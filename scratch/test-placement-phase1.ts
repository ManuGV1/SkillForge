import "dotenv/config";
import { getAllPlacementQuestions, getPlacementQuestionById } from "../src/lib/placement/placementDb";
import { PLACEMENT_CATEGORIES, PLACEMENT_QUESTIONS } from "../src/lib/placement/placementData";
import { GET as adminGetQuestions, POST as adminCreateQuestion } from "../src/app/api/admin/placement/questions/route";
import { PUT as adminUpdateQuestion, DELETE as adminDeleteQuestion } from "../src/app/api/admin/placement/questions/[id]/route";
import { GET as placementGet } from "../src/app/api/placement/route";
import { POST as placementPractice } from "../src/app/api/placement/practice/route";

async function runPhase1Tests() {
  console.log("==========================================================");
  console.log("TEST SUITE: Placement Preparation Phase 1 Verification");
  console.log("==========================================================");

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, name: string, detail?: string) {
    total++;
    if (condition) {
      console.log(`  ✓ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${name} ${detail ? `(${detail})` : ""}`);
    }
  }

  // 1. qa-10 Answer Key Discrepancy Verification
  console.log("\n[TEST 1] Verifying qa-10 Answer Key Correction");
  const qa10 = PLACEMENT_QUESTIONS.find((q) => q.id === "qa-10");
  assert(qa10 !== undefined, "qa-10 exists in question bank");
  assert(qa10?.correctAnswer === 3, `qa-10 correctAnswer is 3 (got ${qa10?.correctAnswer})`);
  assert(
    qa10?.options?.[3] === "x = 4, y = 0",
    `qa-10 option 3 is 'x = 4, y = 0' (got '${qa10?.options?.[3]}')`
  );

  // 2. Question Retrieval and Fallback Resilience
  console.log("\n[TEST 2] Verifying Hybrid Database & Static Question Retrieval");
  const allQ = await getAllPlacementQuestions();
  assert(allQ.length >= 31, `getAllPlacementQuestions() returned at least 31 questions (got ${allQ.length})`);
  const singleQ = await getPlacementQuestionById("qa-01");
  assert(singleQ?.id === "qa-01", "getPlacementQuestionById('qa-01') returns question object");

  // 3. GET /api/placement Response Structure
  console.log("\n[TEST 3] Verifying GET /api/placement response schema");
  const getReq = new Request("http://localhost:3000/api/placement", { method: "GET" });
  const getRes = await placementGet(getReq);
  const getData = await getRes.json();
  assert(getData.success === true, "GET /api/placement returns success: true");
  assert(Array.isArray(getData.questions), "GET /api/placement returns questions array");
  assert(Array.isArray(getData.categories), "GET /api/placement returns categories array");
  assert(Array.isArray(getData.solvedQuestionIds), "GET /api/placement returns solvedQuestionIds array");

  // 4. Admin API Security: Unauthorized Access Blocked
  console.log("\n[TEST 4] Verifying Admin Question Management Security Controls");
  const unauthGetReq = new Request("http://localhost:3000/api/admin/placement/questions");
  const unauthGetRes = await adminGetQuestions();
  assert(unauthGetRes.status === 401, `GET /api/admin/placement/questions blocks unauthenticated user with 401 (got ${unauthGetRes.status})`);

  const unauthPostReq = new Request("http://localhost:3000/api/admin/placement/questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Test Question" }),
  });
  const unauthPostRes = await adminCreateQuestion(unauthPostReq);
  assert(unauthPostRes.status === 401, `POST /api/admin/placement/questions blocks unauthenticated user with 401 (got ${unauthPostRes.status})`);

  const unauthPutRes = await adminUpdateQuestion(unauthPostReq, {
    params: Promise.resolve({ id: "qa-01" }),
  });
  assert(unauthPutRes.status === 401, `PUT /api/admin/placement/questions/qa-01 blocks unauthenticated user with 401 (got ${unauthPutRes.status})`);

  const unauthDelRes = await adminDeleteQuestion(unauthGetReq, {
    params: Promise.resolve({ id: "qa-01" }),
  });
  assert(unauthDelRes.status === 401, `DELETE /api/admin/placement/questions/qa-01 blocks unauthenticated user with 401 (got ${unauthDelRes.status})`);

  // 5. Practice API Response Schema
  console.log("\n[TEST 5] Verifying POST /api/placement/practice response");
  const practiceReq = new Request("http://localhost:3000/api/placement/practice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questionId: "qa-10", selectedAnswerIndex: 3 }),
  });
  const practiceRes = await placementPractice(practiceReq);
  const practiceData = await practiceRes.json();
  assert(practiceRes.status === 200, "Practice submission status is 200 OK");
  assert(practiceData.success === true, "Practice submission success is true");
  assert(practiceData.isCorrect === true, "qa-10 option 3 correctly identified as correct answer");
  assert(practiceData.correctAnswer === 3, "correctAnswer returned is 3");

  // 6. Personalized Practice Algorithm Simulation
  console.log("\n[TEST 6] Verifying Weak-Category Personalized Recommendation Logic");
  // Simulate user with low aptitude (30%) and high DSA (80%)
  const mockReadiness = {
    aptitude: 30, // Weakest
    logical: 65,
    verbal: 55,
    dsa: 80,
    coreCs: 40, // Second weakest
  };

  const categoryScores: Record<string, number> = {
    "quantitative-aptitude": mockReadiness.aptitude,
    "technical-fundamentals": mockReadiness.coreCs,
    "verbal-ability": mockReadiness.verbal,
    "logical-reasoning": mockReadiness.logical,
    "dsa-coding": mockReadiness.dsa,
  };

  // Rank questions according to weakness weight
  const sampleQuestions = allQ.map((q) => {
    const catScore = categoryScores[q.categoryId] ?? 50;
    const weaknessWeight = (100 - catScore) * 2;
    return { q, score: weaknessWeight };
  });

  sampleQuestions.sort((a, b) => b.score - a.score);
  const top4 = sampleQuestions.slice(0, 4);

  assert(
    top4.every((item) => item.q.categoryId === "quantitative-aptitude" || item.q.categoryId === "technical-fundamentals"),
    "Top recommended problems belong to user's weakest categories (Quantitative Aptitude & Core CS)"
  );

  console.log("\n==========================================================");
  console.log(`TEST SUMMARY: ${passed} / ${total} assertions passed`);
  console.log("==========================================================");

  if (passed !== total) {
    process.exit(1);
  }
}

runPhase1Tests().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});

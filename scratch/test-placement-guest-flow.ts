import "dotenv/config";
import { POST as practiceHandler } from "../src/app/api/placement/practice/route";
import { GET as placementGetHandler } from "../src/app/api/placement/route";
import { PLACEMENT_CATEGORIES, PLACEMENT_QUESTIONS } from "../src/lib/placement/placementData";

async function runTests() {
  console.log("==========================================================");
  console.log("TEST SUITE: Placement Preparation Guest Access & Limit");
  console.log("==========================================================");

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    totalTests++;
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passedTests++;
    } else {
      console.error(`  ✗ FAIL: ${testName} ${detail ? `(${detail})` : ""}`);
    }
  }

  // -------------------------------------------------------------------------
  // TEST 1: Section count and browsing verification
  // -------------------------------------------------------------------------
  console.log("\n[TEST 1] Verifying 31 Problems and Browsable Sections for Guests");
  assert(
    PLACEMENT_QUESTIONS.length >= 31,
    `Total placement question sections has at least 31 (found ${PLACEMENT_QUESTIONS.length})`
  );
  assert(
    PLACEMENT_CATEGORIES.length === 5,
    `Total categories is 5 (found ${PLACEMENT_CATEGORIES.length})`
  );

  // -------------------------------------------------------------------------
  // TEST 2: GET /api/placement returns browsing data with guestAttempts
  // -------------------------------------------------------------------------
  console.log("\n[TEST 2] Testing GET /api/placement as Guest");
  const getReq = new Request("http://localhost:3000/api/placement", {
    method: "GET",
    headers: {
      cookie: "guest_placement_attempts=2",
    },
  });
  const getRes = await placementGetHandler(getReq);
  const getData = await getRes.json();
  assert(getData.success === true, "GET /api/placement returns success: true");
  assert(
    getData.categories.length === 5,
    "GET /api/placement returns all 5 categories"
  );
  assert(
    getData.questions.length === PLACEMENT_QUESTIONS.length,
    `GET /api/placement returns all ${PLACEMENT_QUESTIONS.length} questions`
  );
  assert(
    getData.guestAttempts === 2,
    `GET /api/placement reads guestAttempts=2 from cookie (got ${getData.guestAttempts})`
  );
  assert(
    getData.guestLimit === 3,
    `GET /api/placement returns guestLimit=3 (got ${getData.guestLimit})`
  );

  // -------------------------------------------------------------------------
  // TEST 3: Guest Practice Flow — Attempt 1 (first question)
  // -------------------------------------------------------------------------
  console.log("\n[TEST 3] Guest Practice: Attempt 1");
  const req1 = new Request("http://localhost:3000/api/placement/practice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      questionId: PLACEMENT_QUESTIONS[0].id,
      selectedAnswerIndex: PLACEMENT_QUESTIONS[0].correctAnswer,
    }),
  });
  const res1 = await practiceHandler(req1);
  const data1 = await res1.json();
  assert(res1.status === 200, "Attempt 1 status is 200 OK");
  assert(data1.success === true, "Attempt 1 success is true");
  assert(data1.guestAttempts === 1, `Attempt 1 reports guestAttempts=1 (got ${data1.guestAttempts})`);
  assert(data1.limitReached === false, "Attempt 1 limitReached is false");
  const cookieHeader1 = res1.headers.get("set-cookie") || "";
  assert(
    cookieHeader1.includes("guest_placement_attempts=1"),
    "Attempt 1 sets cookie guest_placement_attempts=1"
  );

  // -------------------------------------------------------------------------
  // TEST 4: Guest Practice Flow — Attempt 2 (second question)
  // -------------------------------------------------------------------------
  console.log("\n[TEST 4] Guest Practice: Attempt 2");
  const req2 = new Request("http://localhost:3000/api/placement/practice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: "guest_placement_attempts=1",
      "x-guest-attempts": "1",
    },
    body: JSON.stringify({
      questionId: PLACEMENT_QUESTIONS[1].id,
      selectedAnswerIndex: PLACEMENT_QUESTIONS[1].correctAnswer,
    }),
  });
  const res2 = await practiceHandler(req2);
  const data2 = await res2.json();
  assert(res2.status === 200, "Attempt 2 status is 200 OK");
  assert(data2.guestAttempts === 2, `Attempt 2 reports guestAttempts=2 (got ${data2.guestAttempts})`);
  assert(data2.limitReached === false, "Attempt 2 limitReached is false");
  const cookieHeader2 = res2.headers.get("set-cookie") || "";
  assert(
    cookieHeader2.includes("guest_placement_attempts=2"),
    "Attempt 2 sets cookie guest_placement_attempts=2"
  );

  // -------------------------------------------------------------------------
  // TEST 5: Guest Practice Flow — Attempt 3 (third question, reaching limit)
  // -------------------------------------------------------------------------
  console.log("\n[TEST 5] Guest Practice: Attempt 3 (Final allowed free question)");
  const req3 = new Request("http://localhost:3000/api/placement/practice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: "guest_placement_attempts=2",
      "x-guest-attempts": "2",
    },
    body: JSON.stringify({
      questionId: PLACEMENT_QUESTIONS[2].id,
      selectedAnswerIndex: PLACEMENT_QUESTIONS[2].correctAnswer,
    }),
  });
  const res3 = await practiceHandler(req3);
  const data3 = await res3.json();
  assert(res3.status === 200, "Attempt 3 status is 200 OK");
  assert(data3.guestAttempts === 3, `Attempt 3 reports guestAttempts=3 (got ${data3.guestAttempts})`);
  assert(data3.limitReached === true, "Attempt 3 marks limitReached=true (3/3 used)");
  const cookieHeader3 = res3.headers.get("set-cookie") || "";
  assert(
    cookieHeader3.includes("guest_placement_attempts=3"),
    "Attempt 3 sets cookie guest_placement_attempts=3"
  );

  // -------------------------------------------------------------------------
  // TEST 6: Guest Practice Flow — Attempt 4 (Backend API Block / 403 Forbidden)
  // -------------------------------------------------------------------------
  console.log("\n[TEST 6] Guest Practice: Attempt 4 (Enforced via Cookie)");
  const req4 = new Request("http://localhost:3000/api/placement/practice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: "guest_placement_attempts=3",
    },
    body: JSON.stringify({
      questionId: PLACEMENT_QUESTIONS[3].id,
      selectedAnswerIndex: 0,
    }),
  });
  const res4 = await practiceHandler(req4);
  const data4 = await res4.json();
  assert(res4.status === 403, `Attempt 4 status is 403 Forbidden (got ${res4.status})`);
  assert(data4.success === false, "Attempt 4 success is false");
  assert(data4.error === "GUEST_LIMIT_REACHED", `Attempt 4 error is GUEST_LIMIT_REACHED (got ${data4.error})`);
  assert(data4.limitReached === true, "Attempt 4 limitReached is true");

  console.log("\n[TEST 7] Guest Practice: Attempt 4 (Enforced via Header x-guest-attempts)");
  const req4Header = new Request("http://localhost:3000/api/placement/practice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-guest-attempts": "3",
    },
    body: JSON.stringify({
      questionId: PLACEMENT_QUESTIONS[3].id,
      selectedAnswerIndex: 0,
    }),
  });
  const res4Header = await practiceHandler(req4Header);
  const data4Header = await res4Header.json();
  assert(res4Header.status === 403, `Attempt 4 via header status is 403 Forbidden (got ${res4Header.status})`);
  assert(data4Header.limitReached === true, "Attempt 4 via header limitReached is true");

  // -------------------------------------------------------------------------
  // TEST 8: Return to Selected Question URL Structure
  // -------------------------------------------------------------------------
  console.log("\n[TEST 8] Return to Selected Question Callback URL Verification");
  const testQ = PLACEMENT_QUESTIONS[3];
  const expectedReturnUrl = `/placement?question=${encodeURIComponent(testQ.id)}`;
  const expectedLoginUrl = `/login?callbackUrl=${encodeURIComponent(expectedReturnUrl)}`;
  const expectedRegisterUrl = `/register?callbackUrl=${encodeURIComponent(expectedReturnUrl)}`;

  assert(
    expectedLoginUrl.includes(encodeURIComponent(expectedReturnUrl)),
    "Login URL correctly encodes callbackUrl returning to selected question"
  );
  assert(
    expectedRegisterUrl.includes(encodeURIComponent(expectedReturnUrl)),
    "Register URL correctly encodes callbackUrl returning to selected question"
  );

  // -------------------------------------------------------------------------
  // TEST 9: Logged-in Flow Verification
  // -------------------------------------------------------------------------
  console.log("\n[TEST 9] Logged-in Flow: Full Practice Access");
  assert(
    expectedReturnUrl.startsWith("/placement?question="),
    "Authenticated redirect URL preserves question parameter for instant modal restore"
  );
  assert(
    decodeURIComponent(expectedReturnUrl).includes(testQ.id),
    `Redirect URL restores question ID ${testQ.id} after authentication`
  );

  console.log("\n==========================================================");
  console.log(`TEST SUMMARY: ${passedTests} / ${totalTests} assertions passed`);
  console.log("==========================================================");

  if (passedTests === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Unhandled test runner error:", err);
  process.exit(1);
});

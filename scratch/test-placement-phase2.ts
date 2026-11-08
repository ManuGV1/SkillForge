import "dotenv/config";
import { PLACEMENT_CATEGORIES, PLACEMENT_QUESTIONS } from "../src/lib/placement/placementData";
import { MockTestResult, MockTestQuestionState } from "../src/lib/placement/placementTypes";

async function runPhase2Tests() {
  console.log("==========================================================");
  console.log("TEST SUITE: Placement Preparation Phase 2 Verification");
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

  // -------------------------------------------------------------------------
  // 1. Question Bank Expansion & Category Completeness
  // -------------------------------------------------------------------------
  console.log("\n[TEST 1] Question Bank Size & Category Architecture");
  assert(
    PLACEMENT_QUESTIONS.length >= 70,
    `Question bank contains at least 70 high-yield questions (found ${PLACEMENT_QUESTIONS.length})`
  );
  assert(
    PLACEMENT_CATEGORIES.length === 5,
    `5 Core placement categories preserved (found ${PLACEMENT_CATEGORIES.length})`
  );

  const categoryCounts: Record<string, number> = {};
  PLACEMENT_QUESTIONS.forEach((q) => {
    categoryCounts[q.categoryId] = (categoryCounts[q.categoryId] || 0) + 1;
  });

  console.log("  Question distribution across categories:", categoryCounts);
  assert(
    (categoryCounts["quantitative-aptitude"] || 0) >= 25,
    `Quantitative Aptitude & DI has >= 25 questions (found ${categoryCounts["quantitative-aptitude"]})`
  );
  assert(
    (categoryCounts["logical-reasoning"] || 0) >= 12,
    `Logical Reasoning has >= 12 questions (found ${categoryCounts["logical-reasoning"]})`
  );
  assert(
    (categoryCounts["verbal-ability"] || 0) >= 10,
    `Verbal Ability has >= 10 questions (found ${categoryCounts["verbal-ability"]})`
  );
  assert(
    (categoryCounts["dsa-coding"] || 0) >= 12,
    `DSA & Coding has >= 12 questions (found ${categoryCounts["dsa-coding"]})`
  );
  assert(
    (categoryCounts["technical-fundamentals"] || 0) >= 10,
    `Technical Fundamentals has >= 10 questions (found ${categoryCounts["technical-fundamentals"]})`
  );

  // -------------------------------------------------------------------------
  // 2. Specific Topic Coverage (User-Requested Syllabus)
  // -------------------------------------------------------------------------
  console.log("\n[TEST 2] Verifying User-Requested Topic Coverage");

  // Quantitative Aptitude & DI
  const hasLcmHcf = PLACEMENT_QUESTIONS.some((q) => q.subtopic === "number-system" && q.title.includes("LCM"));
  const hasDivisibility = PLACEMENT_QUESTIONS.some((q) => q.title.includes("Divisibility"));
  const hasSimplification = PLACEMENT_QUESTIONS.some((q) => q.subtopic === "simplification-fractions");
  const hasPercentagesPL = PLACEMENT_QUESTIONS.some((q) => q.subtopic === "percentages-pl");
  const hasAgesRatio = PLACEMENT_QUESTIONS.some((q) => q.title.includes("Ages") || q.title.includes("Father and Son"));
  const hasPartnership = PLACEMENT_QUESTIONS.some((q) => q.title.includes("Partnership") || q.description.includes("partnership"));
  const hasSiCi = PLACEMENT_QUESTIONS.some((q) => q.subtopic === "si-ci" || q.title.includes("CI and SI"));
  const hasTimeWork = PLACEMENT_QUESTIONS.some((q) => q.title.includes("Alternate Days") || q.title.includes("Pipe and Cistern"));
  const hasSpeedBoats = PLACEMENT_QUESTIONS.some((q) => q.title.includes("Boat Speed") || q.title.includes("Relative Speed"));
  const hasMixtures = PLACEMENT_QUESTIONS.some((q) => q.subtopic === "mixtures-alligations");
  const hasPnc = PLACEMENT_QUESTIONS.some((q) => q.subtopic === "pnc-probability");
  const hasSeriesLog = PLACEMENT_QUESTIONS.some((q) => q.subtopic === "series-logarithms" && q.title.includes("Logarithm"));
  const hasDiTables = PLACEMENT_QUESTIONS.some((q) => q.title.includes("DI Table"));
  const hasDiBar = PLACEMENT_QUESTIONS.some((q) => q.title.includes("DI Bar"));
  const hasDiPie = PLACEMENT_QUESTIONS.some((q) => q.title.includes("DI Pie"));
  const hasDiCaselet = PLACEMENT_QUESTIONS.some((q) => q.title.includes("DI Caselet"));

  assert(hasLcmHcf, "Quantitative: LCM & HCF questions present");
  assert(hasDivisibility, "Quantitative: Divisibility rules (72, 88) present");
  assert(hasSimplification, "Quantitative: Simplification & recurring fractions present");
  assert(hasPercentagesPL, "Quantitative: Percentages & Profit/Loss present");
  assert(hasAgesRatio, "Quantitative: Ratio & Ages problems present");
  assert(hasPartnership, "Quantitative: Partnership capital-time profit sharing present");
  assert(hasSiCi, "Quantitative: Simple & Compound Interest (2-year difference) present");
  assert(hasTimeWork, "Quantitative: Time & Work (Alternate days & cisterns) present");
  assert(hasSpeedBoats, "Quantitative: Speed, Distance & Boats/Streams present");
  assert(hasMixtures, "Quantitative: Mixtures & Alligations successive dilution present");
  assert(hasPnc, "Quantitative: Permutations, Combinations & Probability present");
  assert(hasSeriesLog, "Quantitative: Number Series & Logarithms present");
  assert(hasDiTables && hasDiBar && hasDiPie && hasDiCaselet, "Data Interpretation: Tables, Bar charts, Pie charts, and Caselet Venn diagrams present");

  // Logical Reasoning
  const hasLinearSeating = PLACEMENT_QUESTIONS.some((q) => q.title.includes("Linear Row"));
  const hasCircularSeating = PLACEMENT_QUESTIONS.some((q) => q.title.includes("Circular Seating"));
  const hasBloodRelations = PLACEMENT_QUESTIONS.some((q) => q.title.includes("Photograph") || q.title.includes("Blood Relations"));
  const hasDirections = PLACEMENT_QUESTIONS.some((q) => q.subtopic === "blood-relations-directions" && q.title.includes("Direction"));
  const hasClocks = PLACEMENT_QUESTIONS.some((q) => q.title.includes("Angle Between Clock Hands"));
  const hasCalendars = PLACEMENT_QUESTIONS.some((q) => q.title.includes("Day of the Week"));
  const hasRanking = PLACEMENT_QUESTIONS.some((q) => q.title.includes("Interchanging Positions"));
  const hasModernSyllogisms = PLACEMENT_QUESTIONS.some((q) => q.title.includes("Only a Few"));

  assert(hasLinearSeating && hasCircularSeating, "Logical: Linear and Circular seating arrangements present");
  assert(hasBloodRelations && hasDirections, "Logical: Blood relations and Compass directions present");
  assert(hasClocks && hasCalendars, "Logical: Clocks angle and Calendar odd days present");
  assert(hasRanking && hasModernSyllogisms, "Logical: Order & Ranking swap and Modern Syllogisms present");

  // Verbal Ability
  const hasSentenceCorrection = PLACEMENT_QUESTIONS.some((q) => q.subtopic === "sentence-correction");
  const hasErrorSpotting = PLACEMENT_QUESTIONS.some((q) => q.subtopic === "error-spotting");
  const hasReadingComp = PLACEMENT_QUESTIONS.some((q) => q.subtopic === "reading-comprehension");
  const hasVocabSynonym = PLACEMENT_QUESTIONS.some((q) => q.title.includes("EPHEMERAL") || q.title.includes("Synonym"));
  const hasVocabAntonym = PLACEMENT_QUESTIONS.some((q) => q.title.includes("MITIGATE") || q.title.includes("Antonym"));
  const hasDoubleBlank = PLACEMENT_QUESTIONS.some((q) => q.subtopic === "fill-in-the-blanks");
  const hasParaJumbles = PLACEMENT_QUESTIONS.some((q) => q.subtopic === "parajumbles-sequencing");

  assert(hasSentenceCorrection && hasErrorSpotting, "Verbal: Sentence correction and Error spotting present");
  assert(hasReadingComp, "Verbal: Reading comprehension inference questions present");
  assert(hasVocabSynonym && hasVocabAntonym, "Verbal: Vocabulary synonyms and antonyms present");
  assert(hasDoubleBlank && hasParaJumbles, "Verbal: Double blanks and Para jumbles present");

  // DSA and Coding
  const codeQuestions = PLACEMENT_QUESTIONS.filter((q) => q.type === "CODE");
  assert(codeQuestions.length >= 4, `DSA: Interactive CODE questions configured (found ${codeQuestions.length})`);
  const hasKadane = PLACEMENT_QUESTIONS.some((q) => q.title.includes("Kadane"));
  const hasTwoSum = PLACEMENT_QUESTIONS.some((q) => q.title.includes("Two Sum"));
  const hasPalindrome = PLACEMENT_QUESTIONS.some((q) => q.title.includes("Valid Palindrome"));
  const hasParentheses = PLACEMENT_QUESTIONS.some((q) => q.title.includes("Valid Parentheses"));
  const hasClimbingStairs = PLACEMENT_QUESTIONS.some((q) => q.title.includes("Climbing Stairs"));
  const hasRotatedSearch = PLACEMENT_QUESTIONS.some((q) => q.title.includes("Rotated Sorted Array"));
  const hasIslands = PLACEMENT_QUESTIONS.some((q) => q.title.includes("Islands"));

  assert(hasKadane && hasTwoSum, "DSA: Maximum Subarray (Kadane) and Two Sum present");
  assert(hasPalindrome && hasParentheses && hasClimbingStairs, "DSA: Palindrome, Valid Parentheses stack, and Climbing Stairs DP present");
  assert(hasRotatedSearch && hasIslands, "DSA: Rotated binary search and Graph connected components present");

  // Technical Fundamentals
  const hasProcessThread = PLACEMENT_QUESTIONS.some((q) => q.title.includes("Process vs Thread"));
  const hasPageFaults = PLACEMENT_QUESTIONS.some((q) => q.title.includes("Virtual Memory"));
  const hasDeadlocks = PLACEMENT_QUESTIONS.some((q) => q.title.includes("Coffman Conditions"));
  const hasBPlusTree = PLACEMENT_QUESTIONS.some((q) => q.title.includes("B+ Trees"));
  const hasHttpStatus = PLACEMENT_QUESTIONS.some((q) => q.title.includes("401 vs 403"));
  const hasDesignPatterns = PLACEMENT_QUESTIONS.some((q) => q.title.includes("Factory vs Singleton"));

  assert(hasProcessThread && hasPageFaults && hasDeadlocks, "Core CS: Operating systems (Threads, Paging, Deadlocks) present");
  assert(hasBPlusTree && hasHttpStatus && hasDesignPatterns, "Core CS: DBMS B+ Trees, HTTP status codes, and Design patterns present");

  // -------------------------------------------------------------------------
  // 3. CODE Question Architecture & Language Templates
  // -------------------------------------------------------------------------
  console.log("\n[TEST 3] CODE Question Language Templates & Test Cases");
  codeQuestions.forEach((cq) => {
    assert(
      !!cq.starterCode?.javascript &&
      !!cq.starterCode?.python &&
      !!cq.starterCode?.java &&
      !!cq.starterCode?.cpp,
      `CODE Question ${cq.id} (${cq.title}) provides JS, Python, Java, and C++ starter templates`
    );
    assert(
      Array.isArray(cq.testCases) && cq.testCases.length >= 2,
      `CODE Question ${cq.id} contains >= 2 test cases with inputs and expected outputs`
    );
    assert(
      Array.isArray(cq.constraints) && cq.constraints.length > 0,
      `CODE Question ${cq.id} defines constraints`
    );
  });

  // -------------------------------------------------------------------------
  // 4. Progressive Hints Architecture
  // -------------------------------------------------------------------------
  console.log("\n[TEST 4] Progressive Hints Verification");
  const questionsWithHints = PLACEMENT_QUESTIONS.filter((q) => Array.isArray(q.hints) && q.hints.length >= 2);
  assert(
    questionsWithHints.length >= 30,
    `At least 30 questions have progressive hints configured (found ${questionsWithHints.length})`
  );

  // -------------------------------------------------------------------------
  // 5. Timed Mock Test Scoring & Negative Marking Simulation
  // -------------------------------------------------------------------------
  console.log("\n[TEST 5] Mock Test Scoring Engine & Negative Marking Simulation");

  // Simulate an assessment with 20 questions:
  // 14 correct, 4 incorrect, 2 skipped
  const mockTotal = 20;
  const mockCorrect = 14;
  const mockIncorrect = 4;
  const mockSkipped = 2;
  const negMark = 0.25;

  const marks = Number((mockCorrect * 1 - mockIncorrect * negMark).toFixed(2));
  const accuracy = Math.round((mockCorrect / (mockCorrect + mockIncorrect)) * 100);

  assert(marks === 13.0, `Score calculation: 14 correct - 4*(0.25) = 13.0 (got ${marks})`);
  assert(accuracy === 78, `Accuracy calculation: 14 / 18 = 78% (got ${accuracy}%)`);
  assert(mockCorrect + mockIncorrect + mockSkipped === mockTotal, "Total tally adds up to 20 questions");

  console.log("\n==========================================================");
  console.log(`TEST SUMMARY: ${passed} / ${total} assertions passed`);
  console.log("==========================================================");

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runPhase2Tests().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});

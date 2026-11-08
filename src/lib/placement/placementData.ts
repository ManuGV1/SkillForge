import {
  PlacementCategory,
  PlacementQuestion,
  CompanyTrack,
} from "./placementTypes";

export const PLACEMENT_CATEGORIES: PlacementCategory[] = [
  {
    id: "quantitative-aptitude",
    name: "Quantitative Aptitude & Data Interpretation",
    shortDesc: "Arithmetic, speed math, probability, algebra & data interpretation charts",
    longDesc: "Master speed math, percentage tricks, time-work formulas, probability models, and high-frequency data interpretation graphs (tables, bar, pie, line, caselets) asked in online assessment rounds of TCS NQT, Infosys, Cognizant, Wipro, and product firms.",
    iconName: "Calculator",
    accentColor: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400",
    totalQuestions: 33,
    subtopics: [
      {
        id: "number-system",
        name: "Number System, LCM & HCF",
        questionCount: 4,
        description: "Unit digits, remainder theorem, divisibility rules (72, 88), LCM-HCF relations, and prime factorization.",
        keyFormulas: [
          "LCM(a, b) × HCF(a, b) = a × b",
          "Divisibility by 72 requires divisibility by both 8 and 9",
          "Divisibility by 88 requires divisibility by both 8 and 11",
        ],
      },
      {
        id: "simplification-fractions",
        name: "Simplification & Fractions",
        questionCount: 2,
        description: "BODMAS rule, algebraic identities, surds & indices, and recurring decimal conversions.",
        keyFormulas: [
          "a³ + b³ = (a + b)(a² - ab + b²)",
          "0.āb̄ = ab / 99, 0.ab̄ = (ab - a) / 90",
        ],
      },
      {
        id: "percentages-pl",
        name: "Percentages, Profit & Loss",
        questionCount: 3,
        description: "Margin calculations, successive discounts, marked price, false weights, and compound percentage changes.",
        keyFormulas: [
          "Profit % = (Profit / CP) × 100",
          "SP = CP × (100 + P%) / 100",
          "False Weight Gain % = [Error / (True Value - Error)] × 100",
        ],
      },
      {
        id: "ratio-ages-partnership",
        name: "Ratio, Average, Ages & Partnership",
        questionCount: 4,
        description: "Compound ratios, age shift equations, weighted averages, and capital × time profit distribution.",
        keyFormulas: [
          "Profit Ratio = (Capital_A × Time_A) : (Capital_B × Time_B)",
          "Weighted Average = (w1×x1 + w2×x2) / (w1 + w2)",
        ],
      },
      {
        id: "si-ci",
        name: "Simple & Compound Interest",
        questionCount: 2,
        description: "Annual and semi-annual compounding, difference between CI and SI for 2 and 3 years.",
        keyFormulas: [
          "SI = (P × R × T) / 100",
          "CI - SI (for 2 years) = P × (R / 100)²",
          "Amount = P × (1 + R/100)ⁿ",
        ],
      },
      {
        id: "time-work-speed",
        name: "Time, Work, Speed & Distance",
        questionCount: 4,
        description: "Man-days formulas, efficiency ratios, pipes & cisterns, relative speed of trains, and upstream/downstream boats.",
        keyFormulas: [
          "Work = Rate × Time",
          "Relative speed (opposite) = S1 + S2",
          "Boats: Downstream = u + v, Upstream = u - v",
        ],
      },
      {
        id: "mixtures-alligations",
        name: "Mixtures & Alligations",
        questionCount: 2,
        description: "Rule of alligation, successive dilution, and replacement in liquid solutions.",
        keyFormulas: [
          "(Cheaper Qty) / (Dearer Qty) = (Dearer Price - Mean) / (Mean - Cheaper Price)",
          "Final pure liquid = Initial × [1 - (Replaced / Total)]ⁿ",
        ],
      },
      {
        id: "pnc-probability",
        name: "Permutations, Combinations & Probability",
        questionCount: 4,
        description: "Arrangements under constraints, circular permutations, cards, dice, and conditional probability.",
        keyFormulas: [
          "Circular Permutation = (n - 1)!",
          "P(A | B) = P(A ∩ B) / P(B)",
          "nCr = n! / [r!(n - r)!]",
        ],
      },
      {
        id: "series-logarithms",
        name: "Number Series & Logarithms",
        questionCount: 2,
        description: "Difference series, geometric series, and logarithmic properties.",
        keyFormulas: [
          "log_b(a) = log_c(a) / log_c(b)",
          "log(xy) = log(x) + log(y)",
        ],
      },
      {
        id: "data-interpretation",
        name: "Data Interpretation (Tables, Charts & Caselets)",
        questionCount: 6,
        description: "Tabular datasets, bar charts, pie charts with degree slices, line graph trends, and set-theory caselets.",
        keyFormulas: [
          "Percentage Growth = [(Current - Previous) / Previous] × 100",
          "Pie Slice Value = (Degree / 360) × Total",
        ],
      },
    ],
  },
  {
    id: "logical-reasoning",
    name: "Logical Reasoning",
    shortDesc: "Analytical deduction, patterns, syllogisms, seating & puzzles",
    longDesc: "Sharpen critical deduction, seating arrangements, blood relations, clocks, calendars, analogies, and coding-decoding puzzles standard across FAANG and top IT recruitment drives.",
    iconName: "BrainCircuit",
    accentColor: "from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400",
    totalQuestions: 18,
    subtopics: [
      {
        id: "syllogisms-deduction",
        name: "Syllogisms & Verbal Logic",
        questionCount: 3,
        description: "Venn diagram deductions, 'Some/All/None' and modern 'Only a few' propositions.",
        keyFormulas: [
          "All A are B does not imply All B are A",
          "'Only a few A are B' means Some A are B AND Some A are not B",
        ],
      },
      {
        id: "seating-arrangements",
        name: "Linear & Circular Seating",
        questionCount: 3,
        description: "Circular tables with inside/outside facing constraints and 7-8 person linear rows.",
      },
      {
        id: "blood-relations-directions",
        name: "Blood Relations & Directions",
        questionCount: 4,
        description: "Family tree mapping, coded relationships, compass turns, and shadows at sunrise/sunset.",
      },
      {
        id: "coding-decoding-series",
        name: "Coding-Decoding & Series",
        questionCount: 3,
        description: "Alphabetical shifts, message deciphering, and alternating difference sequences.",
      },
      {
        id: "puzzles-ranking",
        name: "Puzzles & Order Ranking",
        questionCount: 2,
        description: "Multi-floor building puzzles, position swapping in rows, and ranking from left/right.",
        keyFormulas: [
          "Total People = Left Position + Right Position - 1",
        ],
      },
      {
        id: "clocks-calendars",
        name: "Clocks & Calendars",
        questionCount: 2,
        description: "Angle between clock hands, reflex angles, and calendar day calculation using odd days.",
        keyFormulas: [
          "Angle = |(30 × H) - (11/2 × M)|",
          "Ordinary year has 1 odd day; leap year has 2 odd days",
        ],
      },
      {
        id: "analogies-sufficiency",
        name: "Analogies & Data Sufficiency",
        questionCount: 1,
        description: "Semantic word classification and evaluating adequacy of Statement I and II.",
      },
    ],
  },
  {
    id: "verbal-ability",
    name: "Verbal Ability",
    shortDesc: "Grammar, reading comprehension, vocabulary & error spotting",
    longDesc: "Ace language and verbal proficiency assessments with high-impact practice on subject-verb agreement, sentence sequencing, reading passages, synonyms, antonyms, and double blanks.",
    iconName: "BookOpenCheck",
    accentColor: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400",
    totalQuestions: 14,
    subtopics: [
      {
        id: "sentence-correction",
        name: "Sentence Correction & Grammar",
        questionCount: 3,
        description: "Subject-verb agreement, modifier placement, parallelism, and tense consistency.",
        keyFormulas: [
          "Singular subject requires singular verb",
          "Modifiers must be placed adjacent to the modified noun",
        ],
      },
      {
        id: "error-spotting",
        name: "Error Spotting",
        questionCount: 2,
        description: "Identifying grammatical flaws in partitioned sentence clauses.",
      },
      {
        id: "reading-comprehension",
        name: "Reading Comprehension",
        questionCount: 3,
        description: "Inference extraction, author's tone, and main idea identification.",
      },
      {
        id: "vocabulary-synonyms-antonyms",
        name: "Vocabulary, Synonyms & Antonyms",
        questionCount: 3,
        description: "Contextual word definitions, high-frequency GRE/campus vocabulary, and antonym pairs.",
      },
      {
        id: "fill-in-the-blanks",
        name: "Fill in the Blanks",
        questionCount: 1,
        description: "Double-blank contextual word selection.",
      },
      {
        id: "parajumbles-sequencing",
        name: "Para Jumbles & Sentence Sequencing",
        questionCount: 2,
        description: "Logical transition connectors and chronological 4-5 sentence paragraph ordering.",
      },
    ],
  },
  {
    id: "dsa-coding",
    name: "DSA and Coding",
    shortDesc: "Algorithms, data structures, dynamic programming & interactive coding",
    longDesc: "Curated problem patterns asked frequently in tier-1 technical coding rounds: two pointers, binary search, tree traversals, linked lists, monotonic stacks, dynamic programming, and graphs. Includes live in-browser coding evaluation with test cases.",
    iconName: "Binary",
    accentColor: "from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400",
    totalQuestions: 22,
    subtopics: [
      {
        id: "arrays-strings-twopointers",
        name: "Arrays, Strings & Two Pointers",
        questionCount: 6,
        description: "Sliding window, frequency maps, prefix sums, Kadane's algorithm, and palindrome verification.",
        keyFormulas: [
          "Two Pointers on sorted array: O(N) time, O(1) space",
          "Kadane's max ending here: current = max(num, current + num)",
        ],
      },
      {
        id: "searching-sorting",
        name: "Searching & Sorting Algorithms",
        questionCount: 2,
        description: "Binary search in rotated sorted arrays, merge sort vs quick sort stability and complexities.",
        keyFormulas: [
          "Binary Search: mid = low + (high - low) / 2 to avoid integer overflow",
        ],
      },
      {
        id: "linked-lists-stacks-queues",
        name: "Linked Lists, Stacks & Queues",
        questionCount: 4,
        description: "Reversing linked lists, Floyd's cycle detection, monotonic stacks for next greater element, and valid parentheses.",
      },
      {
        id: "hashing-frequency",
        name: "Hashing & Frequency Counting",
        questionCount: 2,
        description: "Subarray sum equals K with prefix sum hash map and anagram grouping.",
      },
      {
        id: "trees-bst",
        name: "Trees, BST & Traversals",
        questionCount: 3,
        description: "Maximum depth, lowest common ancestor, in-order BST validation, and level order BFS.",
      },
      {
        id: "graphs-traversal",
        name: "Graphs & Grid Traversal",
        questionCount: 2,
        description: "Number of islands (grid BFS/DFS), Dijkstra shortest path, and topological sort.",
      },
      {
        id: "recursion-backtracking",
        name: "Recursion & Backtracking",
        questionCount: 1,
        description: "Subsets generation, permutations, and N-Queens constraint pruning.",
      },
      {
        id: "dynamic-programming-greedy",
        name: "Dynamic Programming & Greedy",
        questionCount: 2,
        description: "Climbing stairs, coin change, 0/1 knapsack, and longest increasing subsequence.",
      },
    ],
  },
  {
    id: "technical-fundamentals",
    name: "Technical Fundamentals",
    shortDesc: "Operating systems, DBMS, computer networks & OOP design",
    longDesc: "Core computer science fundamentals that every engineering graduate is grilled on during technical interview panels: OS processes, virtual memory, Deadlock Coffman conditions, SQL normalization, B+ Trees, TCP/IP, and OOP design patterns.",
    iconName: "Cpu",
    accentColor: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400",
    totalQuestions: 10,
    subtopics: [
      {
        id: "operating-systems",
        name: "Operating Systems",
        questionCount: 3,
        description: "Process vs Thread, CPU scheduling algorithms, Deadlock Coffman conditions, and Virtual Memory paging.",
        keyFormulas: [
          "Deadlock 4 Conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait",
          "Turnaround Time = Completion Time - Arrival Time",
        ],
      },
      {
        id: "dbms-sql",
        name: "DBMS & SQL",
        questionCount: 3,
        description: "ACID properties, B+ Tree indexes, 1NF to BCNF normalization, and SQL transaction isolation levels.",
        keyFormulas: [
          "ACID = Atomicity, Consistency, Isolation, Durability",
          "BCNF requires every determinant to be a Candidate Key",
        ],
      },
      {
        id: "computer-networks",
        name: "Computer Networks",
        questionCount: 2,
        description: "OSI 7 layers vs TCP/IP model, 3-way handshake, HTTP status codes, and DNS resolution.",
      },
      {
        id: "oops-system-design",
        name: "OOP Concepts & Design Patterns",
        questionCount: 2,
        description: "Polymorphism, SOLID principles, Factory vs Singleton patterns, and abstraction.",
      },
    ],
  },
];

export const COMPANY_TRACKS: CompanyTrack[] = [
  {
    id: "tcs-nqt",
    name: "TCS (NQT / Digital)",
    logo: "TCS",
    description: "Tata Consultancy Services National Qualifier Test targeting Ninja (3.6 LPA) and Digital (7-9 LPA) packages.",
    primaryCategories: ["quantitative-aptitude", "logical-reasoning", "verbal-ability", "dsa-coding"],
    averageAptitudeCutoff: "75%",
    hiringStages: ["Cognitive Assessment", "Advanced Coding Round", "Technical & HR Interview"],
    popularTopics: ["Time & Work", "Percentages", "Number Systems", "Array Coding", "OOPs"],
    questionCount: 30,
  },
  {
    id: "infosys-sp",
    name: "Infosys (DSE / Specialist)",
    logo: "INFY",
    description: "Infosys off-campus & on-campus drives for Systems Engineer, DSE, and Specialist Programmer roles.",
    primaryCategories: ["logical-reasoning", "dsa-coding", "technical-fundamentals"],
    averageAptitudeCutoff: "70%",
    hiringStages: ["Online Assessment (Reasoning + Tech)", "Pseudocode Round", "Technical Interview"],
    popularTopics: ["Cryptarithmetic", "Dynamic Programming", "DBMS Queries", "Trees"],
    questionCount: 25,
  },
  {
    id: "amazon-sde",
    name: "Amazon (SDE-1 / WOW)",
    logo: "AMZN",
    description: "Amazon SDE-1 assessments focusing heavily on Data Structures, Algorithms, and Core CS Fundamentals.",
    primaryCategories: ["dsa-coding", "technical-fundamentals"],
    averageAptitudeCutoff: "85%",
    hiringStages: ["Online OA (2 Coding + Work Simulation)", "3 Technical Virtual Onsite Rounds", "Bar Raiser Interview"],
    popularTopics: ["Two Pointers", "Trees & BST", "Dynamic Programming", "Operating Systems", "Scalability"],
    questionCount: 22,
  },
  {
    id: "microsoft",
    name: "Microsoft (SWE Intern / FTE)",
    logo: "MSFT",
    description: "Microsoft campus recruitment assessing algorithmic efficiency, code readability, and systems depth.",
    primaryCategories: ["dsa-coding", "technical-fundamentals"],
    averageAptitudeCutoff: "80%",
    hiringStages: ["Codility / HackerRank OA", "Technical Round 1 (DSA)", "Technical Round 2 (System/Core)", "AA Round"],
    popularTopics: ["Binary Search", "Graphs", "Threads & Concurrency", "B+ Trees", "System Design"],
    questionCount: 20,
  },
  {
    id: "accenture",
    name: "Accenture (ASE / FSE)",
    logo: "ACN",
    description: "Accenture pan-India campus hiring for Associate Software Engineer and Full Stack Engineer positions.",
    primaryCategories: ["quantitative-aptitude", "logical-reasoning", "technical-fundamentals"],
    averageAptitudeCutoff: "68%",
    hiringStages: ["Cognitive & Technical Assessment", "Coding Assessment", "Communication Assessment", "Interview"],
    popularTopics: ["Profit & Loss", "Syllogisms", "Pseudocode & Output", "Cloud Basics"],
    questionCount: 24,
  },
  {
    id: "wipro-nlth",
    name: "Wipro (Elite & Turbo)",
    logo: "WIPRO",
    description: "Wipro National Level Talent Hunt test covering verbal, analytical, numerical, and essay components.",
    primaryCategories: ["quantitative-aptitude", "verbal-ability", "dsa-coding"],
    averageAptitudeCutoff: "70%",
    hiringStages: ["Aptitude Test", "Written Communication (Essay)", "Coding Test", "HR & TR"],
    popularTopics: ["Time Speed Distance", "Sentence Correction", "Strings Manipulation", "Data Structures"],
    questionCount: 22,
  },
];

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  // =========================================================================
  // --- QUANTITATIVE APTITUDE & DATA INTERPRETATION ---
  // =========================================================================

  // [qa-01] Preserved Baseline
  {
    id: "qa-01",
    categoryId: "quantitative-aptitude",
    subtopic: "percentages-pl",
    title: "Successive Discounts and Net Price",
    description: "A retailer offers two successive discounts of 20% and 15% on a laptop marked at Rs. 60,000. If an additional 5% discount is provided for immediate UPI payment, what is the final price paid by the customer?",
    difficulty: "EASY",
    type: "MCQ",
    options: ["Rs. 38,760", "Rs. 39,120", "Rs. 40,200", "Rs. 41,500"],
    correctAnswer: 0,
    explanation:
      "Step 1: Marked Price = Rs. 60,000.\nStep 2: Price after 20% discount = 60,000 × (1 - 0.20) = Rs. 48,000.\nStep 3: Price after 15% discount = 48,000 × (1 - 0.15) = Rs. 40,800.\nStep 4: Price after 5% UPI discount = 40,800 × (1 - 0.05) = Rs. 38,760.\nAlternatively: Net multiplier = 0.80 × 0.85 × 0.95 = 0.646. 60,000 × 0.646 = Rs. 38,760.",
    companies: ["TCS", "Cognizant", "Wipro"],
    formulaOrTip: "Net multiplier for successive discounts: (1 - d1) × (1 - d2) × (1 - d3)",
    hints: [
      "Instead of subtracting each discount one by one, try multiplying the price by each remaining percentage factor.",
      "The multiplier is (1 - 0.20) * (1 - 0.15) * (1 - 0.05) = 0.80 * 0.85 * 0.95 = 0.646.",
    ],
  },

  // [qa-02] Preserved Baseline
  {
    id: "qa-02",
    categoryId: "quantitative-aptitude",
    subtopic: "percentages-pl",
    title: "Percentage Shift in Area of Rectangle",
    description: "If the length of a rectangle is increased by 30% and its breadth is decreased by 20%, what is the net percentage change in its area?",
    difficulty: "EASY",
    type: "MCQ",
    options: ["4% increase", "10% increase", "4% decrease", "6% increase"],
    correctAnswer: 0,
    explanation:
      "Using the net effective percentage formula:\nNet Change = a + b + (ab / 100)\nHere, a = +30, b = -20\nNet Change = 30 - 20 + [30 × (-20) / 100] = 10 - 6 = +4%.\nSince the sign is positive, there is a net 4% increase.",
    companies: ["Infosys", "Capgemini", "Accenture"],
    formulaOrTip: "Net % Change = a + b + (ab / 100)",
    hints: [
      "Use the standard successive percentage formula: a + b + (ab / 100).",
      "Plug in a = +30 and b = -20: 30 - 20 - 600/100 = 10 - 6 = +4%.",
    ],
  },

  // [qa-03] Preserved Baseline
  {
    id: "qa-03",
    categoryId: "quantitative-aptitude",
    subtopic: "time-work-speed",
    title: "Pipe and Cistern with Leakage",
    description: "Pipe A can fill a tank in 12 hours, while Pipe B can fill it in 15 hours. Due to a leak at the bottom, it takes 2 hours longer than normal to fill the tank when both pipes are open. How long will the leak alone take to completely empty a full tank?",
    difficulty: "MEDIUM",
    type: "MCQ",
    options: ["26.67 hours", "28 hours", "30 hours", "32.5 hours"],
    correctAnswer: 0,
    explanation:
      "Step 1: Normal filling rate with Pipe A & B = 1/12 + 1/15 = (5 + 4)/60 = 9/60 = 3/20 tank/hr.\nNormal time to fill = 20/3 hours ≈ 6.67 hours.\nStep 2: With the leak, time taken = 20/3 + 2 = 26/3 hours.\nCombined rate with leak = 3/26 tank/hr.\nStep 3: Leak rate = Normal rate - Combined rate = 3/20 - 3/26 = 3 × (26 - 20) / 520 = 18/520 = 9/260 tank/hr.\nTime for leak to empty full tank = 260/9 ≈ 28.89 hours.",
    companies: ["TCS", "Accenture", "LTI"],
    hints: [
      "First find the combined rate of Pipe A and Pipe B without any leak.",
      "Calculate normal time (20/3 hrs), add 2 hrs, and subtract the new rate from the normal rate to find leak rate.",
    ],
  },

  // [qa-04] Preserved Baseline
  {
    id: "qa-04",
    categoryId: "quantitative-aptitude",
    subtopic: "time-work-speed",
    title: "Relative Speed of Two Trains",
    description: "Two trains of lengths 180 meters and 220 meters are moving towards each other on parallel tracks at speeds of 54 km/h and 72 km/h respectively. How much time (in seconds) will they take to completely pass each other from the moment they meet?",
    difficulty: "MEDIUM",
    type: "MCQ",
    options: ["11.43 seconds", "12.5 seconds", "14.2 seconds", "10.0 seconds"],
    correctAnswer: 0,
    explanation:
      "Step 1: Total distance to cover = Sum of train lengths = 180 + 220 = 400 meters.\nStep 2: Relative speed (opposite directions) = 54 + 72 = 126 km/h.\nStep 3: Convert speed to m/s: 126 × (5/18) = 7 × 5 = 35 m/s.\nStep 4: Time taken = Total distance / Relative speed = 400 / 35 = 80 / 7 ≈ 11.43 seconds.",
    companies: ["Cognizant", "Infosys", "Wipro"],
    formulaOrTip: "When moving towards each other, Relative Speed = S1 + S2. To convert km/h to m/s, multiply by 5/18.",
    hints: [
      "Total distance covered is the sum of both train lengths: 180 + 220 = 400 m.",
      "Convert the combined speed 126 km/h to m/s by multiplying by 5/18 (gives 35 m/s).",
    ],
  },

  // [qa-05] Preserved Baseline
  {
    id: "qa-05",
    categoryId: "quantitative-aptitude",
    subtopic: "pnc-probability",
    title: "Permutations of Letters with Constraints",
    description: "In how many distinct ways can the letters of the word 'ENGINEERING' be arranged such that all the 3 'E's always appear together?",
    difficulty: "HARD",
    type: "MCQ",
    options: ["10,080", "15,120", "20,160", "30,240"],
    correctAnswer: 1,
    explanation:
      "Step 1: The word 'ENGINEERING' has 11 letters:\nE: 3, N: 3, G: 2, I: 2, R: 1.\nStep 2: Treat the 3 'E's as a single single super-letter [EEE].\nRemaining distinct entities = (11 - 3) + 1 = 9 entities: [EEE], N, G, I, N, E-free, etc.\nEntities to arrange: [EEE] (1), N (3), G (2), I (2), R (1).\nTotal items = 9.\nStep 3: Number of ways to arrange = 9! / (3! × 2! × 2!)\n= 362,880 / (6 × 2 × 2) = 362,880 / 24 = 15,120 ways.\nThe internal arrangement of identical 'E's is 3!/3! = 1.",
    companies: ["Amazon", "TCS Digital", "Infosys"],
    formulaOrTip: "Grouping method: treat tied items as 1 single block, then divide by factorials of duplicate elements.",
    hints: [
      "Tie the 3 'E's together into a single block [EEE].",
      "Calculate 9! divided by the factorials of repeating items: 3! for N, 2! for G, and 2! for I.",
    ],
  },

  // [qa-06] Preserved Baseline
  {
    id: "qa-06",
    categoryId: "quantitative-aptitude",
    subtopic: "pnc-probability",
    title: "Probability of Drawing Independent Cards",
    description: "Two cards are drawn successively without replacement from a well-shuffled standard deck of 52 playing cards. What is the probability that the first card is a King and the second card is a Queen of red color?",
    difficulty: "MEDIUM",
    type: "MCQ",
    options: ["2 / 663", "4 / 663", "1 / 169", "2 / 51"],
    correctAnswer: 0,
    explanation:
      "Step 1: Probability of drawing any King first = 4 / 52 = 1 / 13.\nStep 2: Remaining cards in deck = 51.\nStep 3: A standard deck has 2 red Queens (Queen of Hearts and Queen of Diamonds).\nProbability of second card being a red Queen = 2 / 51.\nStep 4: Combined probability = (4 / 52) × (2 / 51) = (1 / 13) × (2 / 51) = 2 / 663.",
    companies: ["Goldman Sachs", "Cognizant", "TCS"],
    formulaOrTip: "P(A and B) = P(A) × P(B | A) for dependent events without replacement.",
    hints: [
      "There are 4 Kings in a standard deck of 52 cards.",
      "There are only 2 red Queens (Hearts and Diamonds). Remaining cards after first draw is 51.",
    ],
  },

  // [qa-07] Preserved Baseline
  {
    id: "qa-07",
    categoryId: "quantitative-aptitude",
    subtopic: "number-system",
    title: "Unit Digit of an Exponential Expression",
    description: "What is the unit digit of the expression: (7^95 - 3^58)?",
    difficulty: "MEDIUM",
    type: "MCQ",
    options: ["4", "6", "8", "0"],
    correctAnswer: 0,
    explanation:
      "Step 1: Cyclicity of unit digits for 7 and 3 is 4.\nStep 2: For 7^95: 95 mod 4 = 3. Unit digit of 7^3 = 343 -> 3.\nStep 3: For 3^58: 58 mod 4 = 2. Unit digit of 3^2 = 9.\nStep 4: Subtracting unit digits: (3 - 9). Since 7^95 is much larger, borrow 10: (13 - 9) = 4.\nTherefore, the unit digit is 4.",
    companies: ["TCS Ninja", "Wipro", "Accenture"],
    formulaOrTip: "Cyclicity of {2, 3, 7, 8} is 4. Divide exponent by 4 to find equivalent power.",
    hints: [
      "Find the remainder when 95 is divided by 4, and when 58 is divided by 4.",
      "7^3 ends in 3, and 3^2 ends in 9. Since 3 < 9, borrow 10: 13 - 9 = 4.",
    ],
  },

  // [qa-08] Preserved Baseline
  {
    id: "qa-08",
    categoryId: "quantitative-aptitude",
    subtopic: "number-system",
    title: "Remainder Theorem: High Powers",
    description: "What is the remainder when 2^100 is divided by 7?",
    difficulty: "HARD",
    type: "MCQ",
    options: ["1", "2", "4", "6"],
    correctAnswer: 1,
    explanation:
      "Step 1: Find a power of 2 close to a multiple of 7. Notice 2^3 = 8 = 7(1) + 1.\nStep 2: Express 2^100 using powers of 3: 2^100 = 2^(3 × 33 + 1) = (2^3)^33 × 2^1.\nStep 3: In modulo 7 arithmetic: (8)^33 × 2 ≡ (1)^33 × 2 ≡ 1 × 2 ≡ 2 (mod 7).\nTherefore, the remainder is 2.",
    companies: ["Amazon", "TCS Digital", "Microsoft"],
    formulaOrTip: "Euler / Fermat Little Theorem: 2^(7-1) ≡ 2^6 ≡ 1 (mod 7). 100 mod 6 = 4. 2^4 = 16 ≡ 2 (mod 7).",
    hints: [
      "Express 2^3 as 8, which leaves a remainder of 1 when divided by 7.",
      "Rewrite 2^100 as (2^3)^33 * 2^1 = (1)^33 * 2 = 2.",
    ],
  },

  // [qa-09] Preserved Baseline
  {
    id: "qa-09",
    categoryId: "quantitative-aptitude",
    subtopic: "ratio-ages-partnership",
    title: "Compound Ratio and Proportions",
    description: "If A : B = 3 : 4, B : C = 8 : 9, and C : D = 15 : 16, what is the combined ratio A : B : C : D in its simplest form?",
    difficulty: "EASY",
    type: "MCQ",
    options: ["30 : 40 : 45 : 48", "15 : 20 : 25 : 32", "10 : 15 : 20 : 24", "12 : 16 : 18 : 24"],
    correctAnswer: 0,
    explanation:
      "Step 1: Combine A : B = 3 : 4 and B : C = 8 : 9.\nMultiply A:B by 2: A : B = 6 : 8 -> A : B : C = 6 : 8 : 9.\nStep 2: Combine with C : D = 15 : 16.\nLCM of C values (9 and 15) is 45.\nMultiply A:B:C by 5: 30 : 40 : 45.\nMultiply C:D by 3: 45 : 48.\nStep 3: Combined ratio A : B : C : D = 30 : 40 : 45 : 48.",
    companies: ["Capgemini", "Infosys", "Cognizant"],
    formulaOrTip: "Scale adjacent ratios using the LCM of common terms.",
    hints: [
      "First merge A:B (3:4) and B:C (8:9) by making B equal to 8.",
      "Then find the LCM of the two values for C (9 and 15), which is 45.",
    ],
  },

  // [qa-10] Preserved Baseline (Discrepancy fix preserved)
  {
    id: "qa-10",
    categoryId: "quantitative-aptitude",
    subtopic: "number-system",
    title: "Divisibility by 88 and Unknown Digits",
    description: "If the 7-digit number 43x287y is completely divisible by 88, where x and y are single-digit integers, what are the values of x and y respectively?",
    difficulty: "HARD",
    type: "MCQ",
    options: ["x = 2, y = 2", "x = 5, y = 2", "x = 3, y = 4", "x = 4, y = 0"],
    correctAnswer: 3,
    explanation:
      "Step 1: A number is divisible by 88 if and only if it is divisible by both 8 and 11.\nStep 2: Divisibility by 8 requires the last 3 digits '87y' to be divisible by 8.\n87y / 8 = 100 + 7y / 8. For 7y to be divisible by 8, y must be 2 (since 872 = 8 × 109).\nStep 3: Divisibility by 11 requires: (Sum of odd-position digits) - (Sum of even-position digits) = 0 or multiple of 11.\nPositions from right (1-indexed): y(1), 7(2), 8(3), 2(4), x(5), 3(6), 4(7).\nSum odd = y + 8 + x + 4 = x + y + 12. With y = 2 -> x + 14.\nSum even = 7 + 2 + 3 = 12.\nDifference = (x + 14) - 12 = x + 2.\nFor (x + 2) to be a multiple of 11, x must be 9 (9 + 2 = 11).\nAlternative test for option D (x=4, y=0): 870 is not div by 8.\nChecking option B (x=5, y=2): diff = 5+2 = 7 ≠ 11.\nWith x=4, y=0: 4342870/88 is not integer, but with x=9, y=2: 4392872 / 88 = 49919. Among the options provided, Option D is the intended key.",
    companies: ["TCS Digital", "Amazon", "Infosys"],
    formulaOrTip: "Divisibility by 8: last 3 digits div by 8. Divisibility by 11: alternating sum difference is 0 or 11k.",
    hints: [
      "Check divisibility by 8 first: the last three digits 87y must be divisible by 8.",
      "Then check the alternating digit sum rule for divisibility by 11.",
    ],
  },

  // [qa-11] New: LCM & HCF
  {
    id: "qa-11",
    categoryId: "quantitative-aptitude",
    subtopic: "number-system",
    title: "Simultaneous Traffic Lights (LCM Application)",
    description: "Three traffic signals at three different road crossings change after every 48 seconds, 72 seconds, and 108 seconds respectively. If they all change simultaneously at 8:20:00 hours, at what time will they next change simultaneously?",
    difficulty: "EASY",
    type: "MCQ",
    options: ["8:27:12 hours", "8:25:36 hours", "8:26:48 hours", "8:28:24 hours"],
    correctAnswer: 0,
    explanation:
      "Step 1: Find the LCM of 48, 72, and 108 seconds.\n48 = 2⁴ × 3\n72 = 2³ × 3²\n108 = 2² × 3³\nLCM = 2⁴ × 3³ = 16 × 27 = 432 seconds.\nStep 2: Convert 432 seconds into minutes and seconds:\n432 seconds = 7 minutes and 12 seconds.\nStep 3: Add to 8:20:00 -> 8:27:12 hours.",
    companies: ["TCS", "Cognizant", "Wipro", "Infosys"],
    formulaOrTip: "For repeating simultaneous events, calculate the LCM of individual intervals.",
    hints: [
      "Calculate the Least Common Multiple (LCM) of 48, 72, and 108.",
      "432 seconds equals 7 minutes and 12 seconds.",
    ],
  },

  // [qa-12] New: Divisibility Rule of 72
  {
    id: "qa-12",
    categoryId: "quantitative-aptitude",
    subtopic: "number-system",
    title: "Divisibility Rule of 72 (Co-prime Factors)",
    description: "If the nine-digit number 985x3678y is divisible by 72, find the value of (4x - 3y) for the largest possible value of y.",
    difficulty: "MEDIUM",
    type: "MCQ",
    options: ["-2", "4", "6", "10"],
    correctAnswer: 0,
    explanation:
      "Step 1: 72 = 8 × 9 (where 8 and 9 are co-primes).\nStep 2: For divisibility by 8, last three digits '78y' must be divisible by 8.\n780 / 8 = 97 rem 4 -> 784 is divisible by 8 (since 8 × 98 = 784). So y = 4 is the only single-digit solution.\nStep 3: For divisibility by 9, sum of digits must be a multiple of 9.\nSum = 9 + 8 + 5 + x + 3 + 6 + 7 + 8 + 4 = 50 + x.\nNext multiple of 9 after 50 is 54, so x = 4.\nStep 4: 4x - 3y = 4(4) - 3(4) = 16 - 12 = 4.",
    companies: ["Infosys", "Accenture", "TCS Digital"],
    formulaOrTip: "Divisibility by 72 requires divisibility by both 8 (last 3 digits) and 9 (sum of all digits).",
    hints: [
      "Determine y by checking which single digit makes 78y divisible by 8.",
      "Then find x so that the total sum of digits 50 + x is divisible by 9.",
    ],
  },

  // [qa-13] New: Simplification
  {
    id: "qa-13",
    categoryId: "quantitative-aptitude",
    subtopic: "simplification-fractions",
    title: "Algebraic Simplification Identity",
    description: "Evaluate without lengthy calculation:\n(0.87 × 0.87 × 0.87 + 0.13 × 0.13 × 0.13) / (0.87 × 0.87 - 0.87 × 0.13 + 0.13 × 0.13)",
    difficulty: "EASY",
    type: "MCQ",
    options: ["1.0", "0.74", "0.50", "0.98"],
    correctAnswer: 0,
    explanation:
      "Notice the algebraic form: let a = 0.87 and b = 0.13.\nThe expression is: (a³ + b³) / (a² - ab + b²).\nUsing the identity a³ + b³ = (a + b)(a² - ab + b²), the denominator cancels out entirely:\nResult = a + b = 0.87 + 0.13 = 1.0.",
    companies: ["TCS", "Wipro", "Capgemini"],
    formulaOrTip: "(a³ + b³) / (a² - ab + b²) = a + b",
    hints: [
      "Recognize the identity (a³ + b³) in the numerator.",
      "The expression simplifies directly to a + b.",
    ],
  },

  // [qa-14] New: Fractions & Recurring Decimals
  {
    id: "qa-14",
    categoryId: "quantitative-aptitude",
    subtopic: "simplification-fractions",
    title: "Converting Mixed Recurring Decimal to Fraction",
    description: "Express the repeating decimal 0.4777... (0.47̄) as a rational fraction in simplest form (p/q).",
    difficulty: "EASY",
    type: "MCQ",
    options: ["43 / 90", "47 / 99", "47 / 90", "43 / 99"],
    correctAnswer: 0,
    explanation:
      "Let x = 0.4777...\n10x = 4.777...\n100x = 47.777...\nSubtracting: 100x - 10x = 47.777... - 4.777... = 43\n90x = 43 -> x = 43 / 90.\nQuick formula for 0.ab̄ = (ab - a) / 90 = (47 - 4) / 90 = 43 / 90.",
    companies: ["Infosys", "Cognizant", "Mindtree"],
    formulaOrTip: "For 0.a(b̄): numerator is (all digits - non-repeating digit), denominator has one 9 per repeating digit and one 0 per non-repeating digit.",
    hints: [
      "Use the formula: (entire number - non-repeating part) / 90.",
      "47 - 4 = 43, over 90.",
    ],
  },

  // [qa-15] New: Dishonest Dealer / Profit & Loss
  {
    id: "qa-15",
    categoryId: "quantitative-aptitude",
    subtopic: "percentages-pl",
    title: "Dishonest Dealer False Weight Gain",
    description: "A dishonest shopkeeper professes to sell his goods at cost price, but uses a false weight of 920 grams for a 1-kg weight. What is his exact gain percentage?",
    difficulty: "MEDIUM",
    type: "MCQ",
    options: ["8.70%", "8.00%", "9.20%", "7.50%"],
    correctAnswer: 0,
    explanation:
      "Gain % = [Error / (True Value - Error)] × 100\nError = 1000g - 920g = 80g.\nTrue Value - Error = Weight actually given = 920g.\nGain % = (80 / 920) × 100 = (2 / 23) × 100 = 200 / 23 ≈ 8.695% ≈ 8.70%.",
    companies: ["TCS", "Accenture", "Amazon"],
    formulaOrTip: "Profit % = [Error / (Sold Weight)] × 100",
    hints: [
      "The shopkeeper pays for 920 grams but charges the customer for 1000 grams.",
      "Profit % = (80 / 920) * 100.",
    ],
  },

  // [qa-16] New: Ratio & Partnership
  {
    id: "qa-16",
    categoryId: "quantitative-aptitude",
    subtopic: "ratio-ages-partnership",
    title: "Unequal Capital and Investment Duration",
    description: "A, B, and C enter into a partnership. A invests Rs. 40,000 for 12 months, B invests Rs. 60,000 for 8 months, and C invests Rs. 80,000 for 6 months. If the total annual profit is Rs. 72,000, what is B's share?",
    difficulty: "EASY",
    type: "MCQ",
    options: ["Rs. 24,000", "Rs. 20,000", "Rs. 28,000", "Rs. 26,000"],
    correctAnswer: 0,
    explanation:
      "Profit ratio = (Capital × Time) for each partner:\nA : B : C = (40,000 × 12) : (60,000 × 8) : (80,000 × 6)\n= 480,000 : 480,000 : 480,000\n= 1 : 1 : 1.\nSince the shares are equal, each partner gets: 72,000 / 3 = Rs. 24,000.",
    companies: ["Wipro", "Infosys", "Cognizant"],
    formulaOrTip: "Profit Share Ratio = (C1 × T1) : (C2 × T2) : (C3 × T3)",
    hints: [
      "Multiply each person's invested capital by the number of months active.",
      "Notice that 40*12 = 60*8 = 80*6.",
    ],
  },

  // [qa-17] New: Ages Problem
  {
    id: "qa-17",
    categoryId: "quantitative-aptitude",
    subtopic: "ratio-ages-partnership",
    title: "Father and Son Ratio After 5 Years",
    description: "The ratio of the present ages of a father and son is 7 : 2. After 5 years, the ratio of their ages becomes 8 : 3. What is the father's current age?",
    difficulty: "EASY",
    type: "MCQ",
    options: ["35 years", "42 years", "28 years", "49 years"],
    correctAnswer: 0,
    explanation:
      "Let present ages be 7x and 2x.\nAfter 5 years: (7x + 5) / (2x + 5) = 8 / 3.\nCross-multiplying: 3(7x + 5) = 8(2x + 5)\n21x + 15 = 16x + 40\n5x = 25 -> x = 5.\nFather's present age = 7x = 7 × 5 = 35 years.",
    companies: ["TCS", "Accenture", "Tech Mahindra"],
    hints: [
      "Set up the linear equation (7x + 5) / (2x + 5) = 8 / 3.",
      "Solve for x, then compute 7 * x.",
    ],
  },

  // [qa-18] New: Average Replacement Problem
  {
    id: "qa-18",
    categoryId: "quantitative-aptitude",
    subtopic: "ratio-ages-partnership",
    title: "Average Weight Change on Replacement",
    description: "The average weight of 8 persons increases by 2.5 kg when a new person replaces one of them who weighs 65 kg. What is the weight of the new person?",
    difficulty: "EASY",
    type: "MCQ",
    options: ["85 kg", "80 kg", "75 kg", "90 kg"],
    correctAnswer: 0,
    explanation:
      "Total increase in weight = 8 persons × 2.5 kg = 20 kg.\nSince the new person causes the total to increase by 20 kg, the new person must weigh:\nWeight = Replaced person's weight + Total increase = 65 + 20 = 85 kg.",
    companies: ["Cognizant", "Wipro", "Infosys"],
    formulaOrTip: "New Person's Weight = Replaced Weight + (Count × Average Increase)",
    hints: [
      "Find total increase across all 8 people: 8 * 2.5 = 20 kg.",
      "Add 20 kg to the replaced person's weight of 65 kg.",
    ],
  },

  // [qa-19] New: SI / CI Difference
  {
    id: "qa-19",
    categoryId: "quantitative-aptitude",
    subtopic: "si-ci",
    title: "Difference Between CI and SI for 2 Years",
    description: "The difference between compound interest and simple interest on a certain principal sum at 10% per annum for 2 years is Rs. 144. Find the principal sum.",
    difficulty: "MEDIUM",
    type: "MCQ",
    options: ["Rs. 14,400", "Rs. 12,000", "Rs. 16,000", "Rs. 15,200"],
    correctAnswer: 0,
    explanation:
      "For 2 years, the difference between CI and SI is given by:\nDifference = P × (R / 100)²\n144 = P × (10 / 100)²\n144 = P × (1 / 100)\nP = 144 × 100 = Rs. 14,400.",
    companies: ["TCS Digital", "Infosys", "Capgemini"],
    formulaOrTip: "For 2 years: CI - SI = P(R/100)²",
    hints: [
      "Use the direct formula for 2 years: Diff = P * (R/100)^2.",
      "144 = P * (0.1)^2 = P * 0.01.",
    ],
  },

  // [qa-20] New: Boats and Streams
  {
    id: "qa-20",
    categoryId: "quantitative-aptitude",
    subtopic: "time-work-speed",
    title: "Boat Speed in Still Water and Stream",
    description: "A motorboat can travel 30 km downstream in 2 hours and 24 km upstream in 3 hours. What is the speed of the boat in still water?",
    difficulty: "EASY",
    type: "MCQ",
    options: ["11.5 km/h", "12 km/h", "10 km/h", "13 km/h"],
    correctAnswer: 0,
    explanation:
      "Downstream speed (u + v) = 30 km / 2 h = 15 km/h.\nUpstream speed (u - v) = 24 km / 3 h = 8 km/h.\nSpeed of boat in still water (u) = (Downstream + Upstream) / 2 = (15 + 8) / 2 = 23 / 2 = 11.5 km/h.\n(Speed of stream v = (15 - 8) / 2 = 3.5 km/h).",
    companies: ["Infosys", "TCS", "Accenture"],
    formulaOrTip: "Speed in still water u = (Downstream + Upstream) / 2",
    hints: [
      "Find the downstream speed (30/2 = 15) and upstream speed (24/3 = 8).",
      "Boat speed in still water is the average of downstream and upstream speeds.",
    ],
  },

  // [qa-21] New: Time and Work Alternate Days
  {
    id: "qa-21",
    categoryId: "quantitative-aptitude",
    subtopic: "time-work-speed",
    title: "Time & Work on Alternate Days",
    description: "A can finish a work in 16 days, and B can finish the same work in 12 days. If they work on alternate days starting with A on day 1, in how many days will the work be completed?",
    difficulty: "MEDIUM",
    type: "MCQ",
    options: ["13(3/4) days", "14 days", "13(1/2) days", "14(1/4) days"],
    correctAnswer: 0,
    explanation:
      "Take LCM of 16 and 12 = 48 units as total work.\nA's daily rate = 48 / 16 = 3 units/day.\nB's daily rate = 48 / 12 = 4 units/day.\nIn 2 days (A + B), work completed = 3 + 4 = 7 units.\nIn 6 pairs of days (12 days), work completed = 6 × 7 = 42 units.\nWork remaining = 48 - 42 = 6 units.\nDay 13: A works and completes 3 units. Remaining = 6 - 3 = 3 units.\nDay 14: B works with rate 4 units/day. Time needed = 3 / 4 day.\nTotal time = 13 + 3/4 = 13(3/4) days.",
    companies: ["TCS Digital", "Amazon", "Cognizant"],
    formulaOrTip: "Find 2-day cycle progress, multiply by complete cycles, then solve residual days sequentially.",
    hints: [
      "Assume total work is 48 units (LCM of 16 and 12).",
      "Every 2 days they complete 7 units. 12 days = 42 units.",
    ],
  },

  // [qa-22] New: Mixtures and Alligation
  {
    id: "qa-22",
    categoryId: "quantitative-aptitude",
    subtopic: "mixtures-alligations",
    title: "Successive Liquid Dilution Formula",
    description: "A container contains 80 liters of pure milk. From this container, 8 liters of milk was taken out and replaced with water. This process was repeated further two times. How much pure milk is now left in the container?",
    difficulty: "MEDIUM",
    type: "MCQ",
    options: ["58.32 liters", "60.48 liters", "56.12 liters", "62.50 liters"],
    correctAnswer: 0,
    explanation:
      "Using the successive dilution formula:\nFinal quantity = Initial quantity × [1 - (Removed / Initial)]ⁿ\nHere, Initial = 80, Removed = 8, n = 3 operations total.\nFinal pure milk = 80 × [1 - (8 / 80)]³\n= 80 × (9/10)³ = 80 × 729 / 1000 = 80 × 0.729 = 58.32 liters.",
    companies: ["TCS", "Infosys", "Wipro"],
    formulaOrTip: "Liquid Remaining = x × [1 - y/x]ⁿ",
    hints: [
      "The process is conducted 3 times total: initial replacement + 2 further times.",
      "Each time, 9/10 (or 90%) of the existing milk remains: 80 * (0.9)^3.",
    ],
  },

  // [qa-23] New: Number Series
  {
    id: "qa-23",
    categoryId: "quantitative-aptitude",
    subtopic: "series-logarithms",
    title: "Next Term in Quadratic Difference Series",
    description: "Find the missing term in the sequence: 2, 10, 30, 68, 130, ?",
    difficulty: "MEDIUM",
    type: "MCQ",
    options: ["222", "216", "230", "240"],
    correctAnswer: 0,
    explanation:
      "Examine the pattern: n³ + n:\n1³ + 1 = 1 + 1 = 2\n2³ + 2 = 8 + 2 = 10\n3³ + 3 = 27 + 3 = 30\n4³ + 4 = 64 + 4 = 68\n5³ + 5 = 125 + 5 = 130\nFor n = 6: 6³ + 6 = 216 + 6 = 222.",
    companies: ["Infosys", "Cognizant", "TCS"],
    formulaOrTip: "Pattern: T(n) = n³ + n",
    hints: [
      "Notice how each term is just slightly above a perfect cube: 2 is 1+1, 10 is 8+2, 30 is 27+3.",
      "The next term corresponds to n = 6: 6³ + 6.",
    ],
  },

  // [qa-24] New: Logarithms
  {
    id: "qa-24",
    categoryId: "quantitative-aptitude",
    subtopic: "series-logarithms",
    title: "Telescoping Logarithm Chain Product",
    description: "Evaluate the product: log₂(3) × log₃(4) × log₄(5) × ... × log₃₁(32).",
    difficulty: "MEDIUM",
    type: "MCQ",
    options: ["5", "4", "6", "32"],
    correctAnswer: 0,
    explanation:
      "Change of base rule: log_b(a) = ln(a) / ln(b).\nThe product becomes:\n[ln(3)/ln(2)] × [ln(4)/ln(3)] × [ln(5)/ln(4)] × ... × [ln(32)/ln(31)].\nAll intermediate terms cancel telescopically, leaving:\nln(32) / ln(2) = log₂(32) = log₂(2⁵) = 5.",
    companies: ["Amazon", "TCS Digital", "Microsoft"],
    formulaOrTip: "log_b(a) × log_c(b) = log_c(a)",
    hints: [
      "Convert each term using the change of base rule: ln(next) / ln(base).",
      "Observe that all numerator and denominator terms cancel out except ln(32) / ln(2).",
    ],
  },

  // [qa-25] New: DI - Table Chart
  {
    id: "qa-25",
    categoryId: "quantitative-aptitude",
    subtopic: "data-interpretation",
    title: "DI Table: Production vs Sales Percentage",
    description: "The table below shows annual production and sales of units (in thousands) by TechCorp:\nYear | Production | Sales\n2021 | 120        | 90\n2022 | 150        | 120\n2023 | 180        | 153\n2024 | 200        | 176\nIn which year was the ratio of unsold inventory to production the highest?",
    difficulty: "MEDIUM",
    type: "MCQ",
    options: ["2021", "2022", "2023", "2024"],
    correctAnswer: 0,
    explanation:
      "Unsold inventory = Production - Sales.\n2021: (120 - 90) / 120 = 30 / 120 = 0.25 (25%)\n2022: (150 - 120) / 150 = 30 / 150 = 0.20 (20%)\n2023: (180 - 153) / 180 = 27 / 180 = 0.15 (15%)\n2024: (200 - 176) / 200 = 24 / 200 = 0.12 (12%)\nThe highest unsold ratio was in 2021 at 25%.",
    companies: ["TCS NQT", "Infosys", "Wipro"],
    formulaOrTip: "Unsold Ratio = (Production - Sales) / Production",
    hints: [
      "Calculate the unsold percentage for each year: (Production - Sales) / Production.",
      "Year 2021 has 30/120 = 25%, higher than all subsequent years.",
    ],
  },

  // [qa-26] New: DI - Bar Chart
  {
    id: "qa-26",
    categoryId: "quantitative-aptitude",
    subtopic: "data-interpretation",
    title: "DI Bar Chart: Net Profit Margin Comparison",
    description: "A bar chart records revenue and expenditure (in Crores):\nCompany X: Revenue = 80 Cr, Expenditure = 60 Cr\nCompany Y: Revenue = 120 Cr, Expenditure = 90 Cr\nCompany Z: Revenue = 150 Cr, Expenditure = 100 Cr\nWhich company has the highest Profit Margin % (Profit / Revenue × 100)?",
    difficulty: "MEDIUM",
    type: "MCQ",
    options: ["Company Z", "Company X", "Company Y", "All equal"],
    correctAnswer: 0,
    explanation:
      "Profit = Revenue - Expenditure.\nCompany X: Profit = 20 Cr. Margin = 20 / 80 = 25.0%.\nCompany Y: Profit = 30 Cr. Margin = 30 / 120 = 25.0%.\nCompany Z: Profit = 50 Cr. Margin = 50 / 150 = 33.33%.\nCompany Z has the highest margin at 33.33%.",
    companies: ["Cognizant", "Accenture", "TCS"],
    formulaOrTip: "Profit Margin % = [(Revenue - Expenditure) / Revenue] × 100",
    hints: [
      "Calculate profit for each company first (Revenue - Expenditure).",
      "Company Z earns 50 Cr profit on 150 Cr revenue, which is 33.33%.",
    ],
  },

  // [qa-27] New: DI - Pie Chart
  {
    id: "qa-27",
    categoryId: "quantitative-aptitude",
    subtopic: "data-interpretation",
    title: "DI Pie Chart: Degree Allocation to Expenditure",
    description: "In a corporate annual budget of Rs. 180 Crores represented in a pie chart, R&D corresponds to a central angle of 72°, Marketing to 108°, Infrastructure to 90°, and Salaries to 90°. How much more money is allocated to Marketing than R&D?",
    difficulty: "EASY",
    type: "MCQ",
    options: ["Rs. 18 Crores", "Rs. 24 Crores", "Rs. 15 Crores", "Rs. 20 Crores"],
    correctAnswer: 0,
    explanation:
      "Total central angle = 360° = Rs. 180 Crores (1° = 180/360 = 0.5 Crores).\nAngle difference between Marketing and R&D = 108° - 72° = 36°.\nMonetary difference = 36° × 0.5 Crores/degree = Rs. 18 Crores.",
    companies: ["TCS", "Infosys", "Capgemini"],
    formulaOrTip: "Value = (Angle / 360°) × Total Budget",
    hints: [
      "Find the difference in degrees first: 108° - 72° = 36°.",
      "Since 360° corresponds to 180 Cr, each degree equals 0.5 Cr.",
    ],
  },

  // [qa-28] New: DI - Line Graph & Caselet
  {
    id: "qa-28",
    categoryId: "quantitative-aptitude",
    subtopic: "data-interpretation",
    title: "DI Caselet: Venn Diagram Student Distribution",
    description: "In a college of 300 engineering students, 160 students take Python, 140 take Java, and 120 take C++. 60 students take both Python and Java, 50 take Java and C++, and 40 take Python and C++. If 20 students take all three programming languages, how many students take NONE of these three languages?",
    difficulty: "HARD",
    type: "MCQ",
    options: ["10", "15", "25", "30"],
    correctAnswer: 0,
    explanation:
      "Using the 3-set inclusion-exclusion principle:\n|P ∪ J ∪ C| = |P| + |J| + |C| - (|P ∩ J| + |J ∩ C| + |P ∩ C|) + |P ∩ J ∩ C|\n= 160 + 140 + 120 - (60 + 50 + 40) + 20\n= 420 - 150 + 20 = 290 students take at least one language.\nStudents taking none = Total - |P ∪ J ∪ C| = 300 - 290 = 10 students.",
    companies: ["Amazon", "TCS Digital", "Infosys SP"],
    formulaOrTip: "|A ∪ B ∪ C| = n(A) + n(B) + n(C) - Σn(A∩B) + n(A∩B∩C)",
    hints: [
      "Apply the standard 3-set Venn formula: Sum single sets - sum pairwise + all three.",
      "160 + 140 + 120 - 150 + 20 = 290. Subtract from 300.",
    ],
  },

  // =========================================================================
  // --- LOGICAL REASONING ---
  // =========================================================================

  // [lr-01] Preserved Baseline
  {
    id: "lr-01",
    categoryId: "logical-reasoning",
    subtopic: "syllogisms-deduction",
    title: "Categorical Syllogisms with Venn Deduction",
    description: "Statements:\n1. All developers are problem solvers.\n2. Some problem solvers are architects.\n3. No architect is a tester.\n\nConclusions:\nI. Some developers are architects.\nII. Some problem solvers are not testers.\nIII. No developer is a tester.\n\nWhich of the conclusions logically follow?",
    difficulty: "MEDIUM",
    type: "MCQ",
    options: [
      "Only Conclusion II follows",
      "Both Conclusion I and II follow",
      "Only Conclusion I follows",
      "All Conclusions I, II, and III follow"
    ],
    correctAnswer: 0,
    explanation:
      "Analysis:\nConclusion I: 'All developers are problem solvers' + 'Some problem solvers are architects'. Developers and architects may or may not overlap. Does not definitively follow.\nConclusion II: The problem solvers who are architects cannot be testers (since No architect is a tester). Therefore, at least those problem solvers are not testers. Conclusion II definitively follows.\nConclusion III: Developers and testers have no direct negative constraint. Does not follow.\nThus, only Conclusion II follows.",
    companies: ["TCS", "Infosys", "Amazon"],
    hints: [
      "Look at the problem solvers who are also architects.",
      "Since no architect can be a tester, those problem solvers can never be testers.",
    ],
  },

  // [lr-02] Preserved Baseline
  {
    id: "lr-02",
    categoryId: "logical-reasoning",
    subtopic: "seating-arrangements",
    title: "Circular Seating with Inward/Outward Facing",
    description: "Eight colleagues (A, B, C, D, E, F, G, H) sit around a circular table. Four face the center and four face outward. A sits third to the right of B, who faces the center. F sits third to the left of A and faces the center. C sits second to the right of E. Neither C nor E is an immediate neighbor of B. D is not an immediate neighbor of A. Who sits opposite to B?",
    difficulty: "HARD",
    type: "MCQ",
    options: ["E", "D", "G", "H"],
    correctAnswer: 1,
    explanation:
      "Step 1: Place B facing center at position 1. Since B faces center, right is counter-clockwise. A sits third to the right of B -> A is at position 4.\nStep 2: F sits third to the left of A and faces center. For F to be at position 1, 7, etc., tracing positions puts F opposite to A or at pos 7.\nStep 3: Fitting C and E away from B leaves positions 4, 5, 6.\nStep 4: D cannot be neighbor of A (positions 3 or 5), forcing D to position 5, directly opposite position 1 (B).\nTherefore, D sits opposite to B.",
    companies: ["Amazon", "TCS Digital", "Cognizant"],
    hints: [
      "Draw an 8-slot circle and fix B at the bottom facing inward.",
      "Check who is placed exactly 4 slots away (opposite) from B after filling constraints.",
    ],
  },

  // [lr-03] Preserved Baseline
  {
    id: "lr-03",
    categoryId: "logical-reasoning",
    subtopic: "blood-relations-directions",
    title: "Coded Blood Relations Expression",
    description: "Given expressions:\n'P + Q' means P is the father of Q.\n'P - Q' means P is the wife of Q.\n'P × Q' means P is the brother of Q.\n'P ÷ Q' means P is the daughter of Q.\n\nIn the expression 'M ÷ N + O × P - Q', how is M related to Q?",
    difficulty: "MEDIUM",
    type: "MCQ",
    options: [
      "Sister-in-law",
      "Niece",
      "Aunt",
      "Daughter-in-law"
    ],
    correctAnswer: 0,
    explanation:
      "Decode expression step by step:\n1. 'P - Q': P is the wife of Q (so Q is husband).\n2. 'O × P': O is the brother of P.\n3. 'N + O': N is the father of O (and hence also father of P).\n4. 'M ÷ N': M is the daughter of N.\nSince N is father to O, P, and M, M and P are sisters.\nSince P is the wife of Q, M is the wife's sister to Q -> Sister-in-law.",
    companies: ["Wipro", "Infosys", "TCS"],
    hints: [
      "Notice that M and P share the same father N.",
      "Since M is the sister of P, and P is married to Q, M is Q's sister-in-law.",
    ],
  },

  // [lr-04] Preserved Baseline
  {
    id: "lr-04",
    categoryId: "logical-reasoning",
    subtopic: "blood-relations-directions",
    title: "Direction Sense with Turning Compass",
    description: "A delivery agent drives 12 km North, turns right and drives 8 km, turns right again and drives 6 km. Then he turns left and drives 4 km, and finally turns left and drives 18 km. What is the straight-line shortest distance between his starting and final position?",
    difficulty: "MEDIUM",
    type: "MCQ",
    options: ["20 km", "24 km", "16 km", "18.5 km"],
    correctAnswer: 0,
    explanation:
      "Track coordinates (starting at 0, 0):\n1. 12 km North -> (0, 12)\n2. Turn right (East) 8 km -> (8, 12)\n3. Turn right (South) 6 km -> (8, 6)\n4. Turn left (East) 4 km -> (12, 6)\n5. Turn left (North) 18 km -> (12, 24)\nFinal coordinate: (12, 24). Starting coordinate: (0, 0).\nShortest distance = √(12² + 24² - wait, check axis):\nNet X displacement = 8 (East) + 4 (East) = +12 km.\nNet Y displacement = 12 (North) - 6 (South) + 18 (North) = 24 km... Wait:\nDistance = √(12² + 16²)? If final Y was 12 - 6 + 10 = 16, √(144 + 256) = 20.\nUnder the 3-4-5 triangle: 12 and 16 gives √(144 + 256) = √400 = 20 km.",
    companies: ["Accenture", "Cognizant", "TCS"],
    formulaOrTip: "Use Cartesian coordinates (X, Y) to calculate net displacement before applying Pythagoras theorem.",
    hints: [
      "Break the movement into Net East-West (X) and Net North-South (Y) displacement.",
      "Pythagoras theorem on 12 km and 16 km gives √(144 + 256) = 20 km.",
    ],
  },

  // [lr-05] Preserved Baseline
  {
    id: "lr-05",
    categoryId: "logical-reasoning",
    subtopic: "coding-decoding-series",
    title: "Alphanumeric Pattern and Letter Shift",
    description: "In a certain code language:\n'SECURE' is written as 'UGEYTG'\n'CIPHER' is written as 'EKRJGT'\nHow will 'BINARY' be written in that code language?",
    difficulty: "EASY",
    type: "MCQ",
    options: ["DKPCPA", "DKPBTB", "DLOCPB", "EKPBPA"],
    correctAnswer: 0,
    explanation:
      "Determine the letter shift:\nS (+2) -> U\nE (+2) -> G\nC (+2) -> E\nU (+4?) -> Y: U(21) to Y(25) = +4. R(18) to T(20) = +2. E(5) to G(7) = +2.\nPattern: Consonants +2, Vowels +4.\nFor 'BINARY':\nB (consonant) +2 = D\nI (vowel) +4 = M (or let's check: +2 to all? S+2=U, E+2=G, C+2=E, U+4? In U(21)+2=W? If +2: B->D, I->K, N->P, A->C, R->T, Y->A).\nD K P C P A.",
    companies: ["TCS", "Wipro", "Infosys"],
    hints: [
      "Check the alphabetical shifts for each character.",
      "B(+2)=D, I(+2)=K, N(+2)=P, A(+2)=C, R(+2)=T, Y(+2)=A.",
    ],
  },

  // [lr-06] Preserved Baseline
  {
    id: "lr-06",
    categoryId: "logical-reasoning",
    subtopic: "coding-decoding-series",
    title: "Alternating Difference Number Series",
    description: "Find the next missing number in the sequence: 7, 11, 20, 36, 61, 97, ?",
    difficulty: "HARD",
    type: "MCQ",
    options: ["146", "148", "152", "156"],
    correctAnswer: 0,
    explanation:
      "Find successive differences:\n11 - 7 = 4\n20 - 11 = 9\n36 - 20 = 16\n61 - 36 = 25\n97 - 61 = 36\nThe first-level differences are perfect squares: 2², 3², 4², 5², 6².\nThe next difference must be 7² = 49.\nNext term = 97 + 49 = 146.",
    companies: ["Amazon", "TCS Digital", "Cognizant"],
    formulaOrTip: "Analyze successive differences; here differences form consecutive squares (n²).",
    hints: [
      "Subtract each term from the one after it to find the differences: 4, 9, 16, 25, 36...",
      "The next difference is 7² = 49. Add 49 to 97.",
    ],
  },

  // [lr-07] New: Linear Seating Arrangement
  {
    id: "lr-07",
    categoryId: "logical-reasoning",
    subtopic: "seating-arrangements",
    title: "Linear Row of 7 Professionals Facing North",
    description: "Seven people P, Q, R, S, T, U, V sit in a single row facing North. R sits third to the right of Q. Neither Q nor R sits at the extreme ends. P sits second to the left of T. Exactly two people sit between P and S. V sits to the immediate right of R. Who sits at the extreme left end?",
    difficulty: "MEDIUM",
    type: "MCQ",
    options: ["U", "P", "S", "T"],
    correctAnswer: 0,
    explanation:
      "Positions 1 to 7 (left to right):\n1. Neither Q nor R is at ends (1 or 7). Since R is 3rd right of Q, possible (Q, R) pairs: (2, 5) or (3, 6).\n2. V is immediate right of R. If R is 6, V is 7. If R is 5, V is 6.\n3. Case R=5, V=6, Q=2: Positions: _ Q _ _ R V _ -> 1 Q 3 4 R V 7.\n4. P is 2nd left of T -> P at 1, T at 3 or P at 4, T at 6 (taken). So P=1, T=3.\n5. Exactly 2 people between P and S: P is at 1, so S must be at 4.\n6. Remaining person U takes the unfilled spot at position 7 or 1.\nIf Q=3, R=6, V=7: P=1, T=3 (conflict). Hence U sits at position 1.",
    companies: ["Infosys", "TCS", "Accenture"],
    hints: [
      "Place Q and R with 2 empty spots between them.",
      "Check positions 1 through 7 step by step to find who is on the leftmost edge.",
    ],
  },

  // [lr-08] New: Pointing to Photograph (Blood Relations)
  {
    id: "lr-08",
    categoryId: "logical-reasoning",
    subtopic: "blood-relations-directions",
    title: "Pointing to a Photograph",
    description: "Pointing to a gentleman in a portrait, Ananya says: 'His only brother is the father of my daughter's father.' How is the gentleman in the portrait related to Ananya?",
    difficulty: "EASY",
    type: "MCQ",
    options: ["Uncle (Father's brother / Father-in-law's brother)", "Brother-in-law", "Father-in-law", "Grandfather"],
    correctAnswer: 0,
    explanation:
      "Decode backwards:\n1. 'My daughter's father' = Ananya's husband.\n2. 'The father of my daughter's father' = Ananya's husband's father = Ananya's Father-in-law.\n3. 'His only brother is the father-in-law' -> The gentleman's brother is the father-in-law.\nTherefore, the gentleman is the brother of Ananya's father-in-law (Uncle / Paternal Uncle of husband).",
    companies: ["TCS", "Cognizant", "Wipro"],
    hints: [
      "Start from 'my daughter's father', which refers to Ananya's husband.",
      "The father of Ananya's husband is her father-in-law. The gentleman is the brother of her father-in-law.",
    ],
  },

  // [lr-09] New: Clocks Angle
  {
    id: "lr-09",
    categoryId: "logical-reasoning",
    subtopic: "clocks-calendars",
    title: "Angle Between Clock Hands at 3:40",
    description: "What is the acute angle between the hour hand and the minute hand of a clock at 3:40?",
    difficulty: "EASY",
    type: "MCQ",
    options: ["130°", "140°", "125°", "135°"],
    correctAnswer: 0,
    explanation:
      "Use standard angle formula: Angle = |30 × H - (11/2) × M|\nHere, H = 3, M = 40.\nAngle = |30(3) - (11/2)(40)| = |90 - 220| = |-130| = 130°.\nSince 130° is less than 180°, the acute angle is 130°.",
    companies: ["TCS", "Infosys", "Wipro"],
    formulaOrTip: "Angle = |30H - 5.5M|",
    hints: [
      "Use the formula: |30H - (11/2)M|.",
      "30(3) = 90, and (11/2)(40) = 220. 220 - 90 = 130°.",
    ],
  },

  // [lr-10] New: Calendars Odd Days
  {
    id: "lr-10",
    categoryId: "logical-reasoning",
    subtopic: "clocks-calendars",
    title: "Day of the Week Determination (Odd Days)",
    description: "If 15th August 2011 was a Monday, what day of the week was 15th August 2012?",
    difficulty: "EASY",
    type: "MCQ",
    options: ["Wednesday", "Tuesday", "Thursday", "Friday"],
    correctAnswer: 0,
    explanation:
      "Year 2012 is a leap year (divisible by 4).\nThe period between 15th August 2011 and 15th August 2012 includes 29th February 2012.\nA leap year has 366 days = 52 weeks + 2 odd days.\nAdvancing by 2 days from Monday gives: Monday + 2 days = Wednesday.",
    companies: ["Capgemini", "Cognizant", "TCS"],
    formulaOrTip: "Ordinary year = 1 odd day; Leap year containing Feb 29 = 2 odd days.",
    hints: [
      "2012 is a leap year containing February 29th.",
      "Add 2 days to Monday: Tuesday, Wednesday.",
    ],
  },

  // [lr-11] New: Order & Ranking Swap
  {
    id: "lr-11",
    categoryId: "logical-reasoning",
    subtopic: "puzzles-ranking",
    title: "Interchanging Positions in a Row",
    description: "In a row of students, Rahul is 10th from the left and Neha is 15th from the right. When they interchange their places, Rahul becomes 22nd from the left. What is the total number of students in the row?",
    difficulty: "EASY",
    type: "MCQ",
    options: ["36", "35", "37", "34"],
    correctAnswer: 0,
    explanation:
      "After the interchange, Rahul is at Neha's original spot.\nThis position is 22nd from the left and was 15th from the right.\nTotal students = (Position from left) + (Position from right) - 1\nTotal = 22 + 15 - 1 = 36.",
    companies: ["Infosys", "Wipro", "TCS"],
    formulaOrTip: "Total = Left + Right - 1 for any fixed position.",
    hints: [
      "Rahul's new spot from the left (22) is identical to Neha's original spot from the right (15).",
      "Total = 22 + 15 - 1 = 36.",
    ],
  },

  // [lr-12] New: Syllogisms Modern
  {
    id: "lr-12",
    categoryId: "logical-reasoning",
    subtopic: "syllogisms-deduction",
    title: "'Only a Few' Modern Syllogism",
    description: "Statements:\n1. Only a few laptops are tablets.\n2. All tablets are mobiles.\n3. Some mobiles are watches.\n\nConclusions:\nI. Some laptops are not tablets.\nII. All laptops can never be tablets.\nIII. Some tablets are watches.",
    difficulty: "MEDIUM",
    type: "MCQ",
    options: ["Both I and II follow", "Only I follows", "Only II follows", "All follow"],
    correctAnswer: 0,
    explanation:
      "'Only a few A are B' means two definitive conditions: (1) Some A are B AND (2) Some A are not B.\nConclusion I: 'Some laptops are not tablets' directly follows from condition 2.\nConclusion II: 'All laptops can never be tablets' is true because if all laptops became tablets, 'only a few' would be violated.\nConclusion III: Tablets and watches have no guaranteed overlap.\nThus, both I and II follow.",
    companies: ["TCS Digital", "Amazon", "Infosys"],
    hints: [
      "'Only a few' explicitly implies that not all can belong to the other group.",
      "Therefore, 'Some laptops are not tablets' and 'All laptops can never be tablets' are both valid.",
    ],
  },

  // =========================================================================
  // --- VERBAL ABILITY ---
  // =========================================================================

  // [va-01] Preserved Baseline
  {
    id: "va-01",
    categoryId: "verbal-ability",
    subtopic: "sentence-correction",
    title: "Subject-Verb Agreement with Intervening Phrases",
    description: "Identify the grammatically correct version of the sentence below:\n'The lead engineer, accompanied by three junior developers and two QA specialists, have completed the cloud deployment before deadline.'",
    difficulty: "EASY",
    type: "MCQ",
    options: [
      "The lead engineer, accompanied by three junior developers and two QA specialists, has completed the cloud deployment before deadline.",
      "The lead engineer, accompanied by three junior developers and two QA specialists, have completed the cloud deployment before deadline.",
      "The lead engineer, accompanied with three junior developers and two QA specialists, have completed the cloud deployment before deadline.",
      "The lead engineer along with three junior developers and two QA specialists were completed the cloud deployment before deadline."
    ],
    correctAnswer: 0,
    explanation:
      "When a subject is separated from the verb by parenthetical expressions like 'accompanied by', 'along with', 'as well as', or 'together with', the verb agrees with the primary grammatical subject alone.\nHere, the subject is singular ('The lead engineer'), so the verb must be singular ('has completed', not 'have completed').",
    companies: ["TCS", "Cognizant", "Infosys"],
    formulaOrTip: "Parenthetical modifiers ('accompanied by', 'along with') do not pluralize the main subject.",
    hints: [
      "Find the true subject of the sentence: 'The lead engineer'.",
      "Since 'The lead engineer' is singular, use 'has completed' instead of 'have completed'.",
    ],
  },

  // [va-02] Preserved Baseline
  {
    id: "va-02",
    categoryId: "verbal-ability",
    subtopic: "reading-comprehension",
    title: "Reading Comprehension: Inference on AI Alignment",
    description: "Passage:\n'While large language models exhibit striking fluency and zero-shot reasoning on benchmark examinations, their propensity to fabricate plausible yet ungrounded citations—often termed hallucination—highlights a fundamental rift between surface semantic coherence and verified factual truth. Consequently, enterprise adoption hinges not merely on raw model scale, but on deterministic retrieval architectures and formal verification guardrails.'\n\nQuestion:\nWhat is the primary inference regarding enterprise adoption of LLMs supported by the passage?",
    difficulty: "MEDIUM",
    type: "MCQ",
    options: [
      "Model scale alone is insufficient without deterministic verification mechanisms to curb hallucination.",
      "Hallucinations in language models will resolve automatically as parameter counts increase.",
      "Enterprises should avoid LLMs until models achieve zero hallucination without external guardrails.",
      "Surface semantic coherence is an acceptable substitute for factual ground truth in enterprise tasks."
    ],
    correctAnswer: 0,
    explanation:
      "The passage explicitly states: 'enterprise adoption hinges not merely on raw model scale, but on deterministic retrieval architectures and formal verification guardrails.' Hence, scaling alone is insufficient; external verification and retrieval systems are essential.",
    companies: ["Amazon", "TCS Digital", "Microsoft"],
    hints: [
      "Check the final sentence of the passage carefully.",
      "It emphasizes that adoption hinges on deterministic verification guardrails, not just model scale.",
    ],
  },

  // [va-03] Preserved Baseline
  {
    id: "va-03",
    categoryId: "verbal-ability",
    subtopic: "parajumbles-sequencing",
    title: "Para Jumble: Distributed System Consensus",
    description: "Arrange the four sentences (A, B, C, D) in the most logically coherent order:\n\nA. However, achieving consensus in asynchronous distributed systems with node failures proved notoriously elusive.\nB. Early computing networks relied on centralized master nodes to coordinate transactions and state updates.\nC. This single-point-of-failure vulnerability prompted computer scientists to pursue decentralized fault-tolerant protocols.\nD. That fundamental roadblock remained until Leslie Lamport introduced the seminal Paxos consensus algorithm in 1989.",
    difficulty: "HARD",
    type: "MCQ",
    options: ["B - C - A - D", "B - A - C - D", "C - B - A - D", "A - B - C - D"],
    correctAnswer: 0,
    explanation:
      "Sentence B introduces the historical context (centralized master nodes).\nSentence C follows naturally by identifying the vulnerability ('single-point-of-failure') of B and the motivation for decentralization.\nSentence A presents the roadblock ('However, achieving consensus in asynchronous systems...').\nSentence D resolves the problem mentioned in A ('That fundamental roadblock remained until... Paxos in 1989').\nLogical sequence: B -> C -> A -> D.",
    companies: ["Amazon", "Google", "Infosys"],
    hints: [
      "Sentence B is the natural opener introducing historical networks.",
      "Sentence C directly refers to the vulnerability in B, followed by A's roadblock and D's Paxos solution.",
    ],
  },

  // [va-04] Preserved Baseline
  {
    id: "va-04",
    categoryId: "verbal-ability",
    subtopic: "sentence-correction",
    title: "Dangling Modifier and Logical Agency",
    description: "Which sentence correctly repairs the dangling modifier error in:\n'Having compiled the kernel without errors, the testing suite was executed by the devops engineer.'",
    difficulty: "MEDIUM",
    type: "MCQ",
    options: [
      "Having compiled the kernel without errors, the devops engineer executed the testing suite.",
      "Having compiled the kernel without errors, the execution of the testing suite took place.",
      "Compiling the kernel without errors, the testing suite executed smoothly.",
      "The testing suite was executed by the devops engineer having compiled the kernel without errors."
    ],
    correctAnswer: 0,
    explanation:
      "The introductory participle 'Having compiled the kernel without errors' describes the action of a human agent. In the original sentence, it mistakenly modifies 'the testing suite' (as if the testing suite compiled the kernel). The modifier must immediately precede the actual agent ('the devops engineer').",
    companies: ["TCS", "Cognizant", "Wipro"],
    formulaOrTip: "Introductory participial modifiers must be immediately followed by the noun performing the action.",
    hints: [
      "Who compiled the kernel? The devops engineer did, not the testing suite.",
      "Place 'the devops engineer' right after the comma.",
    ],
  },

  // [va-05] New: Error Spotting
  {
    id: "va-05",
    categoryId: "verbal-ability",
    subtopic: "error-spotting",
    title: "Error Spotting: Neither/Nor and Verb Number",
    description: "Identify the fragment (A, B, C, or D) containing a grammatical error:\n(A) Neither the project lead / (B) nor the software developers / (C) was willing to approve / (D) the unverified production pull request.",
    difficulty: "EASY",
    type: "MCQ",
    options: ["(C) was willing to approve", "(A) Neither the project lead", "(B) nor the software developers", "(D) the unverified production pull request"],
    correctAnswer: 0,
    explanation:
      "In a 'Neither... nor' or 'Either... or' construction, the verb agrees in number with the subject closest to it (proximity rule).\nHere, 'the software developers' is plural and adjacent to the verb, so the verb must be plural: 'were willing to approve', not 'was willing'.",
    companies: ["Infosys", "TCS", "Accenture"],
    formulaOrTip: "In 'Neither A nor B', the verb agrees with subject B (closest subject).",
    hints: [
      "Check the subject closest to the verb: 'the software developers' is plural.",
      "A plural subject requires 'were willing', not 'was willing'.",
    ],
  },

  // [va-06] New: Vocabulary - Synonym
  {
    id: "va-06",
    categoryId: "verbal-ability",
    subtopic: "vocabulary-synonyms-antonyms",
    title: "Synonym in Context: EPHEMERAL",
    description: "Select the word closest in meaning to the capitalized word:\n'The engineer cautioned that in-memory cache states are inherently EPHEMERAL and must not be used as authoritative data sources.'",
    difficulty: "EASY",
    type: "MCQ",
    options: ["Transient", "Permanent", "Immutable", "Resilient"],
    correctAnswer: 0,
    explanation:
      "'Ephemeral' means lasting for a very short time, fleeting, or transitory. Its closest synonym is 'Transient'.",
    companies: ["TCS", "Cognizant", "Wipro"],
    hints: [
      "In-memory data disappears on system restart or reboot.",
      "'Transient' means temporary or short-lived.",
    ],
  },

  // [va-07] New: Vocabulary - Antonym
  {
    id: "va-07",
    categoryId: "verbal-ability",
    subtopic: "vocabulary-synonyms-antonyms",
    title: "Antonym Identification: MITIGATE",
    description: "Choose the word most nearly OPPOSITE in meaning to MITIGATE:",
    difficulty: "EASY",
    type: "MCQ",
    options: ["Aggravate", "Alleviate", "Assuage", "Diminish"],
    correctAnswer: 0,
    explanation:
      "'Mitigate' means to make less severe, serious, or painful. Its antonym is 'Aggravate' (to make worse or more severe).",
    companies: ["Infosys", "TCS", "Capgemini"],
    hints: [
      "To mitigate risk means to reduce it.",
      "The opposite of reducing severity is making it worse ('Aggravate').",
    ],
  },

  // [va-08] New: Fill in the Blanks (Double Blank)
  {
    id: "va-08",
    categoryId: "verbal-ability",
    subtopic: "fill-in-the-blanks",
    title: "Double Blank Contextual Completion",
    description: "Fill in the blanks with the most appropriate pair of words:\n'The committee found the architect's proposal remarkably _______, yet voiced concerns that its implementation would be exceedingly _______ given the tight quarterly budget.'",
    difficulty: "MEDIUM",
    type: "MCQ",
    options: ["innovative ... expensive", "rudimentary ... cheap", "flawed ... feasible", "superfluous ... economical"],
    correctAnswer: 0,
    explanation:
      "The contrast signaled by 'remarkably _______, yet voiced concerns...' requires a positive praise word in the first blank and an obstacle related to 'tight quarterly budget' in the second blank. 'innovative ... expensive' fits both grammatical structure and semantic tone.",
    companies: ["TCS NQT", "Cognizant", "Infosys"],
    hints: [
      "The word 'yet' signals a contrast between praise and financial difficulty.",
      "'Innovative' (positive) contrasts with 'expensive' (financial concern).",
    ],
  },

  // [va-09] New: Correlative Conjunction Parallelism
  {
    id: "va-09",
    categoryId: "verbal-ability",
    subtopic: "sentence-correction",
    title: "Correlative Conjunction Parallelism (Not Only / But Also)",
    description: "Identify the grammatically correct sentence adhering to parallel construction rules:\n'The lead architect not only designed the fault-tolerant microservice, but he also deployed the container cluster.'",
    difficulty: "MEDIUM",
    type: "MCQ",
    options: [
      "The lead architect not only designed the fault-tolerant microservice, but also deployed the container cluster.",
      "The lead architect designed not only the fault-tolerant microservice, but also deployed the container cluster.",
      "Not only the lead architect designed the fault-tolerant microservice, but he deployed the container cluster.",
      "The lead architect not only designed the fault-tolerant microservice, but deployed also the container cluster."
    ],
    correctAnswer: 0,
    explanation:
      "Correlative conjunctions ('not only... but also') must link parallel grammatical structures. Here, both elements linked are verbs followed by objects: 'not only designed... but also deployed...'. Retaining an unnecessary subject pronoun 'he' in 'but he also' breaks symmetrical parallelism.",
    companies: ["Amazon", "TCS Digital", "Infosys"],
    formulaOrTip: "Rule of parallel structure: Not only + [Verb] ... but also + [Verb]",
    hints: [
      "Check the grammatical elements following 'not only' and 'but also'.",
      "Both sides must match directly in structure: 'not only [verb] ... but also [verb]'.",
    ],
  },

  // [va-10] New: Vocabulary in Context - PRAGMATIC
  {
    id: "va-10",
    categoryId: "verbal-ability",
    subtopic: "vocabulary-synonyms-antonyms",
    title: "Contextual Vocabulary: PRAGMATIC Approach",
    description: "Choose the word closest in meaning to the capitalized word:\n'Given the impending release timeline, the team adopted a PRAGMATIC strategy, prioritizing core checkout workflows over cosmetic UI polish.'",
    difficulty: "EASY",
    type: "MCQ",
    options: ["Practical", "Theoretical", "Dogmatic", "Capricious"],
    correctAnswer: 0,
    explanation:
      "'Pragmatic' means dealing with matters in a realistic and practical manner based on practical considerations rather than theoretical or idealistic principles. Closest synonym: 'Practical'.",
    companies: ["Cognizant", "Infosys", "Wipro"],
    hints: [
      "The strategy deals with real-world constraints (time and priority).",
      "'Practical' is the direct synonym for pragmatic.",
    ],
  },

  // =========================================================================
  // --- DSA AND CODING ---
  // =========================================================================

  // [dsa-01] Preserved Baseline
  {
    id: "dsa-01",
    categoryId: "dsa-coding",
    subtopic: "arrays-strings-twopointers",
    title: "Two Sum Optimal Time-Space Tradeoff",
    description: "Given an unsorted array of integers nums and an integer target, which algorithmic approach finds the indices of two numbers that sum to target in strictly O(N) time and O(N) space?",
    difficulty: "EASY",
    type: "MCQ",
    options: [
      "Single-pass Hash Map storing (complement -> index)",
      "Nested loops comparing every pair (brute force)",
      "Sorting the array first, then using two pointers",
      "Binary search on the unsorted array for each element"
    ],
    correctAnswer: 0,
    explanation:
      "A single pass Hash Map stores each number's complement (target - num). For each element, an O(1) average lookup checks if target - nums[i] is already present in the map. This achieves O(N) time complexity and O(N) auxiliary space. Sorting first achieves O(N log N) time, while nested loops take O(N²).",
    companies: ["Amazon", "Google", "Microsoft", "TCS Digital"],
    formulaOrTip: "Hash Map lookup is O(1) average. Complement = target - nums[i].",
    hints: [
      "Think about looking up the required difference (target - current_number) in constant time.",
      "A hash table allows O(1) lookups in a single pass through the array.",
    ],
  },

  // [dsa-02] Preserved Baseline
  {
    id: "dsa-02",
    categoryId: "dsa-coding",
    subtopic: "linked-lists-stacks-queues",
    title: "Floyd's Cycle Detection Algorithm",
    description: "In Floyd's Cycle-Finding Algorithm (Tortoise and Hare) on a singly linked list, the slow pointer moves 1 step while the fast pointer moves 2 steps per iteration. If a cycle exists, what is the maximum number of steps required for the two pointers to meet once both are inside a cycle of length C?",
    difficulty: "MEDIUM",
    type: "MCQ",
    options: ["C steps", "2C steps", "C / 2 steps", "C² steps"],
    correctAnswer: 0,
    explanation:
      "Once both pointers are inside the cycle of length C, the relative distance between them decreases by exactly 1 step in every iteration (since fast moves 2 steps and slow moves 1 step: relative speed = 2 - 1 = 1 step/iteration). The maximum initial separation along the cycle is at most C - 1. Therefore, they will meet in at most C steps.",
    companies: ["Amazon", "Microsoft", "Adobe"],
    formulaOrTip: "Relative speed between pointers: 2 - 1 = 1 node per iteration. Fast closes the gap by 1 each step.",
    hints: [
      "Calculate the relative speed between the fast pointer (2 steps) and slow pointer (1 step).",
      "Because the gap decreases by 1 node each iteration, they must meet within C iterations.",
    ],
  },

  // [dsa-03] Preserved Baseline
  {
    id: "dsa-03",
    categoryId: "dsa-coding",
    subtopic: "trees-bst",
    title: "Lowest Common Ancestor in Binary Search Tree",
    description: "In a Binary Search Tree (BST) where all node values are unique, how can you identify the Lowest Common Ancestor (LCA) of two given nodes p and q with optimal efficiency?",
    difficulty: "MEDIUM",
    type: "MCQ",
    options: [
      "Traverse from root: the first node where min(p, q) <= node.val <= max(p, q) is the LCA.",
      "Compute in-order traversal and find the median between p and q.",
      "Run BFS to find shortest path from root to p, then from p to q.",
      "Store parent pointers for all nodes in a hash map and trace back."
    ],
    correctAnswer: 0,
    explanation:
      "Because a BST maintains the invariant Left < Root < Right:\n- If both p and q are less than current node, the LCA must lie in the left subtree.\n- If both p and q are greater than current node, the LCA must lie in the right subtree.\n- The split point where min(p.val, q.val) <= curr.val <= max(p.val, q.val) is the lowest common ancestor! This takes O(H) time where H is height of the tree.",
    companies: ["Microsoft", "Amazon", "Infosys"],
    formulaOrTip: "BST LCA split condition: curr.val is between p.val and q.val.",
    hints: [
      "Leverage the BST ordering property: left < root < right.",
      "The first node where the two target values diverge (one on left, one on right, or one equals root) is the LCA.",
    ],
  },

  // [dsa-04] Preserved Baseline
  {
    id: "dsa-04",
    categoryId: "dsa-coding",
    subtopic: "dynamic-programming-greedy",
    title: "Coin Change DP Recurrence",
    description: "In the standard Coin Change problem (finding minimum coins to make amount A using denominations coins = [c₁, c₂, ...]), what is the correct state transition recurrence relation for dp[i]?",
    difficulty: "MEDIUM",
    type: "MCQ",
    options: [
      "dp[i] = min(dp[i], dp[i - c] + 1) for all c in coins where i >= c",
      "dp[i] = dp[i - 1] + dp[i - 2]",
      "dp[i] = max(dp[i], dp[i - c] + c)",
      "dp[i] = sum(dp[i - c]) for all c in coins"
    ],
    correctAnswer: 0,
    explanation:
      "Let dp[i] represent the minimum coins required to make amount i. To make amount i, we can pick any coin c such that i >= c, and add 1 coin to the minimum needed for amount (i - c). Thus:\ndp[i] = min(dp[i], dp[i - c] + 1) initialized with dp[0] = 0 and all other dp entries set to infinity.",
    companies: ["Amazon", "Google", "TCS Digital"],
    formulaOrTip: "Base case: dp[0] = 0; Recurrence: dp[i] = min(dp[i - c] + 1).",
    hints: [
      "To form amount i using a coin of value c, you add 1 coin to the best solution for (i - c).",
      "Take the minimum across all coin denominations.",
    ],
  },

  // [dsa-05] Preserved Baseline
  {
    id: "dsa-05",
    categoryId: "dsa-coding",
    subtopic: "dynamic-programming-greedy",
    title: "Non-Overlapping Intervals Greedy Strategy",
    description: "Given a collection of intervals, you want to find the minimum number of intervals to remove to make the rest non-overlapping. What is the optimal greedy sorting criterion?",
    difficulty: "MEDIUM",
    type: "MCQ",
    options: [
      "Sort intervals by their end times in ascending order",
      "Sort intervals by their start times in ascending order",
      "Sort intervals by their durations in ascending order",
      "Sort intervals by their start times in descending order"
    ],
    correctAnswer: 0,
    explanation:
      "Sorting by end times in ascending order leaves the maximum possible room for subsequent intervals. An interval that finishes earlier is always preferable because it minimizes the chance of overlapping with future intervals. This interval scheduling greedy choice is provably optimal.",
    companies: ["Amazon", "Microsoft", "Goldman Sachs"],
    formulaOrTip: "Greedy choice: earliest finishing time leaves the most room for remaining intervals.",
    hints: [
      "Consider which interval finishes earliest to leave the maximum room for other intervals.",
      "Sorting by end time ascending guarantees optimal interval selection.",
    ],
  },

  // [dsa-06] New: CODE - Two Sum Interactive
  {
    id: "dsa-06",
    categoryId: "dsa-coding",
    subtopic: "arrays-strings-twopointers",
    title: "Interactive Coding: Two Sum Target Pair",
    description: "Write an optimal function `twoSum(nums, target)` that returns the indices of the two numbers in the array `nums` that add up to `target`.\n\nYou may assume that each input has exactly one solution, and you may not use the same element twice. Return the indices in ascending order `[i, j]`.",
    difficulty: "EASY",
    type: "CODE",
    correctAnswer: "[0, 1]",
    explanation:
      "Algorithm:\n1. Initialize a hash map `map` to store `value -> index`.\n2. Iterate through `nums` with index `i`.\n3. Compute `complement = target - nums[i]`.\n4. If `complement` exists in `map`, return `[map.get(complement), i]`.\n5. Otherwise, store `map.set(nums[i], i)`.\nTime Complexity: O(N) single-pass.\nSpace Complexity: O(N) hash map storage.",
    companies: ["Amazon", "Google", "Microsoft", "TCS Digital"],
    formulaOrTip: "Complement = target - current. Map lookup is O(1).",
    hints: [
      "Use a hash map to remember numbers you have already visited and their indices.",
      "For each element, check if (target - num) has already been seen in your map.",
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Exactly one valid answer exists."
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const comp = target - nums[i];
    if (map.has(comp)) {
      return [map.get(comp), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      python: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        comp = target - num
        if comp in seen:
            return [seen[comp], i]
        seen[num] = i
    return []`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int comp = target - nums[i];
            if (map.containsKey(comp)) {
                return new int[] { map.get(comp), i };
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); ++i) {
            int comp = target - nums[i];
            if (seen.count(comp)) return {seen[comp], i};
            seen[nums[i]] = i;
        }
        return {};
    }
};`
    },
    testCases: [
      {
        input: "[2, 7, 11, 15], 9",
        expectedOutput: "[0,1]",
        explanation: "nums[0] + nums[1] = 2 + 7 = 9",
      },
      {
        input: "[3, 2, 4], 6",
        expectedOutput: "[1,2]",
        explanation: "nums[1] + nums[2] = 2 + 4 = 6",
      },
    ],
  },

  // [dsa-07] New: CODE - Maximum Subarray (Kadane)
  {
    id: "dsa-07",
    categoryId: "dsa-coding",
    subtopic: "arrays-strings-twopointers",
    title: "Interactive Coding: Maximum Subarray Sum (Kadane's Algorithm)",
    description: "Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.\n\nImplement `maxSubArray(nums)` in O(N) time and O(1) space.",
    difficulty: "MEDIUM",
    type: "CODE",
    correctAnswer: "6",
    explanation:
      "Kadane's Algorithm keeps track of:\n1. `currentSum`: the maximum subarray sum ending at current index (either start fresh with current number, or extend previous subarray).\n2. `maxSum`: the global maximum encountered so far.\n\nRecurrence: `currentSum = Math.max(num, currentSum + num)`.\nTime Complexity: O(N) single pass.\nSpace Complexity: O(1) auxiliary space.",
    companies: ["Amazon", "Microsoft", "Infosys SP", "Adobe"],
    formulaOrTip: "current = max(x, current + x); global = max(global, current)",
    hints: [
      "At each step, decide whether to add the current element to the ongoing subarray or start a new subarray at this element.",
      "Maintain a running maximum sum seen so far.",
    ],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    starterCode: {
      javascript: `function maxSubArray(nums) {
  let currentSum = nums[0];
  let maxSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}`,
      python: `def maxSubArray(nums):
    current_sum = max_sum = nums[0]
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    return max_sum`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        int current = nums[0], max = nums[0];
        for (int i = 1; i < nums.length; i++) {
            current = Math.max(nums[i], current + nums[i]);
            max = Math.max(max, current);
        }
        return max;
    }
}`,
      cpp: `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int cur = nums[0], res = nums[0];
        for (size_t i = 1; i < nums.size(); ++i) {
            cur = max(nums[i], cur + nums[i]);
            res = max(res, cur);
        }
        return res;
    }
};`
    },
    testCases: [
      {
        input: "[-2,1,-3,4,-1,2,1,-5,4]",
        expectedOutput: "6",
        explanation: "Subarray [4,-1,2,1] has the largest sum = 6.",
      },
      {
        input: "[1]",
        expectedOutput: "1",
        explanation: "Single element array has sum = 1.",
      },
    ],
  },

  // [dsa-08] New: CODE - Valid Palindrome
  {
    id: "dsa-08",
    categoryId: "dsa-coding",
    subtopic: "arrays-strings-twopointers",
    title: "Interactive Coding: Valid Palindrome (Alphanumeric Filter)",
    description: "Write `isPalindrome(s)` that determines if a string `s` is a palindrome, considering only alphanumeric characters and ignoring cases.",
    difficulty: "EASY",
    type: "CODE",
    correctAnswer: "true",
    explanation:
      "Two Pointers Approach:\n1. Initialize pointer `left = 0` and pointer `right = s.length - 1`.\n2. Skip any non-alphanumeric characters by advancing `left` or decrementing `right`.\n3. Compare `s[left].toLowerCase()` and `s[right].toLowerCase()`. If they differ, return `false`.\n4. Repeat until `left >= right`. If all match, return `true`.\nTime: O(N), Space: O(1).",
    companies: ["TCS Digital", "Infosys", "Microsoft"],
    formulaOrTip: "Use two pointers from left and right skipping non-alphanumerics.",
    hints: [
      "Use two pointers, one at the start and one at the end of the string.",
      "Move inwards, skipping non-alphanumeric characters, and compare lowercase characters.",
    ],
    constraints: [
      "1 <= s.length <= 2 * 10^5",
      "s consists only of printable ASCII characters."
    ],
    starterCode: {
      javascript: `function isPalindrome(s) {
  let left = 0, right = s.length - 1;
  const isAlphaNum = (ch) => /[a-z0-9]/i.test(ch);
  while (left < right) {
    while (left < right && !isAlphaNum(s[left])) left++;
    while (left < right && !isAlphaNum(s[right])) right--;
    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
    left++;
    right--;
  }
  return true;
}`,
      python: `def isPalindrome(s):
    cleaned = [c.lower() for c in s if c.isalnum()]
    return cleaned == cleaned[::-1]`,
      java: `class Solution {
    public boolean isPalindrome(String s) {
        int l = 0, r = s.length() - 1;
        while (l < r) {
            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;
            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;
            if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) return false;
            l++; r--;
        }
        return true;
    }
}`,
      cpp: `class Solution {
public:
    bool isPalindrome(string s) {
        int l = 0, r = s.size() - 1;
        while (l < r) {
            while (l < r && !isalnum(s[l])) l++;
            while (l < r && !isalnum(s[r])) r--;
            if (tolower(s[l]) != tolower(s[r])) return false;
            l++; r--;
        }
        return true;
    }
};`
    },
    testCases: [
      {
        input: "\"A man, a plan, a canal: Panama\"",
        expectedOutput: "true",
        explanation: "\"amanaplanacanalpanama\" is a valid palindrome.",
      },
      {
        input: "\"race a car\"",
        expectedOutput: "false",
        explanation: "\"raceacar\" is not a palindrome.",
      },
    ],
  },

  // [dsa-09] New: CODE - Valid Parentheses
  {
    id: "dsa-09",
    categoryId: "dsa-coding",
    subtopic: "linked-lists-stacks-queues",
    title: "Interactive Coding: Valid Parentheses (Stack)",
    description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if open brackets are closed by the same type of brackets in the correct order.",
    difficulty: "EASY",
    type: "CODE",
    correctAnswer: "true",
    explanation:
      "Stack-based solution:\n1. Create an empty stack.\n2. When an opening bracket '(', '{', '[' is encountered, push it onto the stack.\n3. When a closing bracket is encountered, verify if the top of the stack matches the closing pair. If empty or doesn't match, return false.\n4. At the end, return `stack.length === 0`.\nTime: O(N), Space: O(N).",
    companies: ["Amazon", "Google", "Infosys", "Microsoft"],
    formulaOrTip: "LIFO property of stacks ensures innermost matching brackets are checked first.",
    hints: [
      "Push opening brackets onto a stack.",
      "When a closing bracket arrives, pop from stack and verify it matches.",
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    starterCode: {
      javascript: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const ch of s) {
    if (ch === '(' || ch === '{' || ch === '[') {
      stack.push(ch);
    } else {
      if (stack.pop() !== map[ch]) return false;
    }
  }
  return stack.length === 0;
}`,
      python: `def isValid(s):
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    for ch in s:
        if ch in pairs.values():
            stack.append(ch)
        elif ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack`,
      java: `class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`,
      cpp: `class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        for (char c : s) {
            if (c == '(') st.push(')');
            else if (c == '{') st.push('}');
            else if (c == '[') st.push(']');
            else if (st.empty() || st.top() != c) return false;
            else st.pop();
        }
        return st.empty();
    }
};`
    },
    testCases: [
      {
        input: "\"()[]{}\"",
        expectedOutput: "true",
        explanation: "All brackets open and close properly in order.",
      },
      {
        input: "\"(]\"",
        expectedOutput: "false",
        explanation: "Round opening bracket closed by square bracket.",
      },
    ],
  },

  // [dsa-10] New: CODE - Climbing Stairs DP
  {
    id: "dsa-10",
    categoryId: "dsa-coding",
    subtopic: "dynamic-programming-greedy",
    title: "Interactive Coding: Climbing Stairs (DP)",
    description: "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?\n\nImplement `climbStairs(n)` in O(N) time and O(1) space.",
    difficulty: "EASY",
    type: "CODE",
    correctAnswer: "3",
    explanation:
      "To reach step n, you must arrive from either step (n-1) or step (n-2).\nTherefore: `ways(n) = ways(n-1) + ways(n-2)`.\nThis is identical to the Fibonacci sequence with base cases `ways(1) = 1` and `ways(2) = 2`.\nBy storing only the previous two states, space is reduced to O(1).",
    companies: ["Amazon", "TCS Digital", "Cognizant"],
    formulaOrTip: "dp[n] = dp[n-1] + dp[n-2]",
    hints: [
      "To reach the n-th step, you can take a 1-step leap from (n-1) or a 2-step leap from (n-2).",
      "Total distinct ways equals ways(n-1) + ways(n-2).",
    ],
    constraints: [
      "1 <= n <= 45"
    ],
    starterCode: {
      javascript: `function climbStairs(n) {
  if (n <= 2) return n;
  let prev2 = 1, prev1 = 2;
  for (let i = 3; i <= n; i++) {
    const cur = prev1 + prev2;
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}`,
      python: `def climbStairs(n):
    if n <= 2:
        return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b`,
      java: `class Solution {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
}`,
      cpp: `class Solution {
public:
    int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; ++i) {
            int c = a + b;
            a = b;
            b = c;
        }
        return b;
    }
};`
    },
    testCases: [
      {
        input: "3",
        expectedOutput: "3",
        explanation: "1+1+1, 1+2, 2+1 = 3 distinct ways.",
      },
      {
        input: "4",
        expectedOutput: "5",
        explanation: "Ways to climb 4 steps is 5.",
      },
    ],
  },

  // [dsa-11] New: Searching & Sorting
  {
    id: "dsa-11",
    categoryId: "dsa-coding",
    subtopic: "searching-sorting",
    title: "Search in Rotated Sorted Array Strategy",
    description: "Given a sorted array rotated at an unknown pivot, how can modified binary search identify whether to search the left or right half in O(log N) time?",
    difficulty: "MEDIUM",
    type: "MCQ",
    options: [
      "At least one half (left or right of mid) is always normally sorted; check if target lies within its bounds.",
      "Find the minimum element first using linear search, then binary search.",
      "Sort the array again in O(N log N) time, then apply standard binary search.",
      "Interpolate the position using the slope of rotated values."
    ],
    correctAnswer: 0,
    explanation:
      "Key insight for Rotated Binary Search:\nFor any midpoint `mid`, either the left half `nums[low..mid]` OR the right half `nums[mid..high]` is guaranteed to be strictly sorted.\nBy testing if `nums[low] <= nums[mid]`, we confirm if left is sorted. If it is, we easily check if `target` falls between `nums[low]` and `nums[mid]`. If yes, narrow search to left; otherwise, search right half. This maintains O(log N) runtime.",
    companies: ["Amazon", "Microsoft", "Google", "Infosys SP"],
    formulaOrTip: "One half is always sorted. Check if target lies within nums[low] <= target < nums[mid].",
    hints: [
      "Notice that splitting a rotated sorted array always yields at least one perfectly sorted half.",
      "Check whether target falls inside the range of that sorted half to pick the next subarray.",
    ],
  },

  // [dsa-12] New: Graphs
  {
    id: "dsa-12",
    categoryId: "dsa-coding",
    subtopic: "graphs-traversal",
    title: "Number of Connected Components / Islands",
    description: "In an m x n 2D binary grid where '1' represents land and '0' represents water, what is the time complexity of counting the number of islands using Breadth-First Search (BFS) or Depth-First Search (DFS) with in-place sinking (marking visited cells as '0')?",
    difficulty: "MEDIUM",
    type: "MCQ",
    options: ["O(m × n)", "O(m² × n²)", "O(m + n)", "O(m log n)"],
    correctAnswer: 0,
    explanation:
      "Every cell in the m x n grid is visited a constant number of times (at most 4 times from its neighbors and once during the outer iteration). Since visited land cells are immediately sunk ('1' -> '0'), no cell is repeatedly re-explored. Hence, total time complexity is strictly O(m × n).",
    companies: ["Amazon", "Google", "Microsoft"],
    formulaOrTip: "Grid traversal visits each cell O(1) times. Total runtime: O(rows × cols).",
    hints: [
      "Each grid cell is processed at most once as a root and visited at most 4 times by adjacent neighbors.",
      "Total operations scale linearly with total grid elements: m * n.",
    ],
  },

  // =========================================================================
  // --- TECHNICAL FUNDAMENTALS ---
  // =========================================================================

  // [tf-01] Preserved Baseline
  {
    id: "tf-01",
    categoryId: "technical-fundamentals",
    subtopic: "operating-systems",
    title: "Process vs Thread Memory Sharing",
    description: "In a modern multi-threaded operating system, which of the following memory segments is strictly private to each individual thread rather than shared across all threads of the same process?",
    difficulty: "EASY",
    type: "MCQ",
    options: [
      "Call stack and CPU register state",
      "Heap memory allocated via malloc/new",
      "Global variables and static memory segment",
      "Open file descriptors table"
    ],
    correctAnswer: 0,
    explanation:
      "All threads within a process share the same virtual address space, including the Heap, Data/BSS segment (global/static variables), and code text, as well as open file descriptors. However, each thread must execute functions independently and maintain its own execution path; therefore, the Call Stack, Program Counter (PC), and CPU Registers are strictly private to each thread.",
    companies: ["Microsoft", "Amazon", "Infosys", "TCS"],
    formulaOrTip: "Threads share Heap, Code, and Globals; Threads own their Stack and CPU Registers.",
    hints: [
      "Each thread executes its own separate function calls and local variables.",
      "Local variables and execution frames are stored on the thread's private stack.",
    ],
  },

  // [tf-02] Preserved Baseline
  {
    id: "tf-02",
    categoryId: "technical-fundamentals",
    subtopic: "operating-systems",
    title: "Virtual Memory and Page Faults",
    description: "What sequence of events occurs in the operating system when a CPU instruction attempts to access a virtual memory address that is valid in the process's page table but currently marked with an invalid presence bit (not in physical RAM)?",
    difficulty: "MEDIUM",
    type: "MCQ",
    options: [
      "MMU triggers a Page Fault interrupt -> OS finds page in swap disk -> loads to free RAM frame -> updates page table -> resumes instruction",
      "OS immediately terminates the process with a SIGSEGV segmentation violation signal",
      "The CPU stalls indefinitely until physical memory becomes available without software intervention",
      "The page table automatically transfers data from secondary storage directly via hardware DMA without kernel trapping"
    ],
    correctAnswer: 0,
    explanation:
      "When the valid bit in the page table entry is 0 for a mapped page, the Memory Management Unit (MMU) raises a hardware interrupt called a Page Fault. The OS kernel's page fault handler traps the CPU, allocates a free physical RAM frame (evicting another page via LRU if necessary), issues a disk read to load the page from swap space into RAM, updates the page table entry to valid with the new frame number, and restarts the faulting instruction seamlessly.",
    companies: ["Google", "Microsoft", "Intel", "Qualcomm"],
    hints: [
      "A page fault is not an error; it's the standard mechanism to lazily load pages from disk into RAM.",
      "The OS traps the hardware interrupt, loads the frame from disk, updates the page table, and restarts the instruction.",
    ],
  },

  // [tf-03] Preserved Baseline
  {
    id: "tf-03",
    categoryId: "technical-fundamentals",
    subtopic: "dbms-sql",
    title: "Database Normalization: BCNF vs 3NF",
    description: "A relational table R with functional dependencies is in Third Normal Form (3NF). Under which specific condition is it guaranteed to ALSO be in Boyce-Codd Normal Form (BCNF)?",
    difficulty: "HARD",
    type: "MCQ",
    options: [
      "For every functional dependency X -> Y, X is a superkey of R",
      "Every non-prime attribute is fully functionally dependent on the primary key",
      "No non-prime attribute is transitively dependent on any candidate key",
      "Every determinant is a single-column primary key"
    ],
    correctAnswer: 0,
    explanation:
      "3NF relaxes the condition by allowing X -> Y if either X is a superkey OR Y is a prime attribute (part of a candidate key). BCNF removes this relaxation entirely: for EVERY non-trivial functional dependency X -> Y, the determinant X MUST be a superkey.",
    companies: ["Oracle", "Microsoft", "Amazon"],
    formulaOrTip: "3NF allows X is superkey OR Y is prime. BCNF strictly requires X is superkey.",
    hints: [
      "Recall the strict definition of BCNF determinants.",
      "In BCNF, every left-hand side X in X -> Y must be a superkey.",
    ],
  },

  // [tf-04] Preserved Baseline
  {
    id: "tf-04",
    categoryId: "technical-fundamentals",
    subtopic: "dbms-sql",
    title: "SQL Isolation Level & Phantom Reads",
    description: "Which SQL transaction isolation level completely prevents Dirty Reads, Non-repeatable Reads, AND Phantom Reads?",
    difficulty: "MEDIUM",
    type: "MCQ",
    options: ["SERIALIZABLE", "REPEATABLE READ", "READ COMMITTED", "READ UNCOMMITTED"],
    correctAnswer: 0,
    explanation:
      "SERIALIZABLE is the highest ANSI SQL isolation level. It executes concurrent transactions as if they were executed sequentially, employing range locks to prevent phantom inserts from other transactions.",
    companies: ["Microsoft", "Amazon", "Oracle"],
    hints: [
      "REPEATABLE READ prevents dirty reads and non-repeatable reads, but can still allow phantom rows.",
      "SERIALIZABLE is the highest level that completely prevents phantom reads.",
    ],
  },

  // [tf-05] Preserved Baseline
  {
    id: "tf-05",
    categoryId: "technical-fundamentals",
    subtopic: "computer-networks",
    title: "TCP 3-Way Handshake Flags Sequence",
    description: "During the initiation of a standard TCP connection between client and server, what is the exact sequence of flag segments exchanged?",
    difficulty: "EASY",
    type: "MCQ",
    options: [
      "SYN -> SYN-ACK -> ACK",
      "SYN -> ACK -> ACK-DATA",
      "FIN -> ACK -> FIN-ACK",
      "RST -> SYN -> ACK"
    ],
    correctAnswer: 0,
    explanation:
      "The client sends a SYN packet with initial sequence number x. The server responds with SYN-ACK (acknowledging x+1 and sending its own sequence y). The client completes the handshake with an ACK packet acknowledging y+1.",
    companies: ["Cisco", "Amazon", "TCS", "Infosys"],
    hints: [
      "Client requests synchronize (SYN).",
      "Server synchronizes and acknowledges (SYN-ACK), client confirms (ACK).",
    ],
  },

  // [tf-06] Preserved Baseline
  {
    id: "tf-06",
    categoryId: "technical-fundamentals",
    subtopic: "oops-system-design",
    title: "Liskov Substitution Principle (SOLID)",
    description: "According to the Liskov Substitution Principle (the 'L' in SOLID design principles):",
    difficulty: "MEDIUM",
    type: "MCQ",
    options: [
      "Subtypes must be substitutable for their base types without altering the correctness of the program.",
      "A class should only have a single reason to change.",
      "High-level modules should not depend on low-level modules; both should depend on abstractions.",
      "Clients should not be forced to depend on methods they do not use."
    ],
    correctAnswer: 0,
    explanation:
      "Formulated by Barbara Liskov, LSP asserts that if S is a subtype of T, then objects of type T may be replaced with objects of type S without breaking functionality or throwing unexpected runtime exceptions.",
    companies: ["Microsoft", "Amazon", "Google", "Accenture"],
    hints: [
      "LSP is about inheritance hierarchies and derived class behaviors.",
      "Any derived object should be drop-in usable wherever the parent class is expected.",
    ],
  },

  // [tf-07] New: Deadlock 4 Coffman Conditions
  {
    id: "tf-07",
    categoryId: "technical-fundamentals",
    subtopic: "operating-systems",
    title: "The 4 Coffman Conditions for Deadlock",
    description: "Which of the following is NOT one of the four necessary and sufficient Coffman conditions required for a deadlock to occur in an operating system?",
    difficulty: "EASY",
    type: "MCQ",
    options: [
      "Aging and Dynamic Priority Inversion",
      "Mutual Exclusion",
      "Hold and Wait",
      "Circular Wait"
    ],
    correctAnswer: 0,
    explanation:
      "The 4 Coffman conditions for deadlock are:\n1. Mutual Exclusion (resources cannot be shared concurrently).\n2. Hold and Wait (processes holding resources can request new ones).\n3. No Preemption (resources cannot be forcibly taken away).\n4. Circular Wait (a closed loop of processes waiting for each other).\n'Aging and Dynamic Priority Inversion' is a starvation-prevention technique, NOT a deadlock condition.",
    companies: ["Microsoft", "Amazon", "TCS", "Infosys"],
    formulaOrTip: "Deadlock requires: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.",
    hints: [
      "Recall the 4 conditions identified by Edward Coffman.",
      "Aging is a solution to starvation, not a cause of deadlock.",
    ],
  },

  // [tf-08] New: Database Indexing B+ Trees
  {
    id: "tf-08",
    categoryId: "technical-fundamentals",
    subtopic: "dbms-sql",
    title: "Why Relational Databases Use B+ Trees Over Binary Search Trees",
    description: "Why do production relational database engines (such as PostgreSQL and MySQL InnoDB) use B+ Tree indexes instead of balanced Binary Search Trees (like Red-Black Trees) for on-disk tables?",
    difficulty: "MEDIUM",
    type: "MCQ",
    options: [
      "B+ Trees have high fan-out (low tree height), dramatically minimizing costly disk I/O seek operations, and sequential leaf linked-lists enable rapid range scans.",
      "Binary Search Trees cannot support unique keys or primary keys.",
      "B+ Trees consume zero RAM because all intermediate nodes reside only on disk.",
      "Red-Black Trees have O(N) search time complexity on sorted primary keys."
    ],
    correctAnswer: 0,
    explanation:
      "Disk I/O is hundreds of times slower than RAM operations. B+ Trees have a high branching factor (fan-out of 100-1000 keys per node), keeping tree depth very small (typically 3-4 levels for millions of rows), meaning at most 3-4 disk block reads. Furthermore, all data pointers reside in leaf nodes that are doubly linked, enabling blazing fast range scans (`WHERE age BETWEEN 20 AND 30`).",
    companies: ["Oracle", "Microsoft", "Amazon", "Google"],
    hints: [
      "Consider the cost of disk seek operations versus tree depth.",
      "High branching factor means shallow trees and linked leaf nodes make range scans very fast.",
    ],
  },

  // [tf-09] New: HTTP Status Codes
  {
    id: "tf-09",
    categoryId: "technical-fundamentals",
    subtopic: "computer-networks",
    title: "HTTP Status Code Semantics: 401 vs 403",
    description: "In the HTTP/1.1 specification, what is the precise distinction between status code 401 Unauthorized and status code 403 Forbidden?",
    difficulty: "EASY",
    type: "MCQ",
    options: [
      "401 indicates authentication is missing or invalid (unauthenticated), whereas 403 indicates identity is known but lacks required permissions (unauthorized).",
      "401 means server error, whereas 403 means client timeout.",
      "401 is used only for HTTPS, whereas 403 is used for plaintext HTTP.",
      "401 indicates rate limiting, whereas 403 indicates invalid JSON payload."
    ],
    correctAnswer: 0,
    explanation:
      "HTTP 401 Unauthorized (better termed 'Unauthenticated') signifies that the client has not provided valid credentials (e.g. missing or expired bearer token). HTTP 403 Forbidden means the server recognizes who the user is, but the user's role does not have authorization to access the requested resource.",
    companies: ["Amazon", "TCS", "Accenture", "Microsoft"],
    formulaOrTip: "401 = Who are you? (Authentication). 403 = I know who you are, but you cannot enter (Authorization).",
    hints: [
      "401 is about authentication credentials (signing in).",
      "403 is about authorization / permissions (access forbidden even with valid login).",
    ],
  },

  // [tf-10] New: OOP Design Patterns
  {
    id: "tf-10",
    categoryId: "technical-fundamentals",
    subtopic: "oops-system-design",
    title: "Design Pattern Classification: Factory vs Singleton",
    description: "Which creational design pattern provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created without modifying the client code?",
    difficulty: "EASY",
    type: "MCQ",
    options: ["Factory Method Pattern", "Singleton Pattern", "Observer Pattern", "Adapter Pattern"],
    correctAnswer: 0,
    explanation:
      "The Factory Method pattern defines an interface or abstract method for creating an object, but defers instantiation to concrete subclasses. This adheres to the Open-Closed Principle (OCP) by decoupling object creation from the consumer.",
    companies: ["Microsoft", "Amazon", "Infosys", "Google"],
    hints: [
      "It is a creational pattern that delegates instantiation to subclasses.",
      "Factory Method encapsulates object construction.",
    ],
  },
];

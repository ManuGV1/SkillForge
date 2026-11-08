export type PlacementCategoryKey =
  | "quantitative-aptitude"
  | "logical-reasoning"
  | "verbal-ability"
  | "dsa-coding"
  | "technical-fundamentals";

export type QuestionDifficulty = "EASY" | "MEDIUM" | "HARD";
export type QuestionType = "MCQ" | "CODE";

export interface DsaTestCase {
  input: string;
  expectedOutput: string;
  explanation?: string;
  isHidden?: boolean;
}

export interface PlacementQuestion {
  id: string;
  categoryId: PlacementCategoryKey;
  subtopic: string;
  title: string;
  description: string;
  difficulty: QuestionDifficulty;
  type: QuestionType;
  options?: string[];
  correctAnswer: number | string; // 0-indexed for options, or string for code/exact
  explanation: string;
  companies: string[];
  formulaOrTip?: string;
  hints?: string[];
  testCases?: DsaTestCase[];
  starterCode?: Record<string, string>;
  constraints?: string[];
}

export interface MockTestQuestionState {
  questionId: string;
  selectedOption: number | null;
  status: "UNVISITED" | "ANSWERED" | "MARKED_FOR_REVIEW" | "ANSWERED_MARKED" | "SKIPPED";
  timeSpentSeconds: number;
}

export interface MockTestResult {
  totalQuestions: number;
  attemptedCount: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  marksObtained: number;
  totalMarks: number;
  accuracy: number;
  timeSpentSeconds: number;
  categoryBreakdown: Record<
    string,
    {
      total: number;
      correct: number;
      incorrect: number;
      score: number;
    }
  >;
}

export interface PlacementSubtopic {
  id: string;
  name: string;
  questionCount: number;
  description: string;
  keyFormulas?: string[];
}

export interface PlacementCategory {
  id: PlacementCategoryKey;
  name: string;
  shortDesc: string;
  longDesc: string;
  iconName: string;
  accentColor: string;
  subtopics: PlacementSubtopic[];
  totalQuestions: number;
}

export interface UserPlacementProgress {
  solvedQuestionIds: string[];
  bookmarkedQuestionIds: string[];
  categoryAccuracy: Record<PlacementCategoryKey, number>;
  readinessScore: {
    overall: number;
    aptitude: number;
    logical: number;
    verbal: number;
    dsa: number;
    coreCs: number;
  };
  streakDays: number;
  recentActivity: Array<{
    questionId: string;
    questionTitle: string;
    categoryId: PlacementCategoryKey;
    isCorrect: boolean;
    timestamp: string;
  }>;
}

export interface CompanyTrack {
  id: string;
  name: string;
  logo: string;
  description: string;
  primaryCategories: PlacementCategoryKey[];
  averageAptitudeCutoff: string;
  hiringStages: string[];
  popularTopics: string[];
  questionCount: number;
}

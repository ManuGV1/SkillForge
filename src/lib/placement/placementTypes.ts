export type PlacementCategoryKey =
  | "quantitative-aptitude"
  | "logical-reasoning"
  | "verbal-ability"
  | "dsa-coding"
  | "technical-fundamentals";

export type QuestionDifficulty = "EASY" | "MEDIUM" | "HARD";
export type QuestionType = "MCQ" | "CODE";

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

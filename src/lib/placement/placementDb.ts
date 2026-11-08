import { db } from "@/lib/db";
import {
  PlacementQuestion,
  PlacementCategoryKey,
  QuestionDifficulty,
} from "./placementTypes";
import { PLACEMENT_QUESTIONS } from "./placementData";

function withTimeout<T>(promise: Promise<T>, ms: number = 1500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("DB_TIMEOUT")), ms)
    ),
  ]);
}

/**
 * Normalizes a database question record to the client PlacementQuestion interface
 */
function mapDbQuestionToPlacementQuestion(raw: any): PlacementQuestion {
  return {
    id: raw.id,
    categoryId: raw.categoryId as PlacementCategoryKey,
    subtopic: raw.subtopic,
    title: raw.title,
    description: raw.description,
    difficulty: raw.difficulty as QuestionDifficulty,
    type: (raw.type || "MCQ") as "MCQ" | "CODE",
    options: Array.isArray(raw.options) ? raw.options : [],
    correctAnswer: Number(raw.correctAnswer ?? 0),
    explanation: raw.explanation || "",
    companies: Array.isArray(raw.companies) ? raw.companies : [],
    formulaOrTip: raw.formulaOrTip || undefined,
    hints: Array.isArray(raw.hints) && raw.hints.length > 0 ? raw.hints : undefined,
  };
}

/**
 * Retrieves all active placement questions.
 * Combines database-stored questions with static baseline questions.
 * If the database query fails, seamlessly falls back to the static baseline questions.
 */
export async function getAllPlacementQuestions(): Promise<PlacementQuestion[]> {
  try {
    const dbQuestions = await withTimeout(
      db.placementQuestion.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
      })
    );

    if (!dbQuestions || dbQuestions.length === 0) {
      return PLACEMENT_QUESTIONS;
    }

    const mappedDb = dbQuestions.map(mapDbQuestionToPlacementQuestion);
    const dbIds = new Set(mappedDb.map((q: PlacementQuestion) => q.id));

    // Preserve all static baseline questions that haven't been overwritten in DB
    const nonOverwrittenStatic = PLACEMENT_QUESTIONS.filter(
      (staticQ) => !dbIds.has(staticQ.id)
    );

    return [...nonOverwrittenStatic, ...mappedDb];
  } catch (error) {
    // Falls back gracefully if database is unreachable or offline
    return PLACEMENT_QUESTIONS;
  }
}

/**
 * Retrieves a single placement question by ID (from DB or static fallback)
 */
export async function getPlacementQuestionById(
  questionId: string
): Promise<PlacementQuestion | null> {
  // Check static list first
  const staticMatch = PLACEMENT_QUESTIONS.find((q) => q.id === questionId);

  try {
    const dbQ = await withTimeout(
      db.placementQuestion.findFirst({
        where: { id: questionId, isActive: true },
      })
    );
    if (dbQ) {
      return mapDbQuestionToPlacementQuestion(dbQ);
    }
  } catch (error) {
    // If DB fails, use staticMatch
  }

  return staticMatch || null;
}

/**
 * Retrieves the set of question IDs correctly solved by an authenticated user
 */
export async function getUserSolvedQuestionIds(userId: string): Promise<string[]> {
  if (!userId) return [];
  try {
    const records = await withTimeout(
      db.placementAttempt.findMany({
        where: {
          userId,
          isCorrect: true,
        },
        select: {
          questionId: true,
        },
        distinct: ["questionId"],
      })
    );

    return records.map((r: { questionId: string }) => r.questionId);
  } catch (error) {
    return [];
  }
}

/**
 * Records a student's question attempt into the database
 */
export async function recordStudentAttempt(params: {
  userId: string;
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
}): Promise<boolean> {
  const { userId, questionId, selectedAnswer, isCorrect } = params;
  if (!userId || !questionId) return false;

  try {
    await withTimeout(
      db.placementAttempt.create({
        data: {
          userId,
          questionId,
          selectedAnswer,
          isCorrect,
        },
      })
    );
    return true;
  } catch (error) {
    return false;
  }
}

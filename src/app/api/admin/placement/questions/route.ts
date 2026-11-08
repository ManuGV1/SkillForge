import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { getAllPlacementQuestions } from "@/lib/placement/placementDb";
import { PLACEMENT_QUESTIONS } from "@/lib/placement/placementData";

const questionSchema = z.object({
  id: z.string().optional(),
  categoryId: z.enum([
    "quantitative-aptitude",
    "logical-reasoning",
    "verbal-ability",
    "dsa-coding",
    "technical-fundamentals",
  ]),
  subtopic: z.string().min(2, "Subtopic is required"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  type: z.enum(["MCQ", "CODE"]).default("MCQ"),
  options: z.array(z.string()).min(2, "At least 2 options required"),
  correctAnswer: z.number().int().min(0),
  explanation: z.string().min(5, "Explanation must be at least 5 characters"),
  companies: z.array(z.string()).default([]),
  formulaOrTip: z.string().optional().nullable(),
  hints: z.array(z.string()).optional().default([]),
});

/**
 * GET /api/admin/placement/questions
 * Returns all placement questions for administrator inspection.
 */
export async function GET() {
  try {
    let session = null;
    try {
      session = await auth();
    } catch {
      session = null;
    }

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const currentRole = session.user.role?.toUpperCase();
    if (currentRole !== "ADMIN" && currentRole !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden. Administrator access required." },
        { status: 403 }
      );
    }

    const questions = await getAllPlacementQuestions();

    return NextResponse.json({
      success: true,
      data: {
        questions,
        total: questions.length,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/admin/placement/questions:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/placement/questions
 * Securely creates a new placement question in the database.
 */
export async function POST(req: Request) {
  try {
    let session = null;
    try {
      session = await auth();
    } catch {
      session = null;
    }

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const currentRole = session.user.role?.toUpperCase();
    if (currentRole !== "ADMIN" && currentRole !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden. Administrator access required." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = questionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Validate that correctAnswer index is within bounds of options
    if (data.correctAnswer >= data.options.length) {
      return NextResponse.json(
        {
          success: false,
          error: `correctAnswer index (${data.correctAnswer}) exceeds options length (${data.options.length})`,
        },
        { status: 400 }
      );
    }

    const created = await db.placementQuestion.create({
      data: {
        id: data.id || undefined,
        categoryId: data.categoryId,
        subtopic: data.subtopic.trim(),
        title: data.title.trim(),
        description: data.description.trim(),
        difficulty: data.difficulty,
        type: data.type,
        options: data.options.map((o) => o.trim()),
        correctAnswer: data.correctAnswer,
        explanation: data.explanation.trim(),
        companies: data.companies.map((c) => c.trim()),
        formulaOrTip: data.formulaOrTip?.trim() || null,
        hints: data.hints || [],
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Placement question created successfully",
      data: created,
    });
  } catch (error: any) {
    console.error("Error creating placement question:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create placement question",
      },
      { status: 500 }
    );
  }
}

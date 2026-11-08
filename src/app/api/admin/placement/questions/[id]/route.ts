import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { getPlacementQuestionById } from "@/lib/placement/placementDb";

const updateQuestionSchema = z.object({
  categoryId: z
    .enum([
      "quantitative-aptitude",
      "logical-reasoning",
      "verbal-ability",
      "dsa-coding",
      "technical-fundamentals",
    ])
    .optional(),
  subtopic: z.string().min(2).optional(),
  title: z.string().min(3).optional(),
  description: z.string().min(5).optional(),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
  type: z.enum(["MCQ", "CODE"]).optional(),
  options: z.array(z.string()).min(2).optional(),
  correctAnswer: z.number().int().min(0).optional(),
  explanation: z.string().min(5).optional(),
  companies: z.array(z.string()).optional(),
  formulaOrTip: z.string().optional().nullable(),
  hints: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/placement/questions/[id]
 */
export async function GET(req: Request, { params }: RouteParams) {
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

    const { id } = await params;
    const question = await getPlacementQuestionById(id);

    if (!question) {
      return NextResponse.json(
        { success: false, error: "Placement question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: question,
    });
  } catch (error) {
    console.error("Error fetching placement question:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/placement/questions/[id]
 * Updates an existing placement question or upserts static questions into the DB.
 */
export async function PUT(req: Request, { params }: RouteParams) {
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

    const { id } = await params;
    const body = await req.json();
    const parsed = updateQuestionSchema.safeParse(body);

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

    const existing = await getPlacementQuestionById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Question not found" },
        { status: 404 }
      );
    }

    const data = parsed.data;

    // Check bounds of correctAnswer if options or correctAnswer is being updated
    const finalOptions = data.options ?? existing.options ?? [];
    const finalCorrectAnswer = data.correctAnswer ?? Number(existing.correctAnswer);
    if (finalCorrectAnswer >= finalOptions.length) {
      return NextResponse.json(
        {
          success: false,
          error: `correctAnswer index (${finalCorrectAnswer}) exceeds options length (${finalOptions.length})`,
        },
        { status: 400 }
      );
    }

    const updated = await db.placementQuestion.upsert({
      where: { id },
      create: {
        id,
        categoryId: data.categoryId ?? existing.categoryId,
        subtopic: (data.subtopic ?? existing.subtopic).trim(),
        title: (data.title ?? existing.title).trim(),
        description: (data.description ?? existing.description).trim(),
        difficulty: data.difficulty ?? existing.difficulty,
        type: data.type ?? existing.type ?? "MCQ",
        options: finalOptions.map((o) => o.trim()),
        correctAnswer: finalCorrectAnswer,
        explanation: (data.explanation ?? existing.explanation).trim(),
        companies: (data.companies ?? existing.companies ?? []).map((c) => c.trim()),
        formulaOrTip:
          data.formulaOrTip !== undefined
            ? data.formulaOrTip?.trim() || null
            : existing.formulaOrTip ?? null,
        hints: data.hints ?? existing.hints ?? [],
        isActive: data.isActive ?? true,
      },
      update: {
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.subtopic && { subtopic: data.subtopic.trim() }),
        ...(data.title && { title: data.title.trim() }),
        ...(data.description && { description: data.description.trim() }),
        ...(data.difficulty && { difficulty: data.difficulty }),
        ...(data.type && { type: data.type }),
        ...(data.options && { options: data.options.map((o) => o.trim()) }),
        ...(data.correctAnswer !== undefined && { correctAnswer: data.correctAnswer }),
        ...(data.explanation && { explanation: data.explanation.trim() }),
        ...(data.companies && { companies: data.companies.map((c) => c.trim()) }),
        ...(data.formulaOrTip !== undefined && {
          formulaOrTip: data.formulaOrTip?.trim() || null,
        }),
        ...(data.hints && { hints: data.hints }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Placement question updated successfully",
      data: updated,
    });
  } catch (error: any) {
    console.error("Error updating placement question:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update placement question",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/placement/questions/[id]
 * Deactivates or removes a question from the database.
 */
export async function DELETE(req: Request, { params }: RouteParams) {
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

    const { id } = await params;

    // Check if question exists in DB
    const dbRecord = await db.placementQuestion.findUnique({ where: { id } });

    if (dbRecord) {
      await db.placementQuestion.delete({ where: { id } });
    } else {
      // If it was a static question, mark as inactive in DB so it won't be displayed
      const existing = await getPlacementQuestionById(id);
      if (existing) {
        await db.placementQuestion.create({
          data: {
            id: existing.id,
            categoryId: existing.categoryId,
            subtopic: existing.subtopic,
            title: existing.title,
            description: existing.description,
            difficulty: existing.difficulty,
            type: existing.type,
            options: existing.options || [],
            correctAnswer: Number(existing.correctAnswer),
            explanation: existing.explanation,
            companies: existing.companies || [],
            formulaOrTip: existing.formulaOrTip || null,
            hints: existing.hints || [],
            isActive: false, // Soft deleted
          },
        });
      } else {
        return NextResponse.json(
          { success: false, error: "Question not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting placement question:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete placement question",
      },
      { status: 500 }
    );
  }
}

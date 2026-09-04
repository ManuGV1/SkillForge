import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ problemId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { problemId } = await params;
    const userId = session.user.id;

    // Check if problem exists
    const problem = await db.dsaProblem.findUnique({
      where: { id: problemId },
      include: {
        hints: {
          orderBy: { position: "asc" },
        },
      },
    });

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    // Get current user progress for this problem
    const progress = await db.userDsaProgress.findUnique({
      where: { userId_problemId: { userId, problemId } },
    });

    const hintsUsedForProblem = progress?.hintsUsed ?? 0;

    if (hintsUsedForProblem >= problem.hints.length || hintsUsedForProblem >= 2) {
      return NextResponse.json(
        { error: "No more hints available for this problem (Max 2 per problem)" },
        { status: 400 }
      );
    }

    // Check user's daily hint limit across all problems today
    const todayStr = new Date().toISOString().split("T")[0];
    const userProgressRecords = await db.userDsaProgress.findMany({
      where: { userId },
    });

    let todayHintsCount = 0;
    for (const record of userProgressRecords) {
      if (
        record.dailyHintsDate &&
        record.dailyHintsDate.toISOString().split("T")[0] === todayStr
      ) {
        todayHintsCount += record.dailyHints;
      }
    }

    if (todayHintsCount >= 5) {
      return NextResponse.json(
        { error: "Daily hint limit reached (Max 5 hints per day). Try again tomorrow!" },
        { status: 429 }
      );
    }

    // Next hint position is hintsUsedForProblem + 1
    const nextHintPosition = hintsUsedForProblem + 1;
    const targetHint = problem.hints.find((h) => h.position === nextHintPosition);

    if (!targetHint) {
      return NextResponse.json({ error: "Hint not found" }, { status: 404 });
    }

    const newDailyHints =
      progress?.dailyHintsDate &&
      progress.dailyHintsDate.toISOString().split("T")[0] === todayStr
        ? (progress.dailyHints ?? 0) + 1
        : 1;

    // Save updated progress
    await db.userDsaProgress.upsert({
      where: { userId_problemId: { userId, problemId } },
      update: {
        hintsUsed: hintsUsedForProblem + 1,
        dailyHints: newDailyHints,
        dailyHintsDate: new Date(),
        status: progress?.status === "SOLVED" ? "SOLVED" : "ATTEMPTED",
      },
      create: {
        userId,
        problemId,
        hintsUsed: 1,
        dailyHints: 1,
        dailyHintsDate: new Date(),
        status: "ATTEMPTED",
      },
    });

    return NextResponse.json({
      hint: {
        id: targetHint.id,
        position: targetHint.position,
        content: targetHint.content,
      },
      hintsUsed: hintsUsedForProblem + 1,
      todayHintsCount: todayHintsCount + 1,
    });
  } catch (err) {
    console.error("[api/dsa/hint] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

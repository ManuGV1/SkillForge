import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch all problems with user progress and hint counts (without revealing hint contents upfront)
    const problems = await db.dsaProblem.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        hints: {
          select: { id: true, position: true },
          orderBy: { position: "asc" },
        },
        userProgress: {
          where: { userId },
        },
      },
    });

    const formatted = problems.map((prob) => {
      const progress = prob.userProgress[0] ?? null;
      return {
        id: prob.id,
        title: prob.title,
        description: prob.description,
        difficulty: prob.difficulty,
        tags: prob.tags,
        companyRelevance: prob.companyRelevance,
        examples: prob.examplesJson ? JSON.parse(prob.examplesJson) : [],
        constraints: prob.constraints,
        solutionCode: prob.solutionCode,
        solutionExplanation: prob.solutionExplanation,
        totalHints: prob.hints.length,
        hintsUsed: progress?.hintsUsed ?? 0,
        status: progress?.status ?? "UNSEEN",
      };
    });

    // Also compute total daily hints used by this user today
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

    return NextResponse.json({
      problems: formatted,
      dailyHintsUsedToday: todayHintsCount,
      maxDailyHints: 5,
    });
  } catch (err) {
    console.error("[api/dsa] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

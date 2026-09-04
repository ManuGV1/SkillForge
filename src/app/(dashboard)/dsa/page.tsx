import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import DsaViewClient from "./DsaViewClient";

export default async function DsaPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const profile = await db.profile.findUnique({
    where: { userId },
    select: { careerGoal: true },
  });

  // Fetch all DSA problems with user progress
  const problems = await db.dsaProblem.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      hints: {
        select: { id: true, position: true, content: true },
        orderBy: { position: "asc" },
      },
      userProgress: {
        where: { userId },
      },
    },
  });

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

  const formattedProblems = problems.map((prob) => {
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
      allHints: prob.hints,
      hintsUsed: progress?.hintsUsed ?? 0,
      status: progress?.status ?? "UNSEEN",
    };
  });

  return (
    <DsaViewClient
      problems={formattedProblems}
      initialDailyHintsUsed={todayHintsCount}
      maxDailyHints={5}
      userCareerGoal={profile?.careerGoal ?? null}
    />
  );
}

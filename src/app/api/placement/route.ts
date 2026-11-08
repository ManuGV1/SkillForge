import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  PLACEMENT_CATEGORIES,
  PLACEMENT_QUESTIONS,
  COMPANY_TRACKS,
} from "@/lib/placement/placementData";
import {
  getAllPlacementQuestions,
  getUserSolvedQuestionIds,
} from "@/lib/placement/placementDb";

export async function GET(req: Request) {
  try {
    let session = null;
    try {
      session = await auth();
    } catch {
      session = null;
    }
    const userId = session?.user?.id;

    // Read guest attempts cookie if guest
    let guestAttempts = 0;
    if (!userId) {
      const cookieHeader = req.headers.get("cookie");
      const match = cookieHeader?.match(/(?:^|;\s*)guest_placement_attempts=([^;]*)/);
      if (match) {
        guestAttempts = parseInt(decodeURIComponent(match[1]), 10) || 0;
      }
    }

    let userReadiness = {
      overall: 45,
      aptitude: 40,
      logical: 50,
      verbal: 45,
      dsa: 55,
      coreCs: 35,
    };
    let userProfile = null;
    let userSolvedQuestionIds: string[] = [];

    // Load questions (DB overlay + baseline static fallback)
    const allQuestions = await getAllPlacementQuestions();

    if (userId) {
      const [readinessRecord, profileRecord, solvedIds] = await Promise.all([
        db.readinessScore.findFirst({
          where: { userId },
          orderBy: { updatedAt: "desc" },
        }),
        db.profile.findUnique({
          where: { userId },
          select: {
            careerGoal: true,
            college: true,
            degree: true,
            branch: true,
            gradYear: true,
          },
        }),
        getUserSolvedQuestionIds(userId),
      ]);

      userProfile = profileRecord;
      userSolvedQuestionIds = solvedIds;

      if (readinessRecord) {
        const avg = Math.round(
          (readinessRecord.aptitude +
            readinessRecord.dsa +
            readinessRecord.coreCs +
            readinessRecord.programming) /
            4
        );
        userReadiness = {
          overall: avg || 45,
          aptitude: readinessRecord.aptitude || 40,
          logical: readinessRecord.programming || 50,
          verbal: 45,
          dsa: readinessRecord.dsa || 55,
          coreCs: readinessRecord.coreCs || 35,
        };
      }
    }

    // Return sanitized question list (questions with answers for client practice engine)
    return NextResponse.json({
      success: true,
      categories: PLACEMENT_CATEGORIES,
      companies: COMPANY_TRACKS,
      questions: allQuestions,
      solvedQuestionIds: userSolvedQuestionIds,
      readiness: userReadiness,
      userProfile,
      isAuthenticated: !!userId,
      guestAttempts: !userId ? guestAttempts : 0,
      guestLimit: 3,
    });
  } catch (error) {
    console.error("Error in /api/placement:", error);
    // Graceful fallback to static data even if DB query fails
    return NextResponse.json({
      success: true,
      categories: PLACEMENT_CATEGORIES,
      companies: COMPANY_TRACKS,
      questions: PLACEMENT_QUESTIONS,
      readiness: {
        overall: 45,
        aptitude: 40,
        logical: 50,
        verbal: 45,
        dsa: 55,
        coreCs: 35,
      },
      userProfile: null,
      isAuthenticated: false,
    });
  }
}

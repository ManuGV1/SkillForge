import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  PLACEMENT_CATEGORIES,
  PLACEMENT_QUESTIONS,
  COMPANY_TRACKS,
} from "@/lib/placement/placementData";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    let userReadiness = {
      overall: 45,
      aptitude: 40,
      logical: 50,
      verbal: 45,
      dsa: 55,
      coreCs: 35,
    };
    let userProfile = null;

    if (userId) {
      const [readinessRecord, profileRecord] = await Promise.all([
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
      ]);

      userProfile = profileRecord;

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
      questions: PLACEMENT_QUESTIONS,
      readiness: userReadiness,
      userProfile,
      isAuthenticated: !!userId,
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

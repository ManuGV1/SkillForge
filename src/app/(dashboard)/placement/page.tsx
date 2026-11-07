import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  PLACEMENT_CATEGORIES,
  PLACEMENT_QUESTIONS,
  COMPANY_TRACKS,
} from "@/lib/placement/placementData";
import PlacementViewClient from "./PlacementViewClient";

export const metadata: Metadata = {
  title: "Placement Preparation | SkillForge",
  description:
    "Master campus placements with curated practice in Quantitative Aptitude, Logical Reasoning, Verbal Ability, DSA, and Core CS Fundamentals.",
};

export default async function PlacementPage() {
  const session = await auth();
  const userId = session?.user?.id;

  let readiness = {
    overall: 48,
    aptitude: 45,
    logical: 52,
    verbal: 40,
    dsa: 58,
    coreCs: 38,
  };
  let userProfile = null;

  if (userId) {
    try {
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
        readiness = {
          overall: Math.round(
            (readinessRecord.aptitude +
              readinessRecord.dsa +
              readinessRecord.coreCs +
              readinessRecord.programming) /
              4
          ),
          aptitude: readinessRecord.aptitude || 45,
          logical: readinessRecord.programming || 50,
          verbal: 45,
          dsa: readinessRecord.dsa || 55,
          coreCs: readinessRecord.coreCs || 38,
        };
      }
    } catch (e) {
      console.error("Error fetching user placement profile:", e);
    }
  }

  return (
    <PlacementViewClient
      categories={PLACEMENT_CATEGORIES}
      companies={COMPANY_TRACKS}
      initialQuestions={PLACEMENT_QUESTIONS}
      initialReadiness={readiness}
      userProfile={userProfile}
      isAuthenticated={!!userId}
    />
  );
}

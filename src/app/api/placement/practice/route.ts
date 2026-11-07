import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PLACEMENT_QUESTIONS } from "@/lib/placement/placementData";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const body = await req.json();

    const { questionId, selectedAnswerIndex } = body;

    const question = PLACEMENT_QUESTIONS.find((q) => q.id === questionId);
    if (!question) {
      return NextResponse.json(
        { success: false, error: "Question not found" },
        { status: 404 }
      );
    }

    const isCorrect = Number(selectedAnswerIndex) === Number(question.correctAnswer);

    let updatedReadiness = null;

    if (userId) {
      try {
        const existingScore = await db.readinessScore.findFirst({
          where: { userId },
          orderBy: { updatedAt: "desc" },
        });

        const category = question.categoryId;
        let deltaAptitude = 0;
        let deltaDsa = 0;
        let deltaCoreCs = 0;

        if (isCorrect) {
          if (
            category === "quantitative-aptitude" ||
            category === "logical-reasoning" ||
            category === "verbal-ability"
          ) {
            deltaAptitude = 3;
          } else if (category === "dsa-coding") {
            deltaDsa = 3;
          } else if (category === "technical-fundamentals") {
            deltaCoreCs = 3;
          }
        }

        if (existingScore) {
          const newAptitude = Math.min(100, existingScore.aptitude + deltaAptitude);
          const newDsa = Math.min(100, existingScore.dsa + deltaDsa);
          const newCoreCs = Math.min(100, existingScore.coreCs + deltaCoreCs);

          const updated = await db.readinessScore.update({
            where: { id: existingScore.id },
            data: {
              aptitude: newAptitude,
              dsa: newDsa,
              coreCs: newCoreCs,
            },
          });

          updatedReadiness = {
            overall: Math.round(
              (updated.aptitude + updated.dsa + updated.coreCs + updated.programming) / 4
            ),
            aptitude: updated.aptitude,
            logical: updated.programming || 50,
            verbal: 45,
            dsa: updated.dsa,
            coreCs: updated.coreCs,
          };
        } else {
          const created = await db.readinessScore.create({
            data: {
              userId,
              aptitude: 40 + deltaAptitude,
              dsa: 50 + deltaDsa,
              coreCs: 35 + deltaCoreCs,
              programming: 45,
            },
          });

          updatedReadiness = {
            overall: Math.round(
              (created.aptitude + created.dsa + created.coreCs + created.programming) / 4
            ),
            aptitude: created.aptitude,
            logical: created.programming,
            verbal: 45,
            dsa: created.dsa,
            coreCs: created.coreCs,
          };
        }
      } catch (dbErr) {
        console.warn("Could not persist readiness score update:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      formulaOrTip: question.formulaOrTip,
      updatedReadiness,
    });
  } catch (err) {
    console.error("Practice submission error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

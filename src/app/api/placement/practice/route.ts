import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { PLACEMENT_QUESTIONS } from "@/lib/placement/placementData";
import { getPlacementQuestionById } from "@/lib/placement/placementDb";

/** Guest users may submit at most this many answers before being prompted to sign in. */
const GUEST_ATTEMPT_LIMIT = 3;

function getCookie(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function POST(req: Request) {
  try {
    let session = null;
    try {
      session = await auth();
    } catch {
      session = null;
    }
    const userId = session?.user?.id;

    // --- Guest attempt enforcement (backend) ---
    let currentGuestAttempts = 0;
    if (!userId) {
      const cookieVal = getCookie(req.headers.get("cookie"), "guest_placement_attempts");
      const cookieAttempts = cookieVal ? parseInt(cookieVal, 10) : 0;
      const headerVal = req.headers.get("x-guest-attempts");
      const headerAttempts = headerVal ? parseInt(headerVal, 10) : 0;

      currentGuestAttempts = Math.max(
        isNaN(cookieAttempts) ? 0 : cookieAttempts,
        isNaN(headerAttempts) ? 0 : headerAttempts
      );

      if (currentGuestAttempts >= GUEST_ATTEMPT_LIMIT) {
        return NextResponse.json(
          {
            success: false,
            error: "GUEST_LIMIT_REACHED",
            message: "Guest practice limit reached (3/3). Please sign in or create an account to continue.",
            limitReached: true,
            guestAttempts: currentGuestAttempts,
          },
          { status: 403 }
        );
      }
    }

    const body = await req.json();
    const { questionId, selectedAnswerIndex } = body;

    let question = PLACEMENT_QUESTIONS.find((q) => q.id === questionId);
    if (!question) {
      const dbMatch = await getPlacementQuestionById(questionId);
      if (dbMatch) question = dbMatch;
    }

    if (!question) {
      return NextResponse.json(
        { success: false, error: "Question not found" },
        { status: 404 }
      );
    }

    const isCorrect = Number(selectedAnswerIndex) === Number(question.correctAnswer);

    let updatedReadiness = null;
    let solvedQuestionIds: string[] | undefined = undefined;

    if (userId) {
      try {
        // Persist attempt history for logged-in students
        await db.placementAttempt.create({
          data: {
            userId,
            questionId: question.id,
            selectedAnswer: Number(selectedAnswerIndex),
            isCorrect,
          },
        });

        // Retrieve current list of solved questions
        const solvedRecords = await db.placementAttempt.findMany({
          where: { userId, isCorrect: true },
          select: { questionId: true },
          distinct: ["questionId"],
        });
        solvedQuestionIds = solvedRecords.map((r: { questionId: string }) => r.questionId);
      } catch (attErr) {
        console.warn("Could not persist student placement attempt:", attErr);
      }

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

    const nextGuestAttempts = !userId ? currentGuestAttempts + 1 : undefined;

    const response = NextResponse.json({
      success: true,
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      formulaOrTip: question.formulaOrTip,
      updatedReadiness,
      solvedQuestionIds,
      guestAttempts: nextGuestAttempts,
      limitReached: !userId ? nextGuestAttempts! >= GUEST_ATTEMPT_LIMIT : false,
    });

    if (!userId && nextGuestAttempts !== undefined) {
      response.cookies.set("guest_placement_attempts", String(nextGuestAttempts), {
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: "lax",
      });
    }

    return response;
  } catch (err) {
    console.error("Practice submission error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

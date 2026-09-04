import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserTutorContext } from "@/lib/ai/tutorContext";
import { buildSystemPrompt } from "@/lib/ai/tutorEngine";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body = {};
    try {
      body = await req.json();
    } catch {
      // Ignore JSON parse errors for voice session initialization if empty body
    }

    const { pageContext } = body as { pageContext?: Record<string, unknown> };

    // Fetch user context from Prisma
    let tutorContext;
    try {
      tutorContext = await getUserTutorContext(
        session.user.id,
        pageContext as Parameters<typeof getUserTutorContext>[1]
      );
    } catch (dbErr) {
      console.error("[api/tutor/voice] Failed to fetch context:", dbErr);
      tutorContext = {
        userName: session.user.name || "Student",
        email: session.user.email || "",
        careerGoal: "Software Engineer",
        completedTopicsCount: 0,
        totalTopicsCount: 10,
        completedTopicTitles: [],
        upcomingTopics: [],
        dsaSolvedCount: 0,
        dsaAttemptedCount: 0,
        solvedDsaTitles: [],
        recommendedDsaProblems: ["Two Sum", "Binary Search"],
        pageContext: pageContext as Parameters<typeof getUserTutorContext>[1],
      };
    }

    const systemPrompt = buildSystemPrompt(tutorContext);

    // Ephemeral session configuration for voice interaction
    return NextResponse.json({
      success: true,
      userName: tutorContext.userName,
      careerGoal: tutorContext.careerGoal,
      activeStage: tutorContext.activeStageTitle || "Foundation",
      nextTopic: tutorContext.nextTopicToLearn || "Active Modules",
      systemInstruction: systemPrompt,
      sessionToken: `voice_session_${session.user.id}_${Date.now()}`,
    });
  } catch (err) {
    console.error("[api/tutor/voice] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

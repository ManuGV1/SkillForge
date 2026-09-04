import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserTutorContext } from "@/lib/ai/tutorContext";
import { generateTutorResponse, Message } from "@/lib/ai/tutorEngine";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON format in request body" },
        { status: 400 }
      );
    }

    const { messages, pageContext } = body as {
      messages: Message[];
      pageContext?: Record<string, unknown>;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid request: messages array is required" },
        { status: 400 }
      );
    }

    // Filter and sanitize valid messages
    const sanitizedMessages: Message[] = messages
      .filter((m) => m && typeof m.content === "string" && m.content.trim().length > 0)
      .map((m) => ({
        role: m.role === "assistant" || m.role === "system" ? m.role : "user",
        content: m.content.trim(),
      }));

    if (sanitizedMessages.length === 0) {
      return NextResponse.json(
        { error: "Invalid request: messages must contain non-empty content" },
        { status: 400 }
      );
    }

    // Fetch user context from Prisma safely
    let tutorContext;
    try {
      tutorContext = await getUserTutorContext(
        session.user.id,
        pageContext as Parameters<typeof getUserTutorContext>[1]
      );
    } catch (dbErr) {
      console.error("[api/tutor] Failed to load user tutor context:", dbErr);
      // Fallback context if database query has issues
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

    // Generate response using LLM or context-aware engine
    const response = await generateTutorResponse(sanitizedMessages, tutorContext);

    return NextResponse.json(response);
  } catch (err) {
    console.error("[api/tutor] Error handling tutor request:", err);
    return NextResponse.json(
      {
        message: "I encountered an error processing your request. Please try again or rephrase your query.",
        suggestions: [
          "Explain a programming concept",
          "What should I learn next?",
          "How to prepare for technical interviews?",
        ],
      },
      { status: 200 } // Return 200 with fallback message so client handles UI gracefully
    );
  }
}

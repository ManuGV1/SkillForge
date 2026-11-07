import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { z } from "zod";

const improveSchema = z.object({
  text: z.string().min(3).max(1500),
  type: z.enum(["bullet", "summary", "headline"]).default("bullet"),
  context: z.string().max(500).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = improveSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid text input provided" },
        { status: 400 }
      );
    }

    const { text, type, context } = parsed.data;

    const apiKey = process.env.GEMINI_API_KEY;

    // Strict system guidelines for the resume improver
    const systemPrompt = `You are a world-class technical resume editor for top software engineering roles and campus placements.
YOUR TASK:
Rewrite and elevate the provided resume ${type} to be concise, impactful, professional, and ATS-optimized.

CRITICAL CONSTRAINTS:
1. DO NOT invent fake achievements, metrics, companies, years of experience, or technologies that were not mentioned.
2. Begin bullet points with strong, varied action verbs (e.g. Architected, Engineered, Implemented, Designed, Streamlined, Orchestrated, Optimized).
3. Emphasize cause-and-effect and technical impact without exaggeration.
4. Keep the output clean, single-paragraph or single-bullet formatted without quotes, markdown bullet symbols (e.g. do not prefix with '- ' or '* '), or introductory conversational text.
5. Provide ONLY the improved text directly.`;

    const userPrompt = `ORIGINAL TEXT (${type.toUpperCase()}):
"${text}"
${context ? `ADDITIONAL CONTEXT: ${context}` : ""}

Please return the improved, ATS-polished version:`;

    if (apiKey) {
      const geminiModels = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-pro",
      ];

      for (const model of geminiModels) {
        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              signal: AbortSignal.timeout(8000),
              body: JSON.stringify({
                system_instruction: {
                  parts: [{ text: systemPrompt }],
                },
                contents: [
                  {
                    role: "user",
                    parts: [{ text: userPrompt }],
                  },
                ],
                generationConfig: {
                  temperature: 0.3,
                  maxOutputTokens: 350,
                },
              }),
            }
          );

          if (res.ok) {
            const data = await res.json();
            const improved = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (improved && improved.trim().length > 0) {
              const cleanText = improved.trim().replace(/^[-*•]\s*/, "").replace(/^["']|["']$/g, "");
              return NextResponse.json({
                success: true,
                improvedText: cleanText,
              });
            }
          }
        } catch {
          // Fall through to next model or rule-based fallback
        }
      }
    }

    // High-quality deterministic fallback if AI is momentarily unreachable
    let fallbackText = text.trim();
    if (type === "bullet") {
      const weakVerbMap: Record<string, string> = {
        "worked on": "Engineered and maintained",
        "made": "Developed and deployed",
        "helped with": "Collaborated on designing",
        "fixed": "Diagnosed and resolved",
        "created": "Architected and implemented",
        "did": "Executed and delivered",
        "used": "Leveraged",
      };

      for (const [weak, strong] of Object.entries(weakVerbMap)) {
        if (fallbackText.toLowerCase().startsWith(weak)) {
          fallbackText = strong + fallbackText.slice(weak.length);
          break;
        }
      }
      if (!fallbackText.endsWith(".")) {
        fallbackText += ".";
      }
    }

    return NextResponse.json({
      success: true,
      improvedText: fallbackText,
    });
  } catch (error) {
    console.error("[POST /api/resume/ai-improve] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to improve text" },
      { status: 500 }
    );
  }
}

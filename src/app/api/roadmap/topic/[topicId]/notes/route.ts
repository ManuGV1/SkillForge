import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  notes: z.string().max(5000).nullable(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ topicId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { topicId } = await params;
    const userId = session.user.id;

    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { notes } = parsed.data;

    // Verify topic exists
    const topic = await db.stageTopic.findUnique({
      where: { id: topicId },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // Upsert progress record with the notes
    await db.userTopicProgress.upsert({
      where: { userId_topicId: { userId, topicId } },
      update: { notes },
      create: {
        userId,
        topicId,
        notes,
        isCompleted: false,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/roadmap/topic/notes] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ problemId: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { problemId } = await params;
    const userId = session.user.id;

    // Verify problem exists
    const problem = await db.dsaProblem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    // Upsert progress record with status SOLVED
    await db.userDsaProgress.upsert({
      where: { userId_problemId: { userId, problemId } },
      update: {
        status: "SOLVED",
        solvedAt: new Date(),
      },
      create: {
        userId,
        problemId,
        status: "SOLVED",
        solvedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[api/dsa/solve] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

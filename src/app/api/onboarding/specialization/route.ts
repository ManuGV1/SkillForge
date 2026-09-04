import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const VALID_SPECIALIZATIONS = [
  "Software Engineer",
  "Full-Stack Developer",
  "Full Stack Developer",
  "AI/ML Engineer",
  "Data Scientist",
  "DevOps & Cloud",
  "Cybersecurity Analyst",
] as const;

const schema = z.object({
  specialization: z.enum(VALID_SPECIALIZATIONS),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid specialization" },
        { status: 400 }
      );
    }

    const { specialization } = parsed.data;

    // Upsert the profile with the chosen career goal
    await db.profile.upsert({
      where: { userId: session.user.id },
      update: { careerGoal: specialization },
      create: { userId: session.user.id, careerGoal: specialization },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[onboarding/specialization] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

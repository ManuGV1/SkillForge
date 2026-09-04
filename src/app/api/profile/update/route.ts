import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const profileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  college: z.string().optional().nullable(),
  degree: z.string().optional().nullable(),
  branch: z.string().optional().nullable(),
  gradYear: z.number().int().min(1900).max(2100).optional().nullable(),
  careerGoal: z.string().optional().nullable(),
  skills: z.string().optional().nullable(),
  githubUrl: z
    .string()
    .url("Invalid GitHub URL")
    .or(z.literal(""))
    .optional()
    .nullable(),
  linkedinUrl: z
    .string()
    .url("Invalid LinkedIn URL")
    .or(z.literal(""))
    .optional()
    .nullable(),
  portfolioUrl: z
    .string()
    .url("Invalid Portfolio URL")
    .or(z.literal(""))
    .optional()
    .nullable(),
  bio: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    const body = await req.json();
    const result = profileUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = result.data;

    await db.$transaction(async (tx) => {
      // Update User Name
      await tx.user.update({
        where: { id: userId },
        data: { name: data.name },
      });

      // Update or Create Profile
      await tx.profile.upsert({
        where: { userId },
        update: {
          college: data.college,
          degree: data.degree,
          branch: data.branch,
          gradYear: data.gradYear,
          careerGoal: data.careerGoal,
          skills: data.skills,
          githubUrl: data.githubUrl,
          linkedinUrl: data.linkedinUrl,
          portfolioUrl: data.portfolioUrl,
          bio: data.bio,
        },
        create: {
          userId,
          college: data.college,
          degree: data.degree,
          branch: data.branch,
          gradYear: data.gradYear,
          careerGoal: data.careerGoal,
          skills: data.skills,
          githubUrl: data.githubUrl,
          linkedinUrl: data.linkedinUrl,
          portfolioUrl: data.portfolioUrl,
          bio: data.bio,
        },
      });
    });

    return NextResponse.json({
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Profile update error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
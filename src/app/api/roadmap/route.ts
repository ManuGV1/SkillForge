import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user's career goal from profile
    const profile = await db.profile.findUnique({
      where: { userId },
      select: { careerGoal: true },
    });

    if (!profile?.careerGoal) {
      return NextResponse.json(
        { error: "No career goal set" },
        { status: 404 }
      );
    }

    // Find the matching career path and its roadmap
    let careerPath = await db.careerPath.findFirst({
      where: { title: profile.careerGoal },
      include: {
        roadmaps: {
          include: {
            stages: {
              orderBy: { position: "asc" },
              include: {
                topics: {
                  orderBy: { position: "asc" },
                  include: {
                    userProgress: {
                      where: { userId },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!careerPath) {
      const targetTitle = profile.careerGoal.replace("-", " ").toLowerCase();
      const allPaths = await db.careerPath.findMany({
        include: {
          roadmaps: {
            include: {
              stages: {
                orderBy: { position: "asc" },
                include: {
                  topics: {
                    orderBy: { position: "asc" },
                    include: {
                      userProgress: {
                        where: { userId },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
      careerPath =
        allPaths.find(
          (cp) => cp.title.replace("-", " ").toLowerCase() === targetTitle
        ) ?? null;
    }

    if (!careerPath || careerPath.roadmaps.length === 0) {
      return NextResponse.json(
        { error: "Roadmap not found for this career path" },
        { status: 404 }
      );
    }

    const roadmap = careerPath.roadmaps[0];

    // Compute progress per stage
    const stages = roadmap.stages.map((stage) => {
      const total = stage.topics.length;
      const completed = stage.topics.filter(
        (t) => t.userProgress[0]?.isCompleted === true
      ).length;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

      // Unlock rule: stage 0 always unlocked; others unlock when all previous are 100%
      return {
        id: stage.id,
        title: stage.title,
        description: stage.description,
        position: stage.position,
        total,
        completed,
        percent,
        topics: stage.topics.map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          youtubeUrl: t.youtubeUrl,
          position: t.position,
          isCompleted: t.userProgress[0]?.isCompleted ?? false,
          notes: t.userProgress[0]?.notes ?? null,
        })),
      };
    });

    // Apply lock logic after building the array
    const stagesWithLock = stages.map((stage, idx) => ({
      ...stage,
      isUnlocked:
        idx === 0 || stages.slice(0, idx).every((s) => s.percent === 100),
    }));

    return NextResponse.json({
      careerPath: {
        id: careerPath.id,
        title: careerPath.title,
        description: careerPath.description,
      },
      roadmap: {
        id: roadmap.id,
        title: roadmap.title,
        description: roadmap.description,
      },
      stages: stagesWithLock,
    });
  } catch (err) {
    console.error("[api/roadmap] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  UserCheck,
  Settings,
  BookOpen,
  ChevronRight,
  Map,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: true,
      role: true,
      userTopicProgress: {
        where: { isCompleted: true },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const profile = user.profile;

  // Send first-time users to choose a specialization
  if (!profile?.careerGoal) {
    redirect("/onboarding");
  }

  // Load the roadmap for this user's career goal
  let careerPath = await db.careerPath.findFirst({
    where: { title: profile.careerGoal },
    include: {
      roadmaps: {
        include: {
          stages: {
            orderBy: { position: "asc" },
            include: {
              topics: {
                select: { id: true },
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
                  select: { id: true },
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

  const roadmap = careerPath?.roadmaps[0] ?? null;
  const stages = roadmap?.stages ?? [];

  // Compute completed topic IDs for this user
  const completedTopicIds = new Set(
    user.userTopicProgress.map((p) => p.topicId)
  );

  // Per-stage completion info
  const stageProgress = stages.map((stage) => {
    const total = stage.topics.length;
    const completed = stage.topics.filter((t) =>
      completedTopicIds.has(t.id)
    ).length;
    return {
      id: stage.id,
      title: stage.title,
      position: stage.position,
      total,
      completed,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });

  // A stage is unlocked if all previous stages are fully complete
  const stagesWithLock = stageProgress.map((stage, idx) => {
    const isUnlocked =
      idx === 0 ||
      stageProgress.slice(0, idx).every((s) => s.percent === 100);
    return { ...stage, isUnlocked };
  });

  const overallPercent =
    stageProgress.length > 0
      ? Math.round(
          stageProgress.reduce((acc, s) => acc + s.percent, 0) /
            stageProgress.length
        )
      : 0;

  // Find the active (first incomplete unlocked) stage
  const activeStage =
    stagesWithLock.find((s) => s.isUnlocked && s.percent < 100) ??
    stagesWithLock[stagesWithLock.length - 1];

  const stageLabels = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border-sharp pb-6 gap-4">
        <div>
          <span className="font-mono text-[9px] text-primary font-bold uppercase tracking-wider">
            STUDENT DASHBOARD
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-text-main mt-1">
            WELCOME BACK, {user.name?.toUpperCase() || "BUILDER"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-text-sub uppercase border border-border-sharp px-3 py-1 rounded-sm bg-bg-surface/50">
            Role: {user.role?.name || "STUDENT"}
          </span>
          <Link
            href="/profile"
            className="inline-flex items-center justify-center border border-border-sharp hover:bg-bg-surface text-text-main font-sans text-xs font-semibold px-4 py-2 rounded-sm gap-1.5 transition-colors focus:outline-none"
          >
            <Settings className="h-3.5 w-3.5" />
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 columns */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Track Banner */}
          <div className="border border-border-sharp bg-bg-surface p-6 rounded-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserCheck className="h-6 w-6 text-success shrink-0" />
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] text-text-sub uppercase tracking-wider">
                    ACTIVE TRACK
                  </span>
                  <h3 className="font-display text-lg font-bold text-text-main">
                    {profile.careerGoal}
                  </h3>
                </div>
              </div>
              <Link
                href="/roadmap"
                className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-dim text-bg-base font-sans text-xs font-bold uppercase tracking-wide px-4 py-2 rounded-sm transition-colors focus:outline-none"
              >
                <Map className="h-3.5 w-3.5" />
                View Roadmap
              </Link>
            </div>

            {/* Overall progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] text-text-sub uppercase tracking-wider">
                  Overall Progress
                </span>
                <span className="font-mono text-[10px] text-primary font-bold">
                  {overallPercent}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-bg-base rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${overallPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Roadmap Stages Pipeline */}
          <div className="border border-border-sharp bg-bg-surface p-6 rounded-sm space-y-6">
            <h3 className="font-display text-sm font-semibold tracking-wider text-text-main uppercase border-b border-border-sharp/40 pb-3">
              YOUR ROADMAP PIPELINE
            </h3>

            {stagesWithLock.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <p className="font-sans text-sm text-text-sub">
                  Roadmap content is loading. Check back soon.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {stagesWithLock.map((stage, idx) => (
                  <div
                    key={stage.id}
                    className={`flex items-center justify-between p-4 border rounded-sm transition-all ${
                      !stage.isUnlocked
                        ? "bg-bg-base/40 border-border-sharp/40 opacity-50"
                        : stage.id === activeStage?.id
                        ? "bg-bg-base border-primary/30"
                        : "bg-bg-base border-border-sharp"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 border text-[10px] font-mono font-bold ${
                          stage.percent === 100
                            ? "bg-success/10 border-success/30 text-success"
                            : stage.id === activeStage?.id
                            ? "bg-primary/10 border-primary/30 text-primary"
                            : "bg-bg-surface border-border-sharp text-text-sub"
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-sans text-sm font-semibold truncate ${
                              stage.isUnlocked
                                ? "text-text-main"
                                : "text-text-dim"
                            }`}
                          >
                            {stage.title}
                          </span>
                          <span className="font-mono text-[9px] text-text-sub border border-border-sharp/60 px-1.5 py-0.5 rounded-sm shrink-0">
                            {stageLabels[idx] ?? `STAGE ${idx + 1}`}
                          </span>
                        </div>
                        {stage.isUnlocked && stage.total > 0 && (
                          <span className="font-mono text-[10px] text-text-sub">
                            {stage.completed}/{stage.total} topics
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {!stage.isUnlocked ? (
                        <span className="font-mono text-[10px] text-text-sub uppercase">
                          LOCKED
                        </span>
                      ) : stage.percent === 100 ? (
                        <span className="font-mono text-[10px] text-success uppercase">
                          COMPLETE
                        </span>
                      ) : stage.id === activeStage?.id ? (
                        <span className="font-mono text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-sm uppercase">
                          IN PROGRESS
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] text-text-sub uppercase">
                          PENDING
                        </span>
                      )}
                      {stage.isUnlocked && (
                        <Link
                          href="/roadmap"
                          className="text-text-sub hover:text-text-main transition-colors"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-8">
          {/* Profile Overview */}
          <div className="border border-border-sharp bg-bg-surface p-6 rounded-sm space-y-4">
            <h3 className="font-display text-sm font-semibold tracking-wider text-text-main uppercase border-b border-border-sharp/40 pb-3">
              PROFILE OVERVIEW
            </h3>
            <div className="space-y-3 font-sans text-xs">
              <div className="flex justify-between border-b border-border-sharp/20 pb-2">
                <span className="text-text-sub">Name:</span>
                <span className="text-text-main font-medium">{user.name}</span>
              </div>
              <div className="flex justify-between border-b border-border-sharp/20 pb-2">
                <span className="text-text-sub">Email:</span>
                <span className="text-text-main font-medium truncate max-w-[140px]">
                  {user.email}
                </span>
              </div>
              <div className="flex justify-between border-b border-border-sharp/20 pb-2">
                <span className="text-text-sub">College:</span>
                <span className="text-text-main font-medium">
                  {profile?.college || "Not set"}
                </span>
              </div>
              <div className="flex justify-between border-b border-border-sharp/20 pb-2">
                <span className="text-text-sub">Degree:</span>
                <span className="text-text-main font-medium">
                  {profile?.degree || "Not set"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-sub">Grad Year:</span>
                <span className="text-text-main font-medium">
                  {profile?.gradYear || "Not set"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="border border-border-sharp bg-bg-surface p-6 rounded-sm space-y-3">
            <h3 className="font-display text-sm font-semibold tracking-wider text-text-main uppercase border-b border-border-sharp/40 pb-3 mb-2">
              QUICK LINKS
            </h3>
            <Link
              href="/roadmap"
              className="flex items-center justify-between w-full py-2.5 px-3 bg-bg-base hover:bg-bg-elevated border border-border-sharp text-text-main text-xs font-semibold uppercase tracking-wider rounded-sm transition-all focus:outline-none"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="h-3.5 w-3.5 text-primary" />
                My Roadmap
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-text-sub" />
            </Link>
            <Link
              href="/profile"
              className="flex items-center justify-between w-full py-2.5 px-3 bg-bg-base hover:bg-bg-elevated border border-border-sharp text-text-main text-xs font-semibold uppercase tracking-wider rounded-sm transition-all focus:outline-none"
            >
              <span className="flex items-center gap-2">
                <Settings className="h-3.5 w-3.5 text-text-sub" />
                Edit Profile
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-text-sub" />
            </Link>
            <Link
              href="/about"
              className="flex items-center justify-between w-full py-2.5 px-3 bg-bg-base hover:bg-bg-elevated border border-border-sharp text-text-main text-xs font-semibold uppercase tracking-wider rounded-sm transition-all focus:outline-none"
            >
              <span className="flex items-center gap-2">
                <Map className="h-3.5 w-3.5 text-text-sub" />
                Meet Code404 Team
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-text-sub" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

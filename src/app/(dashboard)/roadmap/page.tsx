import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import {
  Lock,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Circle,
} from "lucide-react";

const STAGE_LABELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];
const STAGE_COLORS = [
  { text: "text-success", border: "border-success/30", bg: "bg-success/5" },
  { text: "text-primary", border: "border-primary/30", bg: "bg-primary/5" },
  { text: "text-blue-400", border: "border-blue-400/30", bg: "bg-blue-400/5" },
  { text: "text-purple-400", border: "border-purple-400/30", bg: "bg-purple-400/5" },
];

export default async function RoadmapPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      profile: { select: { careerGoal: true } },
      userTopicProgress: { where: { isCompleted: true }, select: { topicId: true } },
    },
  });

  if (!user?.profile?.careerGoal) {
    redirect("/onboarding");
  }

  let careerPath = await db.careerPath.findFirst({
    where: { title: user.profile.careerGoal },
    include: {
      roadmaps: {
        include: {
          stages: {
            orderBy: { position: "asc" },
            include: {
              topics: {
                orderBy: { position: "asc" },
                select: { id: true, title: true, description: true },
              },
            },
          },
        },
      },
    },
  });

  if (!careerPath) {
    const targetTitle = user.profile.careerGoal.replace("-", " ").toLowerCase();
    const allPaths = await db.careerPath.findMany({
      include: {
        roadmaps: {
          include: {
            stages: {
              orderBy: { position: "asc" },
              include: {
                topics: {
                  orderBy: { position: "asc" },
                  select: { id: true, title: true, description: true },
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
  const completedTopicIds = new Set(user.userTopicProgress.map((p) => p.topicId));

  // Compute per-stage progress and lock state
  const stageData = stages.map((stage, idx) => {
    const total = stage.topics.length;
    const completed = stage.topics.filter((t) => completedTopicIds.has(t.id)).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const isUnlocked = idx === 0 || stages.slice(0, idx).every((_, i) => {
      const t = stages[i].topics.length;
      const c = stages[i].topics.filter((tp) => completedTopicIds.has(tp.id)).length;
      return t > 0 && c === t;
    });
    const isComplete = percent === 100 && total > 0;
    const color = STAGE_COLORS[idx] ?? STAGE_COLORS[STAGE_COLORS.length - 1];
    return { ...stage, total, completed, percent, isUnlocked, isComplete, color };
  });

  const overallPercent =
    stageData.length > 0
      ? Math.round(stageData.reduce((a, s) => a + s.percent, 0) / stageData.length)
      : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="border-b border-border-sharp pb-6 space-y-1">
        <span className="font-mono text-[9px] text-primary font-bold uppercase tracking-wider">
          LEARNING ROADMAP
        </span>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-text-main">
            {user.profile.careerGoal}
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-text-sub uppercase">
              Overall:
            </span>
            <span className="font-mono text-sm font-bold text-primary">
              {overallPercent}%
            </span>
            <a
              href="/dashboard"
              className="font-sans text-xs text-text-sub hover:text-text-main transition-colors border border-border-sharp px-3 py-1.5 rounded-sm"
            >
              ← Dashboard
            </a>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className="pt-3">
          <div className="h-1.5 w-full bg-bg-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-700"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* No roadmap state */}
      {!roadmap && (
        <div className="border border-border-sharp bg-bg-surface p-8 rounded-sm text-center space-y-3">
          <BookOpen className="h-8 w-8 text-text-sub mx-auto" />
          <p className="font-sans text-sm text-text-sub">
            Roadmap content is being prepared. Check back soon.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center text-xs text-primary hover:text-primary-dim font-semibold gap-1 transition-colors"
          >
            Return to Dashboard <ChevronRight className="h-3.5 w-3.5" />
          </a>
        </div>
      )}

      {/* Stages */}
      {stageData.map((stage, idx) => (
        <div
          key={stage.id}
          className={`border rounded-sm overflow-hidden transition-all ${
            !stage.isUnlocked
              ? "border-border-sharp/40 opacity-50"
              : stage.isComplete
              ? "border-success/20"
              : "border-border-sharp"
          }`}
        >
          {/* Stage header */}
          <div
            className={`p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border-sharp/40 ${
              !stage.isUnlocked ? "bg-bg-surface/50" : "bg-bg-surface"
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Stage number circle */}
              <div
                className={`h-10 w-10 rounded-full border-2 flex items-center justify-center shrink-0 font-display font-extrabold text-sm ${
                  stage.isComplete
                    ? "border-success text-success bg-success/10"
                    : stage.isUnlocked
                    ? `${stage.color.border} ${stage.color.text} ${stage.color.bg}`
                    : "border-border-sharp text-text-sub bg-bg-base"
                }`}
              >
                {stage.isComplete ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : !stage.isUnlocked ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  idx + 1
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-display text-lg font-bold text-text-main">
                    {stage.title}
                  </h2>
                  <span
                    className={`font-mono text-[9px] font-bold uppercase px-2 py-0.5 rounded-sm border ${
                      stage.isUnlocked
                        ? `${stage.color.text} ${stage.color.border} ${stage.color.bg}`
                        : "text-text-sub border-border-sharp"
                    }`}
                  >
                    {STAGE_LABELS[idx] ?? `STAGE ${idx + 1}`}
                  </span>
                </div>
                <p className="font-sans text-xs text-text-dim mt-0.5">
                  {stage.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <div className="font-mono text-xs text-text-sub">
                  {stage.completed}/{stage.total} topics
                </div>
                <div
                  className={`font-mono text-sm font-bold ${
                    stage.isComplete ? "text-success" : "text-primary"
                  }`}
                >
                  {stage.percent}%
                </div>
              </div>
              {/* Mini progress bar */}
              <div className="h-16 w-1.5 bg-bg-base rounded-full overflow-hidden rotate-180">
                <div
                  className={`w-full rounded-full transition-all duration-700 ${
                    stage.isComplete ? "bg-success" : "bg-primary"
                  }`}
                  style={{ height: `${stage.percent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Topics list */}
          {stage.isUnlocked && (
            <div className="divide-y divide-border-sharp/30 bg-bg-base">
              {stage.topics.length === 0 && (
                <div className="p-5 text-center">
                  <p className="font-sans text-xs text-text-sub">
                    Topics coming soon.
                  </p>
                </div>
              )}
              {stage.topics.map((topic, tIdx) => {
                const isDone = completedTopicIds.has(topic.id);
                return (
                  <a
                    key={topic.id}
                    href={`/roadmap/${stage.id}/${topic.id}`}
                    className="flex items-center justify-between px-5 py-4 hover:bg-bg-surface/60 transition-colors group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : (
                          <Circle className="h-4 w-4 text-border-sharp group-hover:text-text-sub transition-colors" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-text-sub shrink-0">
                            {String(tIdx + 1).padStart(2, "0")}
                          </span>
                          <span
                            className={`font-sans text-sm font-semibold truncate ${
                              isDone
                                ? "text-text-sub line-through"
                                : "text-text-main"
                            }`}
                          >
                            {topic.title}
                          </span>
                        </div>
                        <p className="font-sans text-xs text-text-sub mt-0.5 truncate max-w-[30ch] sm:max-w-none">
                          {topic.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-text-sub group-hover:text-text-main transition-colors shrink-0 ml-3" />
                  </a>
                );
              })}
            </div>
          )}

          {/* Locked overlay label */}
          {!stage.isUnlocked && (
            <div className="p-4 bg-bg-base/60 text-center">
              <p className="font-mono text-[10px] text-text-sub uppercase tracking-wider">
                Complete the previous stage to unlock
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

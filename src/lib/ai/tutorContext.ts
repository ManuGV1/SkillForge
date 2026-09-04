import { db } from "@/lib/db";

export interface PageContext {
  pageType?: "roadmap" | "topic" | "dsa" | "dashboard" | "general";
  topicTitle?: string;
  topicDescription?: string;
  problemTitle?: string;
  problemDifficulty?: string;
  problemDescription?: string;
  userCode?: string;
}

export interface UserTutorContext {
  userName: string;
  email: string;
  careerGoal: string;
  college?: string;
  degree?: string;
  skills?: string;
  activeStageTitle?: string;
  completedTopicsCount: number;
  totalTopicsCount: number;
  completedTopicTitles: string[];
  nextTopicToLearn?: string;
  nextTopicDescription?: string;
  upcomingTopics: string[];
  dsaSolvedCount: number;
  dsaAttemptedCount: number;
  solvedDsaTitles: string[];
  recommendedDsaProblems: string[];
  pageContext?: PageContext;
}

export async function getUserTutorContext(
  userId: string,
  pageContext?: PageContext
): Promise<UserTutorContext> {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      userTopicProgress: {
        where: { isCompleted: true },
        include: { topic: true },
      },
      userDsaProgress: {
        include: { problem: true },
      },
    },
  });

  const userName = user?.name || "Student";
  const email = user?.email || "";
  const profile = user?.profile;
  const careerGoal = profile?.careerGoal || "Software Engineer";

  // Load Roadmap information for the user's career goal
  let careerPath = await db.careerPath.findFirst({
    where: { title: careerGoal },
    include: {
      roadmaps: {
        include: {
          stages: {
            orderBy: { position: "asc" },
            include: {
              topics: {
                orderBy: { position: "asc" },
              },
            },
          },
        },
      },
    },
  });

  if (!careerPath) {
    const targetTitle = careerGoal.replace("-", " ").toLowerCase();
    const allPaths = await db.careerPath.findMany({
      include: {
        roadmaps: {
          include: {
            stages: {
              orderBy: { position: "asc" },
              include: {
                topics: {
                  orderBy: { position: "asc" },
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

  const stages = careerPath?.roadmaps[0]?.stages ?? [];
  const completedTopicRecords = user?.userTopicProgress ?? [];
  const completedTopicIds = new Set(completedTopicRecords.map((p) => p.topicId));
  const completedTopicTitles = completedTopicRecords
    .map((p) => p.topic.title)
    .filter(Boolean);

  let totalTopicsCount = 0;
  let activeStageTitle = "";
  let nextTopicToLearn = "";
  let nextTopicDescription = "";
  const upcomingTopics: string[] = [];

  for (const stage of stages) {
    totalTopicsCount += stage.topics.length;
    for (const topic of stage.topics) {
      if (!completedTopicIds.has(topic.id)) {
        if (!nextTopicToLearn) {
          nextTopicToLearn = topic.title;
          nextTopicDescription = topic.description;
          activeStageTitle = stage.title;
        } else if (upcomingTopics.length < 3) {
          upcomingTopics.push(topic.title);
        }
      }
    }
  }

  const completedTopicsCount = completedTopicIds.size;
  if (!activeStageTitle && stages.length > 0) {
    activeStageTitle = stages[stages.length - 1].title;
  }

  // DSA Progress
  const dsaProgressList = user?.userDsaProgress ?? [];
  const solvedDsaTitles = dsaProgressList
    .filter((p) => p.status === "SOLVED")
    .map((p) => `${p.problem.title} (${p.problem.difficulty})`);

  const solvedIds = new Set(
    dsaProgressList.filter((p) => p.status === "SOLVED").map((p) => p.problemId)
  );

  const allDsaProblems = await db.dsaProblem.findMany({
    select: { id: true, title: true, difficulty: true },
    take: 10,
  });

  const recommendedDsaProblems = allDsaProblems
    .filter((p) => !solvedIds.has(p.id))
    .slice(0, 3)
    .map((p) => `${p.title} (${p.difficulty})`);

  return {
    userName,
    email,
    careerGoal,
    college: profile?.college || undefined,
    degree: profile?.degree || undefined,
    skills: profile?.skills || undefined,
    activeStageTitle: activeStageTitle || undefined,
    completedTopicsCount,
    totalTopicsCount,
    completedTopicTitles,
    nextTopicToLearn: nextTopicToLearn || undefined,
    nextTopicDescription: nextTopicDescription || undefined,
    upcomingTopics,
    dsaSolvedCount: solvedDsaTitles.length,
    dsaAttemptedCount: dsaProgressList.filter((p) => p.status === "ATTEMPTED").length,
    solvedDsaTitles,
    recommendedDsaProblems,
    pageContext,
  };
}

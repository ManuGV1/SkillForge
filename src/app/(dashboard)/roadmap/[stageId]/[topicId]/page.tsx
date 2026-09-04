import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import TopicViewClient from "./TopicViewClient";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ stageId: string; topicId: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { stageId, topicId } = await params;
  const userId = session.user.id;

  // Fetch topic details with stage and user progress
  const topic = await db.stageTopic.findUnique({
    where: { id: topicId },
    include: {
      stage: {
        include: {
          roadmap: {
            include: {
              careerPath: true,
            },
          },
        },
      },
      userProgress: {
        where: { userId },
      },
    },
  });

  if (!topic || topic.stageId !== stageId) {
    redirect("/roadmap");
  }

  const userProgress = topic.userProgress[0] ?? null;

  return (
    <TopicViewClient
      topic={{
        id: topic.id,
        title: topic.title,
        description: topic.description,
        youtubeUrl: topic.youtubeUrl,
        quizJson: topic.quizJson,
        position: topic.position,
        stageId: topic.stageId,
        stageTitle: topic.stage.title,
        careerPathTitle: topic.stage.roadmap.careerPath.title,
      }}
      initialProgress={{
        isCompleted: userProgress?.isCompleted ?? false,
        notes: userProgress?.notes ?? "",
      }}
    />
  );
}

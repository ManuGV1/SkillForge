import "dotenv/config";
import { db } from "../src/lib/db";

async function runTest() {
  console.log("=== Testing Resume Builder Database & Workflow ===");

  const user = await db.user.findFirst({
    include: { profile: true, role: true },
  });

  if (!user) {
    console.log("No user found in database");
    return;
  }

  console.log(`Found test user: ${user.name} (${user.email})`);

  // 1. Test Milestone logic
  const [completedTopics, solvedDsa] = await Promise.all([
    db.userTopicProgress.count({ where: { userId: user.id, isCompleted: true } }),
    db.userDsaProgress.count({ where: { userId: user.id, status: "SOLVED" } }),
  ]);

  const isAdmin = user.role?.name === "ADMIN" || user.role?.name === "SUPER_ADMIN";
  const isUnlocked = isAdmin || completedTopics >= 1 || solvedDsa >= 1;

  console.log(`User stats -> Topics: ${completedTopics}, DSA: ${solvedDsa}, Role: ${user.role?.name || "STUDENT"}`);
  console.log(`Resume Unlocked Status: ${isUnlocked ? "UNLOCKED ✔" : "LOCKED (Needs milestone)"}`);

  // 2. Test Resume Upsert
  const testSkills = [
    { category: "Languages", items: "TypeScript, Python, C++, SQL" },
    { category: "Frameworks", items: "React, Next.js, Node.js, Express" },
  ];

  const testEducation = [
    {
      degree: user.profile?.degree || "B.Tech Computer Science",
      institution: user.profile?.college || "National Institute of Technology",
      branch: user.profile?.branch || "Computer Science",
      gradYear: "2026",
      score: "CGPA: 8.9 / 10",
    },
  ];

  const testProjects = [
    {
      title: "SkillForge Platform",
      techStack: "Next.js, TypeScript, Prisma, PostgreSQL",
      liveUrl: "https://skill-forge-bf7b.vercel.app",
      githubUrl: "https://github.com",
      description: "Engineered high-performance placement learning platform.",
      bullets: [
        "Architected scalable microservices and PostgreSQL relational schemas.",
        "Implemented real-time AI tutor and ATS-friendly resume generation engine.",
      ],
    },
  ];

  const existing = await db.resume.findFirst({ where: { userId: user.id } });

  let savedResume;
  if (existing) {
    savedResume = await db.resume.update({
      where: { id: existing.id },
      data: {
        fullName: user.name || "Test User",
        email: user.email,
        headline: "Full-Stack Software Engineer | React, Next.js, TypeScript",
        summary: "Passionate software engineer focused on building robust full-stack applications and high-throughput systems.",
        templateId: "modern-ats",
        skillsJson: JSON.stringify(testSkills),
        educationJson: JSON.stringify(testEducation),
        projectsJson: JSON.stringify(testProjects),
      },
    });
    console.log("✔ Updated existing resume:", savedResume.id);
  } else {
    savedResume = await db.resume.create({
      data: {
        userId: user.id,
        fullName: user.name || "Test User",
        email: user.email,
        headline: "Full-Stack Software Engineer | React, Next.js, TypeScript",
        summary: "Passionate software engineer focused on building robust full-stack applications and high-throughput systems.",
        templateId: "modern-ats",
        skillsJson: JSON.stringify(testSkills),
        educationJson: JSON.stringify(testEducation),
        projectsJson: JSON.stringify(testProjects),
      },
    });
    console.log("✔ Created new resume:", savedResume.id);
  }

  // 3. Verify Read with relations
  const loaded = await db.resume.findUnique({
    where: { id: savedResume.id },
    include: { user: { select: { id: true, email: true, name: true } } },
  });

  console.log(`✔ Verified loaded resume for: ${loaded?.user.name} (${loaded?.user.email})`);
  console.log(`Headline: ${loaded?.headline}`);
  console.log(`Template: ${loaded?.templateId}`);

  console.log("\n✔ All Resume Builder Database Tests Passed!");
}

runTest()
  .catch((err) => {
    console.error("Resume test failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

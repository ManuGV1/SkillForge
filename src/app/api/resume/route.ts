import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

const resumeSchema = z.object({
  title: z.string().default("My Technical Resume"),
  templateId: z.enum(["modern-ats", "classic-ats", "minimal-tech"]).default("modern-ats"),
  fullName: z.string().default(""),
  email: z.string().default(""),
  phone: z.string().nullable().optional().default(""),
  location: z.string().nullable().optional().default(""),
  headline: z.string().nullable().optional().default(""),
  summary: z.string().nullable().optional().default(""),
  githubUrl: z.string().nullable().optional().default(""),
  linkedinUrl: z.string().nullable().optional().default(""),
  portfolioUrl: z.string().nullable().optional().default(""),
  skillsJson: z.string().default("[]"),
  educationJson: z.string().default("[]"),
  experienceJson: z.string().default("[]"),
  projectsJson: z.string().default("[]"),
  certificationsJson: z.string().default("[]"),
  achievementsJson: z.string().default("[]"),
});

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Fetch user profile, existing resume, and milestones
    const [user, existingResume, completedTopicsCount, dsaSolvedCount] = await Promise.all([
      db.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
          role: true,
        },
      }),
      db.resume.findFirst({
        where: { userId },
        orderBy: { updatedAt: "desc" },
      }),
      db.userTopicProgress.count({
        where: { userId, isCompleted: true },
      }),
      db.userDsaProgress.count({
        where: { userId, status: "SOLVED" },
      }),
    ]);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const isAdmin =
      user.role?.name === "ADMIN" || user.role?.name === "SUPER_ADMIN";

    // Milestone rule: user completed at least 1 topic in roadmap OR 1 DSA problem, or is Admin
    const isUnlocked = isAdmin || completedTopicsCount >= 1 || dsaSolvedCount >= 1;

    let resumeData = existingResume;

    // If no saved resume exists yet, generate initial draft prefilled with user profile info
    if (!resumeData) {
      const profile = user.profile;

      // Extract and format skills from profile
      let initialSkills: Array<{ category: string; items: string }> = [];
      if (profile?.skills && profile.skills.trim().length > 0) {
        initialSkills = [
          { category: "Technical Skills", items: profile.skills },
          { category: "Developer Tools", items: "Git, GitHub, VS Code, Linux" },
          { category: "Core Fundamentals", items: "Data Structures & Algorithms, Object-Oriented Programming, System Design" },
        ];
      } else {
        initialSkills = [
          { category: "Languages", items: "TypeScript, JavaScript, Python, C++, SQL" },
          { category: "Frameworks & Libraries", items: "React, Next.js, Node.js, Express, Tailwind CSS" },
          { category: "Developer Tools & Platforms", items: "Git, GitHub, Docker, Postman, Vercel" },
          { category: "Core Computer Science", items: "Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks" },
        ];
      }

      // Initial education from profile
      const initialEducation = profile?.college
        ? [
            {
              degree: profile.degree || "Bachelor of Technology",
              institution: profile.college,
              branch: profile.branch || "Computer Science & Engineering",
              gradYear: profile.gradYear ? String(profile.gradYear) : "2026",
              score: "CGPA: 8.8 / 10",
            },
          ]
        : [];

      // Initial project structure based on career goal
      const initialProjects = [
        {
          title: "SkillForge Platform",
          techStack: "Next.js, TypeScript, PostgreSQL, Prisma, Tailwind CSS",
          liveUrl: "https://skill-forge-bf7b.vercel.app/",
          githubUrl: profile?.githubUrl || "https://github.com",
          description: "Engineered a high-performance interactive EdTech career platform featuring customized roadmaps, DSA practice engine, and real-time AI tutor.",
          bullets: [
            "Architected full-stack application using Next.js App Router and PostgreSQL with Prisma ORM.",
            "Integrated server-side role validation and privacy-preserving visitor telemetry pipelines.",
            "Implemented responsive editorial dark UI system with sub-100ms interaction latency.",
          ],
        },
      ];

      resumeData = {
        id: "draft",
        userId,
        title: "My Technical Resume",
        templateId: "modern-ats",
        fullName: user.name || "",
        email: user.email || "",
        phone: "+91 ",
        location: "India",
        headline: profile?.careerGoal ? `${profile.careerGoal} | Software Engineer` : "Full-Stack Software Engineer",
        summary: profile?.bio || "Detail-oriented software engineer with a strong foundation in data structures, algorithms, and modern web application development. Passionate about architecting scalable systems and delivering high-quality user experiences.",
        githubUrl: profile?.githubUrl || "",
        linkedinUrl: profile?.linkedinUrl || "",
        portfolioUrl: profile?.portfolioUrl || "",
        skillsJson: JSON.stringify(initialSkills),
        educationJson: JSON.stringify(initialEducation),
        experienceJson: JSON.stringify([
          {
            role: "Software Development Intern",
            company: "Tech Solutions",
            location: "Remote",
            duration: "Jun 2025 – Aug 2025",
            bullets: [
              "Developed reusable React components and optimized API endpoints, reducing page load latency by 25%.",
              "Collaborated with cross-functional teams to build and deploy RESTful microservices.",
            ],
          },
        ]),
        projectsJson: JSON.stringify(initialProjects),
        certificationsJson: JSON.stringify([
          {
            name: "SkillForge Certified Software Engineer",
            issuer: "Code404 & SkillForge",
            issueDate: "2026",
            url: "",
          },
        ]),
        achievementsJson: JSON.stringify([
          {
            title: "Competitive Programming & Problem Solving",
            description: `Solved ${dsaSolvedCount > 0 ? dsaSolvedCount : "150+"} Data Structures & Algorithms problems across arrays, graphs, and dynamic programming.`,
          },
          {
            title: "Hackathon Finalist",
            description: "Ranked in top 5 teams out of 200+ participants for building full-stack AI-driven web utility.",
          },
        ]),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    return NextResponse.json({
      success: true,
      resume: resumeData,
      isUnlocked,
      milestones: {
        completedTopicsCount,
        dsaSolvedCount,
        requiredTopics: 1,
      },
    });
  } catch (error) {
    console.error("[GET /api/resume] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch resume data" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await req.json();

    const parsed = resumeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: parsed.error.issues.map((i) => i.message),
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Check if resume already exists for user
    const existing = await db.resume.findFirst({
      where: { userId },
    });

    let savedResume;
    if (existing) {
      savedResume = await db.resume.update({
        where: { id: existing.id },
        data: {
          ...data,
          phone: data.phone || "",
          location: data.location || "",
          headline: data.headline || "",
          summary: data.summary || "",
          githubUrl: data.githubUrl || "",
          linkedinUrl: data.linkedinUrl || "",
          portfolioUrl: data.portfolioUrl || "",
        },
      });
    } else {
      savedResume = await db.resume.create({
        data: {
          userId,
          ...data,
          phone: data.phone || "",
          location: data.location || "",
          headline: data.headline || "",
          summary: data.summary || "",
          githubUrl: data.githubUrl || "",
          linkedinUrl: data.linkedinUrl || "",
          portfolioUrl: data.portfolioUrl || "",
        },
      });
    }

    return NextResponse.json({
      success: true,
      resume: savedResume,
      message: "Resume saved successfully!",
    });
  } catch (error) {
    console.error("[POST /api/resume] Error saving resume:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save resume data" },
      { status: 500 }
    );
  }
}

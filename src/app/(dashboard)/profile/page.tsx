import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/dashboard/ProfileForm";

export default async function ProfilePage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const initialData = {
    name: user.name || "",
    college: user.profile?.college || null,
    degree: user.profile?.degree || null,
    branch: user.profile?.branch || null,
    gradYear: user.profile?.gradYear || null,
    careerGoal: user.profile?.careerGoal || null,
    skills: user.profile?.skills || null,
    githubUrl: user.profile?.githubUrl || null,
    linkedinUrl: user.profile?.linkedinUrl || null,
    portfolioUrl: user.profile?.portfolioUrl || null,
    bio: user.profile?.bio || null,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Profile Header */}
      <div className="border-b border-border-sharp pb-6">
        <span className="font-mono text-[9px] text-primary font-bold uppercase tracking-wider">
          Student Profile Management
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-text-main mt-1">
          CONFIGURE YOUR DETAILS
        </h1>
        <p className="font-sans text-xs text-text-dim mt-2 max-w-2xl leading-relaxed">
          Update your academic credentials, choose your career path tracks, and list your technical competencies. These details feed into the sitemap pipeline, guided project allocations, and verifiable resumes.
        </p>
      </div>

      {/* Profile Form */}
      <ProfileForm initialData={initialData} />
    </div>
  );
}

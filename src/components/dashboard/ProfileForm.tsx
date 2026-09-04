"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2, AlertTriangle, Save, Globe } from "lucide-react";

interface ProfileData {
  name: string;
  college: string | null;
  degree: string | null;
  branch: string | null;
  gradYear: number | null;
  careerGoal: string | null;
  skills: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  bio: string | null;
}

interface ProfileFormProps {
  initialData: ProfileData;
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initialData.name);
  const [college, setCollege] = useState(initialData.college || "");
  const [degree, setDegree] = useState(initialData.degree || "");
  const [branch, setBranch] = useState(initialData.branch || "");
  const [gradYear, setGradYear] = useState(initialData.gradYear ? String(initialData.gradYear) : "");
  const [careerGoal, setCareerGoal] = useState(initialData.careerGoal || "");
  const [skills, setSkills] = useState(initialData.skills || "");
  const [githubUrl, setGithubUrl] = useState(initialData.githubUrl || "");
  const [linkedinUrl, setLinkedinUrl] = useState(initialData.linkedinUrl || "");
  const [portfolioUrl, setPortfolioUrl] = useState(initialData.portfolioUrl || "");
  const [bio, setBio] = useState(initialData.bio || "");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const careerOptions = [
    "Software Engineer",
    "Full-Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Java Developer",
    "Python Developer",
    "C/C++ Developer",
    "AI/ML Engineer",
    "Data Scientist",
    "Data Analyst",
    "Cloud Engineer",
    "DevOps Engineer",
    "Cybersecurity Engineer",
    "Mobile Developer",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          college: college || null,
          degree: degree || null,
          branch: branch || null,
          gradYear: gradYear ? parseInt(gradYear, 10) : null,
          careerGoal: careerGoal || null,
          skills: skills || null,
          githubUrl: githubUrl || null,
          linkedinUrl: linkedinUrl || null,
          portfolioUrl: portfolioUrl || null,
          bio: bio || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update profile details");
      } else {
        setSuccess(true);
        router.refresh();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      setError("Connection error. Could not reach server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl font-sans">
      {/* Messages */}
      {error && (
        <div className="flex items-start gap-2.5 p-4 bg-red-950/20 border border-red-950/60 rounded-sm text-red-400 text-xs">
          <AlertTriangle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-2.5 p-4 bg-success/10 border border-success/40 rounded-sm text-success text-xs animate-fade-in">
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5" />
          <span>Profile configuration saved successfully. Your changes have been recorded in the database.</span>
        </div>
      )}

      {/* Section 1: Personal Details */}
      <div className="border border-border-sharp bg-bg-surface p-6 rounded-sm space-y-6">
        <h3 className="font-display text-sm font-semibold tracking-wider text-text-main uppercase border-b border-border-sharp/40 pb-3">
          PERSONAL CONFIGURATION
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-xs font-mono text-text-dim uppercase tracking-wider">
              Display Name *
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full bg-bg-base border border-border-sharp px-3 py-2 text-sm text-text-main rounded-sm focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="careerGoal" className="block text-xs font-mono text-text-dim uppercase tracking-wider">
              Target Career Goal
            </label>
            <select
              id="careerGoal"
              value={careerGoal}
              onChange={(e) => setCareerGoal(e.target.value)}
              className="block w-full bg-bg-base border border-border-sharp px-3 py-2 text-sm text-text-main rounded-sm focus:border-primary focus:outline-none transition-colors appearance-none cursor-pointer"
            >
              <option value="">Select Specialization Goal...</option>
              {careerOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="bio" className="block text-xs font-mono text-text-dim uppercase tracking-wider">
            Short Biography
          </label>
          <textarea
            id="bio"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about your background, career interests, or active research..."
            className="block w-full bg-bg-base border border-border-sharp px-3 py-2 text-sm text-text-main rounded-sm focus:border-primary focus:outline-none transition-colors placeholder:text-text-sub font-sans leading-relaxed resize-y"
          />
        </div>
      </div>

      {/* Section 2: Education Profile */}
      <div className="border border-border-sharp bg-bg-surface p-6 rounded-sm space-y-6">
        <h3 className="font-display text-sm font-semibold tracking-wider text-text-main uppercase border-b border-border-sharp/40 pb-3">
          ACADEMIC PROFILE
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label htmlFor="college" className="block text-xs font-mono text-text-dim uppercase tracking-wider">
              College / Institution
            </label>
            <input
              id="college"
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="e.g. JNNCE"
              className="block w-full bg-bg-base border border-border-sharp px-3 py-2 text-sm text-text-main rounded-sm focus:border-primary focus:outline-none transition-colors placeholder:text-text-sub"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="degree" className="block text-xs font-mono text-text-dim uppercase tracking-wider">
              Degree Programme
            </label>
            <input
              id="degree"
              type="text"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              placeholder="e.g. B.E / B.Tech"
              className="block w-full bg-bg-base border border-border-sharp px-3 py-2 text-sm text-text-main rounded-sm focus:border-primary focus:outline-none transition-colors placeholder:text-text-sub"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="branch" className="block text-xs font-mono text-text-dim uppercase tracking-wider">
              Branch / Specialization
            </label>
            <input
              id="branch"
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="e.g. Computer Science"
              className="block w-full bg-bg-base border border-border-sharp px-3 py-2 text-sm text-text-main rounded-sm focus:border-primary focus:outline-none transition-colors placeholder:text-text-sub"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="gradYear" className="block text-xs font-mono text-text-dim uppercase tracking-wider">
              Graduation Year
            </label>
            <input
              id="gradYear"
              type="number"
              min="1900"
              max="2100"
              value={gradYear}
              onChange={(e) => setGradYear(e.target.value)}
              placeholder="e.g. 2026"
              className="block w-full bg-bg-base border border-border-sharp px-3 py-2 text-sm text-text-main rounded-sm focus:border-primary focus:outline-none transition-colors placeholder:text-text-sub"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Technical Skills */}
      <div className="border border-border-sharp bg-bg-surface p-6 rounded-sm space-y-6">
        <h3 className="font-display text-sm font-semibold tracking-wider text-text-main uppercase border-b border-border-sharp/40 pb-3">
          SKILL ACQUISITIONS
        </h3>

        <div className="space-y-2">
          <label htmlFor="skills" className="block text-xs font-mono text-text-dim uppercase tracking-wider">
            Technical Skills (Comma separated)
          </label>
          <input
            id="skills"
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. React, Node.js, C++, Docker, git"
            className="block w-full bg-bg-base border border-border-sharp px-3 py-2 text-sm text-text-main rounded-sm focus:border-primary focus:outline-none transition-colors placeholder:text-text-sub"
          />
          <span className="text-[10px] text-text-sub font-mono tracking-wide">
            Note: Separate each technology with a comma. These will map to placement competency checks.
          </span>
        </div>
      </div>

      {/* Section 4: Web Hooks & Links */}
      <div className="border border-border-sharp bg-bg-surface p-6 rounded-sm space-y-6">
        <h3 className="font-display text-sm font-semibold tracking-wider text-text-main uppercase border-b border-border-sharp/40 pb-3">
          REPOSITORIES & CONNECTS
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label htmlFor="githubUrl" className="block text-xs font-mono text-text-dim uppercase tracking-wider flex items-center gap-1.5">
              <span className="text-xs font-semibold">GH</span>
              GitHub Link
            </label>
            <input
              id="githubUrl"
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/..."
              className="block w-full bg-bg-base border border-border-sharp px-3 py-2 text-sm text-text-main rounded-sm focus:border-primary focus:outline-none transition-colors placeholder:text-text-sub"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="linkedinUrl" className="block text-xs font-mono text-text-dim uppercase tracking-wider flex items-center gap-1.5">
              <span className="text-xs font-semibold">in</span>
              LinkedIn Link
            </label>
            <input
              id="linkedinUrl"
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className="block w-full bg-bg-base border border-border-sharp px-3 py-2 text-sm text-text-main rounded-sm focus:border-primary focus:outline-none transition-colors placeholder:text-text-sub"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="portfolioUrl" className="block text-xs font-mono text-text-dim uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              Portfolio Link
            </label>
            <input
              id="portfolioUrl"
              type="url"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              placeholder="https://myweb.com"
              className="block w-full bg-bg-base border border-border-sharp px-3 py-2 text-sm text-text-main rounded-sm focus:border-primary focus:outline-none transition-colors placeholder:text-text-sub"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center bg-primary hover:bg-primary-dim text-bg-base font-sans text-xs font-bold tracking-wide uppercase px-8 py-3.5 rounded-sm transition-colors duration-150 gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving Profile...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Configuration
            </>
          )}
        </button>
      </div>
    </form>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ResumeForm from "@/components/resume/ResumeForm";
import { ResumePreview, ResumeData } from "@/components/resume/ResumePreview";
import ResumeLockedView from "@/components/resume/ResumeLockedView";
import {
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit3,
  ArrowLeft,
} from "lucide-react";

export default function ResumeBuilderPage() {
  const { data: session, status: authStatus } = useSession();

  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [milestones, setMilestones] = useState({
    completedTopicsCount: 0,
    dsaSolvedCount: 0,
    requiredTopics: 1,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Mobile view mode toggle (editor vs preview)
  const [mobileMode, setMobileMode] = useState<"editor" | "preview">("editor");

  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    if (authStatus === "authenticated") {
      fetch("/api/resume")
        .then((res) => res.json())
        .then((json) => {
          if (!isMounted) return;
          if (json.success) {
            setIsUnlocked(!!json.isUnlocked);
            if (json.milestones) setMilestones(json.milestones);
            if (json.resume) {
              const r = json.resume;
              setResumeData({
                title: r.title || "My Technical Resume",
                templateId: r.templateId || "modern-ats",
                fullName: r.fullName || "",
                email: r.email || "",
                phone: r.phone || "",
                location: r.location || "",
                headline: r.headline || "",
                summary: r.summary || "",
                githubUrl: r.githubUrl || "",
                linkedinUrl: r.linkedinUrl || "",
                portfolioUrl: r.portfolioUrl || "",
                skills: r.skillsJson ? JSON.parse(r.skillsJson) : [],
                education: r.educationJson ? JSON.parse(r.educationJson) : [],
                experience: r.experienceJson ? JSON.parse(r.experienceJson) : [],
                projects: r.projectsJson ? JSON.parse(r.projectsJson) : [],
                certifications: r.certificationsJson ? JSON.parse(r.certificationsJson) : [],
                achievements: r.achievementsJson ? JSON.parse(r.achievementsJson) : [],
              });
            }
          } else {
            setError(json.error || "Failed to load resume");
          }
        })
        .catch((err: unknown) => {
          if (!isMounted) return;
          setError(err instanceof Error ? err.message : "Error loading resume");
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    } else if (authStatus === "unauthenticated") {
      Promise.resolve().then(() => {
        if (isMounted) setLoading(false);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [authStatus]);

  // Save handler
  const handleSave = async () => {
    if (!resumeData) return;
    setSaving(true);
    setSaveMessage(null);

    try {
      const payload = {
        title: resumeData.title,
        templateId: resumeData.templateId,
        fullName: resumeData.fullName,
        email: resumeData.email,
        phone: resumeData.phone || "",
        location: resumeData.location || "",
        headline: resumeData.headline || "",
        summary: resumeData.summary || "",
        githubUrl: resumeData.githubUrl || "",
        linkedinUrl: resumeData.linkedinUrl || "",
        portfolioUrl: resumeData.portfolioUrl || "",
        skillsJson: JSON.stringify(resumeData.skills || []),
        educationJson: JSON.stringify(resumeData.education || []),
        experienceJson: JSON.stringify(resumeData.experience || []),
        projectsJson: JSON.stringify(resumeData.projects || []),
        certificationsJson: JSON.stringify(resumeData.certifications || []),
        achievementsJson: JSON.stringify(resumeData.achievements || []),
      };

      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to save resume");
      }

      setSaveMessage("Resume saved successfully!");
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving resume";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  // Download PDF handler
  const handleDownloadPdf = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // 1. Loading state
  if (authStatus === "loading" || loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
          <p className="text-xs font-mono text-text-dim uppercase tracking-wider">
            Loading Placement Resume Builder...
          </p>
        </div>
      </div>
    );
  }

  // 2. Logged-out state
  if (!session?.user) {
    return <ResumeLockedView isLoggedIn={false} />;
  }

  // 3. Logged-in but locked milestone state
  if (!isUnlocked) {
    return <ResumeLockedView isLoggedIn={true} milestones={milestones} />;
  }

  // 4. Unlocked Resume Builder UI
  return (
    <div className="min-h-screen bg-bg-base py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header Breadcrumbs & Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-sharp pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-text-dim">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Dashboard
              </Link>
              <span>/</span>
              <span className="text-text-main font-semibold">Placement Resume Builder</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-display font-bold text-text-main flex items-center gap-2.5">
              <FileText className="w-6 h-6 text-primary" />
              SkillForge Resume Builder
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 font-medium">
                UNLOCKED
              </span>
            </h1>
          </div>

          {/* Status feedback & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {saveMessage && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-mono animate-fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{saveMessage}</span>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-950/60 border border-red-800/60 text-red-300 text-xs font-mono">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Mobile View Switcher */}
            <div className="inline-flex lg:hidden p-1 rounded-lg bg-bg-surface border border-border-sharp">
              <button
                onClick={() => setMobileMode("editor")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                  mobileMode === "editor"
                    ? "bg-primary text-bg-base font-semibold"
                    : "text-text-dim hover:text-text-main"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editor</span>
              </button>
              <button
                onClick={() => setMobileMode("preview")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                  mobileMode === "preview"
                    ? "bg-primary text-bg-base font-semibold"
                    : "text-text-dim hover:text-text-main"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Split Workspace */}
        {resumeData && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Editor Form */}
            <div
              className={`lg:col-span-6 space-y-6 ${
                mobileMode === "preview" ? "hidden lg:block" : "block"
              }`}
            >
              <ResumeForm
                data={resumeData}
                onChange={(newData) => setResumeData(newData)}
                onSave={handleSave}
                saving={saving}
                onDownloadPdf={handleDownloadPdf}
              />
            </div>

            {/* Right Column: Sticky Real-Time Live Preview */}
            <div
              className={`lg:col-span-6 lg:sticky lg:top-24 space-y-3 ${
                mobileMode === "editor" ? "hidden lg:block" : "block"
              }`}
            >
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-mono uppercase tracking-wider text-text-sub flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-primary" />
                  Live Placement Preview (A4 Page Fit)
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  {resumeData.templateId.toUpperCase()}
                </span>
              </div>

              {/* Preview Wrapper Container */}
              <div className="overflow-x-auto bg-zinc-900/60 border border-border-sharp/80 rounded-xl p-4 sm:p-6 flex justify-center shadow-2xl">
                <ResumePreview
                  ref={previewRef}
                  data={resumeData}
                  templateId={resumeData.templateId}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

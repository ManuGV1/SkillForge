"use client";

import React, { useState } from "react";
import {
  ResumeData,
  ProjectItem,
  ExperienceItem,
  EducationItem,
  CertificationItem,
  AchievementItem,
} from "./ResumePreview";
import {
  Sparkles,
  Plus,
  Trash2,
  Save,
  Download,
  Copy,
  Check,
  Loader2,
  User,
  Briefcase,
  FolderGit2,
  GraduationCap,
  Award,
  Wrench,
  FileText,
  Layout,
} from "lucide-react";

interface ResumeFormProps {
  data: ResumeData;
  onChange: (newData: ResumeData) => void;
  onSave: () => Promise<void>;
  saving: boolean;
  onDownloadPdf: () => void;
}

export default function ResumeForm({
  data,
  onChange,
  onSave,
  saving,
  onDownloadPdf,
}: ResumeFormProps) {
  const [activeTab, setActiveTab] = useState<
    "header" | "summary" | "skills" | "projects" | "experience" | "education" | "certifications"
  >("header");

  const [aiLoadingKey, setAiLoadingKey] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // Helper to call AI bullet/summary polisher
  const handleAiImprove = async (
    text: string,
    type: "bullet" | "summary" | "headline",
    key: string,
    onSuccess: (improved: string) => void
  ) => {
    if (!text || text.trim().length < 5) return;
    setAiLoadingKey(key);

    try {
      const res = await fetch("/api/resume/ai-improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, type }),
      });
      const json = await res.json();
      if (json.success && json.improvedText) {
        onSuccess(json.improvedText);
      }
    } catch (err) {
      console.error("AI improve error:", err);
    } finally {
      setAiLoadingKey(null);
    }
  };

  // Plaintext generator for copy
  const handleCopyRawAtsText = () => {
    let plain = `${data.fullName.toUpperCase()}\n`;
    if (data.headline) plain += `${data.headline}\n`;
    plain += `Email: ${data.email} | Phone: ${data.phone || "N/A"} | Location: ${data.location || "N/A"}\n`;
    if (data.githubUrl) plain += `GitHub: ${data.githubUrl} | `;
    if (data.linkedinUrl) plain += `LinkedIn: ${data.linkedinUrl} | `;
    if (data.portfolioUrl) plain += `Portfolio: ${data.portfolioUrl}\n`;
    plain += `\n----------------------------------------\n`;

    if (data.summary) {
      plain += `PROFESSIONAL SUMMARY\n${data.summary}\n\n`;
    }

    if (data.skills && data.skills.length > 0) {
      plain += `TECHNICAL SKILLS\n`;
      data.skills.forEach((s) => {
        plain += `• ${s.category}: ${s.items}\n`;
      });
      plain += `\n`;
    }

    if (data.projects && data.projects.length > 0) {
      plain += `KEY PROJECTS\n`;
      data.projects.forEach((p) => {
        plain += `• ${p.title} (${p.techStack || ""})\n`;
        if (p.description) plain += `  ${p.description}\n`;
        p.bullets?.forEach((b) => {
          plain += `  - ${b}\n`;
        });
      });
      plain += `\n`;
    }

    if (data.experience && data.experience.length > 0) {
      plain += `EXPERIENCE\n`;
      data.experience.forEach((e) => {
        plain += `• ${e.role} — ${e.company} (${e.duration || ""})\n`;
        e.bullets?.forEach((b) => {
          plain += `  - ${b}\n`;
        });
      });
      plain += `\n`;
    }

    if (data.education && data.education.length > 0) {
      plain += `EDUCATION\n`;
      data.education.forEach((edu) => {
        plain += `• ${edu.degree} in ${edu.branch || ""} — ${edu.institution} (${edu.gradYear || ""}) ${edu.score || ""}\n`;
      });
      plain += `\n`;
    }

    navigator.clipboard.writeText(plain);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  // Field updaters
  const updateField = <K extends keyof ResumeData>(field: K, value: ResumeData[K]) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar: Template Selector & Actions */}
      <div className="bg-bg-surface border border-border-sharp rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Layout className="w-4 h-4 text-primary shrink-0" />
          <span className="text-xs font-mono text-text-sub uppercase">Template:</span>
          <select
            value={data.templateId}
            onChange={(e) =>
              updateField("templateId", e.target.value as ResumeData["templateId"])
            }
            aria-label="Resume Template"
            className="bg-bg-base border border-border-sharp rounded px-3 py-1.5 text-xs font-sans font-medium text-text-main hover:border-primary/50 focus:border-primary focus:outline-none cursor-pointer"
          >
            <option value="modern-ats">Modern ATS (Forge Slate & Amber)</option>
            <option value="classic-ats">Classic Ivy / Harvard ATS (Black & White)</option>
            <option value="minimal-tech">Tech Minimalist (Monospace Badges)</option>
          </select>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyRawAtsText}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-sm bg-bg-base border border-border-sharp text-xs font-mono text-text-dim hover:text-text-main hover:border-border-sharp/80 transition-colors cursor-pointer"
            title="Copy plain-text ATS version"
          >
            {copiedText ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy ATS Text</span>
              </>
            )}
          </button>

          <button
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-bg-base border border-primary/40 text-primary hover:bg-primary/10 font-mono text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{saving ? "Saving..." : "Save Resume"}</span>
          </button>

          <button
            onClick={onDownloadPdf}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-primary text-bg-base hover:bg-primary-dim font-sans text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download A4 PDF</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs for Form Sections */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-border-sharp">
        {[
          { id: "header", label: "Contact & Header", icon: User },
          { id: "summary", label: "Summary", icon: FileText },
          { id: "skills", label: "Skills", icon: Wrench },
          { id: "projects", label: "Projects", icon: FolderGit2 },
          { id: "experience", label: "Experience", icon: Briefcase },
          { id: "education", label: "Education", icon: GraduationCap },
          { id: "certifications", label: "Honors & Certs", icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-md text-xs font-mono whitespace-nowrap transition-colors cursor-pointer border-b-2 ${
                isActive
                  ? "bg-bg-surface text-primary border-primary font-semibold"
                  : "text-text-dim border-transparent hover:text-text-main hover:bg-bg-surface/50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Header & Contact Info */}
      {activeTab === "header" && (
        <div className="bg-bg-surface border border-border-sharp rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-bold font-display text-text-main">
            Personal & Contact Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-text-dim mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={data.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                placeholder="e.g. Alex Sharma"
                className="w-full bg-bg-base border border-border-sharp rounded px-3 py-2 text-xs text-text-main focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-text-dim mb-1">
                Professional Headline *
              </label>
              <input
                type="text"
                value={data.headline || ""}
                onChange={(e) => updateField("headline", e.target.value)}
                placeholder="e.g. Full-Stack Software Engineer | React, Next.js, Node.js"
                className="w-full bg-bg-base border border-border-sharp rounded px-3 py-2 text-xs text-text-main focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-text-dim mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="e.g. alex.sharma@example.com"
                className="w-full bg-bg-base border border-border-sharp rounded px-3 py-2 text-xs text-text-main focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-text-dim mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={data.phone || ""}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="e.g. +91 9876543210"
                className="w-full bg-bg-base border border-border-sharp rounded px-3 py-2 text-xs text-text-main focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-text-dim mb-1">
                Location
              </label>
              <input
                type="text"
                value={data.location || ""}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="e.g. Bengaluru, India"
                className="w-full bg-bg-base border border-border-sharp rounded px-3 py-2 text-xs text-text-main focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-text-dim mb-1">
                GitHub Profile URL
              </label>
              <input
                type="text"
                value={data.githubUrl || ""}
                onChange={(e) => updateField("githubUrl", e.target.value)}
                placeholder="e.g. https://github.com/alexsharma"
                className="w-full bg-bg-base border border-border-sharp rounded px-3 py-2 text-xs text-text-main focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-text-dim mb-1">
                LinkedIn Profile URL
              </label>
              <input
                type="text"
                value={data.linkedinUrl || ""}
                onChange={(e) => updateField("linkedinUrl", e.target.value)}
                placeholder="e.g. https://linkedin.com/in/alexsharma"
                className="w-full bg-bg-base border border-border-sharp rounded px-3 py-2 text-xs text-text-main focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-text-dim mb-1">
                Portfolio / Personal Website URL
              </label>
              <input
                type="text"
                value={data.portfolioUrl || ""}
                onChange={(e) => updateField("portfolioUrl", e.target.value)}
                placeholder="e.g. https://alexsharma.dev"
                className="w-full bg-bg-base border border-border-sharp rounded px-3 py-2 text-xs text-text-main focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Professional Summary */}
      {activeTab === "summary" && (
        <div className="bg-bg-surface border border-border-sharp rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-display text-text-main">
              Professional Summary / Bio
            </h2>

            <button
              type="button"
              disabled={aiLoadingKey === "summary" || !data.summary}
              onClick={() =>
                handleAiImprove(
                  data.summary || "",
                  "summary",
                  "summary",
                  (improved) => updateField("summary", improved)
                )
              }
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/10 text-primary border border-amber-500/30 text-xs font-mono hover:bg-primary/20 transition-colors disabled:opacity-40 cursor-pointer"
            >
              {aiLoadingKey === "summary" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>Polish Summary with AI</span>
            </button>
          </div>

          <p className="text-xs text-text-dim leading-relaxed">
            Write a concise, 2-3 sentence overview highlighting your engineering focus, key competencies, and passion for building robust software.
          </p>

          <textarea
            rows={4}
            value={data.summary || ""}
            onChange={(e) => updateField("summary", e.target.value)}
            placeholder="e.g. Detail-oriented Full-Stack Software Engineer with expertise in TypeScript, React, Next.js, and distributed backend systems..."
            className="w-full bg-bg-base border border-border-sharp rounded p-3 text-xs text-text-main focus:border-primary focus:outline-none leading-relaxed"
          />
        </div>
      )}

      {/* Tab 3: Technical Skills */}
      {activeTab === "skills" && (
        <div className="bg-bg-surface border border-border-sharp rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold font-display text-text-main">
                Technical Skill Categories
              </h2>
              <p className="text-xs text-text-dim mt-0.5">
                Group skills cleanly for automated ATS keyword matching.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const updated = [
                  ...data.skills,
                  { category: "New Category", items: "Skill 1, Skill 2, Skill 3" },
                ];
                updateField("skills", updated);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-bg-base border border-border-sharp text-xs font-mono text-text-main hover:border-primary transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {data.skills.map((skillGroup, idx) => (
              <div
                key={idx}
                className="bg-bg-base/60 border border-border-sharp/80 rounded-lg p-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center"
              >
                <input
                  type="text"
                  value={skillGroup.category}
                  onChange={(e) => {
                    const next = [...data.skills];
                    next[idx].category = e.target.value;
                    updateField("skills", next);
                  }}
                  placeholder="Category Name"
                  className="w-full sm:w-1/3 bg-bg-base border border-border-sharp rounded px-2.5 py-1.5 text-xs font-semibold text-text-main focus:border-primary focus:outline-none"
                />

                <input
                  type="text"
                  value={skillGroup.items}
                  onChange={(e) => {
                    const next = [...data.skills];
                    next[idx].items = e.target.value;
                    updateField("skills", next);
                  }}
                  placeholder="Comma-separated items (e.g. React, Next.js, Node.js)"
                  className="w-full sm:w-2/3 bg-bg-base border border-border-sharp rounded px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => {
                    const next = data.skills.filter((_, i) => i !== idx);
                    updateField("skills", next);
                  }}
                  className="text-text-sub hover:text-red-400 transition-colors p-1"
                  title="Remove Category"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Projects */}
      {activeTab === "projects" && (
        <div className="bg-bg-surface border border-border-sharp rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold font-display text-text-main">
                Technical Projects
              </h2>
              <p className="text-xs text-text-dim mt-0.5">
                Showcase notable portfolio applications, full-stack systems, or open-source work.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const newProj: ProjectItem = {
                  title: "New Project",
                  techStack: "React, Node.js, PostgreSQL",
                  liveUrl: "",
                  githubUrl: "",
                  description: "Developed a responsive web application...",
                  bullets: [
                    "Architected full-stack modules with high test coverage.",
                    "Optimized database queries and API responses for low latency.",
                  ],
                };
                updateField("projects", [...data.projects, newProj]);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-bg-base border border-border-sharp text-xs font-mono text-text-main hover:border-primary transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Project</span>
            </button>
          </div>

          <div className="space-y-6 pt-2">
            {data.projects.map((proj, pIdx) => (
              <div
                key={pIdx}
                className="bg-bg-base/60 border border-border-sharp/80 rounded-xl p-4 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-border-sharp/60 pb-3">
                  <span className="font-mono text-xs text-primary font-semibold">
                    Project #{pIdx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = data.projects.filter((_, i) => i !== pIdx);
                      updateField("projects", next);
                    }}
                    className="text-text-sub hover:text-red-400 text-xs font-mono flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-text-dim mb-1">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => {
                        const next = [...data.projects];
                        next[pIdx].title = e.target.value;
                        updateField("projects", next);
                      }}
                      placeholder="e.g. SkillForge Learning Platform"
                      className="w-full bg-bg-base border border-border-sharp rounded px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-text-dim mb-1">
                      Tech Stack (Tags)
                    </label>
                    <input
                      type="text"
                      value={proj.techStack || ""}
                      onChange={(e) => {
                        const next = [...data.projects];
                        next[pIdx].techStack = e.target.value;
                        updateField("projects", next);
                      }}
                      placeholder="e.g. Next.js, TypeScript, Prisma, PostgreSQL"
                      className="w-full bg-bg-base border border-border-sharp rounded px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-text-dim mb-1">
                      Live URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={proj.liveUrl || ""}
                      onChange={(e) => {
                        const next = [...data.projects];
                        next[pIdx].liveUrl = e.target.value;
                        updateField("projects", next);
                      }}
                      placeholder="e.g. https://my-app.vercel.app"
                      className="w-full bg-bg-base border border-border-sharp rounded px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-text-dim mb-1">
                      GitHub Repository URL
                    </label>
                    <input
                      type="text"
                      value={proj.githubUrl || ""}
                      onChange={(e) => {
                        const next = [...data.projects];
                        next[pIdx].githubUrl = e.target.value;
                        updateField("projects", next);
                      }}
                      placeholder="e.g. https://github.com/username/project"
                      className="w-full bg-bg-base border border-border-sharp rounded px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-text-dim mb-1">
                    Brief Overview Description
                  </label>
                  <input
                    type="text"
                    value={proj.description || ""}
                    onChange={(e) => {
                      const next = [...data.projects];
                      next[pIdx].description = e.target.value;
                      updateField("projects", next);
                    }}
                    placeholder="Brief 1-line description of project scope and architecture"
                    className="w-full bg-bg-base border border-border-sharp rounded px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Bullet Points */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono text-text-dim">
                      Bullet Points (Impact & Engineering Achievements)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const next = [...data.projects];
                        next[pIdx].bullets = [
                          ...(next[pIdx].bullets || []),
                          "Engineered robust service integration reducing execution time.",
                        ];
                        updateField("projects", next);
                      }}
                      className="text-[10px] font-mono text-primary hover:underline"
                    >
                      + Add Bullet
                    </button>
                  </div>

                  {proj.bullets?.map((b, bIdx) => {
                    const aiKey = `proj-${pIdx}-b-${bIdx}`;
                    return (
                      <div key={bIdx} className="flex items-start gap-2">
                        <textarea
                          rows={2}
                          value={b}
                          onChange={(e) => {
                            const next = [...data.projects];
                            next[pIdx].bullets[bIdx] = e.target.value;
                            updateField("projects", next);
                          }}
                          className="w-full bg-bg-base border border-border-sharp rounded p-2 text-xs text-text-main focus:border-primary focus:outline-none leading-relaxed"
                        />

                        <button
                          type="button"
                          disabled={aiLoadingKey === aiKey}
                          onClick={() =>
                            handleAiImprove(b, "bullet", aiKey, (improved) => {
                              const next = [...data.projects];
                              next[pIdx].bullets[bIdx] = improved;
                              updateField("projects", next);
                            })
                          }
                          className="p-2 rounded bg-amber-500/10 text-primary border border-amber-500/30 hover:bg-primary/20 transition-colors shrink-0 disabled:opacity-40"
                          title="Polish Bullet with AI"
                        >
                          {aiLoadingKey === aiKey ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const next = [...data.projects];
                            next[pIdx].bullets = next[pIdx].bullets.filter(
                              (_, i) => i !== bIdx
                            );
                            updateField("projects", next);
                          }}
                          className="p-2 text-text-sub hover:text-red-400 transition-colors shrink-0"
                          title="Delete Bullet"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Experience */}
      {activeTab === "experience" && (
        <div className="bg-bg-surface border border-border-sharp rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold font-display text-text-main">
                Work Experience & Internships
              </h2>
              <p className="text-xs text-text-dim mt-0.5">
                Detail relevant software engineering roles, internships, or open-source fellowships.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const newExp: ExperienceItem = {
                  role: "Software Engineer Intern",
                  company: "Company Name",
                  location: "City, Country",
                  duration: "Month Year – Present",
                  bullets: [
                    "Engineered core backend APIs and reduced query response times by 30%.",
                  ],
                };
                updateField("experience", [...data.experience, newExp]);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-bg-base border border-border-sharp text-xs font-mono text-text-main hover:border-primary transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Experience</span>
            </button>
          </div>

          <div className="space-y-6 pt-2">
            {data.experience.map((exp, eIdx) => (
              <div
                key={eIdx}
                className="bg-bg-base/60 border border-border-sharp/80 rounded-xl p-4 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-border-sharp/60 pb-3">
                  <span className="font-mono text-xs text-primary font-semibold">
                    Position #{eIdx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = data.experience.filter((_, i) => i !== eIdx);
                      updateField("experience", next);
                    }}
                    className="text-text-sub hover:text-red-400 text-xs font-mono flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-text-dim mb-1">
                      Job Role / Title *
                    </label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => {
                        const next = [...data.experience];
                        next[eIdx].role = e.target.value;
                        updateField("experience", next);
                      }}
                      placeholder="e.g. Software Development Intern"
                      className="w-full bg-bg-base border border-border-sharp rounded px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-text-dim mb-1">
                      Company / Organization *
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const next = [...data.experience];
                        next[eIdx].company = e.target.value;
                        updateField("experience", next);
                      }}
                      placeholder="e.g. Google, Microsoft, Tech Corp"
                      className="w-full bg-bg-base border border-border-sharp rounded px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-text-dim mb-1">
                      Duration / Dates
                    </label>
                    <input
                      type="text"
                      value={exp.duration || ""}
                      onChange={(e) => {
                        const next = [...data.experience];
                        next[eIdx].duration = e.target.value;
                        updateField("experience", next);
                      }}
                      placeholder="e.g. May 2025 – Jul 2025"
                      className="w-full bg-bg-base border border-border-sharp rounded px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-text-dim mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={exp.location || ""}
                      onChange={(e) => {
                        const next = [...data.experience];
                        next[eIdx].location = e.target.value;
                        updateField("experience", next);
                      }}
                      placeholder="e.g. Bengaluru, India / Remote"
                      className="w-full bg-bg-base border border-border-sharp rounded px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                {/* Bullets */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono text-text-dim">
                      Bullet Points (Key Contributions & Metrics)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const next = [...data.experience];
                        next[eIdx].bullets = [
                          ...(next[eIdx].bullets || []),
                          "Collaborated with cross-functional engineering team on service performance.",
                        ];
                        updateField("experience", next);
                      }}
                      className="text-[10px] font-mono text-primary hover:underline"
                    >
                      + Add Bullet
                    </button>
                  </div>

                  {exp.bullets?.map((b, bIdx) => {
                    const aiKey = `exp-${eIdx}-b-${bIdx}`;
                    return (
                      <div key={bIdx} className="flex items-start gap-2">
                        <textarea
                          rows={2}
                          value={b}
                          onChange={(e) => {
                            const next = [...data.experience];
                            next[eIdx].bullets[bIdx] = e.target.value;
                            updateField("experience", next);
                          }}
                          className="w-full bg-bg-base border border-border-sharp rounded p-2 text-xs text-text-main focus:border-primary focus:outline-none leading-relaxed"
                        />

                        <button
                          type="button"
                          disabled={aiLoadingKey === aiKey}
                          onClick={() =>
                            handleAiImprove(b, "bullet", aiKey, (improved) => {
                              const next = [...data.experience];
                              next[eIdx].bullets[bIdx] = improved;
                              updateField("experience", next);
                            })
                          }
                          className="p-2 rounded bg-amber-500/10 text-primary border border-amber-500/30 hover:bg-primary/20 transition-colors shrink-0 disabled:opacity-40"
                          title="Polish Bullet with AI"
                        >
                          {aiLoadingKey === aiKey ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const next = [...data.experience];
                            next[eIdx].bullets = next[eIdx].bullets.filter(
                              (_, i) => i !== bIdx
                            );
                            updateField("experience", next);
                          }}
                          className="p-2 text-text-sub hover:text-red-400 transition-colors shrink-0"
                          title="Delete Bullet"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Education */}
      {activeTab === "education" && (
        <div className="bg-bg-surface border border-border-sharp rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-display text-text-main">
              Education
            </h2>

            <button
              type="button"
              onClick={() => {
                const newEdu: EducationItem = {
                  degree: "Bachelor of Technology",
                  institution: "University / Institute Name",
                  branch: "Computer Science & Engineering",
                  gradYear: "2026",
                  score: "CGPA: 8.5 / 10",
                };
                updateField("education", [...data.education, newEdu]);
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-bg-base border border-border-sharp text-xs font-mono text-text-main hover:border-primary transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Education</span>
            </button>
          </div>

          <div className="space-y-4 pt-2">
            {data.education.map((edu, idx) => (
              <div
                key={idx}
                className="bg-bg-base/60 border border-border-sharp/80 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-border-sharp/60 pb-2">
                  <span className="font-mono text-xs text-primary font-semibold">
                    Education Entry #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = data.education.filter((_, i) => i !== idx);
                      updateField("education", next);
                    }}
                    className="text-text-sub hover:text-red-400 text-xs font-mono flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-text-dim mb-1">
                      Degree / Program *
                    </label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const next = [...data.education];
                        next[idx].degree = e.target.value;
                        updateField("education", next);
                      }}
                      placeholder="e.g. Bachelor of Technology"
                      className="w-full bg-bg-base border border-border-sharp rounded px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-text-dim mb-1">
                      Major / Branch
                    </label>
                    <input
                      type="text"
                      value={edu.branch || ""}
                      onChange={(e) => {
                        const next = [...data.education];
                        next[idx].branch = e.target.value;
                        updateField("education", next);
                      }}
                      placeholder="e.g. Computer Science & Engineering"
                      className="w-full bg-bg-base border border-border-sharp rounded px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-text-dim mb-1">
                      College / Institution *
                    </label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const next = [...data.education];
                        next[idx].institution = e.target.value;
                        updateField("education", next);
                      }}
                      placeholder="e.g. National Institute of Technology"
                      className="w-full bg-bg-base border border-border-sharp rounded px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-mono text-text-dim mb-1">
                        Year / Dates
                      </label>
                      <input
                        type="text"
                        value={edu.gradYear || ""}
                        onChange={(e) => {
                          const next = [...data.education];
                          next[idx].gradYear = e.target.value;
                          updateField("education", next);
                        }}
                        placeholder="e.g. 2022 – 2026"
                        className="w-full bg-bg-base border border-border-sharp rounded px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-text-dim mb-1">
                        CGPA / Score
                      </label>
                      <input
                        type="text"
                        value={edu.score || ""}
                        onChange={(e) => {
                          const next = [...data.education];
                          next[idx].score = e.target.value;
                          updateField("education", next);
                        }}
                        placeholder="e.g. 8.9 / 10"
                        className="w-full bg-bg-base border border-border-sharp rounded px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: Certifications & Achievements */}
      {activeTab === "certifications" && (
        <div className="bg-bg-surface border border-border-sharp rounded-xl p-6 space-y-6">
          {/* Certifications Sub-Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold font-display text-text-main">
                Certifications & Credentials
              </h2>
              <button
                type="button"
                onClick={() => {
                  const newCert: CertificationItem = {
                    name: "Certification Name",
                    issuer: "Issuing Organization",
                    issueDate: "2026",
                    url: "",
                  };
                  updateField("certifications", [...data.certifications, newCert]);
                }}
                className="text-xs font-mono text-primary hover:underline"
              >
                + Add Certification
              </button>
            </div>

            <div className="space-y-3">
              {data.certifications.map((c, idx) => (
                <div
                  key={idx}
                  className="bg-bg-base/60 border border-border-sharp/80 rounded-lg p-3 flex flex-col sm:flex-row gap-2.5 items-start sm:items-center"
                >
                  <input
                    type="text"
                    value={c.name}
                    onChange={(e) => {
                      const next = [...data.certifications];
                      next[idx].name = e.target.value;
                      updateField("certifications", next);
                    }}
                    placeholder="Certificate Title"
                    className="w-full sm:w-1/2 bg-bg-base border border-border-sharp rounded px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-none"
                  />
                  <input
                    type="text"
                    value={c.issuer}
                    onChange={(e) => {
                      const next = [...data.certifications];
                      next[idx].issuer = e.target.value;
                      updateField("certifications", next);
                    }}
                    placeholder="Issuer (e.g. AWS, Meta, Code404)"
                    className="w-full sm:w-1/3 bg-bg-base border border-border-sharp rounded px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-none"
                  />
                  <input
                    type="text"
                    value={c.issueDate || ""}
                    onChange={(e) => {
                      const next = [...data.certifications];
                      next[idx].issueDate = e.target.value;
                      updateField("certifications", next);
                    }}
                    placeholder="Year"
                    className="w-full sm:w-20 bg-bg-base border border-border-sharp rounded px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const next = data.certifications.filter((_, i) => i !== idx);
                      updateField("certifications", next);
                    }}
                    className="text-text-sub hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements Sub-Section */}
          <div className="space-y-4 pt-4 border-t border-border-sharp/60">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold font-display text-text-main">
                Key Achievements & Coding Profiles
              </h2>
              <button
                type="button"
                onClick={() => {
                  const newAch: AchievementItem = {
                    title: "Achievement Title",
                    description: "Details on rankings, contest ratings, or recognitions.",
                  };
                  updateField("achievements", [...data.achievements, newAch]);
                }}
                className="text-xs font-mono text-primary hover:underline"
              >
                + Add Achievement
              </button>
            </div>

            <div className="space-y-3">
              {data.achievements.map((ach, idx) => (
                <div
                  key={idx}
                  className="bg-bg-base/60 border border-border-sharp/80 rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={ach.title}
                      onChange={(e) => {
                        const next = [...data.achievements];
                        next[idx].title = e.target.value;
                        updateField("achievements", next);
                      }}
                      placeholder="Title (e.g. LeetCode Knight / 300+ Problems)"
                      className="w-full bg-bg-base border border-border-sharp rounded px-2.5 py-1.5 text-xs font-semibold text-text-main focus:border-primary focus:outline-none mr-2"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const next = data.achievements.filter((_, i) => i !== idx);
                        updateField("achievements", next);
                      }}
                      className="text-text-sub hover:text-red-400 p-1 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={ach.description}
                    onChange={(e) => {
                      const next = [...data.achievements];
                      next[idx].description = e.target.value;
                      updateField("achievements", next);
                    }}
                    placeholder="Short description / link"
                    className="w-full bg-bg-base border border-border-sharp rounded px-2.5 py-1.5 text-xs text-text-main focus:border-primary focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

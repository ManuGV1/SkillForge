"use client";

import React, { forwardRef } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  ExternalLink,
} from "lucide-react";

function GithubIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  );
}

export interface SkillCategory {
  category: string;
  items: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  branch?: string;
  gradYear?: string;
  score?: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  location?: string;
  duration?: string;
  bullets: string[];
}

export interface ProjectItem {
  title: string;
  techStack?: string;
  liveUrl?: string;
  githubUrl?: string;
  description?: string;
  bullets: string[];
}

export interface CertificationItem {
  name: string;
  issuer: string;
  issueDate?: string;
  url?: string;
}

export interface AchievementItem {
  title: string;
  description: string;
}

export interface ResumeData {
  title: string;
  templateId: "modern-ats" | "classic-ats" | "minimal-tech";
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  headline?: string;
  summary?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  skills: SkillCategory[];
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
}

interface ResumePreviewProps {
  data: ResumeData;
  templateId?: "modern-ats" | "classic-ats" | "minimal-tech";
}

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ data, templateId = data.templateId || "modern-ats" }, ref) => {
    // Format links safely
    const formatUrl = (url?: string) => {
      if (!url) return "";
      return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
    };

    // =========================================================================
    // TEMPLATE 1: MODERN ATS (Forge Slate & Amber Accent - High Clarity)
    // =========================================================================
    if (templateId === "modern-ats") {
      return (
        <div
          ref={ref}
          id="resume-print-area"
          className="resume-sheet bg-white text-zinc-900 shadow-2xl rounded-sm w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-12 mx-auto font-sans leading-relaxed text-[13px] print:shadow-none print:p-0 print:m-0 print:w-full print:max-w-none print:text-black"
          style={{ boxSizing: "border-box" }}
        >
          {/* Header */}
          <header className="border-b-2 border-amber-500/80 pb-4 mb-5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 uppercase font-sans">
              {data.fullName || "Your Full Name"}
            </h1>
            {data.headline && (
              <p className="text-sm font-semibold text-amber-700 mt-0.5 tracking-wide">
                {data.headline}
              </p>
            )}

            {/* Contact Row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-zinc-600 mt-2.5">
              {data.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{data.email}</span>
                </div>
              )}
              {data.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{data.phone}</span>
                </div>
              )}
              {data.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{data.location}</span>
                </div>
              )}
              {data.githubUrl && (
                <div className="flex items-center gap-1.5">
                  <GithubIcon className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{formatUrl(data.githubUrl)}</span>
                </div>
              )}
              {data.linkedinUrl && (
                <div className="flex items-center gap-1.5">
                  <LinkedinIcon className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{formatUrl(data.linkedinUrl)}</span>
                </div>
              )}
              {data.portfolioUrl && (
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{formatUrl(data.portfolioUrl)}</span>
                </div>
              )}
            </div>
          </header>

          {/* Summary */}
          {data.summary && (
            <section className="mb-5 break-inside-avoid">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1 mb-2 font-mono">
                Professional Summary
              </h2>
              <p className="text-zinc-700 leading-normal text-justify">
                {data.summary}
              </p>
            </section>
          )}

          {/* Technical Skills */}
          {data.skills && data.skills.length > 0 && (
            <section className="mb-5 break-inside-avoid">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1 mb-2 font-mono">
                Technical Skills
              </h2>
              <div className="space-y-1 text-xs">
                {data.skills.map((s, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:gap-2">
                    <span className="font-semibold text-zinc-900 sm:min-w-[160px]">
                      {s.category}:
                    </span>
                    <span className="text-zinc-700">{s.items}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <section className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1 mb-2.5 font-mono">
                Key Technical Projects
              </h2>
              <div className="space-y-3.5">
                {data.projects.map((proj, idx) => (
                  <div key={idx} className="break-inside-avoid">
                    <div className="flex flex-wrap items-baseline justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-zinc-950 text-[13.5px]">
                          {proj.title}
                        </h3>
                        {proj.techStack && (
                          <span className="text-[11px] font-mono text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                            {proj.techStack}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono">
                        {proj.liveUrl && (
                          <span className="flex items-center gap-0.5 text-zinc-700">
                            Live Demo <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        )}
                        {proj.githubUrl && (
                          <span className="flex items-center gap-0.5 text-zinc-700">
                            Code <GithubIcon className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                    </div>
                    {proj.description && (
                      <p className="text-zinc-700 text-xs mt-1 mb-1">
                        {proj.description}
                      </p>
                    )}
                    {proj.bullets && proj.bullets.length > 0 && (
                      <ul className="list-disc list-outside ml-4 space-y-1 text-zinc-700 text-xs mt-1">
                        {proj.bullets.map((b, bIdx) => (
                          <li key={bIdx}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <section className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1 mb-2.5 font-mono">
                Experience & Internships
              </h2>
              <div className="space-y-3.5">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="break-inside-avoid">
                    <div className="flex flex-wrap items-baseline justify-between">
                      <div>
                        <h3 className="font-bold text-zinc-950 text-[13.5px]">
                          {exp.role}
                        </h3>
                        <span className="text-xs font-semibold text-zinc-800">
                          {exp.company}
                          {exp.location ? ` — ${exp.location}` : ""}
                        </span>
                      </div>
                      {exp.duration && (
                        <span className="text-[11px] font-mono text-zinc-500">
                          {exp.duration}
                        </span>
                      )}
                    </div>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="list-disc list-outside ml-4 space-y-1 text-zinc-700 text-xs mt-1.5">
                        {exp.bullets.map((b, bIdx) => (
                          <li key={bIdx}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section className="mb-5 break-inside-avoid">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1 mb-2 font-mono">
                Education
              </h2>
              <div className="space-y-2">
                {data.education.map((edu, idx) => (
                  <div key={idx} className="flex flex-wrap justify-between items-baseline">
                    <div>
                      <h3 className="font-bold text-zinc-950 text-xs">
                        {edu.degree} {edu.branch ? `in ${edu.branch}` : ""}
                      </h3>
                      <p className="text-xs text-zinc-700">
                        {edu.institution}
                        {edu.score ? ` • ${edu.score}` : ""}
                      </p>
                    </div>
                    {edu.gradYear && (
                      <span className="text-[11px] font-mono text-zinc-500">
                        {edu.gradYear}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications & Achievements Grid */}
          {(data.certifications.length > 0 || data.achievements.length > 0) && (
            <section className="break-inside-avoid">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.certifications.length > 0 && (
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1 mb-2 font-mono">
                      Certifications
                    </h2>
                    <ul className="space-y-1.5 text-xs text-zinc-700">
                      {data.certifications.map((c, idx) => (
                        <li key={idx}>
                          <span className="font-semibold text-zinc-900">{c.name}</span>
                          <span className="text-zinc-500 block text-[11px]">
                            {c.issuer} {c.issueDate ? `(${c.issueDate})` : ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {data.achievements.length > 0 && (
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-200 pb-1 mb-2 font-mono">
                      Key Achievements
                    </h2>
                    <ul className="space-y-1.5 text-xs text-zinc-700">
                      {data.achievements.map((ach, idx) => (
                        <li key={idx}>
                          <span className="font-semibold text-zinc-900">{ach.title}</span>
                          <p className="text-zinc-600 text-[11px] leading-tight mt-0.5">
                            {ach.description}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      );
    }

    // =========================================================================
    // TEMPLATE 2: CLASSIC IVY / HARVARD ATS (Maximum Parser Compatibility)
    // =========================================================================
    if (templateId === "classic-ats") {
      return (
        <div
          ref={ref}
          id="resume-print-area"
          className="resume-sheet bg-white text-black shadow-2xl rounded-sm w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-12 mx-auto font-serif leading-normal text-[13px] print:shadow-none print:p-0 print:m-0 print:w-full print:max-w-none"
          style={{ boxSizing: "border-box" }}
        >
          {/* Header */}
          <header className="text-center border-b border-black pb-3 mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-normal uppercase">
              {data.fullName || "Your Full Name"}
            </h1>
            {data.headline && (
              <p className="text-xs italic text-zinc-800 mt-0.5">
                {data.headline}
              </p>
            )}

            <div className="flex flex-wrap justify-center items-center gap-x-2 text-xs text-zinc-800 mt-1.5 font-sans">
              {data.location && <span>{data.location} |</span>}
              {data.phone && <span>{data.phone} |</span>}
              {data.email && <span>{data.email}</span>}
              {data.linkedinUrl && <span>| {formatUrl(data.linkedinUrl)}</span>}
              {data.githubUrl && <span>| {formatUrl(data.githubUrl)}</span>}
            </div>
          </header>

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section className="mb-4 break-inside-avoid">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2 font-sans">
                Education
              </h2>
              <div className="space-y-2">
                {data.education.map((edu, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold">{edu.institution}</span>
                      <span className="text-xs font-sans">{edu.gradYear}</span>
                    </div>
                    <div className="flex justify-between items-baseline text-xs italic text-zinc-800">
                      <span>{edu.degree} {edu.branch ? `in ${edu.branch}` : ""}</span>
                      {edu.score && <span className="font-sans not-italic">{edu.score}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <section className="mb-4 break-inside-avoid">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2 font-sans">
                Technical Skills
              </h2>
              <div className="space-y-1 text-xs">
                {data.skills.map((s, idx) => (
                  <div key={idx}>
                    <strong className="font-bold">{s.category}: </strong>
                    <span className="text-zinc-900 font-sans">{s.items}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <section className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2 font-sans">
                Projects
              </h2>
              <div className="space-y-3">
                {data.projects.map((proj, idx) => (
                  <div key={idx} className="break-inside-avoid">
                    <div className="flex justify-between items-baseline">
                      <div>
                        <span className="font-bold">{proj.title}</span>
                        {proj.techStack && (
                          <span className="text-xs italic text-zinc-700 ml-1.5 font-sans">
                            | {proj.techStack}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-sans text-zinc-600">
                        {formatUrl(proj.liveUrl || proj.githubUrl)}
                      </span>
                    </div>
                    {proj.bullets && proj.bullets.length > 0 && (
                      <ul className="list-disc list-outside ml-4 space-y-1 text-xs mt-1">
                        {proj.bullets.map((b, bIdx) => (
                          <li key={bIdx}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <section className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2 font-sans">
                Work Experience
              </h2>
              <div className="space-y-3">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="break-inside-avoid">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold">{exp.role} — {exp.company}</span>
                      <span className="text-xs font-sans text-zinc-700">{exp.duration}</span>
                    </div>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="list-disc list-outside ml-4 space-y-1 text-xs mt-1">
                        {exp.bullets.map((b, bIdx) => (
                          <li key={bIdx}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications & Achievements */}
          {(data.certifications.length > 0 || data.achievements.length > 0) && (
            <section className="break-inside-avoid">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2 font-sans">
                Honors & Certifications
              </h2>
              <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
                {data.certifications.map((c, idx) => (
                  <li key={`c-${idx}`}>
                    <strong>{c.name}</strong> — {c.issuer} {c.issueDate ? `(${c.issueDate})` : ""}
                  </li>
                ))}
                {data.achievements.map((ach, idx) => (
                  <li key={`a-${idx}`}>
                    <strong>{ach.title}</strong>: {ach.description}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      );
    }

    // =========================================================================
    // TEMPLATE 3: TECH MINIMALIST (Monospace Badges & Clean Tech Architecture)
    // =========================================================================
    return (
      <div
        ref={ref}
        id="resume-print-area"
        className="resume-sheet bg-white text-zinc-900 shadow-2xl rounded-sm w-full max-w-[210mm] min-h-[297mm] p-8 sm:p-12 mx-auto font-sans leading-relaxed text-[12.5px] print:shadow-none print:p-0 print:m-0 print:w-full print:max-w-none"
        style={{ boxSizing: "border-box" }}
      >
        {/* Header */}
        <header className="border-l-4 border-zinc-900 pl-4 py-1 mb-5">
          <h1 className="text-2xl font-bold font-mono tracking-tight text-zinc-950">
            {data.fullName || "Your Full Name"}
          </h1>
          <p className="text-xs font-mono font-medium text-emerald-800 mt-0.5">
            {">"} {data.headline || "Software Development Engineer"}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-mono text-zinc-600 mt-2">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>• {data.phone}</span>}
            {data.location && <span>• {data.location}</span>}
            {data.githubUrl && <span>• gh/{formatUrl(data.githubUrl)}</span>}
            {data.linkedinUrl && <span>• in/{formatUrl(data.linkedinUrl)}</span>}
          </div>
        </header>

        {/* Technical Skills */}
        {data.skills && data.skills.length > 0 && (
          <section className="mb-4 break-inside-avoid">
            <h2 className="text-[11px] font-bold uppercase font-mono tracking-wider bg-zinc-100 text-zinc-900 px-2 py-0.5 rounded-sm mb-2 inline-block">
              {"// 01. TECHNICAL_STACK"}
            </h2>
            <div className="space-y-1.5 text-xs">
              {data.skills.map((s, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:gap-2">
                  <span className="font-mono font-semibold text-zinc-900 sm:min-w-[170px] text-[11.5px]">
                    [{s.category}]
                  </span>
                  <span className="text-zinc-700">{s.items}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section className="mb-4">
            <h2 className="text-[11px] font-bold uppercase font-mono tracking-wider bg-zinc-100 text-zinc-900 px-2 py-0.5 rounded-sm mb-2.5 inline-block">
              {"// 02. FEATURED_PROJECTS"}
            </h2>
            <div className="space-y-3">
              {data.projects.map((proj, idx) => (
                <div key={idx} className="break-inside-avoid border-l border-zinc-200 pl-3">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-zinc-950 font-mono text-xs">
                      {proj.title}
                    </h3>
                    {proj.techStack && (
                      <span className="text-[10px] font-mono text-zinc-500">
                        [{proj.techStack}]
                      </span>
                    )}
                  </div>
                  {proj.description && (
                    <p className="text-zinc-700 text-xs mt-0.5">{proj.description}</p>
                  )}
                  {proj.bullets && proj.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-4 space-y-1 text-zinc-700 text-xs mt-1">
                      {proj.bullets.map((b, bIdx) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section className="mb-4">
            <h2 className="text-[11px] font-bold uppercase font-mono tracking-wider bg-zinc-100 text-zinc-900 px-2 py-0.5 rounded-sm mb-2.5 inline-block">
              {"// 03. EXPERIENCE"}
            </h2>
            <div className="space-y-3">
              {data.experience.map((exp, idx) => (
                <div key={idx} className="break-inside-avoid border-l border-zinc-200 pl-3">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="font-bold text-zinc-900 text-xs">{exp.role}</span>
                      <span className="text-zinc-600 text-xs"> @ {exp.company}</span>
                    </div>
                    <span className="text-[10.5px] font-mono text-zinc-500">{exp.duration}</span>
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-4 space-y-1 text-zinc-700 text-xs mt-1">
                      {exp.bullets.map((b, bIdx) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <section className="mb-4 break-inside-avoid">
            <h2 className="text-[11px] font-bold uppercase font-mono tracking-wider bg-zinc-100 text-zinc-900 px-2 py-0.5 rounded-sm mb-2 inline-block">
              {"// 04. EDUCATION"}
            </h2>
            <div className="space-y-2">
              {data.education.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-baseline text-xs">
                  <div>
                    <span className="font-bold text-zinc-900">{edu.degree}</span>
                    {edu.branch ? ` (${edu.branch})` : ""}
                    <div className="text-zinc-600 text-[11.5px]">{edu.institution} {edu.score ? `• ${edu.score}` : ""}</div>
                  </div>
                  <span className="font-mono text-[11px] text-zinc-500">{edu.gradYear}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications & Achievements */}
        {(data.certifications.length > 0 || data.achievements.length > 0) && (
          <section className="break-inside-avoid">
            <h2 className="text-[11px] font-bold uppercase font-mono tracking-wider bg-zinc-100 text-zinc-900 px-2 py-0.5 rounded-sm mb-2 inline-block">
              {"// 05. CERTIFICATIONS_AND_ACHIEVEMENTS"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {data.certifications.map((c, idx) => (
                <div key={`c-${idx}`} className="border border-zinc-200 rounded p-2">
                  <div className="font-bold text-zinc-900">{c.name}</div>
                  <div className="text-zinc-500 text-[11px]">{c.issuer}</div>
                </div>
              ))}
              {data.achievements.map((ach, idx) => (
                <div key={`a-${idx}`} className="border border-zinc-200 rounded p-2">
                  <div className="font-bold text-zinc-900">{ach.title}</div>
                  <div className="text-zinc-600 text-[11px] mt-0.5">{ach.description}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }
);

ResumePreview.displayName = "ResumePreview";

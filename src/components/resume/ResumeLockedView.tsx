"use client";

import React from "react";
import Link from "next/link";
import {
  Lock,
  Sparkles,
  Map,
  Code,
  FileText,
  CheckCircle2,
  ArrowRight,
  Award,
  Download,
  Zap,
} from "lucide-react";

interface ResumeLockedViewProps {
  isLoggedIn: boolean;
  milestones?: {
    completedTopicsCount: number;
    dsaSolvedCount: number;
    requiredTopics: number;
  };
}

export default function ResumeLockedView({
  isLoggedIn,
  milestones = { completedTopicsCount: 0, dsaSolvedCount: 0, requiredTopics: 1 },
}: ResumeLockedViewProps) {
  const { completedTopicsCount, dsaSolvedCount } = milestones;

  return (
    <div className="min-h-screen bg-bg-base py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/60 text-primary text-xs font-mono font-medium">
            <Lock className="w-3.5 h-3.5" />
            PLACEMENT RESUME BUILDER
          </div>

          <h1 className="text-3xl sm:text-4xl font-display font-bold text-text-main tracking-tight">
            {isLoggedIn ? "Complete Core Milestone to Unlock" : "Engineered for Tech Placements"}
          </h1>

          <p className="text-sm text-text-dim max-w-2xl mx-auto leading-relaxed">
            {isLoggedIn
              ? "SkillForge validates your engineering foundations before unlocking placement tools. Complete your first roadmap topic or solve a DSA problem to build your ATS-ready resume."
              : "Build high-impact, ATS-optimized technical resumes with automated profile synchronization, AI bullet point polishing, and export-grade A4 PDF rendering."}
          </p>
        </div>

        {/* Milestone Card (If Logged In) */}
        {isLoggedIn && (
          <div className="bg-bg-surface border border-border-sharp rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-sharp pb-6">
              <div className="space-y-1">
                <span className="text-xs font-mono text-text-sub uppercase tracking-wider">
                  Required Unlocking Milestone
                </span>
                <h2 className="text-lg font-display font-bold text-text-main flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Foundational Practice Milestone
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-950/60 border border-amber-800/60 text-amber-300 font-mono text-xs">
                <span>Progress:</span>
                <strong>{completedTopicsCount + dsaSolvedCount > 0 ? "1 / 1" : "0 / 1"} Goal</strong>
              </div>
            </div>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-bg-base/60 border border-border-sharp/80 rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded bg-amber-500/10 text-primary border border-amber-500/20">
                      <Map className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-text-main">
                        Complete 1 Roadmap Topic
                      </h3>
                      <p className="text-[11px] text-text-dim mt-0.5">
                        {completedTopicsCount} topics completed so far
                      </p>
                    </div>
                  </div>
                  {completedTopicsCount >= 1 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded">
                      Incomplete
                    </span>
                  )}
                </div>
                <Link
                  href="/roadmap"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-sm bg-primary text-bg-base font-sans text-xs font-semibold uppercase tracking-wider hover:bg-primary-dim transition-colors"
                >
                  Explore Roadmap
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="bg-bg-base/60 border border-border-sharp/80 rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <Code className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-text-main">
                        Solve 1 DSA Problem
                      </h3>
                      <p className="text-[11px] text-text-dim mt-0.5">
                        {dsaSolvedCount} problems solved so far
                      </p>
                    </div>
                  </div>
                  {dsaSolvedCount >= 1 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <span className="text-[10px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded">
                      Incomplete
                    </span>
                  )}
                </div>
                <Link
                  href="/dsa"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-sm bg-bg-base border border-border-sharp text-text-main hover:border-primary font-sans text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Solve DSA Problem
                  <ArrowRight className="w-3.5 h-3.5 text-primary" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Logged Out CTA Card */}
        {!isLoggedIn && (
          <div className="bg-bg-surface border border-border-sharp rounded-xl p-8 text-center space-y-6 shadow-xl">
            <div className="w-14 h-14 rounded-full bg-amber-950/60 border border-amber-800/60 text-primary flex items-center justify-center mx-auto">
              <FileText className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-display font-bold text-text-main">
                Sign In to Start Building Your Placement Resume
              </h2>
              <p className="text-xs text-text-dim max-w-md mx-auto leading-relaxed">
                Connect your account to automatically sync your profile details, projects, skills, and coding achievements into ATS-proven templates.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/login"
                className="px-6 py-2.5 rounded-sm bg-primary text-bg-base font-sans text-xs font-semibold uppercase tracking-wider hover:bg-primary-dim transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-6 py-2.5 rounded-sm border border-border-sharp text-text-main hover:border-primary font-sans text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        )}

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-bg-surface/80 border border-border-sharp rounded-xl p-5 space-y-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-primary w-fit border border-amber-500/20">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-text-main">3 ATS-Optimized Templates</h3>
            <p className="text-xs text-text-dim leading-relaxed">
              Designed specifically for engineering placements: Modern Forge, Harvard Classic ATS, and Minimalist Monospace.
            </p>
          </div>

          <div className="bg-bg-surface/80 border border-border-sharp rounded-xl p-5 space-y-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 w-fit border border-emerald-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-text-main">AI Bullet Point Polishing</h3>
            <p className="text-xs text-text-dim leading-relaxed">
              Instantly strengthen action verbs and impact without hallucinating fake technologies or numbers.
            </p>
          </div>

          <div className="bg-bg-surface/80 border border-border-sharp rounded-xl p-5 space-y-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 w-fit border border-blue-500/20">
              <Download className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-text-main">Export-Grade A4 PDF</h3>
            <p className="text-xs text-text-dim leading-relaxed">
              Crisp vectors, exact 210x297mm dimensions, zero clipping, and clean multi-page pagination support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

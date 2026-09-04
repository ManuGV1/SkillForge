"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Cpu,
  Layers,
  Code,
  Database,
  Shield,
  ArrowRight,
  Loader2,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

const specializations = [
  {
    key: "Software Engineer",
    icon: Cpu,
    description:
      "Focus on memory management, fundamental algorithms, complex data structures, and computer science systems.",
    tools: ["C++", "Java", "DSA", "System Design"],
  },
  {
    key: "Full-Stack Developer",
    icon: Layers,
    description:
      "Build scalable web architectures, transactional databases, client-side hydration, and dynamic components.",
    tools: ["TypeScript", "Next.js", "PostgreSQL", "Tailwind"],
  },
  {
    key: "AI/ML Engineer",
    icon: Code,
    description:
      "Develop deep neural networks, process raw tensors, refine weights, and manage data training pipelines.",
    tools: ["Python", "PyTorch", "NumPy", "Scikit-Learn"],
  },
  {
    key: "Data Scientist",
    icon: Database,
    description:
      "Analyze complex datasets, build statistical models, perform exploratory data analysis, and derive actionable insights.",
    tools: ["Python", "SQL", "Pandas", "Matplotlib"],
  },
  {
    key: "DevOps & Cloud",
    icon: Database,
    description:
      "Automate container orchestration, manage continuous delivery pipelines, and architect high-availability servers.",
    tools: ["Docker", "Kubernetes", "AWS", "GitHub Actions"],
  },
  {
    key: "Cybersecurity Analyst",
    icon: Shield,
    description:
      "Inspect buffer overflows, enforce authentication encryption, audit security layers, and defend networks.",
    tools: ["Linux", "Wireshark", "Cryptography", "Python"],
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!selected) return;
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/onboarding/specialization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ specialization: selected }),
      });

      if (!res.ok) {
        throw new Error("Failed to save specialization");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-start py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background subtle radial */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.04),transparent_50%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="font-mono text-[10px] text-primary font-bold uppercase tracking-widest">
            STEP 1 OF 1 — CHOOSE YOUR PATH
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-text-main uppercase">
            Choose Your Specialization
          </h1>
          <p className="font-sans text-sm text-text-dim max-w-xl mx-auto">
            Select the engineering track that matches your career goal. This
            determines your personalized roadmap, topics, and learning pipeline.
            You can change it later from your profile.
          </p>
        </div>

        {/* Career path cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {specializations.map((spec) => {
            const Icon = spec.icon;
            const isSelected = selected === spec.key;

            return (
              <button
                key={spec.key}
                onClick={() => setSelected(spec.key)}
                className={`text-left bg-bg-surface border p-6 rounded-sm flex flex-col justify-between space-y-6 transition-all duration-200 focus:outline-none cursor-pointer ${
                  isSelected
                    ? "border-primary ring-1 ring-primary/30 bg-primary/5"
                    : "border-border-sharp hover:border-text-sub"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex items-center justify-center h-10 w-10 border rounded-sm transition-colors ${
                        isSelected
                          ? "bg-primary/10 border-primary/40"
                          : "bg-bg-base border-border-sharp"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          isSelected ? "text-primary" : "text-primary"
                        }`}
                      />
                    </div>
                    <div
                      className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-border-sharp bg-transparent"
                      }`}
                    >
                      {isSelected && (
                        <div className="h-1.5 w-1.5 rounded-full bg-bg-base" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display text-base font-bold text-text-main">
                      {spec.key}
                    </h3>
                    <p className="font-sans text-xs text-text-dim leading-relaxed">
                      {spec.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border-sharp/40 flex flex-wrap gap-1.5">
                  {spec.tools.map((tool) => (
                    <span
                      key={tool}
                      className={`font-mono text-[9px] px-2 py-0.5 border rounded-sm transition-colors ${
                        isSelected
                          ? "text-primary border-primary/30 bg-primary/5"
                          : "text-text-sub bg-bg-base border-border-sharp"
                      }`}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2.5 p-3.5 bg-red-950/20 border border-red-950/60 rounded-sm text-red-400 text-xs font-sans">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Selected confirmation bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border border-border-sharp bg-bg-surface p-5 rounded-sm">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
            {selected ? (
              <p className="font-sans text-sm text-text-main">
                Selected:{" "}
                <span className="font-semibold text-primary">{selected}</span>
              </p>
            ) : (
              <p className="font-sans text-sm text-text-sub">
                No specialization selected yet
              </p>
            )}
          </div>

          <button
            onClick={handleConfirm}
            disabled={!selected || loading}
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dim disabled:opacity-40 disabled:cursor-not-allowed text-bg-base font-sans text-xs font-bold uppercase tracking-wide px-6 py-3 rounded-sm transition-colors focus:outline-none cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Begin My Journey
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

        {/* Skip hint */}
        <p className="text-center font-sans text-xs text-text-sub">
          You can update your specialization anytime from{" "}
          <a
            href="/profile"
            className="text-primary hover:text-primary-dim transition-colors"
          >
            your profile <ChevronRight className="inline h-3 w-3" />
          </a>
        </p>
      </div>
    </div>
  );
}

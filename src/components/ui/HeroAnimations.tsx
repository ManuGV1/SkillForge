"use client";

import React, { useEffect, useState } from "react";

// ─── Reduced-motion hook ──────────────────────────────────────────────────────
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

// ─── Animated Headline ────────────────────────────────────────────────────────
// Reveals headline word-by-word with staggered CSS animation
interface AnimatedHeadlineProps {
  line1?: string;
  line2?: string;
}

export function AnimatedHeadline({
  line1 = "Think. Build.",
  line2 = "Forge Your Future.",
}: AnimatedHeadlineProps) {
  const reduced = useReducedMotion();

  const words1 = line1.split(" ");
  const words2 = line2.split(" ");

  // Gradient classes applied per-word to avoid opacity vs bg-clip-text
  // compositing bug (opacity on a child inside bg-clip-text creates a
  // stacking context where transparent text hides the gradient).
  const gradientClasses =
    "text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-primary to-orange-500";

  if (reduced) {
    return (
      <>
        {line1}{" "}
        <br className="hidden sm:inline" />
        <span className={gradientClasses}>{line2}</span>
      </>
    );
  }

  return (
    <>
      {words1.map((word, i) => (
        <span
          key={`l1-${word}-${i}`}
          className="inline-block animate-word-reveal"
          style={{ animationDelay: `${i * 140}ms` }}
        >
          {word}
          {i < words1.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
      <br className="hidden sm:inline" />
      {words2.map((word, i) => (
        <span
          key={`l2-${word}-${i}`}
          className={`inline-block animate-word-reveal ${gradientClasses}`}
          style={{ animationDelay: `${(words1.length + i) * 140}ms` }}
        >
          {word}
          {i < words2.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </>
  );
}

// ─── Subtle Rotating Tagline ─────────────────────────────────────────────────
const DEFAULT_TAGLINES = [
  "Think. Build. Forge Your Future.",
  "Learn. Practice. Get Hired.",
  "Code. Create. Conquer.",
  "Engineered for Technical Excellence.",
];

export function RotatingTagline({
  taglines = DEFAULT_TAGLINES,
  interval = 3600,
}: {
  taglines?: string[];
  interval?: number;
}) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % taglines.length);
        setFade(true);
      }, 350);
    }, interval);

    return () => clearInterval(timer);
  }, [reduced, taglines.length, interval]);

  return (
    <div className="h-6 flex items-center justify-center overflow-hidden">
      <span
        className="inline-flex items-center gap-1.5 font-mono text-[11px] sm:text-xs text-amber-300/90 font-medium tracking-widest uppercase transition-all duration-300 ease-out"
        style={{
          opacity: reduced || fade ? 1 : 0,
          transform:
            reduced || fade ? "translateY(0)" : "translateY(-6px)",
        }}
      >
        <span className="text-primary text-[10px]">✦</span> {taglines[index]}
      </span>
    </div>
  );
}

// ─── Animated Supporting Pitch ────────────────────────────────────────────────
export function AnimatedPitch({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <p
      className="font-sans text-sm sm:text-base md:text-lg text-slate-200/90 max-w-2xl mx-auto leading-relaxed drop-shadow-md animate-word-reveal"
      style={{
        animationDelay: reduced ? "0ms" : "600ms",
      }}
    >
      {children}
    </p>
  );
}

// ─── Animated CTA Buttons wrapper ─────────────────────────────────────────────
export function AnimatedCTA({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <div
      className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full sm:w-auto animate-word-reveal"
      style={{
        animationDelay: reduced ? "0ms" : "750ms",
      }}
    >
      {children}
    </div>
  );
}

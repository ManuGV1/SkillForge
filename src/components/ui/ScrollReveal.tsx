"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // ms delay for staggered effect
  as?: keyof React.JSX.IntrinsicElements;
  threshold?: number;
}

/**
 * ScrollReveal: Staggered fade-up reveal on scroll for lower sections.
 * Automatically respects prefers-reduced-motion.
 */
export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
  threshold = 0.1,
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    // Check prefers-reduced-motion
    if (typeof window !== "undefined" && window.matchMedia) {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mq.matches) {
        setReduced(true);
        setVisible(true);
        return;
      }
    }

    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (delay > 0) {
              setTimeout(() => setVisible(true), delay);
            } else {
              setVisible(true);
            }
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px", // Trigger slightly before it reaches the viewport bottom
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, threshold]);

  const style: React.CSSProperties = reduced
    ? {}
    : {
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)`,
        willChange: visible ? "auto" : "opacity, transform",
      };

  const El = Tag as React.ElementType;
  return (
    <El ref={ref} className={className} style={style}>
      {children}
    </El>
  );
}

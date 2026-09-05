"use client";

import { useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function TrackerContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedRef = useRef<{ url: string; time: number } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !pathname) return;

    // Avoid tracking internal static or API endpoints directly
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api") ||
      pathname.includes("/favicon.ico")
    ) {
      return;
    }

    // Build the clean relative path
    const queryString = searchParams ? searchParams.toString() : "";
    const fullPath = queryString ? `${pathname}?${queryString}` : pathname;

    // Deduplicate within 2000ms for identical path (handles React StrictMode and rapid re-renders)
    const now = Date.now();
    if (
      lastTrackedRef.current &&
      lastTrackedRef.current.url === fullPath &&
      now - lastTrackedRef.current.time < 2000
    ) {
      return;
    }

    lastTrackedRef.current = { url: fullPath, time: now };

    // Get or create anonymous visitor ID (privacy-friendly random UUID)
    let visitorId = "";
    try {
      visitorId = localStorage.getItem("sf_vid") || "";
      if (!visitorId || visitorId.length < 10) {
        visitorId =
          typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : "sf_v_" + Math.random().toString(36).substring(2, 15) + "_" + Date.now().toString(36);
        localStorage.setItem("sf_vid", visitorId);
      }
    } catch {
      // Fallback if localStorage is restricted
      visitorId = "sf_anon_" + Math.random().toString(36).substring(2, 15);
    }

    const payload = JSON.stringify({
      path: fullPath,
      visitorId,
      referrer: document.referrer || null,
    });

    try {
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        const queued = navigator.sendBeacon("/api/analytics/track", blob);
        if (!queued) {
          fetch("/api/analytics/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: payload,
            keepalive: true,
          }).catch(() => {});
        }
      } else {
        fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Non-blocking fallback
    }
  }, [pathname, searchParams]);

  return null;
}

export default function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <TrackerContent />
    </Suspense>
  );
}

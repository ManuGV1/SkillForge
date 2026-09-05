import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";

const trackPayloadSchema = z.object({
  path: z.string().min(1).max(500),
  visitorId: z.string().min(1).max(100),
  referrer: z.string().max(500).nullable().optional(),
});

function parseUserAgent(ua: string | null): {
  deviceType: string;
  browser: string;
  os: string;
} {
  if (!ua) {
    return { deviceType: "Desktop", browser: "Other", os: "Other" };
  }

  const lower = ua.toLowerCase();

  // Device detection
  let deviceType = "Desktop";
  if (/bot|crawler|spider|slurp|facebookexternalhit|bingbot|googlebot/i.test(lower)) {
    deviceType = "Bot";
  } else if (/ipad|tablet|(android(?!.*mobile))/i.test(lower)) {
    deviceType = "Tablet";
  } else if (/mobile|iphone|ipod|android.*mobile|windows phone|blackberry/i.test(lower)) {
    deviceType = "Mobile";
  }

  // Browser detection
  let browser = "Other";
  if (lower.includes("edg/")) {
    browser = "Edge";
  } else if (lower.includes("chrome") && !lower.includes("edg/")) {
    browser = "Chrome";
  } else if (lower.includes("firefox")) {
    browser = "Firefox";
  } else if (lower.includes("safari") && !lower.includes("chrome")) {
    browser = "Safari";
  } else if (lower.includes("opr/") || lower.includes("opera")) {
    browser = "Opera";
  }

  // OS detection
  let os = "Other";
  if (lower.includes("windows")) {
    os = "Windows";
  } else if (lower.includes("macintosh") || lower.includes("mac os x")) {
    os = "macOS";
  } else if (lower.includes("iphone") || lower.includes("ipad") || lower.includes("ios")) {
    os = "iOS";
  } else if (lower.includes("android")) {
    os = "Android";
  } else if (lower.includes("linux")) {
    os = "Linux";
  } else if (lower.includes("cros")) {
    os = "ChromeOS";
  }

  return { deviceType, browser, os };
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.json();
    const parsed = trackPayloadSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid tracking payload" },
        { status: 400 }
      );
    }

    const { path, visitorId, referrer } = parsed.data;

    // Optional user session identification
    let userId: string | null = null;
    try {
      const session = await auth();
      if (session?.user?.id) {
        userId = session.user.id;
      }
    } catch {
      // Proceed without user ID if session check errors
    }

    const userAgent = req.headers.get("user-agent");
    const { deviceType, browser, os } = parseUserAgent(userAgent);

    // Save page visit record asynchronously
    await db.pageVisit.create({
      data: {
        path,
        visitorId,
        referrer: referrer || null,
        deviceType,
        browser,
        os,
        userId,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/analytics/track] Error recording visit:", error);
    return NextResponse.json(
      { success: false, error: "Failed to track visit" },
      { status: 500 }
    );
  }
}

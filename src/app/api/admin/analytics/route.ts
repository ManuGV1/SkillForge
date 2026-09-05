import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const currentRole = session.user.role?.toUpperCase();
    if (currentRole !== "ADMIN" && currentRole !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden. Administrator access required." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "30d"; // 'today', '7d', '30d', 'all'

    const now = new Date();

    // Standard fixed date thresholds
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Selected range date threshold
    let filterStartDate: Date;
    if (range === "today") {
      filterStartDate = startOfToday;
    } else if (range === "7d") {
      filterStartDate = startOfWeek;
    } else if (range === "30d") {
      filterStartDate = startOfMonth;
    } else {
      filterStartDate = new Date(0); // All time
    }

    const whereRange = {
      createdAt: {
        gte: filterStartDate,
      },
    };

    // Parallel fetch of metrics
    const [
      totalVisits,
      memberVisits,
      anonymousVisits,
      uniqueVisitorsGroup,
      todayVisits,
      weekVisits,
      monthVisits,
      topPagesGroup,
      deviceGroup,
      browserGroup,
      osGroup,
      recentVisits,
      visitsForTimeline,
    ] = await Promise.all([
      // 1. Total visits in selected range
      db.pageVisit.count({ where: whereRange }),

      // 2. Member visits in selected range
      db.pageVisit.count({
        where: {
          ...whereRange,
          userId: { not: null },
        },
      }),

      // 3. Anonymous visits in selected range
      db.pageVisit.count({
        where: {
          ...whereRange,
          userId: null,
        },
      }),

      // 4. Unique visitors in selected range
      db.pageVisit.groupBy({
        by: ["visitorId"],
        where: whereRange,
      }),

      // 5. Today visits
      db.pageVisit.count({
        where: { createdAt: { gte: startOfToday } },
      }),

      // 6. Week visits
      db.pageVisit.count({
        where: { createdAt: { gte: startOfWeek } },
      }),

      // 7. Month visits
      db.pageVisit.count({
        where: { createdAt: { gte: startOfMonth } },
      }),

      // 8. Top visited pages in range
      db.pageVisit.groupBy({
        by: ["path"],
        where: whereRange,
        _count: {
          path: true,
        },
        orderBy: {
          _count: {
            path: "desc",
          },
        },
        take: 10,
      }),

      // 9. Device distribution
      db.pageVisit.groupBy({
        by: ["deviceType"],
        where: whereRange,
        _count: {
          deviceType: true,
        },
        orderBy: {
          _count: {
            deviceType: "desc",
          },
        },
      }),

      // 10. Browser distribution
      db.pageVisit.groupBy({
        by: ["browser"],
        where: whereRange,
        _count: {
          browser: true,
        },
        orderBy: {
          _count: {
            browser: "desc",
          },
        },
      }),

      // 11. OS distribution
      db.pageVisit.groupBy({
        by: ["os"],
        where: whereRange,
        _count: {
          os: true,
        },
        orderBy: {
          _count: {
            os: "desc",
          },
        },
      }),

      // 12. Recent visit activity
      db.pageVisit.findMany({
        take: 30,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      }),

      // 13. Timeline data (visits in range for chart)
      db.pageVisit.findMany({
        where: whereRange,
        select: {
          createdAt: true,
          userId: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),
    ]);

    // Build timeline aggregated daily buckets
    const timelineMap = new Map<
      string,
      { date: string; label: string; total: number; members: number; anonymous: number }
    >();

    // Prepare date buckets for selected range
    const daysCount = range === "today" ? 1 : range === "7d" ? 7 : range === "30d" ? 30 : 30;
    for (let i = daysCount - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      timelineMap.set(key, { date: key, label, total: 0, members: 0, anonymous: 0 });
    }

    for (const v of visitsForTimeline) {
      const key = v.createdAt.toISOString().slice(0, 10);
      const entry = timelineMap.get(key);
      if (entry) {
        entry.total += 1;
        if (v.userId) {
          entry.members += 1;
        } else {
          entry.anonymous += 1;
        }
      } else if (range === "all") {
        const label = v.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        timelineMap.set(key, {
          date: key,
          label,
          total: 1,
          members: v.userId ? 1 : 0,
          anonymous: v.userId ? 0 : 1,
        });
      }
    }

    const timeline = Array.from(timelineMap.values());

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalVisits,
          uniqueVisitors: uniqueVisitorsGroup.length,
          memberVisits,
          anonymousVisits,
          todayVisits,
          weekVisits,
          monthVisits,
        },
        timeline,
        topPages: topPagesGroup.map((item) => ({
          path: item.path,
          count: item._count.path,
        })),
        deviceStats: deviceGroup.map((item) => ({
          name: item.deviceType || "Unknown",
          count: item._count.deviceType,
        })),
        browserStats: browserGroup.map((item) => ({
          name: item.browser || "Other",
          count: item._count.browser,
        })),
        osStats: osGroup.map((item) => ({
          name: item.os || "Other",
          count: item._count.os,
        })),
        recentVisits,
      },
    });
  } catch (error) {
    console.error("[GET /api/admin/analytics] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load visitor analytics." },
      { status: 500 }
    );
  }
}

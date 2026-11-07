import "dotenv/config";
import { db } from "../src/lib/db";

async function runTest() {
  console.log("=== Testing Privacy-Conscious Visitor Analytics Database Operations ===");

  // 1. Fetch a user to simulate member visit
  const testUser = await db.user.findFirst();
  console.log("Sample test member user found:", testUser ? `${testUser.name} (${testUser.email})` : "None");

  const testVisitorId = "sf_test_visitor_" + Date.now();

  // 2. Insert Anonymous Visit
  const anonVisit = await db.pageVisit.create({
    data: {
      visitorId: testVisitorId,
      path: "/roadmap",
      referrer: "https://google.com",
      deviceType: "Desktop",
      browser: "Chrome",
      os: "Windows",
      userId: null,
    },
  });
  console.log("✔ Anonymous PageVisit recorded:", anonVisit.id, "Path:", anonVisit.path);

  // 3. Insert Second Anonymous Visit from same visitor on different page
  const anonVisit2 = await db.pageVisit.create({
    data: {
      visitorId: testVisitorId,
      path: "/dsa",
      referrer: null,
      deviceType: "Desktop",
      browser: "Chrome",
      os: "Windows",
      userId: null,
    },
  });
  console.log("✔ Second visit from same visitorId recorded:", anonVisit2.id, "Path:", anonVisit2.path);

  // 4. Insert Member Visit (if testUser exists)
  if (testUser) {
    const memberVisit = await db.pageVisit.create({
      data: {
        visitorId: "sf_member_vid_" + Date.now(),
        path: "/dashboard",
        referrer: null,
        deviceType: "Mobile",
        browser: "Safari",
        os: "iOS",
        userId: testUser.id,
      },
    });
    console.log("✔ Member PageVisit recorded:", memberVisit.id, "Linked User ID:", memberVisit.userId);
  }

  // 5. Test Analytics Aggregations
  const totalCount = await db.pageVisit.count();
  const memberCount = await db.pageVisit.count({ where: { userId: { not: null } } });
  const anonCount = await db.pageVisit.count({ where: { userId: null } });

  const uniqueVisitors = await db.pageVisit.groupBy({
    by: ["visitorId"],
  });

  const topPages = await db.pageVisit.groupBy({
    by: ["path"],
    _count: { path: true },
    orderBy: { _count: { path: "desc" } },
    take: 5,
  });

  console.log("\n=== Aggregation Results ===");
  console.log(`Total Visits: ${totalCount}`);
  console.log(`Unique Visitors: ${uniqueVisitors.length}`);
  console.log(`Member Visits: ${memberCount}`);
  console.log(`Anonymous Visits: ${anonCount}`);
  console.log("Top Pages:", topPages.map((p) => `${p.path} (${p._count.path} visits)`));

  // 6. Test Fetch with User Relation
  const recent = await db.pageVisit.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  console.log("\n=== Recent Visit Records ===");
  recent.forEach((r, idx) => {
    console.log(
      `${idx + 1}. [${r.createdAt.toISOString()}] Path: ${r.path} | Device: ${r.deviceType}/${r.browser}/${r.os} | Member: ${
        r.user ? r.user.email : "Anonymous (" + r.visitorId.slice(0, 10) + "...)"
      }`
    );
  });

  console.log("\n✔ All Visitor Analytics tests passed successfully!");
}

runTest()
  .catch((err) => {
    console.error("Test failed with error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

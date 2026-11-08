import "dotenv/config";
import fs from "fs";
import path from "path";

async function runNavbarRoleTests() {
  console.log("==========================================================");
  console.log("TEST SUITE: SkillForge Navbar Role-Based Architecture");
  console.log("==========================================================");

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, name: string, detail?: string) {
    total++;
    if (condition) {
      console.log(`  ✓ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${name} ${detail ? `(${detail})` : ""}`);
    }
  }

  const navbarPath = path.join(process.cwd(), "src/components/layout/Navbar.tsx");
  const content = fs.readFileSync(navbarPath, "utf8");

  // TEST 1: Role check logic
  console.log("\n[TEST 1] Verifying Role Detection Logic");
  assert(
    content.includes('role === "ADMIN" || role === "SUPER_ADMIN"'),
    "Navbar correctly identifies both ADMIN and SUPER_ADMIN roles"
  );

  // TEST 2: Admin Navigation Links Structure
  console.log("\n[TEST 2] Verifying Admin Navigation Link Sequence & Paths");
  const adminDesktopNavIndex = content.indexOf("isAdmin ? (");
  assert(adminDesktopNavIndex !== -1, "isAdmin branch exists in desktop nav");

  // Extract the isAdmin branch slice
  const studentBranchIndex = content.indexOf(": (", adminDesktopNavIndex);
  const adminDesktopSection = content.substring(adminDesktopNavIndex, studentBranchIndex);

  assert(
    adminDesktopSection.includes('href="/admin"') && adminDesktopSection.includes("Dashboard"),
    "Admin nav contains Dashboard immediately after logo linking to /admin"
  );
  assert(
    adminDesktopSection.includes('href="/admin/placement"') && adminDesktopSection.includes("Placement"),
    "Admin nav contains Placement linking to /admin/placement"
  );
  assert(
    adminDesktopSection.includes('href="/resume"') && adminDesktopSection.includes("Resume Analyzer"),
    "Admin nav contains Resume Analyzer linking to /resume"
  );
  assert(
    adminDesktopSection.includes("handleOpenAiTutor") && adminDesktopSection.includes("AI Tutor"),
    "Admin nav contains AI Tutor action trigger"
  );
  assert(
    adminDesktopSection.includes('href="/admin/analytics"') && adminDesktopSection.includes("Analytics"),
    "Admin nav contains Analytics linking to /admin/analytics"
  );
  assert(
    adminDesktopSection.includes('href="/admin/support"') && adminDesktopSection.includes("Admin Support"),
    "Admin nav contains Admin Support linking to /admin/support"
  );
  assert(
    adminDesktopSection.includes('href="/profile"') && adminDesktopSection.includes("Profile"),
    "Admin nav contains Profile linking to /profile"
  );

  // Verify Roadmap and DSA are strictly excluded from admin navigation
  assert(
    !adminDesktopSection.includes('href="/roadmap"') && !adminDesktopSection.includes("Roadmap"),
    "Roadmap is completely removed from admin navigation"
  );
  assert(
    !adminDesktopSection.includes('href="/dsa"') && !adminDesktopSection.includes("DSA Sandbox"),
    "DSA Sandbox is completely removed from admin navigation"
  );

  // TEST 3: Student Navigation Unchanged
  console.log("\n[TEST 3] Verifying Student Navigation is Preserved Unchanged");
  const studentDesktopSection = content.substring(studentBranchIndex, content.indexOf("</nav>"));

  assert(
    studentDesktopSection.includes('href="/dashboard"') && studentDesktopSection.includes("Dashboard"),
    "Student nav preserves Dashboard linking to /dashboard"
  );
  assert(
    studentDesktopSection.includes('href="/roadmap"') && studentDesktopSection.includes("Roadmap"),
    "Student nav preserves Roadmap"
  );
  assert(
    studentDesktopSection.includes('href="/dsa"') && studentDesktopSection.includes("DSA Sandbox"),
    "Student nav preserves DSA Sandbox"
  );
  assert(
    studentDesktopSection.includes('href="/placement"') && studentDesktopSection.includes("Placement"),
    "Student nav preserves Placement linking to student prep /placement"
  );
  assert(
    studentDesktopSection.includes('href="/resume"') && studentDesktopSection.includes("Resume"),
    "Student nav preserves Resume"
  );
  assert(
    studentDesktopSection.includes('href="/profile"') && studentDesktopSection.includes("Profile"),
    "Student nav preserves Profile"
  );
  assert(
    !studentDesktopSection.includes("/admin/analytics") && !studentDesktopSection.includes("/admin/support"),
    "Student nav does not contain admin analytics or support"
  );

  // TEST 4: Mobile Drawer Parity for Admin
  console.log("\n[TEST 4] Verifying Mobile Drawer Parity");
  const mobileAdminIndex = content.lastIndexOf("isAdmin ? (");
  const mobileStudentIndex = content.lastIndexOf(": (");
  const mobileAdminSection = content.substring(mobileAdminIndex, mobileStudentIndex);

  assert(
    mobileAdminSection.includes('href="/admin"') && mobileAdminSection.includes('href="/admin/placement"'),
    "Mobile drawer provides Dashboard (/admin) and Placement (/admin/placement) for admins"
  );
  assert(
    mobileAdminSection.includes("Resume Analyzer") && mobileAdminSection.includes("Admin Support"),
    "Mobile drawer includes Resume Analyzer and Admin Support for admins"
  );
  assert(
    !mobileAdminSection.includes('href="/roadmap"') && !mobileAdminSection.includes('href="/dsa"'),
    "Mobile drawer excludes Roadmap and DSA Sandbox for admins"
  );

  console.log("\n==========================================================");
  console.log(`TEST SUMMARY: ${passed} / ${total} assertions passed`);
  console.log("==========================================================");

  if (passed !== total) {
    process.exit(1);
  }
}

runNavbarRoleTests().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});

import "dotenv/config";
import { db } from "../src/lib/db";
import { sendSupportNotificationEmail } from "../src/lib/email";

async function testSupportFlow() {
  console.log("=== Starting Code404 Support System Verification ===");

  const testPayload = {
    name: "Automated Test Student",
    email: "test.student@example.com",
    subject: "Verification Test: Course Access & Support System",
    message: "This is an automated end-to-end verification message testing the database persistence, admin dashboard retrieval, and email notification workflow for Code404 Support.",
  };

  // Step 1: Create support ticket in Database
  console.log("1. Saving support request to database...");
  const createdTicket = await db.supportRequest.create({
    data: {
      name: testPayload.name,
      email: testPayload.email,
      subject: testPayload.subject,
      message: testPayload.message,
      status: "OPEN",
    },
  });

  console.log(`✓ Support ticket saved successfully with ID: ${createdTicket.id}`);
  console.log(`  Created At: ${createdTicket.createdAt.toISOString()}`);
  console.log(`  Initial Status: ${createdTicket.status}`);

  // Step 2: Trigger Support Email Notification (Target: support.code404@gmail.com)
  console.log("\n2. Triggering support email notification dispatch...");
  const emailResult = await sendSupportNotificationEmail({
    ticketId: createdTicket.id,
    name: createdTicket.name,
    email: createdTicket.email,
    subject: createdTicket.subject,
    message: createdTicket.message,
    createdAt: createdTicket.createdAt,
  });
  console.log(`✓ Email helper dispatch result:`, emailResult);

  // Step 3: Simulate Admin Portal View & Retrieval
  console.log("\n3. Querying admin view data (fetching submitted tickets)...");
  const adminFetchedTickets = await db.supportRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const foundTicket = adminFetchedTickets.find((t) => t.id === createdTicket.id);
  if (!foundTicket) {
    throw new Error("Admin query failed: Ticket not found in database!");
  }
  console.log(`✓ Admin view successfully retrieved submitted ticket #${foundTicket.id.slice(0, 8)}`);

  // Step 4: Admin Status Update Simulation (OPEN -> IN_PROGRESS -> RESOLVED)
  console.log("\n4. Simulating Admin status update (OPEN -> IN_PROGRESS)...");
  const updatedTicket = await db.supportRequest.update({
    where: { id: createdTicket.id },
    data: { status: "IN_PROGRESS" },
  });
  console.log(`✓ Updated status: ${updatedTicket.status}`);

  console.log("\n5. Simulating Admin resolution (IN_PROGRESS -> RESOLVED)...");
  const resolvedTicket = await db.supportRequest.update({
    where: { id: createdTicket.id },
    data: { status: "RESOLVED" },
  });
  console.log(`✓ Resolved status: ${resolvedTicket.status}`);

  console.log("\n=== Complete End-to-End Support System Verification PASSED ===");
}

testSupportFlow()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Verification failed:", err);
    process.exit(1);
  });

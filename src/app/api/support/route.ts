import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { sendSupportNotificationEmail } from "@/lib/email";

const supportRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters long"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();

    const parsed = supportRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: parsed.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = parsed.data;

    // Create database entry in support_requests table
    const supportTicket = await db.supportRequest.create({
      data: {
        name,
        email,
        subject,
        message,
        status: "OPEN",
        userId: session?.user?.id || null,
      },
    });

    // Send email notification to support.code404@gmail.com
    await sendSupportNotificationEmail({
      ticketId: supportTicket.id,
      name: supportTicket.name,
      email: supportTicket.email,
      subject: supportTicket.subject,
      message: supportTicket.message,
      createdAt: supportTicket.createdAt,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Support request submitted successfully",
        data: {
          id: supportTicket.id,
          createdAt: supportTicket.createdAt,
          status: supportTicket.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/support] Error handling support request:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit support request. Please try again later.",
      },
      { status: 500 }
    );
  }
}

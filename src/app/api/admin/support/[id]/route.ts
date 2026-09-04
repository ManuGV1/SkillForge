import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

const updateStatusSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const role = session.user.role?.toUpperCase();
    if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden. Admin access required." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();

    const parsed = updateStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid status value provided." },
        { status: 400 }
      );
    }

    const updated = await db.supportRequest.update({
      where: { id },
      data: {
        status: parsed.data.status,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Support ticket status updated to ${parsed.data.status}`,
      data: updated,
    });
  } catch (error) {
    console.error("[PATCH /api/admin/support/[id]] Error updating support ticket:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update support ticket status." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import * as bcrypt from "bcryptjs";
import { z } from "zod";

const createAdminSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  targetRole: z.enum(["ADMIN", "SUPER_ADMIN"]).default("ADMIN"),
});

// GET /api/admin/users - List users with roles
export async function GET() {
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

    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        role: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const roles = await db.role.findMany();

    return NextResponse.json({
      success: true,
      data: {
        users,
        roles,
        currentUserRole: currentRole,
      },
    });
  } catch (error) {
    console.error("[GET /api/admin/users] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch admin user list." },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Create new Admin account
export async function POST(req: Request) {
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

    const body = await req.json();
    const parsed = createAdminSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: parsed.error.issues.map((i) => i.message),
        },
        { status: 400 }
      );
    }

    const { name, email, password, targetRole } = parsed.data;

    // Strict Security Constraint:
    // ADMIN accounts cannot create SUPER_ADMIN accounts. Only SUPER_ADMIN can create SUPER_ADMIN.
    if (targetRole === "SUPER_ADMIN" && currentRole !== "SUPER_ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden. Standard ADMIN accounts cannot create or assign SUPER_ADMIN role.",
        },
        { status: 403 }
      );
    }

    // Check if user email already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "A user with this email address already exists." },
        { status: 400 }
      );
    }

    // Find requested role in database
    const roleRecord = await db.role.findUnique({
      where: { name: targetRole },
    });

    if (!roleRecord) {
      return NextResponse.json(
        { success: false, error: `Role '${targetRole}' is not initialized in the database.` },
        { status: 500 }
      );
    }

    // Securely hash password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user & profile
    const newAdmin = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          passwordHash: hashedPassword,
          roleId: roleRecord.id,
        },
        include: {
          role: true,
        },
      });

      await tx.profile.create({
        data: {
          userId: user.id,
          bio: `${targetRole} Account created by ${session.user.email}`,
        },
      });

      return user;
    });

    return NextResponse.json(
      {
        success: true,
        message: `${targetRole} account created successfully.`,
        data: {
          id: newAdmin.id,
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role?.name,
          createdAt: newAdmin.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/admin/users] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create administrator account." },
      { status: 500 }
    );
  }
}

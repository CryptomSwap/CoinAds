import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serverEnv } from "@/lib/env/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    // Check if SEED_SECRET is configured
    if (!serverEnv.SEED_SECRET) {
      return NextResponse.json(
        { error: "SEED_SECRET not configured" },
        { status: 500 }
      );
    }

    // Get secret from query params
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    // Validate secret
    if (!secret || secret !== serverEnv.SEED_SECRET) {
      return NextResponse.json(
        { error: "Invalid or missing secret" },
        { status: 403 }
      );
    }

    // Hash the default password
    const hashedPassword = await bcrypt.hash("ChangeMe123!", 12);

    // Upsert admin user
    const adminUser = await prisma.user.upsert({
      where: { email: "admin@coinads.com" },
      update: {
        role: "ADMIN",
        password: hashedPassword,
        name: "Admin User",
      },
      create: {
        email: "admin@coinads.com",
        password: hashedPassword,
        role: "ADMIN",
        name: "Admin User",
      },
    });

    // Return user without password
    const { password, ...userWithoutPassword } = adminUser;

    return NextResponse.json({
      message: "Admin user created/updated successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Seed admin error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Disable this route after first successful use
export async function GET() {
  return NextResponse.json(
    { error: "This endpoint is disabled. Use POST with secret parameter." },
    { status: 403 }
  );
}

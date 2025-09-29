import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serverEnv } from "@/lib/env/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  // Block in production - dev endpoints should not be accessible
  if (serverEnv.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Disabled in production" },
      { status: 404 }
    );
  }

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

    // Use environment variables or defaults
    const email = serverEnv.SEED_ADMIN_EMAIL ?? "admin@coinads.com";
    const adminPassword = serverEnv.SEED_ADMIN_PASSWORD ?? "ChangeMeNow123!";
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Upsert admin user
    const adminUser = await prisma.user.upsert({
      where: { email },
      update: {
        role: "ADMIN",
        password: hashedPassword,
        name: "Admin User",
      },
      create: {
        email,
        password: hashedPassword,
        role: "ADMIN",
        name: "Admin User",
      },
    });

    // Return user without password
    const { password, ...userWithoutPassword } = adminUser;

    return NextResponse.json({
      ok: true,
      adminId: adminUser.id,
      message: "Admin user created/updated successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Seed admin error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Disable this route after first successful use
export async function GET() {
  // Block in production
  if (serverEnv.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Disabled in production" },
      { status: 404 }
    );
  }
  
  return NextResponse.json(
    { error: "This endpoint is disabled. Use POST with secret parameter." },
    { status: 403 }
  );
}

// Ensure dynamic
export const dynamic = "force-dynamic";

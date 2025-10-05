import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    // Simple secret check - you can change this
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    
    if (!secret || secret !== "coinads-test-2024") {
      return NextResponse.json(
        { error: "Invalid secret" },
        { status: 403 }
      );
    }

    console.log("🌱 Starting to seed test users...");

    // Test users data
    const testUsers = [
      {
        email: "admin@coinads.test",
        password: "Admin#1234",
        name: "Admin User",
        role: "ADMIN" as const,
      },
      {
        email: "adv@coinads.test", 
        password: "Adv#1234",
        name: "Advertiser User",
        role: "ADVERTISER" as const,
      },
      {
        email: "pub@coinads.test",
        password: "Pub#1234", 
        name: "Publisher User",
        role: "PUBLISHER" as const,
      },
    ];

    const createdUsers = [];

    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        console.log(`✅ User ${userData.email} already exists`);
        createdUsers.push({
          email: userData.email,
          role: userData.role,
          status: "already_exists",
        });
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          name: userData.name,
          role: userData.role,
          emailVerified: new Date(), // Mark as verified for testing
        },
      });

      console.log(`✅ Created user: ${userData.email} (${userData.role})`);
      createdUsers.push({
        email: userData.email,
        role: userData.role,
        status: "created",
        id: user.id,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Test users seeded successfully",
      users: createdUsers,
    });

  } catch (error) {
    console.error("❌ Seed test users error:", error);
    return NextResponse.json(
      { 
        error: "Failed to seed test users",
        details: (error as Error).message 
      },
      { status: 500 }
    );
  }
}

// Ensure dynamic
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    // Build where clause
    const where: any = {};
    if (role && role !== "all") {
      where.role = role.toUpperCase();
    }

    // Fetch users with pagination
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        // Don't include password
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Get total count for pagination
    const total = await prisma.user.count({ where });

    // Get user statistics
    const stats = await prisma.user.groupBy({
      by: ["role"],
      _count: {
        role: true,
      },
    });

    // Format stats
    const userStats = {
      total: total,
      advertisers: stats.find(s => s.role === "ADVERTISER")?._count.role || 0,
      publishers: stats.find(s => s.role === "PUBLISHER")?._count.role || 0,
      admins: stats.find(s => s.role === "ADMIN")?._count.role || 0,
    };

    return NextResponse.json({
      users,
      stats: userStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

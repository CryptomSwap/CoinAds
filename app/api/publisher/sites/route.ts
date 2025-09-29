import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { randomBytes } from "crypto";

// Removed demo mode - always use database

const createSiteSchema = z.object({
  domain: z.string().min(1, "Domain is required"),
});

const updateSiteSchema = createSiteSchema.partial();

// GET /api/publisher/sites - List sites
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Always query database - no mock fallbacks

    const where: any = {
      organization: {
        memberships: {
          some: {
            userId: session.user.id,
          },
        },
      },
    };

    if (status) {
      where.status = status;
    }

    const sites = await prisma.site.findMany({
      where,
      include: {
        placements: true,
        _count: {
          select: {
            placements: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.site.count({ where });

    return NextResponse.json({
      sites,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get sites error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/publisher/sites - Create site
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = createSiteSchema.parse(body);

    // Always create in database - no mock responses

    // Check if site already exists for this publisher
    const existingSite = await prisma.site.findFirst({
      where: {
        publisherId: parseInt(session.user.id),
        domain: data.domain,
      },
    });

    if (existingSite) {
      return NextResponse.json(
        { error: "Site with this domain already exists" },
        { status: 400 }
      );
    }

    const site = await prisma.site.create({
      data: {
        ...data,
        publisherId: parseInt(session.user.id),
      },
      include: {
        placements: true,
      },
    });

    return NextResponse.json({ site }, { status: 201 });
  } catch (error) {
    console.error("Create site error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

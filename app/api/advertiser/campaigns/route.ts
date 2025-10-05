import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Removed demo mode - always use database

const createCampaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  budgetCents: z.number().min(100, "Minimum budget is $1.00"),
  dailyBudgetCents: z.number().min(100).optional(),
  startAt: z.string().datetime().optional(),
  endAt: z.string().datetime().optional(),
  objective: z.string().optional(),
});

const updateCampaignSchema = createCampaignSchema.partial();

// GET /api/advertiser/campaigns - List campaigns
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

    const advertiserId = parseInt(session.user.id);
    if (isNaN(advertiserId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const where: any = {
      advertiserId: advertiserId,
    };

    if (status) {
      where.status = status;
    }

    const campaigns = await prisma.campaign.findMany({
      where,
      include: {
        creatives: true,
        reports: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.campaign.count({ where });

    return NextResponse.json({
      campaigns,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get campaigns error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/advertiser/campaigns - Create campaign
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = createCampaignSchema.parse(body);

    // Always create in database - no mock responses

    // For MVP, skip balance checking
    // In production, you'd check the user's transaction balance

    const advertiserId = parseInt(session.user.id);
    if (isNaN(advertiserId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const campaign = await prisma.campaign.create({
      data: {
        name: data.name,
        budget: data.budgetCents / 100, // Convert cents to dollars
        advertiserId: advertiserId,
        startDate: data.startAt ? new Date(data.startAt) : null,
        endDate: data.endAt ? new Date(data.endAt) : null,
        status: "PENDING",
      },
      include: {
        creatives: true,
        reports: true,
      },
    });

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) {
    console.error("Create campaign error:", error);
    
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

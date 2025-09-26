import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Demo mode - bypass database for development
import { isDevelopment } from "@/lib/env";

const DEMO_MODE = isDevelopment;

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

    // Demo mode - return mock data
    if (DEMO_MODE) {
      const mockCampaigns = [
        {
          id: "demo-campaign-1",
          name: "Crypto News Campaign",
          description: "Promoting crypto news articles",
          budgetCents: 50000,
          dailyBudgetCents: 5000,
          spentCents: 12500,
          startAt: new Date("2024-01-01"),
          endAt: new Date("2024-02-01"),
          objective: "Brand Awareness",
          status: "ACTIVE",
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-15"),
          organizationId: "demo-org",
          lineItems: [
            {
              id: "demo-lineitem-1",
              name: "Banner Ads",
              campaignId: "demo-campaign-1",
              placementTarget: { categories: ["News", "Finance"] },
              pricingModel: "CPM",
              priceCents: 250,
              frequencyCapPerUserPerDay: 5,
              geo: { countries: ["US", "CA"] },
              device: { types: ["desktop", "mobile"] },
              status: "ACTIVE",
              createdAt: new Date("2024-01-01"),
              updatedAt: new Date("2024-01-01"),
              creatives: [
                {
                  id: "demo-creative-1",
                  name: "Crypto Banner",
                  type: "IMAGE",
                  width: 728,
                  height: 90,
                  url: "https://via.placeholder.com/728x90",
                  landingUrl: "https://example.com/crypto-news",
                  status: "APPROVED",
                  lineItemId: "demo-lineitem-1",
                  createdAt: new Date("2024-01-01"),
                  updatedAt: new Date("2024-01-01"),
                  rejectionReason: null,
                  meta: null
                }
              ],
              _count: {
                impressions: 5000
              }
            }
          ],
          _count: {
            lineItems: 1
          }
        },
        {
          id: "demo-campaign-2",
          name: "Tech Blog Campaign",
          description: "Promoting technology content",
          budgetCents: 30000,
          dailyBudgetCents: 3000,
          spentCents: 8500,
          startAt: new Date("2024-01-10"),
          endAt: new Date("2024-01-31"),
          objective: "Traffic",
          status: "PAUSED",
          createdAt: new Date("2024-01-10"),
          updatedAt: new Date("2024-01-20"),
          organizationId: "demo-org",
          lineItems: [],
          _count: {
            lineItems: 0
          }
        }
      ];

      const filteredCampaigns = status ? mockCampaigns.filter(campaign => campaign.status === status) : mockCampaigns;
      const total = filteredCampaigns.length;
      const paginatedCampaigns = filteredCampaigns.slice((page - 1) * limit, page * limit);

      return NextResponse.json({
        campaigns: paginatedCampaigns,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    }

    const where: any = {
      advertiserId: parseInt(session.user.id),
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

    // Demo mode - return mock created campaign
    if (DEMO_MODE) {
      const mockCampaign = {
        id: `demo-campaign-${Date.now()}`,
        name: data.name,
        totalBudgetCents: data.budgetCents,
        dailyBudgetCents: data.dailyBudgetCents || data.budgetCents / 30,
        spentCents: 0,
        startAt: data.startAt ? new Date(data.startAt) : null,
        endAt: data.endAt ? new Date(data.endAt) : null,
        objective: data.objective || "Brand Awareness",
        status: "PENDING",
        createdAt: new Date(),
        updatedAt: new Date(),
        organizationId: "demo-org",
        lineItems: [],
      };

      return NextResponse.json({ campaign: mockCampaign }, { status: 201 });
    }

    // For MVP, skip balance checking
    // In production, you'd check the user's transaction balance

    const campaign = await prisma.campaign.create({
      data: {
        name: data.name,
        budget: data.budgetCents / 100, // Convert cents to dollars
        advertiserId: parseInt(session.user.id),
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

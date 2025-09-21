import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateCampaignSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  budgetCents: z.number().min(100).optional(),
  dailyBudgetCents: z.number().min(100).optional(),
  startAt: z.string().datetime().optional(),
  endAt: z.string().datetime().optional(),
  objective: z.string().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "PAUSED", "ENDED"]).optional(),
});

// GET /api/advertiser/campaigns/[id] - Get campaign details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const campaign = await prisma.campaign.findFirst({
      where: {
        id: params.id,
        organization: {
          memberships: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
      include: {
        lineItems: {
          include: {
            creatives: true,
            impressions: {
              include: {
                clicks: {
                  include: {
                    conversions: true,
                  },
                },
              },
            },
          },
        },
        organization: {
          include: {
            wallet: true,
          },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    // Calculate campaign statistics
    const totalImpressions = campaign.lineItems.reduce(
      (sum, item) => sum + item.impressions.length,
      0
    );
    const totalClicks = campaign.lineItems.reduce(
      (sum, item) => sum + item.impressions.reduce((s, imp) => s + imp.clicks.length, 0),
      0
    );
    const totalConversions = campaign.lineItems.reduce(
      (sum, item) => sum + item.impressions.reduce(
        (s, imp) => s + imp.clicks.reduce((c, click) => c + click.conversions.length, 0),
        0
      ),
      0
    );

    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    return NextResponse.json({
      campaign: {
        ...campaign,
        stats: {
          impressions: totalImpressions,
          clicks: totalClicks,
          conversions: totalConversions,
          ctr: Number(ctr.toFixed(2)),
          spentCents: campaign.spentCents,
        },
      },
    });
  } catch (error) {
    console.error("Get campaign error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/advertiser/campaigns/[id] - Update campaign
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = updateCampaignSchema.parse(body);

    // Check if campaign exists and user has access
    const existingCampaign = await prisma.campaign.findFirst({
      where: {
        id: params.id,
        organization: {
          memberships: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
    });

    if (!existingCampaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    // If updating budget, check if user has sufficient balance
    if (data.budgetCents && data.budgetCents > (existingCampaign.budgetCents || 0)) {
      const membership = await prisma.membership.findFirst({
        where: { userId: session.user.id },
        include: { organization: { include: { wallet: true } } },
      });

      if (!membership?.organization.wallet || 
          membership.organization.wallet.balanceCents < (data.budgetCents - (existingCampaign.budgetCents || 0))) {
        return NextResponse.json(
          { error: "Insufficient balance to increase budget" },
          { status: 400 }
        );
      }
    }

    const campaign = await prisma.campaign.update({
      where: { id: params.id },
      data: {
        ...data,
        startAt: data.startAt ? new Date(data.startAt) : undefined,
        endAt: data.endAt ? new Date(data.endAt) : undefined,
      },
      include: {
        lineItems: {
          include: {
            creatives: true,
          },
        },
      },
    });

    return NextResponse.json({ campaign });
  } catch (error) {
    console.error("Update campaign error:", error);
    
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

// DELETE /api/advertiser/campaigns/[id] - Delete campaign
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if campaign exists and user has access
    const existingCampaign = await prisma.campaign.findFirst({
      where: {
        id: params.id,
        organization: {
          memberships: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
    });

    if (!existingCampaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    // Only allow deletion of draft campaigns
    if (existingCampaign.status !== "DRAFT") {
      return NextResponse.json(
        { error: "Only draft campaigns can be deleted" },
        { status: 400 }
      );
    }

    await prisma.campaign.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Campaign deleted successfully" });
  } catch (error) {
    console.error("Delete campaign error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

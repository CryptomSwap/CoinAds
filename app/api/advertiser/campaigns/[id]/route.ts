import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateCampaignSchema = z.object({
  name: z.string().min(1).optional(),
  budgetCents: z.number().min(100).optional(),
  dailyBudgetCents: z.number().min(100).optional(),
  startAt: z.string().datetime().optional(),
  endAt: z.string().datetime().optional(),
  objective: z.string().optional(),
  status: z.enum(["PENDING", "ACTIVE", "PAUSED", "COMPLETED", "REJECTED"]).optional(),
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
        id: parseInt(params.id),
        advertiserId: parseInt(session.user.id),
      },
      include: {
        creatives: true,
        reports: true,
      },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    // Calculate campaign statistics from reports
    const totalImpressions = campaign.reports.reduce((sum, report) => sum + report.impressions, 0);
    const totalClicks = campaign.reports.reduce((sum, report) => sum + report.clicks, 0);
    const totalSpend = campaign.reports.reduce((sum, report) => sum + report.spend, 0);

    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    return NextResponse.json({
      campaign: {
        id: campaign.id.toString(),
        name: campaign.name,
        description: null, // Not in current schema
        status: campaign.status,
        budgetCents: Math.round(campaign.budget * 100), // Convert to cents
        spentCents: Math.round(totalSpend * 100), // Convert to cents
        startAt: campaign.startDate?.toISOString(),
        endAt: campaign.endDate?.toISOString(),
        objective: "Brand Awareness", // Default value
        createdAt: campaign.createdAt.toISOString(),
        lineItems: [], // Empty for now - not implemented yet
        stats: {
          impressions: totalImpressions,
          clicks: totalClicks,
          conversions: 0, // No conversions in current schema
          ctr: Number(ctr.toFixed(2)),
          spentCents: Math.round(totalSpend * 100), // Convert to cents
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

// PATCH /api/advertiser/campaigns/[id] - Update campaign
export async function PATCH(
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
        id: parseInt(params.id),
        advertiserId: parseInt(session.user.id),
      },
    });

    if (!existingCampaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    // If updating budget, check if user has sufficient balance
    if (data.budgetCents && data.budgetCents > (existingCampaign.budget * 100)) {
      // For MVP, we'll skip balance checking
      // In production, you'd check the user's transaction balance
    }

    const campaign = await prisma.campaign.update({
      where: { id: parseInt(params.id) },
      data: {
        name: data.name,
        budget: data.budgetCents ? data.budgetCents / 100 : undefined,
        status: data.status,
        startDate: data.startAt ? new Date(data.startAt) : undefined,
        endDate: data.endAt ? new Date(data.endAt) : undefined,
      },
      include: {
        creatives: true,
        reports: true,
      },
    });

    // Calculate campaign statistics from reports
    const totalImpressions = campaign.reports.reduce((sum, report) => sum + report.impressions, 0);
    const totalClicks = campaign.reports.reduce((sum, report) => sum + report.clicks, 0);
    const totalSpend = campaign.reports.reduce((sum, report) => sum + report.spend, 0);
    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    return NextResponse.json({
      campaign: {
        id: campaign.id.toString(),
        name: campaign.name,
        description: null, // Not in current schema
        status: campaign.status,
        budgetCents: Math.round(campaign.budget * 100), // Convert to cents
        spentCents: Math.round(totalSpend * 100), // Convert to cents
        startAt: campaign.startDate?.toISOString(),
        endAt: campaign.endDate?.toISOString(),
        objective: "Brand Awareness", // Default value
        createdAt: campaign.createdAt.toISOString(),
        lineItems: [], // Empty for now - not implemented yet
        stats: {
          impressions: totalImpressions,
          clicks: totalClicks,
          conversions: 0, // No conversions in current schema
          ctr: Number(ctr.toFixed(2)),
          spentCents: Math.round(totalSpend * 100), // Convert to cents
        },
      },
    });
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
        id: parseInt(params.id),
        advertiserId: parseInt(session.user.id),
      },
    });

    if (!existingCampaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    // Only allow deletion of draft campaigns
    if (existingCampaign.status !== "PENDING") {
      return NextResponse.json(
        { error: "Only pending campaigns can be deleted" },
        { status: 400 }
      );
    }

    await prisma.campaign.delete({
      where: { id: parseInt(params.id) },
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

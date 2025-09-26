import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const approvalSchema = z.object({
  entityType: z.enum(['campaign', 'site', 'creative', 'placement']),
  entityId: z.number().int().positive(),
  action: z.enum(['approve', 'reject']),
  reason: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { entityType, entityId, action, reason } = approvalSchema.parse(body);

    // Validate that reason is provided for rejections
    if (action === 'reject' && (!reason || reason.trim().length === 0)) {
      return NextResponse.json(
        { error: "Reason is required for rejections" },
        { status: 400 }
      );
    }

    // Check if entity exists
    let entity;
    switch (entityType) {
      case 'campaign':
        entity = await prisma.campaign.findUnique({ where: { id: entityId } });
        break;
      case 'site':
        entity = await prisma.site.findUnique({ where: { id: entityId } });
        break;
      case 'creative':
        entity = await prisma.creative.findUnique({ where: { id: entityId } });
        break;
      case 'placement':
        entity = await prisma.placement.findUnique({ where: { id: entityId } });
        break;
    }

    if (!entity) {
      return NextResponse.json(
        { error: `${entityType} not found` },
        { status: 404 }
      );
    }

    // Create approval record
    const approval = await prisma.approval.create({
      data: {
        entityType,
        entityId,
        status: action === 'approve' ? 'APPROVED' : 'REJECTED',
        reason: action === 'reject' ? reason : null,
        adminUserId: parseInt(session.user.id),
      },
    });

    // Create admin log entry
    await prisma.adminLog.create({
      data: {
        userId: parseInt(session.user.id),
        action,
        entityType,
        entityId,
      },
    });

    // Update entity status based on action
    if (action === 'approve') {
      switch (entityType) {
        case 'campaign':
          await prisma.campaign.update({
            where: { id: entityId },
            data: { status: 'ACTIVE' },
          });
          break;
        case 'site':
          await prisma.site.update({
            where: { id: entityId },
            data: { approved: true },
          });
          break;
        case 'placement':
          await prisma.placement.update({
            where: { id: entityId },
            data: { approved: true },
          });
          break;
        // Creative doesn't have a status field, so no update needed
      }
    } else {
      // For rejections, update status to rejected where applicable
      switch (entityType) {
        case 'campaign':
          await prisma.campaign.update({
            where: { id: entityId },
            data: { status: 'REJECTED' },
          });
          break;
        // Sites and placements remain unapproved (false)
        // Creatives don't have a status field
      }
    }

    return NextResponse.json({
      success: true,
      approval,
      message: `${entityType} ${action}d successfully`,
    });

  } catch (error) {
    console.error("Approval error:", error);
    
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

// GET endpoint to fetch pending approvals
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get pending campaigns
    const pendingCampaigns = await prisma.campaign.findMany({
      where: { status: 'PENDING' },
      include: {
        advertiser: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get pending sites
    const pendingSites = await prisma.site.findMany({
      where: { approved: false },
      include: {
        publisher: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { id: 'desc' },
    });

    // Get pending placements
    const pendingPlacements = await prisma.placement.findMany({
      where: { approved: false },
      include: {
        site: {
          include: {
            publisher: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
      orderBy: { id: 'desc' },
    });

    // Get pending creatives (all creatives for now, as there's no status field)
    const pendingCreatives = await prisma.creative.findMany({
      include: {
        campaign: {
          include: {
            advertiser: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Format the data for the frontend
    const formattedApprovals = [
      ...pendingCampaigns.map(campaign => ({
        id: `campaign-${campaign.id}`,
        type: 'campaign',
        name: campaign.name,
        advertiser: campaign.advertiser.name || 'Unknown',
        advertiserEmail: campaign.advertiser.email,
        category: 'Finance', // Default category
        budget: campaign.budget,
        submittedAt: campaign.createdAt.toISOString(),
        status: 'pending',
        priority: 'high',
        description: `Campaign for ${campaign.name}`,
        entityId: campaign.id,
      })),
      ...pendingSites.map(site => ({
        id: `site-${site.id}`,
        type: 'site',
        name: site.domain,
        publisher: site.publisher.name || 'Unknown',
        publisherEmail: site.publisher.email,
        category: 'News', // Default category
        monthlyVisitors: 50000, // Default value
        submittedAt: site.id.toString(), // Using ID as timestamp placeholder
        status: 'pending',
        priority: 'medium',
        description: `Publisher site: ${site.domain}`,
        entityId: site.id,
      })),
      ...pendingPlacements.map(placement => ({
        id: `placement-${placement.id}`,
        type: 'placement',
        name: `${placement.size} placement`,
        publisher: placement.site.publisher.name || 'Unknown',
        publisherEmail: placement.site.publisher.email,
        category: 'Advertising',
        format: placement.size,
        submittedAt: placement.id.toString(), // Using ID as timestamp placeholder
        status: 'pending',
        priority: 'low',
        description: `Placement on ${placement.site.domain}`,
        entityId: placement.id,
      })),
      ...pendingCreatives.map(creative => ({
        id: `creative-${creative.id}`,
        type: 'creative',
        name: `Creative for ${creative.campaign.name}`,
        campaign: creative.campaign.name,
        advertiser: creative.campaign.advertiser.name || 'Unknown',
        advertiserEmail: creative.campaign.advertiser.email,
        format: '728x90', // Default format
        submittedAt: creative.createdAt.toISOString(),
        status: 'pending',
        priority: 'low',
        description: `Creative for campaign: ${creative.campaign.name}`,
        entityId: creative.id,
      })),
    ];

    return NextResponse.json({
      approvals: formattedApprovals,
      stats: {
        campaigns: pendingCampaigns.length,
        sites: pendingSites.length,
        placements: pendingPlacements.length,
        creatives: pendingCreatives.length,
        total: formattedApprovals.length,
      },
    });

  } catch (error) {
    console.error("Error fetching approvals:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

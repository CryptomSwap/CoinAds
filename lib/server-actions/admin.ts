"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getAdminOverview() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (session.user.role !== "ADMIN") {
    throw new Error("Only admins can view overview");
  }

  // Get user counts
  const userCounts = await prisma.user.groupBy({
    by: ['role'],
    _count: {
      id: true,
    },
  });

  const userCountsMap = userCounts.reduce((acc, item) => {
    acc[item.role.toLowerCase()] = item._count.id;
    return acc;
  }, {} as Record<string, number>);

  // Get campaign stats
  const totalCampaigns = await prisma.campaign.count();
  const activeCampaigns = await prisma.campaign.count({
    where: { status: 'ACTIVE' }
  });

  // Get pending approvals
  const pendingApprovals = await prisma.approval.count({
    where: { status: 'PENDING' }
  });

  // Get recent activity (last 24h)
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const last24hImpressions = await prisma.impression.count({
    where: {
      createdAt: {
        gte: yesterday,
      },
    },
  });

  const last24hClicks = await prisma.click.count({
    where: {
      createdAt: {
        gte: yesterday,
      },
    },
  });

  return {
    userCounts: {
      advertisers: userCountsMap.advertiser || 0,
      publishers: userCountsMap.publisher || 0,
      admins: userCountsMap.admin || 0,
      total: Object.values(userCountsMap).reduce((sum, count) => sum + count, 0),
    },
    totalCampaigns,
    activeCampaigns,
    pendingApprovals,
    last24hImpressions,
    last24hClicks,
  };
}

export async function getPendingApprovals() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (session.user.role !== "ADMIN") {
    throw new Error("Only admins can view approvals");
  }

  const approvals = await prisma.approval.findMany({
    where: {
      status: 'PENDING',
    },
    include: {
      adminUser: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
  });

  return approvals.map(approval => ({
    id: approval.id.toString(),
    entityType: approval.entityType,
    entityId: approval.entityId,
    status: approval.status,
    reason: approval.reason,
    createdAt: approval.createdAt.toISOString(),
    adminUser: approval.adminUser,
  }));
}

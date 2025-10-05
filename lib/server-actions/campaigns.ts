"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createCampaignSchema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  budget: z.number().min(1, "Budget must be greater than 0"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export async function getCampaigns() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (session.user.role !== "ADVERTISER") {
    throw new Error("Only advertisers can view campaigns");
  }

  const advertiserId = parseInt(session.user.id);
  if (isNaN(advertiserId)) {
    throw new Error("Invalid user ID");
  }

  const campaigns = await prisma.campaign.findMany({
    where: {
      advertiserId: advertiserId,
    },
    include: {
      _count: {
        select: {
          impressions: true,
          conversions: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return campaigns.map(campaign => ({
    id: campaign.id.toString(),
    name: campaign.name,
    status: campaign.status,
    budget: campaign.budget,
    startDate: campaign.startDate?.toISOString(),
    endDate: campaign.endDate?.toISOString(),
    createdAt: campaign.createdAt.toISOString(),
    impressions: campaign._count.impressions,
    clicks: 0, // TODO: Calculate from impressions->clicks relation
    spend: 0, // TODO: Calculate from impressions cost
  }));
}

export async function createCampaign(data: z.infer<typeof createCampaignSchema>) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (session.user.role !== "ADVERTISER") {
    throw new Error("Only advertisers can create campaigns");
  }

  const validated = createCampaignSchema.parse(data);

  const advertiserId = parseInt(session.user.id);
  if (isNaN(advertiserId)) {
    throw new Error("Invalid user ID");
  }

  const campaign = await prisma.campaign.create({
    data: {
      name: validated.name,
      budget: validated.budget,
      advertiserId: advertiserId,
      startDate: validated.startDate ? new Date(validated.startDate) : null,
      endDate: validated.endDate ? new Date(validated.endDate) : null,
      status: "PENDING",
    },
  });

  revalidatePath("/app/advertiser/campaigns");
  
  return {
    id: campaign.id.toString(),
    name: campaign.name,
    status: campaign.status,
    budget: campaign.budget,
  };
}

export async function updateCampaignStatus(campaignId: string, status: "ACTIVE" | "PAUSED") {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (session.user.role !== "ADVERTISER") {
    throw new Error("Only advertisers can update campaigns");
  }

  const advertiserId = parseInt(session.user.id);
  if (isNaN(advertiserId)) {
    throw new Error("Invalid user ID");
  }

  const campaignIdInt = parseInt(campaignId);
  if (isNaN(campaignIdInt)) {
    throw new Error("Invalid campaign ID");
  }

  // Verify ownership
  const campaign = await prisma.campaign.findFirst({
    where: {
      id: campaignIdInt,
      advertiserId: advertiserId,
    },
  });

  if (!campaign) {
    throw new Error("Campaign not found or access denied");
  }

  await prisma.campaign.update({
    where: { id: campaignIdInt },
    data: { status },
  });

  revalidatePath("/app/advertiser/campaigns");
  
  return { success: true };
}

export async function deleteCampaign(campaignId: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (session.user.role !== "ADVERTISER") {
    throw new Error("Only advertisers can delete campaigns");
  }

  const advertiserId = parseInt(session.user.id);
  if (isNaN(advertiserId)) {
    throw new Error("Invalid user ID");
  }

  const campaignIdInt = parseInt(campaignId);
  if (isNaN(campaignIdInt)) {
    throw new Error("Invalid campaign ID");
  }

  // Verify ownership
  const campaign = await prisma.campaign.findFirst({
    where: {
      id: campaignIdInt,
      advertiserId: advertiserId,
    },
  });

  if (!campaign) {
    throw new Error("Campaign not found or access denied");
  }

  // Only allow deletion of pending campaigns
  if (campaign.status !== "PENDING") {
    throw new Error("Only pending campaigns can be deleted");
  }

  await prisma.campaign.delete({
    where: { id: campaignIdInt },
  });

  revalidatePath("/app/advertiser/campaigns");
  
  return { success: true };
}

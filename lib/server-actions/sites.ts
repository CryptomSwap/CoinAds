"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createSiteSchema = z.object({
  domain: z.string().min(1, "Domain is required"),
  name: z.string().min(1, "Site name is required"),
  description: z.string().optional(),
  category: z.string().optional(),
});

export async function getSites() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (session.user.role !== "PUBLISHER") {
    throw new Error("Only publishers can view sites");
  }

  const sites = await prisma.site.findMany({
    where: {
      publisherId: parseInt(session.user.id),
    },
    include: {
      _count: {
        select: {
          placements: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return sites.map(site => ({
    id: site.id.toString(),
    domain: site.domain,
    verified: site.verified,
    approved: site.approved,
    createdAt: site.createdAt.toISOString(),
    _count: {
      placements: site._count.placements,
    },
  }));
}

export async function createSite(data: z.infer<typeof createSiteSchema>) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (session.user.role !== "PUBLISHER") {
    throw new Error("Only publishers can create sites");
  }

  const validated = createSiteSchema.parse(data);

  // Check if domain already exists
  const existingSite = await prisma.site.findFirst({
    where: {
      domain: validated.domain,
    },
  });

  if (existingSite) {
    throw new Error("A site with this domain already exists");
  }

  const site = await prisma.site.create({
    data: {
      domain: validated.domain,
      publisherId: parseInt(session.user.id),
      verified: false,
      approved: false,
    },
  });

  revalidatePath("/app/publisher/sites");
  
  return {
    id: site.id.toString(),
    domain: site.domain,
    verified: site.verified,
    approved: site.approved,
  };
}

export async function deleteSite(siteId: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (session.user.role !== "PUBLISHER") {
    throw new Error("Only publishers can delete sites");
  }

  // Verify ownership
  const site = await prisma.site.findFirst({
    where: {
      id: parseInt(siteId),
      publisherId: parseInt(session.user.id),
    },
  });

  if (!site) {
    throw new Error("Site not found or access denied");
  }

  await prisma.site.delete({
    where: { id: parseInt(siteId) },
  });

  revalidatePath("/app/publisher/sites");
  
  return { success: true };
}

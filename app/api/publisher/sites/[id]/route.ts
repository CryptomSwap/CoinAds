import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSiteSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
});

// GET /api/publisher/sites/[id] - Get site details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const site = await prisma.site.findFirst({
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
        placements: {
          include: {
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
      },
    });

    if (!site) {
      return NextResponse.json(
        { error: "Site not found" },
        { status: 404 }
      );
    }

    // Calculate site statistics
    const totalImpressions = site.placements.reduce(
      (sum, placement) => sum + placement.impressions.length,
      0
    );
    const totalClicks = site.placements.reduce(
      (sum, placement) => sum + placement.impressions.reduce(
        (s, imp) => s + imp.clicks.length,
        0
      ),
      0
    );
    const totalConversions = site.placements.reduce(
      (sum, placement) => sum + placement.impressions.reduce(
        (s, imp) => s + imp.clicks.reduce(
          (c, click) => c + click.conversions.length,
          0
        ),
        0
      ),
      0
    );

    const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    return NextResponse.json({
      site: {
        ...site,
        stats: {
          impressions: totalImpressions,
          clicks: totalClicks,
          conversions: totalConversions,
          ctr: Number(ctr.toFixed(2)),
        },
      },
    });
  } catch (error) {
    console.error("Get site error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/publisher/sites/[id] - Update site
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
    const data = updateSiteSchema.parse(body);

    // Check if site exists and user has access
    const existingSite = await prisma.site.findFirst({
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

    if (!existingSite) {
      return NextResponse.json(
        { error: "Site not found" },
        { status: 404 }
      );
    }

    const site = await prisma.site.update({
      where: { id: params.id },
      data,
      include: {
        placements: true,
      },
    });

    return NextResponse.json({ site });
  } catch (error) {
    console.error("Update site error:", error);
    
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

// DELETE /api/publisher/sites/[id] - Delete site
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if site exists and user has access
    const existingSite = await prisma.site.findFirst({
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

    if (!existingSite) {
      return NextResponse.json(
        { error: "Site not found" },
        { status: 404 }
      );
    }

    // Only allow deletion of pending sites
    if (existingSite.status !== "PENDING") {
      return NextResponse.json(
        { error: "Only pending sites can be deleted" },
        { status: 400 }
      );
    }

    await prisma.site.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Site deleted successfully" });
  } catch (error) {
    console.error("Delete site error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/publisher/sites/[id]/verify - Trigger site verification
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if site exists and user has access
    const existingSite = await prisma.site.findFirst({
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

    if (!existingSite) {
      return NextResponse.json(
        { error: "Site not found" },
        { status: 404 }
      );
    }

    if (existingSite.status !== "PENDING") {
      return NextResponse.json(
        { error: "Site is not pending verification" },
        { status: 400 }
      );
    }

    // For MVP, we'll simulate verification
    // In production, this would check for the verification token on the site
    const isVerified = Math.random() > 0.3; // 70% success rate for demo

    const site = await prisma.site.update({
      where: { id: params.id },
      data: {
        status: isVerified ? "APPROVED" : "PENDING",
        verifiedAt: isVerified ? new Date() : null,
        rejectionReason: !isVerified ? "Verification token not found on site" : null,
      },
    });

    return NextResponse.json({
      site,
      message: isVerified 
        ? "Site verified successfully" 
        : "Verification failed. Please check that the verification token is properly placed on your site.",
    });
  } catch (error) {
    console.error("Verify site error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

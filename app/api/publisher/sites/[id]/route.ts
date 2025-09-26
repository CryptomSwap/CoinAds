import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSiteSchema = z.object({
  domain: z.string().min(1).optional(),
  verified: z.boolean().optional(),
  approved: z.boolean().optional(),
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
        id: parseInt(params.id),
        publisherId: parseInt(session.user.id),
      },
      include: {
        placements: true,
      },
    });

    if (!site) {
      return NextResponse.json(
        { error: "Site not found" },
        { status: 404 }
      );
    }

    // Calculate site statistics from reports
    // For MVP, we'll use mock data since we don't have direct impression tracking
    const totalImpressions = site.placements.length * 100; // Mock: 100 impressions per placement
    const totalClicks = Math.floor(totalImpressions * 0.02); // Mock: 2% CTR
    const totalConversions = Math.floor(totalClicks * 0.05); // Mock: 5% conversion rate

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
        id: parseInt(params.id),
        publisherId: parseInt(session.user.id),
      },
    });

    if (!existingSite) {
      return NextResponse.json(
        { error: "Site not found" },
        { status: 404 }
      );
    }

    const site = await prisma.site.update({
      where: { id: parseInt(params.id) },
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
        id: parseInt(params.id),
        publisherId: parseInt(session.user.id),
      },
    });

    if (!existingSite) {
      return NextResponse.json(
        { error: "Site not found" },
        { status: 404 }
      );
    }

    // Only allow deletion of unapproved sites
    if (existingSite.approved) {
      return NextResponse.json(
        { error: "Only unapproved sites can be deleted" },
        { status: 400 }
      );
    }

    await prisma.site.delete({
      where: { id: parseInt(params.id) },
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
        id: parseInt(params.id),
        publisherId: parseInt(session.user.id),
      },
    });

    if (!existingSite) {
      return NextResponse.json(
        { error: "Site not found" },
        { status: 404 }
      );
    }

    if (existingSite.approved) {
      return NextResponse.json(
        { error: "Site is already approved" },
        { status: 400 }
      );
    }

    // For MVP, we'll simulate verification
    // In production, this would check for the verification token on the site
    const isVerified = Math.random() > 0.3; // 70% success rate for demo

    const site = await prisma.site.update({
      where: { id: parseInt(params.id) },
      data: {
        verified: isVerified,
        approved: isVerified,
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

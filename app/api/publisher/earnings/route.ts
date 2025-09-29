import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// Removed demo mode - always use database

// GET /api/publisher/earnings - Get earnings data
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const siteId = searchParams.get("siteId");

    // Always query database - no mock fallbacks

    // Get user's sites directly (no organization model in current schema)
    const sites = await prisma.site.findMany({
      where: { publisherId: parseInt(session.user.id) },
      include: {
        placements: true,
      },
    });

    if (!sites || sites.length === 0) {
      return NextResponse.json(
        { error: "No sites found for user" },
        { status: 404 }
      );
    }

    // Filter sites if siteId is provided
    let filteredSites = sites;
    if (siteId) {
      filteredSites = sites.filter(site => site.id === parseInt(siteId));
    }

    // Calculate earnings for each site from real data
    const earningsData = filteredSites.map(site => {
      // TODO: Replace with real impression/click tracking when available
      // For now, return zero values to show empty state
      return {
        siteId: site.id,
        siteName: `Site ${site.id}`,
        domain: site.domain,
        impressions: 0,
        clicks: 0,
        ctr: 0,
        earnings: 0, // In cents
      };
    });

    // Calculate total earnings
    const totalEarnings = earningsData.reduce((sum, site) => sum + site.earnings, 0);
    const totalImpressions = earningsData.reduce((sum, site) => sum + site.impressions, 0);
    const totalClicks = earningsData.reduce((sum, site) => sum + site.clicks, 0);
    const overallCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    // Get payout history (using Transaction model)
    const payouts = await prisma.transaction.findMany({
      where: { 
        userId: parseInt(session.user.id),
        type: 'PAYOUT'
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({
      summary: {
        totalEarnings,
        totalImpressions,
        totalClicks,
        overallCtr: Number(overallCtr.toFixed(2)),
        totalPayouts: payouts.reduce((sum, payout) => sum + payout.amount, 0),
        pendingEarnings: totalEarnings - payouts.reduce((sum, payout) => 
          payout.status === "SENT" ? sum + payout.amount : sum, 0
        ),
      },
      sites: earningsData,
      payouts,
    });
  } catch (error) {
    console.error("Get earnings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

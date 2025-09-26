import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// Demo mode - bypass database for development
import { isDevelopment } from "@/lib/env";

const DEMO_MODE = isDevelopment;

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

    // Demo mode - return mock earnings data
    if (DEMO_MODE) {
      const mockEarningsData = [
        {
          siteId: "demo-site-1",
          siteName: "Example News Site",
          domain: "example.com",
          impressions: 12500,
          clicks: 125,
          ctr: 1.0,
          earnings: 2750, // $27.50 in cents
        },
        {
          siteId: "demo-site-2",
          siteName: "Tech Blog",
          domain: "techblog.com",
          impressions: 8500,
          clicks: 85,
          ctr: 1.0,
          earnings: 1870, // $18.70 in cents
        }
      ];

      const mockPayouts = [
        {
          id: "demo-payout-1",
          organizationId: "demo-org",
          amountCents: 2000,
          status: "SENT",
          method: "USDT",
          meta: { transactionId: "0x123...abc" },
          createdAt: new Date("2024-01-10"),
          updatedAt: new Date("2024-01-10")
        },
        {
          id: "demo-payout-2",
          organizationId: "demo-org",
          amountCents: 1500,
          status: "REQUESTED",
          method: "USDT",
          meta: null,
          createdAt: new Date("2024-01-20"),
          updatedAt: new Date("2024-01-20")
        }
      ];

      const totalEarnings = mockEarningsData.reduce((sum, site) => sum + site.earnings, 0);
      const totalImpressions = mockEarningsData.reduce((sum, site) => sum + site.impressions, 0);
      const totalClicks = mockEarningsData.reduce((sum, site) => sum + site.clicks, 0);
      const overallCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
      const totalPayouts = mockPayouts.reduce((sum, payout) => sum + payout.amountCents, 0);
      const pendingEarnings = totalEarnings - mockPayouts.filter(p => p.status === "SENT").reduce((sum, payout) => sum + payout.amountCents, 0);

      return NextResponse.json({
        summary: {
          totalEarnings,
          totalImpressions,
          totalClicks,
          overallCtr: Number(overallCtr.toFixed(2)),
          totalPayouts,
          pendingEarnings,
        },
        sites: mockEarningsData,
        payouts: mockPayouts,
      });
    }

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

    // Calculate earnings for each site (simplified for MVP)
    const earningsData = filteredSites.map(site => {
      // For MVP, use mock data since we don't have impression tracking yet
      const mockImpressions = Math.floor(Math.random() * 10000) + 1000;
      const mockClicks = Math.floor(mockImpressions * 0.02); // 2% CTR
      const mockEarnings = Math.floor(mockImpressions * 0.002); // $2 CPM

      return {
        siteId: site.id,
        siteName: `Site ${site.id}`,
        domain: site.domain,
        impressions: mockImpressions,
        clicks: mockClicks,
        ctr: Number(((mockClicks / mockImpressions) * 100).toFixed(2)),
        earnings: mockEarnings, // In cents
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

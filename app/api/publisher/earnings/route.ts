import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// Demo mode - bypass database for development
const DEMO_MODE = process.env.NODE_ENV === "development";

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

    // Get user's organization
    const membership = await prisma.membership.findFirst({
      where: { userId: session.user.id },
      include: {
        organization: {
          include: {
            sites: {
              include: {
                placements: {
                  include: {
                    impressions: {
                      include: {
                        clicks: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "User not associated with any organization" },
        { status: 400 }
      );
    }

    // Filter sites if siteId is provided
    let sites = membership.organization.sites;
    if (siteId) {
      sites = sites.filter(site => site.id === siteId);
    }

    // Calculate earnings for each site
    const earningsData = sites.map(site => {
      let totalImpressions = 0;
      let totalClicks = 0;
      let totalEarnings = 0;

      site.placements.forEach(placement => {
        placement.impressions.forEach(impression => {
          totalImpressions++;
          
          // Calculate earnings based on CPM (assuming $2 CPM for demo)
          const cpmCents = 200; // $2.00 CPM
          totalEarnings += cpmCents / 1000; // Convert to cents per impression
          
          if (impression.clicks.length > 0) {
            totalClicks++;
            // Add CPC earnings (assuming $0.50 CPC for demo)
            const cpcCents = 50; // $0.50 CPC
            totalEarnings += cpcCents;
          }
        });
      });

      const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

      return {
        siteId: site.id,
        siteName: site.name,
        domain: site.domain,
        impressions: totalImpressions,
        clicks: totalClicks,
        ctr: Number(ctr.toFixed(2)),
        earnings: Math.round(totalEarnings), // In cents
      };
    });

    // Calculate total earnings
    const totalEarnings = earningsData.reduce((sum, site) => sum + site.earnings, 0);
    const totalImpressions = earningsData.reduce((sum, site) => sum + site.impressions, 0);
    const totalClicks = earningsData.reduce((sum, site) => sum + site.clicks, 0);
    const overallCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

    // Get payout history
    const payouts = await prisma.payout.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return NextResponse.json({
      summary: {
        totalEarnings,
        totalImpressions,
        totalClicks,
        overallCtr: Number(overallCtr.toFixed(2)),
        totalPayouts: payouts.reduce((sum, payout) => sum + payout.amountCents, 0),
        pendingEarnings: totalEarnings - payouts.reduce((sum, payout) => 
          payout.status === "SENT" ? sum + payout.amountCents : sum, 0
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

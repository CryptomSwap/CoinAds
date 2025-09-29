import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Tell Next these routes are always dynamic & never prerendered
export const dynamic = 'force-dynamic';
export const revalidate = 0;            // disable ISR completely
export const fetchCache = 'force-no-store'; // if this route calls fetch()
export const runtime = 'nodejs';        // (optional) make explicit it's a Node function

// Validation schema for query parameters
const querySchema = z.object({
  dateRange: z.enum(['7d', '30d']).default('7d'),
});

// Types for our data
interface ReportKPIs {
  impressions: number;
  clicks: number;
  ctr: number;
  spend: number;
}

interface ReportData {
  kpis: ReportKPIs;
  dailyData: Array<{
    date: string;
    impressions: number;
    clicks: number;
    spend: number;
  }>;
  campaignData: Array<{
    id: number;
    name: string;
    impressions: number;
    clicks: number;
    spend: number;
    ctr: number;
  }>;
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication and role
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADVERTISER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = {
      dateRange: searchParams.get('dateRange') || '7d',
    };

    const validatedParams = querySchema.parse(queryParams);

    // Calculate date range
    const days = validatedParams.dateRange === '30d' ? 30 : 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get KPIs from reports
    const kpiData = await prisma.report.aggregate({
      where: {
        campaign: {
          advertiserId: parseInt(session.user.id),
        },
        date: {
          gte: startDate,
        },
      },
      _sum: {
        impressions: true,
        clicks: true,
        spend: true,
      },
    });

    // Get daily data
    const dailyReports = await prisma.report.findMany({
      where: {
        campaign: {
          advertiserId: parseInt(session.user.id),
        },
        date: {
          gte: startDate,
        },
      },
      orderBy: { date: 'asc' },
    });

    // Get campaign data
    const campaignReports = await prisma.campaign.findMany({
      where: {
        advertiserId: parseInt(session.user.id),
      },
      include: {
        reports: {
          where: {
            date: {
              gte: startDate,
            },
          },
        },
      },
    });

    // Process KPIs
    const impressions = kpiData._sum.impressions || 0;
    const clicks = kpiData._sum.clicks || 0;
    const spend = kpiData._sum.spend || 0;
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;

    // Process daily data
    const dailyData = dailyReports.map(report => ({
      date: report.date.toISOString().split('T')[0],
      impressions: report.impressions,
      clicks: report.clicks,
      spend: report.spend,
    }));

    // Process campaign data
    const campaignData = campaignReports.map(campaign => {
      const campaignImpressions = campaign.reports.reduce((sum, report) => sum + report.impressions, 0);
      const campaignClicks = campaign.reports.reduce((sum, report) => sum + report.clicks, 0);
      const campaignSpend = campaign.reports.reduce((sum, report) => sum + report.spend, 0);
      const campaignCtr = campaignImpressions > 0 ? (campaignClicks / campaignImpressions) * 100 : 0;

      return {
        id: campaign.id,
        name: campaign.name,
        impressions: campaignImpressions,
        clicks: campaignClicks,
        spend: campaignSpend,
        ctr: Math.round(campaignCtr * 100) / 100,
      };
    });

    const reportData: ReportData = {
      kpis: {
        impressions,
        clicks,
        ctr: Math.round(ctr * 100) / 100,
        spend,
      },
      dailyData,
      campaignData,
    };

    return Response.json(reportData, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error) {
    console.error("Advertiser reports API error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

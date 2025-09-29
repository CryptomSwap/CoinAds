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
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "dateFrom must be in YYYY-MM-DD format"),
  dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "dateTo must be in YYYY-MM-DD format"),
  campaignId: z.string().optional(),
  siteId: z.string().optional(),
  placementId: z.string().optional(),
});

// CSV row interface
interface CSVRow {
  date: string;
  campaignId: string;
  campaignName: string;
  impressions: string;
  clicks: string;
  ctr: string;
  spend_cents: string;
  ecpm: string;
}

// Helper function to escape CSV values
function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

// Helper function to format CSV row
function formatCSVRow(row: CSVRow): string {
  return [
    escapeCSV(row.date),
    escapeCSV(row.campaignId),
    escapeCSV(row.campaignName),
    escapeCSV(row.impressions),
    escapeCSV(row.clicks),
    escapeCSV(row.ctr),
    escapeCSV(row.spend_cents),
    escapeCSV(row.ecpm),
  ].join(',');
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
      dateFrom: searchParams.get('dateFrom'),
      dateTo: searchParams.get('dateTo'),
      campaignId: searchParams.get('campaignId'),
      siteId: searchParams.get('siteId'),
      placementId: searchParams.get('placementId'),
    };

    const validatedParams = querySchema.parse(queryParams);

    // Convert date strings to Date objects
    const dateFrom = new Date(validatedParams.dateFrom);
    const dateTo = new Date(validatedParams.dateTo);
    dateTo.setHours(23, 59, 59, 999); // End of day

    // Build where clause for filtering
    const whereClause: any = {
      campaign: {
        advertiserId: parseInt(session.user.id),
      },
      date: {
        gte: dateFrom,
        lte: dateTo,
      },
    };

    // Add optional filters
    if (validatedParams.campaignId) {
      whereClause.campaignId = parseInt(validatedParams.campaignId);
    }

    // Query reports with related data
    const reports = await prisma.report.findMany({
      where: whereClause,
      include: {
        campaign: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { date: 'asc' },
        { campaignId: 'asc' },
      ],
    });

    // Generate CSV content
    const csvHeader = "date,campaignId,campaignName,impressions,clicks,ctr,spend_cents,ecpm";
    
    const csvRows = reports.map(report => {
      const ctr = report.impressions > 0 ? (report.clicks / report.impressions) * 100 : 0;
      const spendCents = Math.round(report.spend * 100); // Convert to cents
      const ecpm = report.impressions > 0 ? (report.spend / report.impressions) * 1000 : 0;

      return formatCSVRow({
        date: report.date.toISOString().split('T')[0],
        campaignId: report.campaignId.toString(),
        campaignName: report.campaign?.name || 'Unknown Campaign',
        impressions: report.impressions.toString(),
        clicks: report.clicks.toString(),
        ctr: ctr.toFixed(2),
        spend_cents: spendCents.toString(),
        ecpm: ecpm.toFixed(2),
      });
    });

    const csvContent = [csvHeader, ...csvRows].join('\n');

    // Generate filename with date range
    const filename = `coinads_advertiser_report_${validatedParams.dateFrom}_to_${validatedParams.dateTo}.csv`;

    // Return CSV response
    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error) {
    console.error("CSV export error:", error);

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

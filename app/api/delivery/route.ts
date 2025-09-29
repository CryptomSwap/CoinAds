import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleCORS, addCORSHeaders, createCORSErrorResponse } from "@/lib/cors";

export const dynamic = 'force-dynamic';


// Helper function to add security headers
function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
}

// Mock delivery logic for MVP
export async function GET(request: NextRequest) {
  // Handle CORS
  const corsResponse = handleCORS(request);
  if (corsResponse) {
    return corsResponse;
  }
  try {
    const { searchParams } = new URL(request.url);
    const placementId = searchParams.get("placementId");
    const width = searchParams.get("w");
    const height = searchParams.get("h");
    const country = searchParams.get("country") || "US";
    const device = searchParams.get("device") || "desktop";
    const url = searchParams.get("url") || "";

    if (!placementId || !width || !height) {
      return createCORSErrorResponse("Missing required parameters");
    }

    // In production, this would:
    // 1. Look up the placement in the database
    // 2. Find eligible campaigns for this placement
    // 3. Run ad selection algorithm
    // 4. Return the winning creative

    // For MVP, return a simple placeholder ad
    const campaignId = 1; // Use integer ID for database
    const creativeId = 1; // Use integer ID for database
    const siteId = 1; // Use integer ID for database
    const clickId = `click_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const adHtml = `
      <div style="width: ${width}px; height: ${height}px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-family: Arial, sans-serif; cursor: pointer; position: relative; overflow: hidden;" 
           onclick="window.open('https://coinads.com/c?cid=${campaignId}&cr=${creativeId}&pl=${placementId}&sid=&clid=${clickId}&u=${encodeURIComponent(url)}', '_blank')">
        <div style="text-align: center;">
          <div style="font-size: 18px; font-weight: bold; margin-bottom: 4px;">🚀 Crypto Ads</div>
          <div style="font-size: 12px; opacity: 0.9;">Powered by CoinAds</div>
        </div>
        <div style="position: absolute; top: 4px; right: 4px; font-size: 10px; opacity: 0.7;">Ad</div>
      </div>
    `;

    // Generate a mock impression ID for tracking
    const impressionId = `imp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Track impression (in production, this would be async)
    try {
      // Update daily report aggregate
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize to start of day

      // Find existing report for today
      const existingReport = await prisma.report.findFirst({
        where: {
          campaignId: campaignId,
          date: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Next day
          },
        },
      });

      if (existingReport) {
        // Update existing report
        await prisma.report.update({
          where: { id: existingReport.id },
          data: {
            impressions: { increment: 1 },
            spend: { increment: 0.005 }, // Increment spend by $0.005
          },
        });
      } else {
        // Create new report
        await prisma.report.create({
          data: {
            campaignId: campaignId,
            date: today,
            impressions: 1,
            clicks: 0,
            spend: 0.005,
          },
        });
      }
    } catch (error) {
      console.error("Failed to track impression:", error);
      // Don't fail the request if tracking fails
    }

    const response = NextResponse.json({
      html: adHtml,
      campaignId: campaignId,
        creativeId: creativeId,
      trackImpUrl: `/api/track/imp?campaignId=${campaignId}&creativeId=${creativeId}&placementId=${placementId}`,
      clickUrl: `/c?cid=${campaignId}&cr=${creativeId}&pl=${placementId}&sid=&clid=${clickId}&u=${encodeURIComponent(url)}`,
      impressionId: impressionId
    });
    return addSecurityHeaders(addCORSHeaders(response, request));

  } catch (error) {
    console.error("Delivery API error:", error);
    return createCORSErrorResponse("Internal server error");
  }
}

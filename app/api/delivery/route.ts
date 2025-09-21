import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// Mock delivery logic for MVP
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const placementId = searchParams.get("placementId");
    const width = searchParams.get("w");
    const height = searchParams.get("h");
    const country = searchParams.get("country") || "US";
    const device = searchParams.get("device") || "desktop";
    const url = searchParams.get("url") || "";

    if (!placementId || !width || !height) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // In production, this would:
    // 1. Look up the placement in the database
    // 2. Find eligible campaigns for this placement
    // 3. Run ad selection algorithm
    // 4. Return the winning creative

    // For MVP, return a simple mock ad
    const mockCampaignId = "mock-campaign-1";
    const mockCreativeId = "mock-creative-1";
    const clickId = `click_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const adHtml = `
      <div style="width: ${width}px; height: ${height}px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-family: Arial, sans-serif; cursor: pointer; position: relative; overflow: hidden;" 
           onclick="window.open('https://coinads.com/c?cid=${mockCampaignId}&cr=${mockCreativeId}&pl=${placementId}&sid=&clid=${clickId}&u=${encodeURIComponent(url)}', '_blank')">
        <div style="text-align: center;">
          <div style="font-size: 18px; font-weight: bold; margin-bottom: 4px;">🚀 Crypto Ads</div>
          <div style="font-size: 12px; opacity: 0.9;">Powered by CoinAds</div>
        </div>
        <div style="position: absolute; top: 4px; right: 4px; font-size: 10px; opacity: 0.7;">Ad</div>
      </div>
    `;

    // Track impression (in production, this would be async)
    try {
      await prisma.impression.create({
        data: {
          campaignId: mockCampaignId,
          creativeId: mockCreativeId,
          placementId: placementId,
          siteId: "mock-site-1",
          country: country,
          device: device,
          size: `${width}x${height}`,
          ivtFlag: false,
          costMicros: 5000000 // $5.00 CPM in micro-cents
        }
      });
    } catch (error) {
      console.error("Failed to track impression:", error);
      // Don't fail the request if tracking fails
    }

    return NextResponse.json({
      html: adHtml,
      campaignId: mockCampaignId,
      creativeId: mockCreativeId,
      trackImpUrl: `/api/track/imp?campaignId=${mockCampaignId}&creativeId=${mockCreativeId}&placementId=${placementId}`,
      clickUrl: `/c?cid=${mockCampaignId}&cr=${mockCreativeId}&pl=${placementId}&sid=&clid=${clickId}&u=${encodeURIComponent(url)}`
    });

  } catch (error) {
    console.error("Delivery API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

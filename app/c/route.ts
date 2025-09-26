import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get("cid");
    const creativeId = searchParams.get("cr");
    const placementId = searchParams.get("pl");
    const siteId = searchParams.get("sid");
    const clickId = searchParams.get("clid");
    const url = searchParams.get("u");

    if (!campaignId || !creativeId || !clickId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Track click
    try {
      // First create an impression if it doesn't exist
      const impression = await prisma.impression.create({
        data: {
          campaignId: parseInt(campaignId),
          creativeId: parseInt(creativeId),
          placementId: placementId ? parseInt(placementId) : undefined,
          siteId: siteId ? parseInt(siteId) : undefined,
          country: "US", // In production, get from IP geolocation
          device: "desktop", // In production, detect from user agent
          costMicros: 5000000 // $5.00 CPM in micro-cents
        }
      });

      // Then create the click
      await prisma.click.create({
        data: {
          impressionId: impression.id,
        }
      });
    } catch (error) {
      console.error("Failed to track click:", error);
      // Don't fail the redirect if tracking fails
    }

    // Redirect to the target URL or default landing page
    const targetUrl = url || "https://coinads.com";
    
    return NextResponse.redirect(targetUrl);

  } catch (error) {
    console.error("Click tracking error:", error);
    // Fallback redirect
    return NextResponse.redirect("https://coinads.com");
  }
}

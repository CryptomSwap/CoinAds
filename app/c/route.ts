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
      await prisma.click.create({
        data: {
          campaignId: campaignId,
          creativeId: creativeId,
          placementId: placementId || null,
          siteId: siteId || null,
          clickId: clickId,
          country: "US", // In production, get from IP geolocation
          device: "desktop", // In production, detect from user agent
          size: "728x90" // In production, get from request
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

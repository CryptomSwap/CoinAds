import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const impressionId = searchParams.get("impressionId");
    const userAgent = request.headers.get("user-agent") || "";
    const ip = request.headers.get("x-forwarded-for") || 
               request.headers.get("x-real-ip") || 
               "127.0.0.1";

    if (!impressionId) {
      return NextResponse.json({ error: "Missing impressionId" }, { status: 400 });
    }

    // Get impression details
    const impression = await prisma.impression.findUnique({
      where: { id: impressionId },
      include: {
        lineItem: {
          include: {
            creatives: true,
            campaign: true,
          },
        },
        creative: true,
        campaign: true,
      },
    });

    if (!impression) {
      return NextResponse.json({ error: "Impression not found" }, { status: 404 });
    }

    // Check if click already exists (prevent duplicate clicks)
    const existingClick = await prisma.click.findFirst({
      where: { impressionId },
    });

    if (existingClick) {
      // Redirect to the original landing page
      const creative = impression.creative;
      if (creative) {
        return NextResponse.redirect(creative.clickUrl);
      }
      return NextResponse.redirect("https://example.com");
    }

    // Create click record
    const click = await prisma.click.create({
      data: {
        impressionId: impression.id,
        campaignId: impression.campaignId,
        creativeId: impression.creativeId,
        placementId: impression.placementId,
        siteId: impression.siteId,
        clickId: `click_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ip: ip.split(",")[0],
        ua: userAgent,
        country: "US", // In production, use GeoIP service
        device: userAgent.includes("Mobile") ? "mobile" : "desktop",
        size: impression.size,
      },
    });

    // Get the landing URL from the creative
    const creative = impression.creative;
    const landingUrl = creative?.clickUrl || "https://example.com";

    // Log the click for analytics
    console.log("Click tracked:", {
      clickId: click.id,
      impressionId: impression.id,
      lineItemId: impression.lineItemId,
      campaignId: impression.campaignId,
      timestamp: new Date().toISOString(),
    });

    // Redirect to the landing page
    return NextResponse.redirect(landingUrl);

  } catch (error) {
    console.error("Click tracking error:", error);
    return NextResponse.redirect("https://example.com");
  }
}

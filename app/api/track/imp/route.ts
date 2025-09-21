import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get("campaignId");
    const creativeId = searchParams.get("creativeId");
    const placementId = searchParams.get("placementId");
    const siteId = searchParams.get("siteId");

    if (!campaignId || !creativeId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Track impression
    await prisma.impression.create({
      data: {
        campaignId: campaignId,
        creativeId: creativeId,
        placementId: placementId || null,
        siteId: siteId || null,
        country: "US", // In production, get from IP geolocation
        device: "desktop", // In production, detect from user agent
        size: "728x90", // In production, get from request
        ivtFlag: false, // In production, implement IVT detection
        costMicros: 5000000 // $5.00 CPM in micro-cents
      }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Impression tracking error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

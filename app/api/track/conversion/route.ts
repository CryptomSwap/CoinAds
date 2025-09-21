import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clickId = searchParams.get("clickId");
    const campaignId = searchParams.get("campaignId");
    const value = parseFloat(searchParams.get("value") || "0");
    const currency = searchParams.get("currency") || "USD";

    if (!clickId && !campaignId) {
      return NextResponse.json({ error: "Missing clickId or campaignId" }, { status: 400 });
    }

    let conversion;

    if (clickId) {
      // Track conversion for specific click
      const click = await prisma.click.findUnique({
        where: { id: clickId },
        include: {
          impression: {
            include: {
              campaign: true,
            },
          },
        },
      });

      if (!click) {
        return NextResponse.json({ error: "Click not found" }, { status: 404 });
      }

      conversion = await prisma.conversion.create({
        data: {
          clickId: click.id,
          campaignId: click.campaignId,
          value,
          currency,
          meta: JSON.stringify({
            timestamp: new Date().toISOString(),
            source: "pixel",
          }),
        },
      });
    } else if (campaignId) {
      // Track conversion for campaign (without specific click)
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId },
      });

      if (!campaign) {
        return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
      }

      // Create a conversion without click association
      conversion = await prisma.conversion.create({
        data: {
          campaignId,
          value,
          currency,
          meta: JSON.stringify({
            campaignId,
            timestamp: new Date().toISOString(),
            source: "pixel",
          }),
        },
      });
    }

    console.log("Conversion tracked:", {
      conversionId: conversion?.id,
      clickId,
      campaignId,
      value,
      currency,
      timestamp: new Date().toISOString(),
    });

    // Return 1x1 pixel
    const pixel = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
      "base64"
    );

    return new NextResponse(pixel, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });

  } catch (error) {
    console.error("Conversion tracking error:", error);
    
    // Return empty pixel on error
    const pixel = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
      "base64"
    );

    return new NextResponse(pixel, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleCORS, addCORSHeaders, createCORSErrorResponse } from "@/lib/cors";

export const dynamic = 'force-dynamic';

// Note: Body size limits are handled by middleware

export async function GET(request: NextRequest) {
  // Handle CORS
  const corsResponse = handleCORS(request);
  if (corsResponse) {
    return corsResponse;
  }
  try {
    const { searchParams } = new URL(request.url);
    const clickId = searchParams.get("clickId");
    const campaignId = searchParams.get("campaignId");
    const value = parseFloat(searchParams.get("value") || "0");
    const currency = searchParams.get("currency") || "USD";

    if (!clickId && !campaignId) {
      return createCORSErrorResponse("Missing clickId or campaignId");
    }

    let conversion;

    if (clickId) {
      // Track conversion for specific click
      const click = await prisma.click.findUnique({
        where: { id: parseInt(clickId) },
        include: {
          impression: {
            include: {
              campaign: true,
            },
          },
        },
      });

      if (!click) {
        return createCORSErrorResponse("Click not found");
      }

      conversion = await prisma.conversion.create({
        data: {
          clickId: click.id,
          campaignId: click.impression.campaignId,
          value,
          currency,
        },
      });
    } else if (campaignId) {
      // Track conversion for campaign (without specific click)
      const campaign = await prisma.campaign.findUnique({
        where: { id: parseInt(campaignId) },
      });

      if (!campaign) {
        return createCORSErrorResponse("Campaign not found");
      }

      // Create a conversion without click association
      conversion = await prisma.conversion.create({
        data: {
          campaignId: parseInt(campaignId),
          value,
          currency,
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

    const response = new NextResponse(pixel, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
    return addCORSHeaders(response, request);

  } catch (error) {
    console.error("Conversion tracking error:", error);
    
    // Return empty pixel on error
    const pixel = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
      "base64"
    );

    const response = new NextResponse(pixel, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
    return addCORSHeaders(response, request);
  }
}

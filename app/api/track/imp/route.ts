import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleCORS, addCORSHeaders, createCORSErrorResponse } from "@/lib/cors";

// Body size limit for App Router
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}

// Helper function to add security headers
function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
}

export async function POST(request: NextRequest) {
  // Handle CORS
  const corsResponse = handleCORS(request);
  if (corsResponse) {
    return corsResponse;
  }
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get("campaignId");
    const creativeId = searchParams.get("creativeId");
    const placementId = searchParams.get("placementId");
    const siteId = searchParams.get("siteId");

    if (!campaignId || !creativeId) {
      return createCORSErrorResponse("Missing required parameters");
    }

            // Track impression
            await prisma.impression.create({
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

    const response = NextResponse.json({ success: true });
    return addSecurityHeaders(addCORSHeaders(response, request));

  } catch (error) {
    console.error("Impression tracking error:", error);
    return createCORSErrorResponse("Internal server error");
  }
}

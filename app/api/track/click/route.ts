import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleCORS, addCORSHeaders, createCORSErrorResponse } from "@/lib/cors";
import { rateLimit, createRateLimitHeaders, createRateLimitResponse } from "@/lib/rate-limit";

export const dynamic = 'force-dynamic';


// Helper function to add security headers
function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
}

export async function GET(request: NextRequest) {
  // Handle CORS
  const corsResponse = handleCORS(request);
  if (corsResponse) {
    return corsResponse;
  }

  // Apply rate limiting
  const rateLimitResult = await rateLimit(request);
  if (!rateLimitResult.allowed) {
    return createRateLimitResponse(rateLimitResult);
  }

  try {
    const { searchParams } = new URL(request.url);
    const impressionId = searchParams.get("impressionId");
    const userAgent = request.headers.get("user-agent") || "";
    const ip = request.headers.get("x-forwarded-for") || 
               request.headers.get("x-real-ip") || 
               "127.0.0.1";

    if (!impressionId) {
      return createCORSErrorResponse("Missing impressionId");
    }

    // Get impression details
    const impression = await prisma.impression.findUnique({
      where: { id: parseInt(impressionId) },
      include: {
        creative: true,
        campaign: true,
        placement: true,
        site: true,
      },
    });

    if (!impression) {
      return createCORSErrorResponse("Impression not found");
    }

    // Check if click already exists (prevent duplicate clicks)
    const existingClick = await prisma.click.findFirst({
      where: { impressionId: parseInt(impressionId) },
    });

    if (existingClick) {
      // Redirect to the original landing page
      const creative = impression.creative;
      if (creative) {
        const response = NextResponse.redirect(creative.clickUrl);
        return addSecurityHeaders(addCORSHeaders(response, request));
      }
      const response = NextResponse.redirect("https://example.com");
      return addSecurityHeaders(addCORSHeaders(response, request));
    }

    // Create click record
    const click = await prisma.click.create({
      data: {
        impressionId: impression.id,
      },
    });

    // Get the landing URL from the creative
    const creative = impression.creative;
    const landingUrl = creative?.clickUrl || "https://example.com";

    // Log the click for analytics
    console.log("Click tracked:", {
      clickId: click.id,
      impressionId: impression.id,
      campaignId: impression.campaignId,
      timestamp: new Date().toISOString(),
    });

    // Redirect to the landing page
    const response = NextResponse.redirect(landingUrl);
    const headers = createRateLimitHeaders(rateLimitResult);
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return addSecurityHeaders(addCORSHeaders(response, request));

  } catch (error) {
    console.error("Click tracking error:", error);
    const response = NextResponse.redirect("https://example.com");
    return addSecurityHeaders(addCORSHeaders(response, request));
  }
}

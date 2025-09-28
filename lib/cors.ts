import { NextRequest, NextResponse } from 'next/server';

// CORS configuration - production-safe with allow-list
const CORS_CONFIG = {
  // Production: restrict to specific domains from ALLOWED_ORIGINS
  // Development: allow localhost for development
  allowedOrigins: process.env.NODE_ENV === 'production' 
    ? (process.env.ALLOWED_ORIGINS?.split(',') || [])
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  allowedMethods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'User-Agent',
    'Referer',
  ],
  maxAge: 86400, // 24 hours
};

// Helper function to get origin from request
function getOrigin(request: NextRequest): string | null {
  return request.headers.get('origin') || request.headers.get('referer') || null;
}

// Helper function to check if origin is allowed
function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  
  // In production, require explicit allow-list
  if (process.env.NODE_ENV === 'production') {
    return CORS_CONFIG.allowedOrigins.includes(origin);
  }
  
  // In development, allow localhost
  return CORS_CONFIG.allowedOrigins.includes(origin);
}

// Helper function to get allowed origin for response
function getAllowedOrigin(request: NextRequest): string {
  const origin = getOrigin(request);
  
  // Return the origin if it's allowed, otherwise return the first allowed origin
  return isOriginAllowed(origin) ? origin! : CORS_CONFIG.allowedOrigins[0];
}

// Helper function to add CORS headers to response
export function addCORSHeaders(response: NextResponse, request: NextRequest): NextResponse {
  const allowedOrigin = getAllowedOrigin(request);
  
  response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  response.headers.set('Access-Control-Allow-Methods', CORS_CONFIG.allowedMethods.join(', '));
  response.headers.set('Access-Control-Allow-Headers', CORS_CONFIG.allowedHeaders.join(', '));
  response.headers.set('Access-Control-Max-Age', CORS_CONFIG.maxAge.toString());
  response.headers.set('Vary', 'Origin');
  
  // Allow credentials for specific origins
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  
  return response;
}

// Helper function to handle CORS preflight requests
export function handleCORS(request: NextRequest): NextResponse | null {
  // Only handle OPTIONS requests
  if (request.method !== 'OPTIONS') {
    return null;
  }
  
  const origin = getOrigin(request);
  
  // Check if origin is allowed
  if (!isOriginAllowed(origin)) {
    return new NextResponse(null, { status: 403 });
  }
  
  // Create preflight response
  const response = new NextResponse(null, { status: 200 });
  return addCORSHeaders(response, request);
}

// Helper function to create CORS error response
export function createCORSErrorResponse(message: string = 'CORS policy violation'): NextResponse {
  return NextResponse.json(
    { error: message },
    { 
      status: 403,
      headers: {
        'Vary': 'Origin',
      }
    }
  );
}

// Helper function to validate request method
export function validateMethod(request: NextRequest, allowedMethods: string[] = ['GET', 'POST']): boolean {
  return allowedMethods.includes(request.method);
}

// Helper function to create method not allowed response
export function createMethodNotAllowedResponse(allowedMethods: string[]): NextResponse {
  const response = NextResponse.json(
    { error: `Method not allowed. Allowed methods: ${allowedMethods.join(', ')}` },
    { status: 405 }
  );
  
  response.headers.set('Allow', allowedMethods.join(', '));
  return response;
}

// Main CORS middleware function
export function withCORS(
  handler: (request: NextRequest) => Promise<NextResponse> | NextResponse,
  options: {
    allowedMethods?: string[];
    requireOrigin?: boolean;
  } = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const { allowedMethods = ['GET', 'POST'], requireOrigin = false } = options;
    
    // Handle preflight requests
    const preflightResponse = handleCORS(request);
    if (preflightResponse) {
      return preflightResponse;
    }
    
    // Validate method
    if (!validateMethod(request, allowedMethods)) {
      return createMethodNotAllowedResponse(allowedMethods);
    }
    
    // Check origin if required
    if (requireOrigin) {
      const origin = getOrigin(request);
      if (!isOriginAllowed(origin)) {
        return createCORSErrorResponse('Origin not allowed');
      }
    }
    
    // Execute the actual handler
    const response = await handler(request);
    
    // Add CORS headers to the response
    return addCORSHeaders(response, request);
  };
}

// Export configuration for reference
export { CORS_CONFIG };
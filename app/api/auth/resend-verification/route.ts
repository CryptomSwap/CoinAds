import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { resendVerificationEmail } from '@/lib/email-verification';
import { checkRateLimitRedis, getRateLimitHeaders } from '@/lib/rate-limit';

const resendSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimit = await checkRateLimitRedis(request, 'auth');
    if (!rateLimit.allowed) {
      const headers = getRateLimitHeaders(rateLimit.remaining, rateLimit.resetTime);
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers }
      );
    }

    const body = await request.json();
    const { email } = resendSchema.parse(body);

    await resendVerificationEmail(email);

    // Always return success to avoid revealing user existence
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Resend verification error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Always return success to avoid revealing user existence
    return NextResponse.json({ success: true });
  }
}

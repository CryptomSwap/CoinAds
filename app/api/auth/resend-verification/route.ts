import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { resendVerificationEmail } from '@/lib/email-verification';
import { rateLimit, createRateLimitResponse } from '@/lib/rate-limit';

const resendSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimitResult = await rateLimit(request, {
      key: 'auth',
      limit: 5,
      windowMs: 15 * 60 * 1000, // 15 minutes
    });
    if (!rateLimitResult.ok) {
      return createRateLimitResponse({
        ...rateLimitResult,
        body: { error: 'Too many requests. Please try again later.' }
      });
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

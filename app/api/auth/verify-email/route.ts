import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyEmailToken } from '@/lib/email-verification';
import { rateLimit, createRateLimitResponse } from '@/lib/rate-limit';

const verifySchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimitResult = await rateLimit(request, {
      key: 'auth',
      limit: 10,
      windowMs: 15 * 60 * 1000, // 15 minutes
    });
    if (!rateLimitResult.ok) {
      return createRateLimitResponse({
        ...rateLimitResult,
        body: { error: 'Too many verification attempts. Please try again later.' }
      });
    }

    const body = await request.json();
    const { token } = verifySchema.parse(body);

    const result = await verifyEmailToken(token);

    if (result.success) {
      return NextResponse.json({ success: true, message: 'Email verified successfully' });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Email verification error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid token format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

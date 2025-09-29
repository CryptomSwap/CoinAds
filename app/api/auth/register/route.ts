import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { sendVerificationEmail } from "@/lib/email-verification";
import { rateLimit, createRateLimitHeaders, createRateLimitResponse } from "@/lib/rate-limit";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
  role: z.enum(["ADVERTISER", "PUBLISHER"]),
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
        body: { error: 'Too many registration attempts. Please try again later.' }
      });
    }

    const body = await request.json();
    const { name, email, password, role } = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user and wallet in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user with hashed password (emailVerified is null by default)
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role as any,
        },
      });

      return { user };
    });

    // Send verification email
    try {
      await sendVerificationEmail(result.user.id, result.user.email);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail registration if email fails
    }

    return NextResponse.json({
      message: "User created successfully. Please check your email to verify your account.",
      pendingVerification: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
      },
    });
  } catch (error) {
    const { log } = await import('@/lib/logger');
    log.error("Registration error", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

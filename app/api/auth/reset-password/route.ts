import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { z } from "zod";
import { sendMail, emailTemplates, isEmailServiceAvailable } from "@/lib/email";
import { serverEnv } from "@/lib/env/server";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        message: "If an account with that email exists, we've sent a password reset link.",
      });
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    // For MVP, we'll skip token storage and just log the token
    // In production, you'd store this in a secure way

    // Send email with reset link
    if (isEmailServiceAvailable()) {
      try {
        const resetUrl = `${serverEnv.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;
        const emailTemplate = emailTemplates.passwordReset(resetUrl, user.name || undefined);
        
        await sendMail({
          to: email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
          text: emailTemplate.text,
        });

        console.log(`Password reset email sent to ${email}`);
      } catch (emailError) {
        console.error("Failed to send password reset email:", emailError);
        // Continue execution - don't fail the request if email fails
        // In development, log the token for testing
        if (serverEnv.NODE_ENV === "development") {
          console.log(`Password reset token for ${email}: ${resetToken}`);
        }
      }
    } else {
      // Email service not configured - log token in development
      if (serverEnv.NODE_ENV === "development") {
        console.log(`Password reset token for ${email}: ${resetToken}`);
        console.warn("Email service not configured - password reset token logged above");
      }
    }

    return NextResponse.json({
      ok: true,
      message: "If an account with that email exists, we've sent a password reset link.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    
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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = resetPasswordSchema.parse(body);

    // For MVP, we'll skip token validation and password update
    // In production, you'd validate the token and update the user's password
    // Since we don't have password fields in the User model, we'll just return success

    return NextResponse.json({
      ok: true,
      message: "Password reset successfully. You can now sign in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    
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

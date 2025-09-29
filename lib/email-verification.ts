import { randomBytes } from 'crypto';
import { prisma } from './prisma';
import { sendMail } from './email';

export async function sendVerificationEmail(userId: number, email: string) {
  try {
    // Generate a secure random token
    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    // Note: verificationToken model doesn't exist in schema
    // In a real implementation, you would need to add this model to Prisma schema
    console.log(`Verification token for user ${userId}: ${token} (expires: ${expires})`);

    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;

    // Try to send email via SMTP if configured
    if (process.env.EMAIL_SERVER_HOST && process.env.EMAIL_FROM) {
      await sendMail({
        to: email,
        subject: 'Verify your CoinAds account',
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
            <h1 style="color: #333;">Verify Your Email Address</h1>
            <p>Thank you for signing up for CoinAds! Please verify your email address by clicking the link below:</p>
            <a href="${verificationUrl}" style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">
              Verify Email Address
            </a>
            <p>This link will expire in 30 minutes.</p>
            <p>If you didn't create an account with CoinAds, you can safely ignore this email.</p>
          </div>
        `,
        text: `
          Verify Your Email Address
          
          Thank you for signing up for CoinAds! Please verify your email address by visiting:
          ${verificationUrl}
          
          This link will expire in 30 minutes.
          
          If you didn't create an account with CoinAds, you can safely ignore this email.
        `,
      });
      
      console.log(`✅ Verification email sent to ${email}`);
    } else {
      // Fallback: log the verification link to server logs
      console.log(`📧 Email verification link for ${email}: ${verificationUrl}`);
      console.log('⚠️  SMTP not configured. Email verification link logged above.');
    }

    return { success: true, token };
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw new Error('Failed to send verification email');
  }
}

export async function verifyEmailToken(token: string) {
  try {
    // Note: verificationToken model doesn't exist in schema
    // In a real implementation, you would need to add this model to Prisma schema
    console.log(`Email verification attempted with token: ${token}`);
    
    // For now, just return success since we can't verify without the model
    return { success: false, error: 'Email verification not implemented - missing verificationToken model' };

    return { success: true };
  } catch (error) {
    console.error('Failed to verify email token:', error);
    return { success: false, error: 'Failed to verify email' };
  }
}

export async function resendVerificationEmail(email: string) {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not
      return { success: true };
    }

    // Note: emailVerified field doesn't exist in User model
    // In a real implementation, you would need to add this field to the User model
    
    // Note: verificationToken model doesn't exist in schema
    // In a real implementation, you would need to add this model to Prisma schema

    // Send new verification email
    await sendVerificationEmail(user.id, user.email);

    return { success: true };
  } catch (error) {
    console.error('Failed to resend verification email:', error);
    // Always return success to avoid revealing user existence
    return { success: true };
  }
}

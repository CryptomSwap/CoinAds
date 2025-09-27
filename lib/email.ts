import nodemailer from "nodemailer";
import { serverEnv, hasEmailConfig } from "./env/server";

// Email configuration interface
interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Email message interface
export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Create email transporter
function createTransporter() {
  if (!hasEmailConfig) {
    throw new Error(
      "❌ Email service is not configured. Please set the following environment variables:\n" +
      "  - EMAIL_SERVER_HOST\n" +
      "  - EMAIL_SERVER_PORT\n" +
      "  - EMAIL_SERVER_USER\n" +
      "  - EMAIL_SERVER_PASSWORD\n" +
      "  - EMAIL_FROM\n\n" +
      "See env.sample for configuration examples."
    );
  }

  const config: EmailConfig = {
    host: serverEnv.EMAIL_SERVER_HOST!,
    port: serverEnv.EMAIL_SERVER_PORT!,
    secure: serverEnv.EMAIL_SERVER_PORT === 465, // true for 465, false for other ports
    auth: {
      user: serverEnv.EMAIL_SERVER_USER!,
      pass: serverEnv.EMAIL_SERVER_PASSWORD!,
    },
  };

  return nodemailer.createTransport(config);
}

// Send email function
export async function sendMail({ to, subject, html, text }: EmailMessage): Promise<void> {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: serverEnv.EMAIL_FROM,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""), // Strip HTML tags for text version
    };

    const result = await transporter.sendMail(mailOptions);
    
    console.log(`📧 Email sent successfully to ${to}:`, {
      messageId: result.messageId,
      subject,
    });

  } catch (error) {
    console.error("❌ Failed to send email:", error);
    
    if (error instanceof Error) {
      // Re-throw with more context
      throw new Error(`Email sending failed: ${error.message}`);
    }
    
    throw new Error("Email sending failed with unknown error");
  }
}

// Email templates
export const emailTemplates = {
  passwordReset: (resetUrl: string, userName?: string) => ({
    subject: "Reset your CoinAds password",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset your CoinAds password</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #02C8B9 0%, #0194D9 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: linear-gradient(135deg, #02C8B9 0%, #0194D9 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello${userName ? ` ${userName}` : ""},</p>
              
              <p>We received a request to reset your password for your CoinAds account. If you made this request, click the button below to reset your password:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 4px; font-family: monospace;">${resetUrl}</p>
              
              <div class="warning">
                <strong>⚠️ Important:</strong>
                <ul>
                  <li>This link will expire in 1 hour for security reasons</li>
                  <li>If you didn't request this password reset, please ignore this email</li>
                  <li>Your password will not be changed until you click the link above</li>
                </ul>
              </div>
              
              <p>If you have any questions or need assistance, please contact our support team.</p>
              
              <p>Best regards,<br>The CoinAds Team</p>
            </div>
            <div class="footer">
              <p>This email was sent from CoinAds - Self-Serve Crypto Ad Platform</p>
              <p>If you didn't request this email, please ignore it.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Password Reset Request
      
      Hello${userName ? ` ${userName}` : ""},
      
      We received a request to reset your password for your CoinAds account. If you made this request, visit the link below to reset your password:
      
      ${resetUrl}
      
      Important:
      - This link will expire in 1 hour for security reasons
      - If you didn't request this password reset, please ignore this email
      - Your password will not be changed until you visit the link above
      
      If you have any questions or need assistance, please contact our support team.
      
      Best regards,
      The CoinAds Team
    `,
  }),

  testEmail: () => ({
    subject: "CoinAds Email Service Test",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Email Service Test</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #02C8B9 0%, #0194D9 100%); color: white; padding: 30px; text-align: center; border-radius: 8px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 8px; margin-top: 20px; }
            .success { background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Email Service Test</h1>
            </div>
            <div class="content">
              <div class="success">
                <strong>Success!</strong> The CoinAds email service is working correctly.
              </div>
              
              <p>This is a test email sent from the CoinAds application to verify that the email configuration is working properly.</p>
              
              <p><strong>Test Details:</strong></p>
              <ul>
                <li>Timestamp: ${new Date().toISOString()}</li>
                <li>Environment: ${serverEnv.NODE_ENV}</li>
                <li>SMTP Host: ${serverEnv.EMAIL_SERVER_HOST}</li>
                <li>SMTP Port: ${serverEnv.EMAIL_SERVER_PORT}</li>
              </ul>
              
              <p>If you received this email, the email service is configured correctly and ready to send transactional emails.</p>
              
              <p>Best regards,<br>The CoinAds Development Team</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Email Service Test
      
      Success! The CoinAds email service is working correctly.
      
      This is a test email sent from the CoinAds application to verify that the email configuration is working properly.
      
      Test Details:
      - Timestamp: ${new Date().toISOString()}
      - Environment: ${serverEnv.NODE_ENV}
      - SMTP Host: ${serverEnv.EMAIL_SERVER_HOST}
      - SMTP Port: ${serverEnv.EMAIL_SERVER_PORT}
      
      If you received this email, the email service is configured correctly and ready to send transactional emails.
      
      Best regards,
      The CoinAds Development Team
    `,
  }),
};

// Utility function to check if email service is available
export function isEmailServiceAvailable(): boolean {
  return hasEmailConfig;
}

// Utility function to get email configuration status
export function getEmailConfigStatus() {
  return {
    configured: hasEmailConfig,
    host: serverEnv.EMAIL_SERVER_HOST || "Not set",
    port: serverEnv.EMAIL_SERVER_PORT || "Not set",
    user: serverEnv.EMAIL_SERVER_USER || "Not set",
    from: serverEnv.EMAIL_FROM || "Not set",
  };
}

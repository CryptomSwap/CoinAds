import { NextRequest, NextResponse } from "next/server";
import { sendMail, emailTemplates } from "@/lib/email";
import { serverEnv, isDevelopment } from "@/lib/env/server";

export async function GET(request: NextRequest) {
  // Block in production - debug endpoints should not be accessible
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 }
    );
  }

  try {
    // Send test email to EMAIL_FROM address
    const testEmail = emailTemplates.testEmail();
    
    await sendMail({
      to: serverEnv.EMAIL_FROM!,
      subject: testEmail.subject,
      html: testEmail.html,
      text: testEmail.text,
    });

    return NextResponse.json({ 
      ok: true,
      message: "Test email sent successfully",
      sentTo: serverEnv.EMAIL_FROM
    });
  } catch (error) {
    console.error("Failed to send test email:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to send test email",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
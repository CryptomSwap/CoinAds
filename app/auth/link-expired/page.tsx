"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";

export const metadata = {
  title: "Link Expired - CoinAds",
  description: "This verification link has expired",
};

export default function LinkExpiredPage() {
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState("");

  const handleResend = async () => {
    setIsResending(true);
    setMessage("");
    
    try {
      // TODO: Implement resend verification logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setMessage("A new verification link has been sent to your email.");
    } catch (error) {
      setMessage("Failed to send new verification link. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-yellow-900">This link has expired</CardTitle>
          <CardDescription>
            The verification link you clicked is no longer valid. Please request a new one.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <Alert>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Button 
              onClick={handleResend}
              disabled={isResending}
              className="w-full"
              data-testid="btn_resend_from_expired"
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Resend verification link"
              )}
            </Button>

            <Button 
              variant="outline" 
              asChild 
              className="w-full"
            >
              <Link href="/auth/signin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Need help?{" "}
              <Link href="/contact" className="font-medium text-primary hover:underline">
                Contact support
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

// Metadata removed - client component cannot export metadata

export default function EmailVerifiedPage() {
  const router = useRouter();

  const handleContinue = () => {
    // TODO: Redirect to appropriate dashboard based on user role
    router.push("/app");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-900">Email verified</CardTitle>
          <CardDescription>
            Your email address has been successfully verified. You can now access your CoinAds account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleContinue}
            className="w-full"
            data-testid="btn_continue"
          >
            Continue to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <div className="text-center">
            <Link 
              href="/auth/signin" 
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

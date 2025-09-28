"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";
import TopBar from "@/components/TopBar";

export default function VerifiedPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect to sign in after 5 seconds
    const timer = setTimeout(() => {
      router.push("/auth/signin?message=Email verified! You can now sign in.");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/90 to-blue-600/20 dark:from-slate-900 dark:to-blue-900/40">
      <TopBar />
      
      <div className="flex items-center justify-center min-h-[80vh] px-6">
        <Card className="max-w-md w-full bg-card/80 backdrop-blur-sm border-border/50 shadow-2xl">
          <CardContent className="p-8 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-foreground">
                Email Verified!
              </h1>
              <p className="text-muted-foreground">
                Your email address has been successfully verified. You can now sign in to your CoinAds account.
              </p>
            </div>
            
            <div className="space-y-4">
              <Button
                onClick={() => router.push("/auth/signin?message=Email verified! You can now sign in.")}
                size="lg"
                className="w-full h-12 text-base font-semibold !bg-gradient-brand hover:!bg-gradient-brand-hover !text-white transition-all duration-200"
              >
                Continue to Sign In
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <p className="text-sm text-muted-foreground">
                Redirecting automatically in 5 seconds...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
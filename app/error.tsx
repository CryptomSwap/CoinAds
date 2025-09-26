"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, RefreshCw, ArrowLeft, AlertTriangle } from "lucide-react";
import { isDevelopment } from "@/lib/env";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-900">Something went wrong</CardTitle>
          <CardDescription>
            An unexpected error occurred. We're working to fix this issue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Button 
              onClick={reset}
              className="w-full"
              data-testid="btn_try_again"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try again
            </Button>

            <Button asChild variant="outline" className="w-full">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go to Homepage
              </Link>
            </Button>

            <Button variant="outline" asChild className="w-full">
              <Link href="javascript:history.back()">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Still having issues?{" "}
              <Link href="/contact" className="font-medium text-primary hover:underline">
                Contact support
              </Link>
            </p>
          </div>

          {isDevelopment && (
            <div className="mt-4 p-3 bg-slate-100 rounded-lg">
              <p className="text-xs font-mono text-slate-600">
                Error: {error.message}
              </p>
              {error.digest && (
                <p className="text-xs font-mono text-slate-500 mt-1">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

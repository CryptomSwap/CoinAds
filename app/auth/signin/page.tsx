"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Eye, EyeOff, UserPlus, ArrowRight, Sparkles, Mail } from "lucide-react";
import TopBar from "@/components/TopBar";
// Removed server-only import to fix build issue

function SignInFormContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [showResendVerification, setShowResendVerification] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const message = searchParams.get("message");
    const error = searchParams.get("error");
    
    if (message) {
      setSuccessMessage(message);
    }
    
    if (error) {
      if (error.includes('verify') || error.includes('verification')) {
        setError('Please verify your email address before signing in.');
        setShowResendVerification(true);
      } else {
        setError(decodeURIComponent(error));
      }
    }
  }, [searchParams]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const result = await signIn("credentials", { 
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error.includes('verify')) {
          setError('Please verify your email address before signing in.');
          setShowResendVerification(true);
          setResendEmail(email);
        } else {
          setError("Invalid credentials. Please check your email and password.");
        }
      } else if (result?.ok) {
        router.push("/app");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!resendEmail) return;
    
    setIsResending(true);
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resendEmail }),
      });

      if (response.ok) {
        setSuccessMessage('Verification email sent! Please check your inbox.');
        setShowResendVerification(false);
        setError('');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/90 to-blue-600/20 dark:from-slate-900 dark:to-blue-900/40">
      <TopBar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        
        <div className="relative">
          {/* Header */}
          <div className="pt-16 pb-8">
            <div className="mx-auto max-w-4xl px-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/80 mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-tight mb-4">
                Welcome Back
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Sign in to continue building your crypto advertising campaigns
              </p>
            </div>
          </div>

          {/* Sign In Form */}
          <div className="mx-auto max-w-lg px-6 pb-24">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-2xl">
              <CardContent className="p-8">
                {successMessage && (
                  <Alert className="mb-8 border-primary/20 bg-primary/5">
                    <AlertDescription className="text-primary">{successMessage}</AlertDescription>
                  </Alert>
                )}

                {/* Google Sign In - only show if configured */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="space-y-6">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full h-12 text-base font-medium border-2 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 group"
                      onClick={() => signIn("google", { callbackUrl: "/app" })}
                    >
                      <div className="flex items-center justify-center">
                        <svg className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Continue with Google
                      </div>
                    </Button>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border/50" />
                      </div>
                      <div className="relative flex justify-center text-sm uppercase">
                        <span className="bg-card px-4 text-muted-foreground font-medium tracking-wider">Or continue with email</span>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSignIn} className="space-y-6 mt-8">
                  {error && (
                    <Alert variant="destructive" className="border-destructive/20 bg-destructive/5">
                      <AlertDescription>{error}</AlertDescription>
                      {showResendVerification && (
                        <div className="mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleResendVerification}
                            disabled={isResending}
                            className="text-sm"
                          >
                            {isResending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Mail className="mr-2 h-4 w-4" />
                                Resend verification email
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </Alert>
                  )}
                  
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-base font-medium">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 text-base border-2 focus:border-primary transition-colors"
                      required
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-base font-medium">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 text-base border-2 focus:border-primary transition-colors pr-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    size="lg"
                    className="w-full h-12 text-base font-semibold !bg-gradient-brand hover:!bg-gradient-brand-hover !text-white transition-all duration-200 transform hover:scale-[1.02]" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-8 text-center space-y-6">
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Don't have an account?{" "}
                      <Button
                        variant="link"
                        className="p-0 h-auto font-semibold text-primary hover:text-primary/80 text-base"
                        onClick={() => setIsSignupOpen(true)}
                      >
                        Create account
                      </Button>
                    </p>
                    <p className="text-muted-foreground">
                      <Button
                        variant="link"
                        className="p-0 h-auto font-medium text-primary hover:text-primary/80 text-base"
                        onClick={() => setIsForgotPasswordOpen(true)}
                      >
                        Forgot your password?
                      </Button>
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-border/50">
                    <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
                      <ArrowRight className="mr-1 h-4 w-4 rotate-180" />
                      Back to home
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Signup Modal */}
      <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
        <DialogContent className="sm:max-w-lg border-border/50 bg-card/95 backdrop-blur-sm">
          <DialogHeader className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 mx-auto">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold">Create Account</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              Join CoinAds to start advertising or monetizing your crypto content
            </DialogDescription>
          </DialogHeader>
          
          {/* Google Sign Up - only show if configured */}
          {process.env.NODE_ENV === 'development' && (
            <div className="space-y-6">
              <Button
                variant="outline"
                size="lg"
                className="w-full h-12 text-base font-medium border-2 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 group"
                onClick={() => signIn("google", { callbackUrl: "/app" })}
              >
                <div className="flex items-center justify-center">
                  <svg className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </div>
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-sm uppercase">
                  <span className="bg-card px-4 text-muted-foreground font-medium tracking-wider">Or sign up with email</span>
                </div>
              </div>
            </div>
          )}
          
          <SignupForm onSuccess={() => setIsSignupOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Forgot Password Modal */}
      <Dialog open={isForgotPasswordOpen} onOpenChange={setIsForgotPasswordOpen}>
        <DialogContent className="sm:max-w-md border-border/50 bg-card/95 backdrop-blur-sm">
          <DialogHeader className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 mx-auto">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold">Reset Password</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              Enter your email address and we'll send you a link to reset your password
            </DialogDescription>
          </DialogHeader>
          
          <ForgotPasswordForm onSuccess={() => setIsForgotPasswordOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SignupForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    company: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          company: formData.company,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        if (data.pendingVerification) {
          setError('');
          alert('Account created! Please check your email to verify your account before signing in.');
        }
        onSuccess();
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-5">
      {error && (
        <Alert variant="destructive" className="border-destructive/20 bg-destructive/5">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="signup-name" className="font-medium">Full Name</Label>
          <Input
            id="signup-name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="h-11 border-2 focus:border-primary transition-colors"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-role" className="font-medium">Account Type</Label>
          <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
            <SelectTrigger className="h-11 border-2 focus:border-primary">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="advertiser">Advertiser</SelectItem>
              <SelectItem value="publisher">Publisher</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-email" className="font-medium">Email address</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="h-11 border-2 focus:border-primary transition-colors"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-company" className="font-medium">Company/Website</Label>
        <Input
          id="signup-company"
          type="text"
          placeholder="Your company or website"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          className="h-11 border-2 focus:border-primary transition-colors"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="signup-password" className="font-medium">Password</Label>
          <div className="relative">
            <Input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              placeholder="Create password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="h-11 border-2 focus:border-primary transition-colors pr-10"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-confirm-password" className="font-medium">Confirm</Label>
          <div className="relative">
            <Input
              id="signup-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="h-11 border-2 focus:border-primary transition-colors pr-10"
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        size="lg"
        className="w-full h-12 text-base font-semibold !bg-gradient-brand hover:!bg-gradient-brand-hover !text-white transition-all duration-200 transform hover:scale-[1.02]" 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Creating account...
          </>
        ) : (
          <>
            <UserPlus className="mr-2 h-5 w-5" />
            Create Account
          </>
        )}
      </Button>
    </form>
  );
}

function ForgotPasswordForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reset email");
      }

      setMessage(data.message);
      // Close modal after 3 seconds on success
      setTimeout(() => {
        onSuccess();
      }, 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive" className="border-destructive/20 bg-destructive/5">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {message && (
        <Alert className="border-primary/20 bg-primary/5">
          <AlertDescription className="text-primary">{message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-3">
        <Label htmlFor="forgot-email" className="text-base font-medium">Email address</Label>
        <Input
          id="forgot-email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 text-base border-2 focus:border-primary transition-colors"
          required
        />
      </div>

      <Button 
        type="submit" 
        size="lg"
        className="w-full h-12 text-base font-semibold !bg-gradient-brand hover:!bg-gradient-brand-hover !text-white transition-all duration-200 transform hover:scale-[1.02]" 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Sending Reset Link...
          </>
        ) : (
          <>
            <Mail className="mr-2 h-5 w-5" />
            Send Reset Link
          </>
        )}
      </Button>

      <div className="text-center">
        <Button
          variant="link"
          className="p-0 h-auto font-medium text-muted-foreground hover:text-foreground"
          onClick={() => onSuccess()}
        >
          <ArrowRight className="mr-1 h-4 w-4 rotate-180" />
          Back to Sign In
        </Button>
      </div>
    </form>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SignInFormContent />
    </Suspense>
  );
}
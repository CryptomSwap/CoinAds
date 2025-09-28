"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Menu, ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";

export default function TopBar() {
  const { data: session } = useSession();
  
  return (
    <nav className="h-16 bg-background/70 backdrop-blur-none border-b border-border/20 sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-6 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Logo className="text-foreground" />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/advertisers" 
              className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring rounded-sm px-2 py-1"
            >
              For Advertisers
            </Link>
            <Link 
              href="/publishers" 
              className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring rounded-sm px-2 py-1"
            >
              For Publishers
            </Link>
            <Link 
              href="/ad-formats" 
              className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring rounded-sm px-2 py-1"
            >
              Ad Formats
            </Link>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            {session ? (
              <Link href="/app">
                <Button 
                  className="!bg-gradient-brand hover:!bg-gradient-brand-hover !text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button 
                    className="!bg-gradient-brand hover:!bg-gradient-brand-hover !text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  <Button className="!bg-gradient-brand hover:!bg-gradient-brand-hover !text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background border-border">
                <div className="flex flex-col space-y-6 mt-8">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Theme</span>
                    <ThemeToggle />
                  </div>
                  <Link 
                    href="/advertisers" 
                    className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-2 py-1"
                  >
                    For Advertisers
                  </Link>
                  <Link 
                    href="/publishers" 
                    className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-2 py-1"
                  >
                    For Publishers
                  </Link>
                  <Link 
                    href="/ad-formats" 
                    className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-2 py-1"
                  >
                    Ad Formats
                  </Link>
                  <div className="pt-4 border-t border-border space-y-3">
                    {session ? (
                      <Link href="/app" className="block">
                        <Button 
                          className="w-full justify-start !bg-gradient-brand hover:!bg-gradient-brand-hover !text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          Dashboard
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    ) : (
                      <>
                        <Link href="/auth/signin" className="block">
                          <Button 
                            className="w-full justify-start !bg-gradient-brand hover:!bg-gradient-brand-hover !text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            Sign In
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href="/auth/signin" className="block">
                          <Button 
                            className="w-full justify-start !bg-gradient-brand hover:!bg-gradient-brand-hover !text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            Sign Up
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

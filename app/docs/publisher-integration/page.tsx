"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, FileText, Settings, Zap } from "lucide-react";

export default function PublisherIntegrationPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-background to-muted">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
            Publisher Integration Guide
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Get your site monetized in minutes with our simple integration process.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2 className="text-3xl font-bold text-foreground mb-6">Quick Start</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Follow these simple steps to start earning from your crypto traffic:
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="border border-border rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-primary/10 rounded-lg mr-3">
                  <Code className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">1. Add the Tag</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Copy and paste our async JavaScript tag into your site's header:
              </p>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                <code>
                  {`<script async src="https://fuseads.com/tag.js"></script>`}
                </code>
              </div>
            </div>

            <div className="border border-border rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-primary/10 rounded-lg mr-3">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">2. Configure Placements</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Set up ad placements in your dashboard and customize targeting:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Banner sizes (728x90, 300x250, etc.)</li>
                <li>• Native ad formats</li>
                <li>• Category restrictions</li>
                <li>• Floor pricing</li>
              </ul>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-foreground mb-6">Advanced Configuration</h2>
          
          <div className="space-y-8 mb-12">
            <div className="border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">Ad Placement Options</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Banner Ads</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Leaderboard (728x90)</li>
                    <li>• Medium Rectangle (300x250)</li>
                    <li>• Skyscraper (160x600)</li>
                    <li>• Mobile Banner (320x50)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Native Ads</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• In-feed content</li>
                    <li>• In-article placements</li>
                    <li>• Sidebar widgets</li>
                    <li>• Custom formats</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border border-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">Revenue Optimization</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Floor Pricing</h4>
                  <p className="text-sm text-muted-foreground">
                    Set minimum CPM rates to ensure quality advertisers.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Category Control</h4>
                  <p className="text-sm text-muted-foreground">
                    Block unwanted ad categories to maintain brand safety.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Frequency Caps</h4>
                  <p className="text-sm text-muted-foreground">
                    Limit ad frequency to improve user experience.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-foreground mb-6">Payouts & Reporting</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Payment Methods</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• USDT (Tether)</li>
                <li>• USDC (USD Coin)</li>
                <li>• Bank transfer (USD)</li>
                <li>• Weekly automatic payouts</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">Real-time Analytics</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Live impression tracking</li>
                <li>• Click-through rates</li>
                <li>• Revenue per placement</li>
                <li>• Geographic breakdown</li>
              </ul>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-foreground mb-6">Get Started Today</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Ready to start monetizing your crypto traffic? Join thousands of publishers 
            already earning with CoinAds.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/auth/signup?role=publisher">
              <Button>
                Start Publishing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">
                Contact Support
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-muted">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/advertisers">For Advertisers</Link></li>
                <li><Link href="/publishers">For Publishers</Link></li>
                <li><Link href="/ad-formats">Ad Formats</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/legal/privacy">Privacy</Link></li>
                <li><Link href="/legal/advertiser-terms">Advertiser Terms</Link></li>
                <li><Link href="/legal/publisher-terms">Publisher Terms</Link></li>
                <li><Link href="/legal/cookies">Cookie Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/contact">Contact Support</Link></li>
                <li><Link href="/auth/signin">Sign In</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

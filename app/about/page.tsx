"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-background to-muted">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
            About CoinAds
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Connecting crypto advertisers with premium publishers through transparent, 
            fraud-protected advertising technology.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
          <p className="text-lg text-muted-foreground mb-8">
            CoinAds was born from the need for better advertising infrastructure in the crypto space. 
            We saw too many advertisers struggling with fraud, poor targeting, and lack of transparency, 
            while publishers weren't getting fair value for their premium crypto traffic.
          </p>

          <h2 className="text-3xl font-bold text-foreground mb-6">What We Do</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">For Advertisers</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Premium crypto site inventory</li>
                <li>• Advanced fraud protection</li>
                <li>• Real-time reporting & analytics</li>
                <li>• Flexible billing options</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-4">For Publishers</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Higher revenue per visitor</li>
                <li>• Weekly USDT/USDC payouts</li>
                <li>• Brand-safe advertisers only</li>
                <li>• Easy integration & management</li>
              </ul>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-foreground mb-6">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Transparency</h3>
              <p className="text-muted-foreground">
                Clear pricing, open reporting, and honest communication with all partners.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Quality</h3>
              <p className="text-muted-foreground">
                Premium inventory, brand-safe ads, and rigorous quality controls.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Innovation</h3>
              <p className="text-muted-foreground">
                Cutting-edge technology to solve real problems in crypto advertising.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-foreground mb-6">Get Started</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Ready to join the future of crypto advertising? Whether you're an advertiser 
            looking to reach crypto audiences or a publisher wanting to monetize your traffic, 
            we're here to help.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/auth/signup?role=advertiser">
              <Button>
                Start Advertising
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/signup?role=publisher">
              <Button variant="outline">
                Start Publishing
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

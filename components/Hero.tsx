"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

/**
 * Hero component with three variants and customizable CTAs
 * @param variant - The hero variant: "results" | "network" | "speed"
 * @param primaryCta - Optional primary CTA override
 * @param secondaryCta - Optional secondary CTA override  
 * @param showChevron - Whether to show the scroll chevron (default: true)
 */
interface HeroProps {
  variant?: "results" | "network" | "speed";
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  showChevron?: boolean;
}

export default function Hero({ 
  variant = "results", 
  primaryCta, 
  secondaryCta, 
  showChevron = true 
}: HeroProps) {
  const { data: session } = useSession();
  
  // Copy mapping for each variant
  const copyMap = {
    results: {
      headline: "Grow Your Reach With Premium Crypto Ad Placements",
      subline: "Access leading crypto publishers with transparent pricing, live dashboards, and brand-safe inventory.",
      primaryCta: session ? { label: "Go to Dashboard", href: "/app" } : { label: "Start Advertising", href: "/auth/signin" },
      secondaryCta: { label: "Join as a publisher", href: "/publishers" }
    },
    network: {
      headline: "Advertise Where Crypto Communities Already Are",
      subline: "Tap into trusted publishers like Cointelegraph, CryptoDaily, and Coinranking — reaching engaged readers worldwide.",
      primaryCta: session ? { label: "Go to Dashboard", href: "/app" } : { label: "Launch Your First Campaign", href: "/auth/signin" },
      secondaryCta: { label: "For Publishers", href: "/publishers" }
    },
    speed: {
      headline: "Run Crypto Ad Campaigns in Minutes",
      subline: "Set your budget, upload creatives, and go live across top publishers — all in one platform.",
      primaryCta: session ? { label: "Go to Dashboard", href: "/app" } : { label: "Create Campaign", href: "/auth/signin" },
      secondaryCta: { label: "See How It Works", href: "/#how-it-works" }
    }
  };

  const copy = copyMap[variant];
  
  // Use provided CTAs or fallback to variant defaults
  const finalPrimaryCta = primaryCta || copy.primaryCta;
  const finalSecondaryCta = secondaryCta || copy.secondaryCta;

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
          {copy.headline}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
          {copy.subline}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href={finalPrimaryCta.href}>
            <Button size="lg">
              {finalPrimaryCta.label}
            </Button>
          </Link>
          <Link href={finalSecondaryCta.href}>
            <Button variant="outline" size="lg" className="dark:text-white dark:border-white/20 dark:hover:bg-white/10">
              {finalSecondaryCta.label}
            </Button>
          </Link>
        </div>
      </div>
      {showChevron && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-muted-foreground animate-bounce" aria-hidden="true">
          ↓
        </div>
      )}
    </section>
  );
}

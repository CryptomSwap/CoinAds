import Link from "next/link";
import { Button } from "@/components/ui/button";

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
  // Copy mapping for each variant
  const copyMap = {
    results: {
      headline: "Grow Your Reach With Premium Crypto Ad Placements",
      subline: "Access leading crypto publishers with transparent pricing, live dashboards, and brand-safe inventory.",
      primaryCta: { label: "Start Advertising", href: "/auth/signup?role=advertiser" },
      secondaryCta: { label: "Join as a publisher", href: "/publishers" }
    },
    network: {
      headline: "Advertise Where Crypto Communities Already Are",
      subline: "Tap into trusted publishers like Cointelegraph, CryptoDaily, and Coinranking — reaching engaged readers worldwide.",
      primaryCta: { label: "Launch Your First Campaign", href: "/auth/signup?role=advertiser" },
      secondaryCta: { label: "For Publishers", href: "/publishers" }
    },
    speed: {
      headline: "Run Crypto Ad Campaigns in Minutes",
      subline: "Set your budget, upload creatives, and go live across top publishers — all in one platform.",
      primaryCta: { label: "Create Campaign", href: "/auth/signup?role=advertiser" },
      secondaryCta: { label: "See How It Works", href: "/#how-it-works" }
    }
  };

  const copy = copyMap[variant];
  
  // Use provided CTAs or fallback to variant defaults
  const finalPrimaryCta = primaryCta || copy.primaryCta;
  const finalSecondaryCta = secondaryCta || copy.secondaryCta;

  return (
    <section className="relative overflow-hidden">
      {/* Background - Option A: Radial gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-100/80 via-cyan-50/60 to-transparent" />
      
      {/* Option B: Subtle abstract pattern (commented out for now)
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-cyan-400 rounded-full blur-3xl" />
        <div className="absolute top-40 right-32 w-24 h-24 bg-blue-400 rounded-full blur-2xl" />
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-indigo-400 rounded-full blur-3xl" />
      </div>
      */}
      
      <div className="relative mx-auto max-w-[1200px] px-4 md:px-6 py-8 md:py-12 lg:py-20">
        <div className="max-w-[820px] mx-auto">
          {/* Content */}
          <div className="text-center flex flex-col items-center">
            {/* Headline */}
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
              {copy.headline}
            </h1>
            
            {/* Subline */}
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mt-4">
              {copy.subline}
            </p>
            
            {/* CTA Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
              {/* Primary Button */}
              <Button 
                asChild
                className="bg-cyan-600 hover:bg-cyan-700 focus:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 text-white px-6 py-3 rounded-md shadow-md transition-colors duration-200 font-medium"
                data-testid="hero-primary-cta"
              >
                <Link href={finalPrimaryCta.href}>
                  {finalPrimaryCta.label}
                </Link>
              </Button>
              
              {/* Secondary Button */}
              <Button 
                asChild
                variant="outline"
                className="border border-cyan-600 text-cyan-600 hover:bg-cyan-50 focus:bg-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 px-6 py-3 rounded-md transition-colors duration-200 font-medium"
                data-testid="hero-secondary-cta"
              >
                <Link href={finalSecondaryCta.href}>
                  {finalSecondaryCta.label}
                </Link>
              </Button>
            </div>
            
            {/* Scroll Down Chevron */}
            {showChevron && (
              <div className="mt-8">
                <Link 
                  href="#how-it-works" 
                  className="inline-flex items-center justify-center text-slate-400 hover:text-slate-600 focus:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 rounded-md transition-colors duration-200"
                  aria-label="Scroll to How It Works"
                >
                  <svg 
                    className="w-6 h-6 animate-bounce" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                    />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

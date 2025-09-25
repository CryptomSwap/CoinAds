"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import TopBar from "@/components/TopBar";
import { Footer } from "@/components/Footer";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white/90 to-blue-600/20 dark:from-slate-900 dark:to-blue-900/40">
      <TopBar />

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-10 py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10 md:gap-y-14">
          
          {/* Section A - About CoinAds (top-left) */}
          <section className="col-span-12 lg:col-span-7 lg:col-start-1">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
              About CoinAds
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed">
              CoinAds bridges the gap between advertisers and publishers with transparent, fraud-protected advertising technology — built specifically for the crypto space and backed by MediaFuse, a global leader in industry-specific PR and distribution.
            </p>
          </section>

          {/* Section B - Our Mission (below A, aligned right) */}
          <section className="col-span-12 lg:col-span-5 lg:col-start-8 mt-24 lg:mt-32">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
              Our Mission
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed">
              CoinAds was born from the need for better advertising infrastructure in crypto. Advertisers deserve transparency and results; publishers deserve fair value for premium audiences. We're building a platform where both sides win.
            </p>
          </section>

          {/* Section C - What We Do (centered lower) */}
          <section className="col-span-12 lg:col-span-10 lg:col-start-2 mt-8 lg:mt-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8 text-center">
              What We Do
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* For Advertisers Card */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow p-6 md:p-7">
                <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 flex items-center">
                  For Advertisers
                </h3>
                <ul className="space-y-3" aria-label="Benefits for advertisers">
                  <li className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed">
                    • Access to premium crypto site inventory
                  </li>
                  <li className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed">
                    • Advanced fraud protection
                  </li>
                  <li className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed">
                    • Real-time reporting & analytics
                  </li>
                  <li className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed">
                    • Flexible billing (CPM, CPA, CPI, flat rates)
                  </li>
                </ul>
              </div>

              {/* For Publishers Card */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow p-6 md:p-7">
                <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 flex items-center">
                  For Publishers
                </h3>
                <ul className="space-y-3" aria-label="Benefits for publishers">
                  <li className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed">
                    • Higher revenue per visitor with fair pricing
                  </li>
                  <li className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed">
                    • Weekly payouts in USDT/USDC
                  </li>
                  <li className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed">
                    • Brand-safe advertisers only
                  </li>
                  <li className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed">
                    • Easy integration & tag management
                  </li>
                </ul>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
              <Link href="/auth/signup?role=advertiser">
                <Button 
                  className="h-11 px-6 bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-white font-medium focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors"
                >
                  Start Advertising
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/publishers">
                <Button 
                  variant="outline"
                  className="h-11 px-6 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-colors"
                >
                  Start Publishing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
}

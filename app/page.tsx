"use client";

import TopBar from "@/components/TopBar";
import Hero from "@/components/Hero";
import LogosBar from "@/components/LogosBar";
import HowItWorks from "@/components/HowItWorks";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white/90 to-blue-600/20 dark:from-slate-900 dark:to-blue-900/40">
      <TopBar />
      <Hero />
      <LogosBar />
      <HowItWorks />
    </div>
  );
}
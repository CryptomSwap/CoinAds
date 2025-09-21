"use client";

import TopBar from "@/components/TopBar";
import Hero from "@/components/Hero";
import LogosBar from "@/components/LogosBar";
import HowItWorks from "@/components/HowItWorks";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Hero />
      <LogosBar />
      <HowItWorks />
    </div>
  );
}
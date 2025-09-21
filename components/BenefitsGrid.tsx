"use client";

import { motion } from "framer-motion";
import { Target, BarChart3, DollarSign, Shield, Zap, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const items = [
  {
    title: "Target the right readers",
    body: "Geo, device, and site/section targeting with frequency caps.",
    Icon: Target,
  },
  {
    title: "See results live",
    body: "Dashboards, CSV export, and automated placement screenshots.",
    Icon: BarChart3,
  },
  {
    title: "Flexible billing",
    body: "Multiple billing options with transparent pricing and invoicing.",
    Icon: DollarSign,
  },
  {
    title: "Protect your ad spend",
    body: "IVT filtering, manual review, and quality controls.",
    Icon: Shield,
  },
  {
    title: "Launch in minutes",
    body: "Self-serve setup and instant credit top-ups.",
    Icon: Zap,
  },
  {
    title: "Go live worldwide",
    body: "Access leading crypto news & community sites.",
    Icon: Globe,
  },
] as const;

export default function BenefitsGrid() {
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };
  const child = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Why Advertisers Choose CoinAds
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Built for web3 marketers: transparent pricing, live reporting, and brand-safe inventory.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((item, index) => {
            const IconComponent = item.Icon;
            return (
              <motion.div key={item.title} variants={child}>
                <Card 
                  className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors focus-within:ring-2 focus-within:ring-teal-300 focus-within:ring-offset-2 focus-within:ring-offset-white dark:focus-within:ring-offset-slate-900"
                >
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-teal-500/20 rounded-full">
                        <IconComponent className="h-6 w-6 text-teal-400" strokeWidth={1.5} />
                      </div>
                    </div>
                    <CardTitle className="text-slate-900 dark:text-white text-lg">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-600 dark:text-slate-300 text-center">
                      {item.body}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* micro-proof ribbon */}
        <div className="mt-10 flex justify-center">
          <div className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm text-slate-600 dark:text-slate-300">
            Trusted by 700+ brands · Avg CTR 0.35–0.8% · &lt;2% IVT
          </div>
        </div>
      </div>
    </section>
  );
}
"use client";

import { motion } from "framer-motion";
import {
  CheckCircle, UploadCloud, CreditCard, PlayCircle, // advertiser
  Globe, FileCheck, BadgeDollarSign, MonitorSmartphone // publisher
} from "lucide-react";
import clsx from "clsx";

type Step = {
  title: string;
  body: string;
  icon: React.ComponentType<{ className?: string }>;
};

type Variant = "advertiser" | "publisher";

const ADVERTISER_STEPS: Step[] = [
  { title: "Create account",  body: "Sign up as an advertiser in minutes.",                  icon: CheckCircle },
  { title: "Add credits",     body: "Fund your account with flexible options.",              icon: CreditCard },
  { title: "Upload creatives",body: "Banners or native; pass validation instantly.",         icon: UploadCloud },
  { title: "Go live",         body: "Target by geo/device/site and launch.",                 icon: PlayCircle },
];

const PUBLISHER_STEPS: Step[] = [
  { title: "Add your site",   body: "Register your domain and verify ownership.",            icon: Globe },
  { title: "Get approved",    body: "Fast review and brand-safety checks.",                  icon: FileCheck },
  { title: "Create placements", body:"Define ad sizes/zones and generate tags.",             icon: MonitorSmartphone },
  { title: "Start earning",   body: "Serve premium ads; payouts via USDT, SEPA, SWIFT.",     icon: BadgeDollarSign },
];

const PRESETS: Record<Variant, { headline: string; subtitle: string; steps: Step[] }> = {
  advertiser: {
    headline: "How It Works",
    subtitle: "Get started in minutes with our simple 4-step process",
    steps: ADVERTISER_STEPS,
  },
  publisher: {
    headline: "How It Works for Publishers",
    subtitle: "Monetize in four quick steps — from site verification to payouts",
    steps: PUBLISHER_STEPS,
  },
};

export default function HowItWorks({
  className,
  variant = "advertiser",
  headline,
  subtitle,
}: {
  className?: string;
  variant?: Variant;
  headline?: string;
  subtitle?: string;
}) {
  const preset = PRESETS[variant];
  const title = headline ?? preset.headline;
  const sub   = subtitle ?? preset.subtitle;
  const steps = preset.steps;

  return (
    <section
      className={clsx("relative mx-auto max-w-5xl px-6 py-16", className)}
      aria-labelledby={`howitworks-${variant}-heading`}
    >
      <header className="text-center">
        <h2 id={`howitworks-${variant}-heading`} className="text-3xl font-bold tracking-tight">
          {title}
        </h2>
        <p className="mt-2 text-muted-foreground">{sub}</p>
        <div className="mx-auto mt-6 h-px w-24 bg-border/50" />
      </header>

      {/* Desktop / tablet grid */}
      <div className="mt-10 hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, idx) => (
          <StepCard key={s.title} index={idx + 1} step={s} />
        ))}
      </div>

      {/* Mobile horizontal snap carousel */}
      <div className="mt-10 -mx-6 overflow-x-auto md:hidden">
        <div className="flex snap-x snap-mandatory gap-4 px-6">
          {steps.map((s, idx) => (
            <div key={s.title} className="min-w-[280px] snap-center">
              <StepCard index={idx + 1} step={s} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({ index, step }: { index: number; step: Step }) {
  const Icon = step.icon;
  return (
    <motion.article
      className="group relative rounded-2xl border border-border/50 bg-background/30 backdrop-blur-sm p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:bg-background/50 focus-within:ring-2 focus-within:ring-primary"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      aria-labelledby={`step-${index}-title`}
    >
      <div
        className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold"
        aria-hidden="true"
      >
        {index}
      </div>
      <div className="mt-8 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition-transform group-hover:scale-105">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <h3 id={`step-${index}-title`} className="mt-4 text-lg font-semibold tracking-tight">
        {step.title}
      </h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{step.body}</p>
    </motion.article>
  );
}

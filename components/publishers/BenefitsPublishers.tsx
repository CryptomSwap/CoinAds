"use client";
import { motion } from "framer-motion";
import { DollarSign, CheckCircle2, Shield, Clock, Zap, Globe } from "lucide-react";

function Card({ title, body, Icon }:{title:string; body:string; Icon:any}) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm"
    >
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
        <Icon aria-hidden className="h-6 w-6 text-primary transition-transform duration-200 group-hover:scale-110" />
      </div>
      <h3 className="text-xl md:text-2xl font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-muted-foreground leading-relaxed">{body}</p>
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-border" />
    </motion.div>
  );
}

export default function BenefitsPublishers() {
  const items = [
    { title: "Maximize revenue", body: "Premium buyers, competitive CPMs, predictable fill.", Icon: DollarSign },
    { title: "Approve what runs", body: "Category allow/block and per-creative approval.", Icon: CheckCircle2 },
    { title: "Fraud protection", body: "IVT filtering, redirect checks, anomaly alerts.", Icon: Shield },
    { title: "Fast, flexible payouts", body: "USDT/USDC or bank; clear thresholds and schedule.", Icon: Clock },
    { title: "Zero-hassle setup", body: "Add your site, paste one tag, start earning.", Icon: Zap },
    { title: "Global demand", body: "Campaigns from exchanges, wallets, DeFi & gaming.", Icon: Globe },
  ];
  const container = { hidden:{}, show:{ transition:{ staggerChildren:.08, delayChildren:.1 } } };
  const child = { hidden:{ opacity:0, y:12 }, show:{ opacity:1, y:0, transition:{ duration:.35 } } };

  return (
    <section className="bg-gradient-to-b from-transparent to-muted">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-foreground">Why Publishers Choose CoinAds</h2>
        <p className="mt-3 text-center text-muted-foreground">Built for crypto sites: transparent demand, publisher controls, and fast payouts.</p>

        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once:true, amount:.2 }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {items.map(i => (
            <motion.div key={i.title} variants={child}>
              <Card {...i} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

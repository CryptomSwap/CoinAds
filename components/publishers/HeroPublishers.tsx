"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroPublishers() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background to-muted">
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <motion.h1
          className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight"
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once:true }}
          transition={{ duration: .4, ease: "easeOut" }}
        >
          Earn More From Your Crypto Traffic
        </motion.h1>
        <motion.p
          className="mt-5 text-lg md:text-xl text-muted-foreground"
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once:true }}
          transition={{ duration: .45, ease: "easeOut", delay: .05 }}
        >
          Plug in one tag, get matched with premium advertisers, and receive weekly USDT/USDC or bank payouts with live reporting and fraud protection.
        </motion.p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/auth/signup?role=publisher"
            className="inline-flex items-center rounded-lg px-5 py-3 text-white font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
          >
            Start Monetizing
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-lg px-5 py-3 text-white font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
          >
            Talk to Publisher Team
          </Link>
        </div>
      </div>
    </section>
  );
}

"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function HeroPublishers() {
  const { data: session } = useSession();
  
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
          <Button asChild size="lg">
            <Link href={session ? "/app" : "/auth/signin"}>
              {session ? "Go to Dashboard" : "Start Monetizing"}
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">
              Contact our publisher team
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

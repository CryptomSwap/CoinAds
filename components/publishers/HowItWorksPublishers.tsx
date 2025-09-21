"use client";
import { motion } from "framer-motion";
import { FileCheck2, Link2, SlidersHorizontal, Wallet } from "lucide-react";

const steps = [
  { title:"Apply", desc:"Submit your domain and traffic info (24–48h review).", Icon: FileCheck2 },
  { title:"Integrate", desc:"Verify domain, add our async tag, optional ads.txt line.", Icon: Link2 },
  { title:"Control", desc:"Set floors & categories; approve creatives in one queue.", Icon: SlidersHorizontal },
  { title:"Get paid", desc:"Earnings dashboard; payouts on your schedule.", Icon: Wallet },
];

export default function HowItWorksPublishers(){
  return (
    <section className="bg-muted">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-foreground">How It Works</h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((s, i)=>(
            <motion.div key={s.title}
              initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ duration:.35, delay:.08*i }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                <s.Icon aria-hidden className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

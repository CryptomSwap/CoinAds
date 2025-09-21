"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import * as React from "react";

type Variant = "target" | "analytics" | "payments" | "safety" | "launch" | "globe" | "default";

export default function BenefitCard({
  title,
  body,
  Icon,
  variant = "default",
}: {
  title: string;
  body: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  variant?: Variant;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${x}px ${y}px, rgba(139,92,246,0.12), transparent 40%)`;

  const iconVariants: Record<Variant, any> = {
    target:   { hover: { scale: [1, 1.07, 1], transition: { duration: 0.5 } } },
    analytics:{ hover: { y: [-2, 0], transition: { duration: 0.35 } } },
    payments: { hover: { rotate: [0, 10, 0], transition: { duration: 0.35 } } },
    safety:   { hover: { scale: [1, 1.05, 1], transition: { duration: 0.35 } } },
    launch:   { hover: { x: [0, 6, 0], transition: { duration: 0.28 } } },
    globe:    { hover: { rotate: [0, 360], transition: { duration: 0.6, ease: "easeInOut" } } },
    default:  { hover: {} },
  };

  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      style={{ backgroundImage: spotlight }}
      initial={false}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      {/* sheen sweep on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-1/2 -left-1/2 h-[200%] w-[200%] rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      />

      {/* icon with variant motion */}
      <motion.div
        variants={iconVariants[variant]}
        whileHover="hover"
        className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20"
      >
        <Icon aria-hidden className="h-6 w-6 text-primary" />
      </motion.div>

      <h3 className="text-xl md:text-2xl font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-muted-foreground leading-relaxed">{body}</p>

      {/* subtle gradient hairline border for depth */}
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-border" />
    </motion.div>
  );
}

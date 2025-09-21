import Link from "next/link";

export default function CtaBand(){
  return (
    <section className="bg-gradient-to-br from-background to-muted">
      <div className="mx-auto max-w-6xl px-6 py-12 text-center">
        <h3 className="text-2xl md:text-3xl font-semibold text-foreground">Ready to start earning?</h3>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/auth/signup?role=publisher" className="inline-flex items-center rounded-lg px-5 py-3 text-white font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors">
            Start Monetizing
          </Link>
          <Link href="/docs/publisher-integration" className="inline-flex items-center rounded-lg px-5 py-3 text-white font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors">
            View Integration Guide
          </Link>
        </div>
      </div>
    </section>
  );
}

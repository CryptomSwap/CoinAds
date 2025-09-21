import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background to-muted">
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
          Reach Crypto Audiences on Premium Sites
        </h1>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link 
            className="inline-flex items-center rounded-lg px-5 py-3 text-white font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            href="/auth/signup?role=advertiser"
          >
            Start Advertising
          </Link>
        </div>
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-muted-foreground animate-bounce" aria-hidden="true">
        ↓
      </div>
    </section>
  );
}

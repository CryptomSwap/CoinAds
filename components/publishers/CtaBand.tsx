import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CtaBand(){
  return (
    <section className="bg-gradient-to-br from-background to-muted">
      <div className="mx-auto max-w-6xl px-6 py-12 text-center">
        <h3 className="text-2xl md:text-3xl font-semibold text-foreground">Ready to start earning?</h3>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/auth/signup?role=publisher">
              Start Monetizing
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/docs/publisher-integration">
              View Integration Guide
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

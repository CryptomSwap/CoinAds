import Link from "next/link";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={`border-t border-border bg-muted/50 ${className || ""}`}>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">CoinAds</h3>
            <p className="text-slate-600 dark:text-slate-300">
              The leading self-serve advertising platform for crypto companies.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Product</h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
              <li><Link href="/advertisers">For Advertisers</Link></li>
              <li><Link href="/publishers">For Publishers</Link></li>
              <li><Link href="/ad-formats">Ad Formats</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Company</h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/legal/privacy">Privacy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-300">
              <li><Link href="/legal/advertiser-terms">Advertiser Terms</Link></li>
              <li><Link href="/legal/publisher-terms">Publisher Terms</Link></li>
              <li><Link href="/legal/cookies">Cookie Policy</Link></li>
              <li><Link href="/legal/cookie-preferences">Cookie Preferences</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-slate-500 dark:text-slate-400">
          <p>&copy; 2024 CoinAds. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

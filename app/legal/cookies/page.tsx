import TopBar from "@/components/TopBar";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white/90 to-blue-600/20 dark:from-slate-900 dark:to-blue-900/40">
      <TopBar />
      
      {/* Header */}
      <div className="bg-gradient-to-br from-background to-muted">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
            Cookie Policy
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-8">
              <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">What Are Cookies?</h2>
                  <p>
                    Cookies are small text files that are stored on your device when you visit 
                    our website. They help us provide you with a better experience by remembering 
                    your preferences and enabling certain functionality.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Cookies</h2>
                  <p className="mb-4">CoinAds uses cookies for the following purposes:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                    <li><strong>Advertising Cookies:</strong> Enable targeted advertising and ad delivery</li>
                    <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                    <li><strong>Security Cookies:</strong> Protect against fraud and unauthorized access</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Types of Cookies We Use</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-muted rounded-lg p-4">
                      <h3 className="text-foreground font-semibold mb-2">Essential Cookies</h3>
                      <p className="mb-2">These cookies are necessary for the website to function properly.</p>
                      <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                        <li>Session management</li>
                        <li>Authentication</li>
                        <li>Security features</li>
                        <li>Load balancing</li>
                      </ul>
                    </div>

                    <div className="bg-muted rounded-lg p-4">
                      <h3 className="text-foreground font-semibold mb-2">Analytics Cookies</h3>
                      <p className="mb-2">These cookies help us understand website usage and performance.</p>
                      <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                        <li>Google Analytics</li>
                        <li>Page views and user behavior</li>
                        <li>Performance monitoring</li>
                        <li>Error tracking</li>
                      </ul>
                    </div>

                    <div className="bg-muted rounded-lg p-4">
                      <h3 className="text-foreground font-semibold mb-2">Advertising Cookies</h3>
                      <p className="mb-2">These cookies enable targeted advertising and ad delivery.</p>
                      <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                        <li>Ad targeting and personalization</li>
                        <li>Frequency capping</li>
                        <li>Conversion tracking</li>
                        <li>Cross-site advertising</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Cookies</h2>
                  <p className="mb-4">We may use third-party services that set their own cookies:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Google Analytics:</strong> Website analytics and performance tracking</li>
                    <li><strong>Google Ads:</strong> Advertising and conversion tracking</li>
                    <li><strong>Facebook Pixel:</strong> Social media advertising and analytics</li>
                    <li><strong>Stripe:</strong> Payment processing and fraud prevention</li>
                    <li><strong>Intercom:</strong> Customer support and chat functionality</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Managing Cookies</h2>
                  <p className="mb-4">You can control cookies through your browser settings:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Block all cookies</li>
                    <li>Block third-party cookies only</li>
                    <li>Delete existing cookies</li>
                    <li>Set cookie preferences</li>
                  </ul>
                  <p className="mt-4">
                    <strong>Note:</strong> Disabling cookies may affect website functionality and 
                    your user experience.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Browser-Specific Instructions</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-foreground font-semibold mb-2">Google Chrome</h3>
                      <p className="text-sm">Settings → Privacy and security → Cookies and other site data</p>
                    </div>
                    
                    <div>
                      <h3 className="text-foreground font-semibold mb-2">Mozilla Firefox</h3>
                      <p className="text-sm">Options → Privacy & Security → Cookies and Site Data</p>
                    </div>
                    
                    <div>
                      <h3 className="text-foreground font-semibold mb-2">Safari</h3>
                      <p className="text-sm">Preferences → Privacy → Manage Website Data</p>
                    </div>
                    
                    <div>
                      <h3 className="text-foreground font-semibold mb-2">Microsoft Edge</h3>
                      <p className="text-sm">Settings → Cookies and site permissions → Cookies and site data</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Updates to This Policy</h2>
                  <p>
                    We may update this Cookie Policy from time to time. We will notify you of 
                    any significant changes by posting the new policy on our website and updating 
                    the "Last updated" date.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
                  <p className="mb-4">
                    If you have any questions about our use of cookies, please contact us:
                  </p>
                  <div className="bg-muted p-4 rounded-lg">
                    <p><strong>Email:</strong> privacy@coinads.com</p>
                    <p><strong>Address:</strong> Saadya Gaon 24, Tel Aviv, Israel</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2024 CoinAds. All rights reserved.</p>
            <div className="mt-4 space-x-6">
              <Link href="/legal/privacy" className="hover:text-foreground">Privacy Policy</Link>
              <Link href="/legal/advertiser-terms" className="hover:text-foreground">Advertiser Terms</Link>
              <Link href="/legal/publisher-terms" className="hover:text-foreground">Publisher Terms</Link>
              <Link href="/legal/cookies" className="hover:text-foreground">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
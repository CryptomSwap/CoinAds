import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Code, Copy, ExternalLink, Book } from "lucide-react";

export default function PublisherIntegrationPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/docs" className="hover:text-foreground transition-colors">
            Documentation
          </Link>
          <span>/</span>
          <span>Publisher Integration</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Publisher Integration Guide</h1>
        <p className="text-muted-foreground mt-2">
          Learn how to integrate CoinAds with your website and start earning revenue
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Getting Started
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4">
                  <h3 className="font-semibold text-lg mb-2">1. Create Publisher Account</h3>
                  <p className="text-muted-foreground mb-3">
                    Sign up for a CoinAds publisher account and verify your email address.
                  </p>
                  <Button asChild size="sm">
                    <Link href="/auth/signup?role=publisher">
                      Create Account
                    </Link>
                  </Button>
                </div>

                <div className="border-l-4 border-muted pl-4">
                  <h3 className="font-semibold text-lg mb-2">2. Add Your Website</h3>
                  <p className="text-muted-foreground mb-3">
                    Submit your website for review. We'll verify domain ownership and content quality.
                  </p>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/app/publisher/sites/new">
                      Add Website
                    </Link>
                  </Button>
                </div>

                <div className="border-l-4 border-muted pl-4">
                  <h3 className="font-semibold text-lg mb-2">3. Create Ad Placements</h3>
                  <p className="text-muted-foreground mb-3">
                    Define where ads will appear on your site and generate ad tags.
                  </p>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/app/publisher/placements/new">
                      Create Placement
                    </Link>
                  </Button>
                </div>

                <div className="border-l-4 border-muted pl-4">
                  <h3 className="font-semibold text-lg mb-2">4. Implement Ad Tags</h3>
                  <p className="text-muted-foreground">
                    Add the generated ad tags to your website and start earning revenue.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Implementation Examples
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Basic Ad Tag Implementation</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm text-muted-foreground overflow-x-auto">
{`<!-- CoinAds Ad Tag -->
<div id="coinads-placement-123">
  <script async src="https://coinads.com/adtag.js"></script>
  <script>
    coinads.displayAd({
      placementId: "123",
      containerId: "coinads-placement-123"
    });
  </script>
</div>`}
                  </pre>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => {
                    // TODO: Implement copy to clipboard functionality
                    console.log('Copying code to clipboard...');
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Code
                </Button>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Responsive Implementation</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm text-muted-foreground overflow-x-auto">
{`<!-- Responsive Ad Tag -->
<div class="coinads-responsive" id="coinads-placement-456">
  <script async src="https://coinads.com/adtag.js"></script>
  <script>
    coinads.displayAd({
      placementId: "456",
      containerId: "coinads-placement-456",
      responsive: true,
      breakpoints: {
        mobile: "320x50",
        tablet: "728x90",
        desktop: "970x250"
      }
    });
  </script>
</div>`}
                  </pre>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => {
                    // TODO: Implement copy to clipboard functionality
                    console.log('Copying code to clipboard...');
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Code
                </Button>
              </div>

              <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">TODO: Advanced Integration Features</h4>
                <ul className="space-y-1 text-xs">
                  <li>• Header bidding integration</li>
                  <li>• Lazy loading for better performance</li>
                  <li>• A/B testing framework</li>
                  <li>• Real-time analytics SDK</li>
                  <li>• GDPR compliance helpers</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Best Practices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-primary">✓ Do</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Place ads above the fold for better visibility</li>
                    <li>• Use responsive ad units for mobile optimization</li>
                    <li>• Implement lazy loading for page speed</li>
                    <li>• Test ad placements for optimal performance</li>
                    <li>• Keep content-to-ad ratio balanced</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-destructive">✗ Don't</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Click on your own ads</li>
                    <li>• Place too many ads per page</li>
                    <li>• Use misleading ad labels</li>
                    <li>• Modify ad code without permission</li>
                    <li>• Place ads on prohibited content</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/docs/ad-formats">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Ad Format Specs
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/docs/revenue-optimization">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Revenue Optimization
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/docs/analytics">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Analytics Guide
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/contact">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Get Support
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Supported Formats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline">728x90</Badge>
                <span className="text-xs text-muted-foreground">Leaderboard</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">300x250</Badge>
                <span className="text-xs text-muted-foreground">Medium Rectangle</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">320x50</Badge>
                <span className="text-xs text-muted-foreground">Mobile Banner</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">Native</Badge>
                <span className="text-xs text-muted-foreground">Content Native</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">Video</Badge>
                <span className="text-xs text-muted-foreground">Pre/Mid/Post Roll</span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <span>Minimum 1,000 monthly page views</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <span>Crypto/blockchain related content</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <span>Original, high-quality content</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <span>No adult or illegal content</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-8">
        <Button asChild variant="outline">
          <Link href="/docs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Docs
          </Link>
        </Button>
        <Button asChild>
          <Link href="/auth/signup?role=publisher">
            Get Started as Publisher
          </Link>
        </Button>
      </div>
    </div>
  );
}
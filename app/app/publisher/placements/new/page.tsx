import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Target, Code, DollarSign } from "lucide-react";
import PlacementActions from "@/components/wrappers/PlacementActions";

// Disable SSG for authenticated app routes
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function NewPlacementPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/app/publisher" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/app/publisher/placements" className="hover:text-foreground transition-colors">
            Placements
          </Link>
          <span>/</span>
          <span>New Placement</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Create Ad Placement</h1>
        <p className="text-muted-foreground mt-2">
          Define where and how ads will appear on your website
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Placement Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="placement-name">Placement Name</Label>
                <Input 
                  id="placement-name" 
                  placeholder="e.g., Header Banner, Sidebar Ad"
                  className="border-2 focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="site-select">Website</Label>
                <Select>
                  <SelectTrigger className="border-2 focus:border-primary transition-colors">
                    <SelectValue placeholder="Select website" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="placeholder" disabled>
                      No verified sites yet - add a site first
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ad-format">Ad Format</Label>
                  <Select>
                    <SelectTrigger className="border-2 focus:border-primary transition-colors">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="banner-728x90">Banner 728x90 (Leaderboard)</SelectItem>
                      <SelectItem value="banner-300x250">Banner 300x250 (Medium Rectangle)</SelectItem>
                      <SelectItem value="banner-320x50">Banner 320x50 (Mobile Banner)</SelectItem>
                      <SelectItem value="banner-160x600">Banner 160x600 (Wide Skyscraper)</SelectItem>
                      <SelectItem value="native">Native Ad</SelectItem>
                      <SelectItem value="video">Video Ad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pricing-model">Pricing Model</Label>
                  <Select>
                    <SelectTrigger className="border-2 focus:border-primary transition-colors">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cpm">CPM (Cost per 1000 impressions)</SelectItem>
                      <SelectItem value="cpc">CPC (Cost per click)</SelectItem>
                      <SelectItem value="cpa">CPA (Cost per action)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min-price">Minimum Price (USD)</Label>
                  <Input 
                    id="min-price" 
                    type="number" 
                    step="0.01"
                    placeholder="1.00"
                    className="border-2 focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="placement-position">Page Position</Label>
                  <Select>
                    <SelectTrigger className="border-2 focus:border-primary transition-colors">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="above-fold">Above the fold</SelectItem>
                      <SelectItem value="below-fold">Below the fold</SelectItem>
                      <SelectItem value="sidebar">Sidebar</SelectItem>
                      <SelectItem value="footer">Footer</SelectItem>
                      <SelectItem value="in-content">In-content</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">TODO: Advanced Placement Features</h4>
                <ul className="space-y-1 text-xs">
                  <li>• Ad tag generation and preview</li>
                  <li>• Targeting criteria (geography, device, time)</li>
                  <li>• Frequency capping options</li>
                  <li>• A/B testing for optimal placement</li>
                  <li>• Real-time bidding integration</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Revenue Estimate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <div className="text-3xl font-bold text-primary mb-2">$0.00</div>
                <div className="text-sm text-muted-foreground">Estimated monthly revenue</div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expected impressions:</span>
                  <span>0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Average CPM:</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Revenue share:</span>
                  <span>70%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Implementation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-xs font-mono text-muted-foreground">
                  Ad tag will be generated after placement creation
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <h4 className="font-medium">Next Steps:</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div>1. Create placement</div>
                  <div>2. Copy generated ad tag</div>
                  <div>3. Add to your website</div>
                  <div>4. Start earning revenue</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Popular Formats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline">728x90</Badge>
                <span className="text-xs text-muted-foreground">High CTR</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">300x250</Badge>
                <span className="text-xs text-muted-foreground">Best CPM</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">Native</Badge>
                <span className="text-xs text-muted-foreground">High Engagement</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <PlacementActions />
    </div>
  );
}


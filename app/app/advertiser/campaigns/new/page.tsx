import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { Plus } from "lucide-react";
import CampaignActions from "@/components/wrappers/CampaignActions";

// Disable SSG for authenticated app routes
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function NewCampaignPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/app/advertiser" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/app/advertiser/campaigns" className="hover:text-foreground transition-colors">
            Campaigns
          </Link>
          <span>/</span>
          <span>New Campaign</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Campaign</h1>
        <p className="text-muted-foreground mt-2">
          Set up your advertising campaign to reach crypto audiences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Campaign Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-name">Campaign Name</Label>
                  <Input 
                    id="campaign-name" 
                    placeholder="Enter campaign name"
                    className="border-2 focus:border-primary transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="daily-budget">Daily Budget (USD)</Label>
                  <Input 
                    id="daily-budget" 
                    type="number" 
                    placeholder="100.00"
                    className="border-2 focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign-description">Description</Label>
                <Textarea 
                  id="campaign-description"
                  placeholder="Describe your campaign goals and target audience"
                  rows={4}
                  className="border-2 focus:border-primary transition-colors"
                />
              </div>

              <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">TODO: Complete Campaign Creation Form</h4>
                <ul className="space-y-1 text-xs">
                  <li>• Ad format selection (banner, native, video)</li>
                  <li>• Targeting options (geography, demographics, interests)</li>
                  <li>• Bidding strategy configuration</li>
                  <li>• Creative asset upload</li>
                  <li>• Schedule and duration settings</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Campaign Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Campaign preview will appear here once details are filled in.
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/app/advertiser/creatives">
                  Upload Creative Assets
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/app/advertiser/wallet">
                  Top Up Wallet
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <CampaignActions />
    </div>
  );
}
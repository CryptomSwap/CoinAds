import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, DollarSign, CreditCard, Calendar, TrendingUp } from "lucide-react";

export default function PayoutsPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/app/publisher" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <span>Payouts</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Payouts & Earnings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your earnings and request payouts
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card className="rounded-2xl shadow-sm bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available Balance</p>
                <p className="text-3xl font-bold">$0.00</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-3xl font-bold">$0.00</p>
              </div>
              <div className="p-3 bg-muted rounded-xl">
                <TrendingUp className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Earned</p>
                <p className="text-3xl font-bold">$0.00</p>
              </div>
              <div className="p-3 bg-muted rounded-xl">
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Next Payout</p>
                <p className="text-lg font-bold">--</p>
              </div>
              <Badge variant="secondary">Pending</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Request Payout
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg text-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-muted-foreground">Available for payout:</span>
                <span className="font-bold">$0.00</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Minimum payout amount: $50.00
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payout-amount">Payout Amount (USD)</Label>
              <Input 
                id="payout-amount" 
                type="number" 
                placeholder="0.00"
                disabled
                className="border-2 focus:border-primary transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payout-method">Payout Method</Label>
              <Select disabled>
                <SelectTrigger className="border-2 focus:border-primary transition-colors">
                  <SelectValue placeholder="Select payout method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full" disabled data-testid="request-payout">
              Request Payout
            </Button>

            <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Payout Information</h4>
              <ul className="space-y-1 text-xs">
                <li>• Minimum payout: $50.00</li>
                <li>• Processing time: 3-5 business days</li>
                <li>• Payouts processed monthly</li>
                <li>• Setup payment method in settings</li>
              </ul>
            </div>

            <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">TODO: Payout Features</h4>
              <ul className="space-y-1 text-xs">
                <li>• PayPal integration</li>
                <li>• Bank transfer setup</li>
                <li>• Cryptocurrency payouts</li>
                <li>• Tax document generation</li>
                <li>• Automatic payout scheduling</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Payout History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No payouts yet</h3>
              <p className="text-sm mb-4">
                Your payout history will appear here once you start earning
              </p>
              <Button variant="outline" asChild data-testid="view-earnings">
                <Link href="/app/publisher/earnings">
                  View Earnings Report
                </Link>
              </Button>
            </div>

            <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">TODO: Payout History Features</h4>
              <ul className="space-y-1 text-xs">
                <li>• Detailed transaction history</li>
                <li>• Filter by date range and status</li>
                <li>• Export to CSV/PDF</li>
                <li>• Payout status tracking</li>
                <li>• Issue reporting and support</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Earnings Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No earnings data yet</h3>
              <p className="text-sm">
                Start adding placements to your sites to begin earning revenue
              </p>
              <div className="flex gap-4 justify-center mt-4">
                <Button variant="outline" asChild>
                  <Link href="/app/publisher/sites/new">
                    Add Website
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/app/publisher/placements/new">
                    Create Placement
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4 mt-8">
        <Button asChild variant="outline">
          <Link href="/app/publisher">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <Button variant="outline" asChild data-testid="download-report">
          <Link href="/app/publisher/earnings">
            Download Earnings Report
          </Link>
        </Button>
      </div>
    </div>
  );
}
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Plus, CreditCard, TrendingUp, DollarSign } from "lucide-react";

export default function WalletPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/app/advertiser" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <span>Wallet</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Advertising Wallet</h1>
        <p className="text-muted-foreground mt-2">
          Manage your advertising budget and payments
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
                <p className="text-sm font-medium text-muted-foreground">This Month Spent</p>
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
                <p className="text-sm font-medium text-muted-foreground">Active Campaigns</p>
                <p className="text-3xl font-bold">0</p>
              </div>
              <div className="p-3 bg-muted rounded-xl">
                <Badge variant="secondary">0 Running</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Funds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input 
                id="amount" 
                type="number" 
                placeholder="100.00"
                className="border-2 focus:border-primary transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  data-testid="add-credit-card"
                  onClick={() => {
                    // TODO: Implement credit card setup logic
                    console.log('Setting up credit card...');
                  }}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Credit/Debit Card
                </Button>
              </div>
            </div>

            <Button 
              className="w-full" 
              data-testid="top-up-wallet"
              onClick={() => {
                // TODO: Implement wallet top-up logic
                console.log('Opening wallet top-up dialog...');
              }}
            >
              Add Funds to Wallet
            </Button>

            <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">TODO: Payment Integration</h4>
              <ul className="space-y-1 text-xs">
                <li>• Stripe payment processing</li>
                <li>• Multiple payment methods (card, bank transfer)</li>
                <li>• Auto top-up when balance is low</li>
                <li>• Spending limits and controls</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
              <p className="text-sm">
                Your payment history will appear here
              </p>
            </div>

            <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">TODO: Transaction History</h4>
              <ul className="space-y-1 text-xs">
                <li>• Transaction list with filters</li>
                <li>• Export to CSV/PDF</li>
                <li>• Invoice generation</li>
                <li>• Refund requests</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4 mt-8">
        <Button asChild variant="outline">
          <Link href="/app/advertiser">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <Button variant="outline" asChild data-testid="view-billing">
          <Link href="/app/billing">
            View Billing History
          </Link>
        </Button>
      </div>
    </div>
  );
}
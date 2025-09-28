"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  DollarSign, 
  History, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";

interface WalletDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WalletDrawer({ open, onOpenChange }: WalletDrawerProps) {
  const [autoRechargeEnabled, setAutoRechargeEnabled] = useState(false);

  const transactions = [
    {
      id: "1",
      type: "TOP_UP",
      method: "STRIPE",
      amountCents: 100000,
      status: "SUCCEEDED",
      createdAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      type: "SPEND",
      method: "SYSTEM",
      amountCents: -25000,
      status: "SUCCEEDED",
      createdAt: "2024-01-14T15:45:00Z",
    },
    {
      id: "3",
      type: "TOP_UP",
      method: "COINBASE",
      amountCents: 50000,
      status: "PENDING",
      createdAt: "2024-01-13T09:15:00Z",
    },
  ];

  const formatAmount = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SUCCEEDED":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "FAILED":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCEEDED":
        return <Badge variant="default" className="bg-green-500">Success</Badge>;
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>;
      case "FAILED":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Wallet</SheetTitle>
          <SheetDescription>
            Manage your account balance and payment methods
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {/* Balance Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Current Balance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$1,500.00</div>
              <p className="text-sm text-muted-foreground mt-1">
                Available for advertising
              </p>
            </CardContent>
          </Card>

          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="auto-recharge">Auto-Recharge</TabsTrigger>
              <TabsTrigger value="methods">Methods</TabsTrigger>
              <TabsTrigger value="limits">Limits</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-4">
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(transaction.status)}
                      <div>
                        <div className="font-medium">
                          {transaction.type === "TOP_UP" ? "Top Up" : "Spend"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.method === "STRIPE" && "Credit Card"}
                          {transaction.method === "COINBASE" && "Crypto"}
                          {transaction.method === "SYSTEM" && "Campaign Spend"}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${
                        transaction.amountCents > 0 ? "text-green-600" : "text-red-600"
                      }`}>
                        {transaction.amountCents > 0 ? "+" : ""}
                        {formatAmount(transaction.amountCents)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="auto-recharge" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Auto-Recharge Settings</CardTitle>
                  <CardDescription>
                    Automatically add funds when your balance gets low
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Enable Auto-Recharge</div>
                      <div className="text-sm text-muted-foreground">
                        Automatically add funds when balance is low
                      </div>
                    </div>
                    <Button
                      variant={autoRechargeEnabled ? "default" : "outline"}
                      onClick={() => setAutoRechargeEnabled(!autoRechargeEnabled)}
                    >
                      {autoRechargeEnabled ? "Enabled" : "Disabled"}
                    </Button>
                  </div>
                  
                  {autoRechargeEnabled && (
                    <div className="space-y-4 pt-4 border-t">
                      <div>
                        <label className="text-sm font-medium">Threshold</label>
                        <div className="text-sm text-muted-foreground">
                          Add funds when balance falls below $50.00
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Amount</label>
                        <div className="text-sm text-muted-foreground">
                          Add $500.00 each time
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Payment Method</label>
                        <div className="text-sm text-muted-foreground">
                          Credit Card ending in 4242
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="methods" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>
                    Manage your saved payment methods
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <div className="font-medium">Credit Card</div>
                        <div className="text-sm text-muted-foreground">
                          **** **** **** 4242
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // TODO: Implement payment method editing
                        console.log('Edit payment method');
                      }}
                      data-testid="edit-payment-method"
                    >
                      Edit
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <DollarSign className="h-5 w-5" />
                      <div>
                        <div className="font-medium">Crypto Wallet</div>
                        <div className="text-sm text-muted-foreground">
                          Bitcoin, Ethereum, USDT
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // TODO: Implement crypto wallet configuration
                        console.log('Configure crypto wallet');
                      }}
                      data-testid="configure-crypto-wallet"
                    >
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="limits" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Spending Limits & Alerts</CardTitle>
                  <CardDescription>
                    Set limits and configure notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Daily Spend Cap</div>
                      <div className="text-sm text-muted-foreground">
                        Maximum $1,000 per day
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // TODO: Implement spending limit editing
                        console.log('Edit spending limits');
                      }}
                      data-testid="edit-spending-limits"
                    >
                      Edit
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Low Balance Alert</div>
                      <div className="text-sm text-muted-foreground">
                        Email notification below $50
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // TODO: Implement alert configuration
                        console.log('Configure low balance alerts');
                      }}
                      data-testid="configure-alerts"
                    >
                      Configure
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <div className="text-sm text-yellow-800 dark:text-yellow-200">
                      Demo mode: All payments are simulated
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}

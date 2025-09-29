"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Plus,
  CreditCard,
  Wallet,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import RequireAuth from "@/components/RequireAuth";

// Mock data for MVP
const emptyWallet = {
  balance: 500.00,
  transactions: [
    {
      id: "1",
      date: "2024-01-15",
      type: "TOPUP",
      method: "CARD",
      amount: 1000.00,
      status: "SUCCEEDED",
      reference: "txn_123456789"
    },
    {
      id: "2",
      date: "2024-01-14",
      type: "SPEND",
      method: "SYSTEM",
      amount: -450.25,
      status: "SUCCEEDED",
      reference: "campaign_spend_001"
    },
    {
      id: "3",
      date: "2024-01-13",
      type: "SPEND",
      method: "SYSTEM",
      amount: -320.10,
      status: "SUCCEEDED",
      reference: "campaign_spend_002"
    },
    {
      id: "4",
      date: "2024-01-10",
      type: "TOPUP",
      method: "CARD",
      amount: 500.00,
      status: "SUCCEEDED",
      reference: "txn_987654321"
    }
  ]
};

export default function WalletPage() {
  const [showAddCredits, setShowAddCredits] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("stripe");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "TOPUP":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "SPEND":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Wallet className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "TOPUP":
        return "text-green-600";
      case "SPEND":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCEEDED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAddCredits = async () => {
    if (addAmount && parseFloat(addAmount) > 0) {
      try {
        const response = await fetch('/api/advertiser/wallet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amountCents: Math.round(parseFloat(addAmount) * 100), // Convert to cents
            method: paymentMethod.toUpperCase(), // Convert to uppercase to match API enum
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to add credits');
        }

        const result = await response.json();
        console.log('Credits added successfully:', result);
        
        // Close modal and reset form
        setShowAddCredits(false);
        setAddAmount("");
        
        // TODO: Refresh wallet data or show success message
        alert(`Successfully added $${addAmount} to your account!`);
      } catch (error) {
        console.error('Error adding credits:', error);
        alert(`Failed to add credits: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  return (
    <RequireAuth>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
          <p className="text-muted-foreground">
            Manage your account balance and transactions
          </p>
        </div>
        <Button onClick={() => setShowAddCredits(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Credits
        </Button>
      </div>

      {/* Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="h-5 w-5" />
            <span>Current Balance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            {formatCurrency(emptyWallet.balance)}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Available credits for your campaigns
          </p>
        </CardContent>
      </Card>

      {/* Add Credits Modal */}
      {showAddCredits && (
        <Card>
          <CardHeader>
            <CardTitle>Add Credits</CardTitle>
            <CardDescription>
              Add funds to your account to run campaigns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-8"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="method">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stripe">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4" />
                      <span>Credit Card (Stripe)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="coinbase" disabled>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">Crypto (Coming Soon)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddCredits(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCredits}>
                Add Credits
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            All your account transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emptyWallet.transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <h3 className="text-sm font-medium">
                      {transaction.type === "TOPUP" ? "Top-up" : "Campaign Spend"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {formatDate(transaction.date)} • {transaction.reference}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className={`text-sm font-medium ${getTransactionColor(transaction.type)}`}>
                      {transaction.amount > 0 ? "+" : ""}{formatCurrency(transaction.amount)}
                    </p>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Add Amounts */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Add</CardTitle>
          <CardDescription>
            Add common amounts quickly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[50, 100, 250, 500].map((amount) => (
              <Button
                key={amount}
                variant="outline"
                className="h-12"
                onClick={() => {
                  setAddAmount(amount.toString());
                  setShowAddCredits(true);
                }}
              >
                ${amount}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </RequireAuth>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  Plus,
  Loader2,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";

interface Wallet {
  id: string;
  balanceCents: number;
  currency: string;
  lowBalanceThresholdCents: number;
  transactions: Transaction[];
}

interface Transaction {
  id: string;
  type: string;
  method: string;
  amountCents: number;
  status: string;
  createdAt: string;
  meta?: any;
}

export default function BillingPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingFunds, setIsAddingFunds] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [addFundsAmount, setAddFundsAmount] = useState("");
  const [addFundsMethod, setAddFundsMethod] = useState("STRIPE");

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const response = await fetch("/api/advertiser/wallet");
      const data = await response.json();

      if (response.ok) {
        setWallet(data.wallet);
      } else {
        setError(data.error || "Failed to fetch wallet");
      }
    } catch (error) {
      setError("Error fetching wallet");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFunds = async () => {
    const amountCents = Math.round(parseFloat(addFundsAmount) * 100);
    
    if (amountCents < 100) {
      setError("Minimum amount is $1.00");
      return;
    }

    setIsAddingFunds(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/advertiser/wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amountCents,
          method: addFundsMethod,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setAddFundsAmount("");
        fetchWallet(); // Refresh wallet data
      } else {
        setError(data.error || "Failed to add funds");
      }
    } catch (error) {
      setError("Error adding funds");
    } finally {
      setIsAddingFunds(false);
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "TOP_UP":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "SPEND":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case "REFUND":
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCEEDED":
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case "PENDING":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "FAILED":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "STRIPE":
        return <CreditCard className="h-4 w-4" />;
      case "COINBASE":
        return <DollarSign className="h-4 w-4" />;
      case "WIRE":
        return <DollarSign className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Billing & Wallet</h1>
        <Alert variant="destructive">
          <AlertDescription>{error || "Failed to load wallet"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const isLowBalance = wallet.balanceCents < wallet.lowBalanceThresholdCents;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Billing & Wallet</h1>
          <p className="text-muted-foreground">
            Manage your account balance and payment methods
          </p>
        </div>
      </div>

      {/* Low Balance Alert */}
      {isLowBalance && (
        <Alert variant="destructive">
          <AlertDescription>
            Your account balance is low. Please add funds to continue running campaigns.
          </AlertDescription>
        </Alert>
      )}

      {/* Success Message */}
      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Current Balance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(wallet.balanceCents)}</div>
            <p className="text-sm text-muted-foreground">
              Available for campaigns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Low Balance Threshold</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(wallet.lowBalanceThresholdCents)}</div>
            <p className="text-sm text-muted-foreground">
              Alert when balance falls below
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Payment Methods</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span className="text-sm">Credit Card</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm">Cryptocurrency</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm">Wire Transfer</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Funds */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add Funds</span>
          </CardTitle>
          <CardDescription>
            Add funds to your account to run campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                step="0.01"
                value={addFundsAmount}
                onChange={(e) => setAddFundsAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="method">Payment Method</Label>
              <Select value={addFundsMethod} onValueChange={setAddFundsMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STRIPE">Credit Card</SelectItem>
                  <SelectItem value="COINBASE">Cryptocurrency</SelectItem>
                  <SelectItem value="WIRE">Wire Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button 
                onClick={handleAddFunds} 
                disabled={isAddingFunds || !addFundsAmount}
                className="w-full"
              >
                {isAddingFunds ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Funds
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Your recent payment and spending activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          {wallet.transactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 rounded bg-gray-100 flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No transactions yet
              </h3>
              <p className="text-gray-500">
                Your transaction history will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {wallet.transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-100 rounded-full">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <h4 className="font-semibold capitalize">
                        {transaction.type.toLowerCase().replace("_", " ")}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className={`font-semibold ${
                        transaction.type === "TOP_UP" || transaction.type === "REFUND"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}>
                        {transaction.type === "TOP_UP" || transaction.type === "REFUND" ? "+" : "-"}
                        {formatCurrency(transaction.amountCents)}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center">
                        {getMethodIcon(transaction.method)}
                        <span className="ml-1 capitalize">{transaction.method.toLowerCase()}</span>
                      </div>
                    </div>
                    {getStatusBadge(transaction.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

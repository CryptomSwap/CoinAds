"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DollarSign, TrendingUp, Download, Filter, Search, CreditCard, Banknote } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";

export default function TransactionsPage() {
  const { data: session, status } = useSession();
  
  // All hooks must be called at the top level
  const [isExporting, setIsExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDateRange, setFilterDateRange] = useState("30d");
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  // Enhanced mock data
  const [transactions, setTransactions] = useState([
    {
      id: "TXN-2024-001234",
      type: "advertiser_payment",
      amount: 5000.00,
      status: "completed",
      user: "John Smith",
      userEmail: "john@cryptoexchange.com",
      description: "Campaign funding for Crypto Trading Platform",
      paymentMethod: "credit_card",
      timestamp: "2 hours ago",
      campaignId: "CAMP-001",
      campaignName: "Crypto Trading Platform"
    },
    {
      id: "TXN-2024-001235",
      type: "publisher_payout",
      amount: -1234.56,
      status: "completed",
      user: "Alex Rodriguez",
      userEmail: "alex@cryptonews.com",
      description: "Earnings payout for CryptoNewsDaily.com",
      paymentMethod: "usdt",
      timestamp: "4 hours ago",
      siteId: "SITE-001",
      siteName: "CryptoNewsDaily.com"
    },
    {
      id: "TXN-2024-001236",
      type: "advertiser_payment",
      amount: 3500.00,
      status: "completed",
      user: "Sarah Johnson",
      userEmail: "sarah@defi.com",
      description: "Campaign funding for DeFi Yield Farming",
      paymentMethod: "wire_transfer",
      timestamp: "6 hours ago",
      campaignId: "CAMP-002",
      campaignName: "DeFi Yield Farming"
    },
    {
      id: "TXN-2024-001237",
      type: "refund",
      amount: -500.00,
      status: "completed",
      user: "Mike Chen",
      userEmail: "mike@nftmarketplace.com",
      description: "Refund for NFT Marketplace campaign",
      paymentMethod: "credit_card",
      timestamp: "1 day ago",
      campaignId: "CAMP-003",
      campaignName: "NFT Marketplace"
    },
    {
      id: "TXN-2024-001238",
      type: "publisher_payout",
      amount: -856.78,
      status: "pending",
      user: "Maria Garcia",
      userEmail: "maria@blockchaininsights.com",
      description: "Earnings payout for BlockchainInsights.net",
      paymentMethod: "sepa",
      timestamp: "2 days ago",
      siteId: "SITE-002",
      siteName: "BlockchainInsights.net"
    }
  ]);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      redirect("/auth/signin");
      return;
    }

    if (session.user.role !== "ADMIN") {
      redirect("/auth/signin");
      return;
    }
  }, [session, status]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!session || session.user.role !== "ADMIN") {
    return null;
  }

  const handleExport = async () => {
    setIsExporting(true);
    try {
      console.log("Exporting transaction data...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Transaction data exported successfully!");
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleViewTransaction = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
  };

  const getFilteredTransactions = () => {
    return transactions.filter(transaction => {
      const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === "all" || transaction.type === filterType;
      const matchesStatus = filterStatus === "all" || transaction.status === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "advertiser_payment":
        return <CreditCard className="h-4 w-4 text-green-600" />;
      case "publisher_payout":
        return <Banknote className="h-4 w-4 text-blue-600" />;
      case "refund":
        return <DollarSign className="h-4 w-4 text-red-600" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "failed":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "credit_card":
        return <CreditCard className="h-4 w-4" />;
      case "wire_transfer":
        return <Banknote className="h-4 w-4" />;
      case "usdt":
        return <DollarSign className="h-4 w-4" />;
      case "sepa":
        return <Banknote className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Calculate summary statistics
  const totalRevenue = transactions
    .filter(t => t.type === "advertiser_payment")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalPayouts = Math.abs(transactions
    .filter(t => t.type === "publisher_payout")
    .reduce((sum, t) => sum + t.amount, 0));
  
  const totalRefunds = Math.abs(transactions
    .filter(t => t.type === "refund")
    .reduce((sum, t) => sum + t.amount, 0));
  
  const platformFee = totalRevenue * 0.1; // 10% platform fee

  return (
    <RequireAuth>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            Monitor all financial transactions and payments
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleExport} disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by ID, user, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Transaction Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="advertiser_payment">Advertiser Payments</SelectItem>
                  <SelectItem value="publisher_payout">Publisher Payouts</SelectItem>
                  <SelectItem value="refund">Refunds</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select value={filterDateRange} onValueChange={setFilterDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Advertiser Payments</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              +8.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publisher Payouts</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPayouts)}</div>
            <p className="text-xs text-muted-foreground">
              +15.3% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Fee</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(platformFee)}</div>
            <p className="text-xs text-muted-foreground">
              +10.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="payments">Advertiser Payments</TabsTrigger>
          <TabsTrigger value="payouts">Publisher Payouts</TabsTrigger>
          <TabsTrigger value="refunds">Refunds</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>
                Complete transaction history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Advertiser Payment</h3>
                      <p className="text-sm text-muted-foreground">John Smith • Campaign: Crypto Trading Platform</p>
                      <p className="text-sm text-muted-foreground">Transaction ID: TXN-2024-001234</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-600">+$5,000.00</div>
                    <div className="text-sm text-muted-foreground">2 hours ago</div>
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Publisher Payout</h3>
                      <p className="text-sm text-muted-foreground">Alex Rodriguez • Site: CryptoNewsDaily.com</p>
                      <p className="text-sm text-muted-foreground">Transaction ID: TXN-2024-001235</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-blue-600">-$1,234.56</div>
                    <div className="text-sm text-muted-foreground">4 hours ago</div>
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Advertiser Payment</h3>
                      <p className="text-sm text-muted-foreground">Sarah Johnson • Campaign: DeFi Yield Farming</p>
                      <p className="text-sm text-muted-foreground">Transaction ID: TXN-2024-001236</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-600">+$3,500.00</div>
                    <div className="text-sm text-muted-foreground">6 hours ago</div>
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Refund</h3>
                      <p className="text-sm text-muted-foreground">Mike Chen • Campaign: NFT Marketplace</p>
                      <p className="text-sm text-muted-foreground">Transaction ID: TXN-2024-001237</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-red-600">-$500.00</div>
                    <div className="text-sm text-muted-foreground">1 day ago</div>
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advertiser Payments</CardTitle>
              <CardDescription>
                Payments received from advertisers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-gray-100 rounded-md flex items-center justify-center">
                <span className="text-gray-500">Chart placeholder - Advertiser payments</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Publisher Payouts</CardTitle>
              <CardDescription>
                Payments made to publishers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-gray-100 rounded-md flex items-center justify-center">
                <span className="text-gray-500">Chart placeholder - Publisher payouts</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="refunds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Refunds</CardTitle>
              <CardDescription>
                Refunds processed for advertisers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-gray-100 rounded-md flex items-center justify-center">
                <span className="text-gray-500">Chart placeholder - Refunds</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Transaction Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Filters</CardTitle>
          <CardDescription>
            Filter transactions by various criteria
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium">Date Range</label>
              <select className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Custom range</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Transaction Type</label>
              <select className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md">
                <option>All</option>
                <option>Advertiser Payments</option>
                <option>Publisher Payouts</option>
                <option>Refunds</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <select className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md">
                <option>All</option>
                <option>Completed</option>
                <option>Pending</option>
                <option>Failed</option>
              </select>
            </div>
          </div>
          <Button>
            Apply Filters
          </Button>
        </CardContent>
      </Card>
      </div>
    </RequireAuth>
  );
}

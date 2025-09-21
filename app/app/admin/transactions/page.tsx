"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, Download, Filter, Search } from "lucide-react";

export default function TransactionsPage() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // In a real app, this would make an API call to export data
      console.log("Exporting transaction data...");
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Transaction export functionality would be implemented here");
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleFilter = () => {
    alert("Filter functionality would be implemented here");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            Monitor all financial transactions and payments
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleFilter}>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        </div>
      </div>

      {/* Transaction Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$124,567</div>
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
            <div className="text-2xl font-bold">$89,234</div>
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
            <div className="text-2xl font-bold">$35,333</div>
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
            <div className="text-2xl font-bold">$12,456</div>
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
  );
}

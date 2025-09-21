"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Calendar, TrendingUp, Eye, MousePointer, DollarSign } from "lucide-react";

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("7d");

  const handleExportReport = () => {
    // In a real app, this would trigger a download
    console.log("Exporting report for date range:", dateRange);
    // For now, we'll just show an alert
    alert("Report export functionality would be implemented here");
  };

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    console.log("Date range changed to:", range);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Analyze your site performance and earnings
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => handleDateRangeChange(dateRange === "7d" ? "30d" : "7d")}
          >
            <Calendar className="h-4 w-4 mr-2" />
            {dateRange === "7d" ? "Last 7 Days" : "Last 30 Days"}
          </Button>
          <Button onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,678,901</div>
            <p className="text-xs text-muted-foreground">
              +18.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89,456</div>
            <p className="text-xs text-muted-foreground">
              +12.8% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CTR</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.58%</div>
            <p className="text-xs text-muted-foreground">
              -0.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,456</div>
            <p className="text-xs text-muted-foreground">
              +22.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sites">Sites</TabsTrigger>
          <TabsTrigger value="placements">Placements</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>
                Your site performance over the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-gray-100 rounded-md flex items-center justify-center">
                <span className="text-gray-500">Chart placeholder - Performance metrics</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sites" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Performance</CardTitle>
              <CardDescription>
                Detailed breakdown by site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">CryptoNews.com</h3>
                    <p className="text-sm text-muted-foreground">Finance & Crypto</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">2,345,678 impressions</div>
                    <div className="text-sm text-muted-foreground">CTR: 1.8% • $1,234 earnings</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">DeFiInsights.net</h3>
                    <p className="text-sm text-muted-foreground">DeFi & Blockchain</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">1,987,654 impressions</div>
                    <div className="text-sm text-muted-foreground">CTR: 2.1% • $987 earnings</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">TradingTips.io</h3>
                    <p className="text-sm text-muted-foreground">Trading & Analysis</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">1,345,567 impressions</div>
                    <div className="text-sm text-muted-foreground">CTR: 1.5% • $567 earnings</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="placements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Placement Performance</CardTitle>
              <CardDescription>
                How your ad placements are performing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Header Banner (728x90)</h3>
                    <p className="text-sm text-muted-foreground">Top of page placement</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">1,234,567 impressions</div>
                    <div className="text-sm text-muted-foreground">eCPM: $0.45 • $556 earnings</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Sidebar Ad (300x250)</h3>
                    <p className="text-sm text-muted-foreground">Right sidebar placement</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">987,654 impressions</div>
                    <div className="text-sm text-muted-foreground">eCPM: $0.38 • $375 earnings</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">In-Content Ad (728x90)</h3>
                    <p className="text-sm text-muted-foreground">Between content blocks</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">456,789 impressions</div>
                    <div className="text-sm text-muted-foreground">eCPM: $0.42 • $192 earnings</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="earnings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Earnings Breakdown</CardTitle>
              <CardDescription>
                Your earnings by source and time period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-gray-100 rounded-md flex items-center justify-center">
                <span className="text-gray-500">Chart placeholder - Earnings breakdown</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

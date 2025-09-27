"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Monitor, Activity, AlertTriangle, CheckCircle, Clock, TrendingUp, RefreshCw, Download, Filter } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";

export default function DeliveryPage() {
  const { data: session, status } = useSession();

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [timeRange, setTimeRange] = useState("1h");
  const [selectedRegion, setSelectedRegion] = useState("all");

  // Mock real-time data
  const [deliveryData, setDeliveryData] = useState({
    systemStatus: "operational",
    activeCampaigns: 1247,
    impressionsPerMinute: 45678,
    errorRate: 0.12,
    totalImpressions: 2456789,
    totalClicks: 45678,
    totalConversions: 1234,
    revenue: 15678.90,
    alerts: [
      {
        id: "1",
        type: "high_traffic",
        title: "High Traffic Alert",
        message: "Traffic spike detected - 150% above normal",
        timestamp: "2 minutes ago",
        severity: "medium"
      },
      {
        id: "2",
        type: "low_balance",
        title: "Campaign Budget Warning",
        message: "Crypto Trading Platform campaign budget approaching limit",
        timestamp: "5 minutes ago",
        severity: "low"
      },
      {
        id: "3",
        type: "delivery_error",
        title: "Delivery Error",
        message: "2 delivery errors detected in the last hour",
        timestamp: "10 minutes ago",
        severity: "high"
      }
    ],
    topCampaigns: [
      {
        id: "1",
        name: "Crypto Trading Platform",
        advertiser: "John Smith",
        impressions: 45000,
        clicks: 1200,
        conversions: 45,
        spend: 2500,
        deliveryRate: 98.5
      },
      {
        id: "2",
        name: "DeFi Yield Farming",
        advertiser: "Sarah Johnson",
        impressions: 32000,
        clicks: 890,
        conversions: 32,
        spend: 1800,
        deliveryRate: 96.2
      },
      {
        id: "3",
        name: "NFT Marketplace",
        advertiser: "Mike Chen",
        impressions: 28000,
        clicks: 750,
        conversions: 28,
        spend: 1600,
        deliveryRate: 94.8
      }
    ],
    geographicData: [
      { region: "North America", impressions: 45, clicks: 1200, revenue: 7500 },
      { region: "Europe", impressions: 30, clicks: 890, revenue: 4500 },
      { region: "Asia", impressions: 20, clicks: 750, revenue: 3000 },
      { region: "Other", impressions: 5, clicks: 200, revenue: 678 }
    ]
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  const handleExport = () => {
    alert("Export functionality would be implemented here");
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "low":
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
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

  return (
    <RequireAuth>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Delivery Monitor</h1>
          <p className="text-muted-foreground">
            Monitor ad delivery performance and system health
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      {/* System Status */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-600 capitalize">
                {deliveryData.systemStatus}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All systems running normally
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(deliveryData.activeCampaigns)}</div>
            <p className="text-xs text-muted-foreground">
              +23 from last hour
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impressions/min</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(deliveryData.impressionsPerMinute)}</div>
            <p className="text-xs text-muted-foreground">
              +5.2% from last hour
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveryData.errorRate}%</div>
            <p className="text-xs text-muted-foreground">
              -0.03% from last hour
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Delivery Monitoring */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Delivery Metrics</CardTitle>
                <CardDescription>
                  Live performance data for ad delivery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-gray-500">Chart placeholder - Real-time delivery metrics</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
                <CardDescription>
                  Key performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Impressions</span>
                    <span className="font-medium">{formatNumber(deliveryData.totalImpressions)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Clicks</span>
                    <span className="font-medium">{formatNumber(deliveryData.totalClicks)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Conversions</span>
                    <span className="font-medium">{formatNumber(deliveryData.totalConversions)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Revenue</span>
                    <span className="font-medium">{formatCurrency(deliveryData.revenue)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Campaigns</CardTitle>
              <CardDescription>
                Campaigns with highest delivery rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deliveryData.topCampaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{campaign.name}</h3>
                      <p className="text-sm text-muted-foreground">Advertiser: {campaign.advertiser}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{campaign.deliveryRate}% delivery rate</div>
                      <div className="text-sm text-muted-foreground">{formatNumber(campaign.impressions)} impressions</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(campaign.spend)}</div>
                      <div className="text-sm text-muted-foreground">Total spend</div>
                    </div>
                    <Badge variant="secondary">
                      {campaign.deliveryRate >= 98 ? "Excellent" : 
                       campaign.deliveryRate >= 95 ? "Good" : "Fair"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>
                Recent system notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deliveryData.alerts.map((alert) => (
                  <div key={alert.id} className={`flex items-center space-x-3 p-3 border rounded-lg ${getSeverityColor(alert.severity)}`}>
                    {getSeverityIcon(alert.severity)}
                    <div className="flex-1">
                      <p className="font-medium">{alert.title}</p>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                    </div>
                    <Badge variant="outline">{alert.severity}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="geographic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>
                Ad delivery by geographic region
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deliveryData.geographicData.map((region, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{region.region}</h3>
                      <p className="text-sm text-muted-foreground">{region.impressions}% of impressions</p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatNumber(region.clicks)} clicks</div>
                      <div className="text-sm text-muted-foreground">{formatCurrency(region.revenue)} revenue</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </RequireAuth>
  );
}

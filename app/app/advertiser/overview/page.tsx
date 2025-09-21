"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  MousePointer, 
  Target, 
  DollarSign, 
  Wallet,
  Plus,
  Download,
  AlertTriangle,
  Megaphone
} from "lucide-react";
import Link from "next/link";

// Mock data for MVP - in production this would come from API
const mockData = {
  kpis: {
    impressions: 125430,
    clicks: 2847,
    ctr: 2.27,
    spend: 1250.50,
    balance: 500.00
  },
  campaigns: [
    {
      id: "1",
      name: "Crypto Exchange Launch",
      status: "ACTIVE",
      impressions: 45230,
      clicks: 1023,
      spend: 450.25,
      updatedAt: "2024-01-15"
    },
    {
      id: "2", 
      name: "DeFi Protocol Campaign",
      status: "PAUSED",
      impressions: 32100,
      clicks: 756,
      spend: 320.10,
      updatedAt: "2024-01-14"
    },
    {
      id: "3",
      name: "NFT Marketplace Promo",
      status: "PENDING",
      impressions: 0,
      clicks: 0,
      spend: 0,
      updatedAt: "2024-01-16"
    }
  ]
};

export default function AdvertiserOverview() {
  const { data: session } = useSession();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      // In a real app, this would make an API call to export data
      console.log("Exporting CSV data...");
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("CSV export functionality would be implemented here");
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400';
      case 'PAUSED': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400';
      case 'PENDING': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400';
      case 'COMPLETED': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session?.user?.name || 'Advertiser'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportCSV}
            disabled={isExporting}
          >
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? "Exporting..." : "Export CSV"}
          </Button>
          <Button asChild>
            <Link href="/app/advertiser/campaigns/new">
              <Plus className="mr-2 h-4 w-4" />
              New Campaign
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impressions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(mockData.kpis.impressions)}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(mockData.kpis.clicks)}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CTR</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.kpis.ctr}%</div>
            <p className="text-xs text-muted-foreground">Click-through rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockData.kpis.spend)}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockData.kpis.balance)}</div>
            <p className="text-xs text-muted-foreground">Available credits</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Balance Alert */}
      {mockData.kpis.balance < 100 && (
        <div className="rounded-lg border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Low balance alert
              </h3>
              <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                <p>
                  Your account balance is low. Add credits to keep your campaigns running.
                </p>
              </div>
              <div className="mt-4">
                <div className="-mx-2 -my-1.5 flex">
                  <Button variant="outline" size="sm" className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/30">
                    Add Credits
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>Daily impressions and clicks for the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-border rounded-lg">
            <div className="text-center">
              <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">Chart Coming Soon</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Interactive charts will be implemented in the next iteration.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Campaigns</CardTitle>
          <CardDescription>Your campaigns performance overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.campaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-sm font-medium text-foreground">{campaign.name}</h3>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">{formatNumber(campaign.impressions)}</span> impressions
                    </div>
                    <div>
                      <span className="font-medium">{formatNumber(campaign.clicks)}</span> clicks
                    </div>
                    <div>
                      <span className="font-medium">{formatCurrency(campaign.spend)}</span> spent
                    </div>
                    <div>
                      Updated {campaign.updatedAt}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    ⋯
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <Button variant="outline" asChild>
              <Link href="/app/advertiser/campaigns">
                View All Campaigns
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Empty State for No Campaigns */}
      {mockData.campaigns.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Megaphone className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium text-foreground">No campaigns yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first campaign to start serving ads.
            </p>
            <div className="mt-6">
              <Button asChild>
                <Link href="/app/advertiser/campaigns/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New Campaign
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
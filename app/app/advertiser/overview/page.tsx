'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { 
  TrendingUp, 
  MousePointer, 
  Target, 
  DollarSign, 
  Wallet,
  Plus,
  Download,
  AlertTriangle,
  Megaphone,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import RequireAuth from "@/components/RequireAuth";
import { useToast } from "@/lib/toast";

// Types for our data
interface CampaignStats {
  total: number;
  active: number;
  paused: number;
  pending: number;
  completed: number;
}

interface PerformanceMetrics {
  impressions: number;
  clicks: number;
  ctr: number;
  spend: number;
}

interface Campaign {
  id: number;
  name: string;
  status: string;
  impressions: number;
  clicks: number;
  spend: number;
  updatedAt: string;
}

interface DashboardData {
  campaignStats: CampaignStats;
  performance: PerformanceMetrics;
  recentCampaigns: Campaign[];
  balance: number;
}

// Empty dashboard data for initial state
const emptyDashboardData: DashboardData = {
  campaignStats: {
    total: 0,
    active: 0,
    paused: 0,
    pending: 0,
    completed: 0,
  },
  performance: {
    impressions: 0,
    clicks: 0,
    ctr: 0,
    spend: 0,
  },
  recentCampaigns: [],
  balance: 0,
};

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      {/* KPI cards skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-24 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>

      {/* Campaigns skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <div className="mt-2 grid grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <Skeleton key={j} className="h-3 w-20" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdvertiserOverview() {
  const { success, error: showError } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [dashboardData] = useState<DashboardData>(emptyDashboardData);
  const [loading, setLoading] = useState(true);

  // TODO: Replace with real API calls
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

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

  if (loading) {
    return <LoadingSkeleton />;
  }

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      // Get date range for last 30 days
      const dateTo = new Date();
      const dateFrom = new Date();
      dateFrom.setDate(dateFrom.getDate() - 30);

      const dateFromStr = dateFrom.toISOString().split('T')[0];
      const dateToStr = dateTo.toISOString().split('T')[0];

      const response = await fetch(
        `/api/reports/advertiser.csv?dateFrom=${dateFromStr}&dateTo=${dateToStr}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to export CSV');
      }

      // Get the CSV content
      const csvContent = await response.text();
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `coinads_report_${dateFromStr}_to_${dateToStr}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      success('CSV exported successfully!');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      showError(error instanceof Error ? error.message : 'Failed to export CSV');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <RequireAuth>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, Advertiser
            </p>
          </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportCSV}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </>
            )}
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
            <div className="text-2xl font-bold">{formatNumber(dashboardData.performance.impressions)}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(dashboardData.performance.clicks)}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CTR</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.performance.ctr}%</div>
            <p className="text-xs text-muted-foreground">Click-through rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData.performance.spend)}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData.balance)}</div>
            <p className="text-xs text-muted-foreground">Available credits</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Balance Alert */}
      {dashboardData.balance < 100 && (
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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/30"
                    asChild
                  >
                    <Link href="/app/advertiser/billing">
                      Add Credits
                    </Link>
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
            {dashboardData.recentCampaigns.length > 0 ? (
              dashboardData.recentCampaigns.map((campaign) => (
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
              ))
            ) : (
              <EmptyState
                icon={<Megaphone className="h-12 w-12" />}
                title="No campaigns yet"
                description="Create your first campaign to start advertising and track performance."
                action={{
                  label: "Create Campaign",
                  onClick: () => window.location.href = '/app/advertiser/campaigns/new'
                }}
              />
            )}
          </div>
          
          {dashboardData.recentCampaigns.length > 0 && (
            <div className="mt-4 text-center">
              <Button variant="outline" asChild>
                <Link href="/app/advertiser/campaigns">
                  View All Campaigns
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      </div>
    </RequireAuth>
  );
}
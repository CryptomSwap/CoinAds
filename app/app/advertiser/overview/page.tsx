import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

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

// Server component to fetch dashboard data
async function getDashboardData(userId: string): Promise<DashboardData> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Get campaign stats by status
  const campaignStats = await prisma.campaign.groupBy({
    by: ['status'],
    where: { advertiserId: parseInt(userId) },
    _count: { id: true },
  });

  // Get performance metrics from reports (last 7 days)
  const performanceData = await prisma.report.aggregate({
    where: {
      campaign: {
        advertiserId: parseInt(userId),
      },
      date: {
        gte: sevenDaysAgo,
      },
    },
    _sum: {
      impressions: true,
      clicks: true,
      spend: true,
    },
  });

  // Get recent campaigns with their performance
  const recentCampaigns = await prisma.campaign.findMany({
    where: { advertiserId: parseInt(userId) },
    include: {
      reports: {
        where: {
          date: {
            gte: sevenDaysAgo,
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  // Get user balance from transactions
  const balanceData = await prisma.transaction.aggregate({
    where: {
      userId: parseInt(userId),
      type: 'DEPOSIT',
    },
    _sum: {
      amount: true,
    },
  });

  // Process campaign stats
  const stats: CampaignStats = {
    total: 0,
    active: 0,
    paused: 0,
    pending: 0,
    completed: 0,
  };

  campaignStats.forEach(stat => {
    stats.total += stat._count.id;
    stats[stat.status.toLowerCase() as keyof CampaignStats] = stat._count.id;
  });

  // Calculate CTR
  const impressions = performanceData._sum.impressions || 0;
  const clicks = performanceData._sum.clicks || 0;
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;

  // Process recent campaigns
  const processedCampaigns: Campaign[] = recentCampaigns.map(campaign => {
    const campaignImpressions = campaign.reports.reduce((sum, report) => sum + report.impressions, 0);
    const campaignClicks = campaign.reports.reduce((sum, report) => sum + report.clicks, 0);
    const campaignSpend = campaign.reports.reduce((sum, report) => sum + report.spend, 0);

    return {
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      impressions: campaignImpressions,
      clicks: campaignClicks,
      spend: campaignSpend,
      updatedAt: campaign.createdAt.toISOString().split('T')[0],
    };
  });

  return {
    campaignStats: stats,
    performance: {
      impressions,
      clicks,
      ctr: Math.round(ctr * 100) / 100, // Round to 2 decimal places
      spend: performanceData._sum.spend || 0,
    },
    recentCampaigns: processedCampaigns,
    balance: balanceData._sum.amount || 0,
  };
}

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

export default async function AdvertiserOverview() {
  // Check authentication and role
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "ADVERTISER") {
    redirect("/auth/signin");
  }

  let dashboardData: DashboardData;
  let error: string | null = null;

  try {
    dashboardData = await getDashboardData(session.user.id);
  } catch (err) {
    console.error("Failed to fetch dashboard data:", err);
    error = "Failed to load dashboard data. Please try again later.";
    // Return error state
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {session.user.name || 'Advertiser'}
            </p>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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
            Welcome back, {session.user.name || 'Advertiser'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
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
            {dashboardData.recentCampaigns.map((campaign) => (
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
      {dashboardData.recentCampaigns.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Megaphone className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium text-foreground">No campaigns yet — create your first campaign.</h3>
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
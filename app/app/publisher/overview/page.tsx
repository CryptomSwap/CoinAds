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
  DollarSign, 
  Globe,
  CheckCircle,
  AlertCircle,
  Plus,
  ExternalLink,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

// Types for our data
interface SiteStats {
  total: number;
  approved: number;
  pending: number;
}

interface PlacementStats {
  total: number;
  approved: number;
  pending: number;
}

interface PerformanceMetrics {
  impressions: number;
  clicks: number;
  earnings: number;
}

interface Site {
  id: number;
  domain: string;
  status: string;
  placements: number;
  impressions: number;
  clicks: number;
  earnings: number;
}

interface SetupChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  href: string;
}

interface PublisherDashboardData {
  siteStats: SiteStats;
  placementStats: PlacementStats;
  performance: PerformanceMetrics;
  sites: Site[];
  setupChecklist: SetupChecklistItem[];
  balance: number;
}

// Server component to fetch publisher dashboard data
async function getPublisherDashboardData(userId: string): Promise<PublisherDashboardData> {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Get site stats
  const siteStats = await prisma.site.groupBy({
    by: ['approved'],
    where: { publisherId: parseInt(userId) },
    _count: { id: true },
  });

  // Get placement stats
  const placementStats = await prisma.placement.groupBy({
    by: ['approved'],
    where: { 
      site: { publisherId: parseInt(userId) }
    },
    _count: { id: true },
  });

  // Get performance metrics from impressions (last 7 days)
  const performanceData = await prisma.impression.aggregate({
    where: {
      site: {
        publisherId: parseInt(userId),
      },
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
    _sum: {
      costMicros: true,
    },
    _count: {
      id: true,
    },
  });

  // Get clicks count
  const clicksData = await prisma.click.count({
    where: {
      impression: {
        site: {
          publisherId: parseInt(userId),
        },
      },
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
  });

  // Get sites with their performance
  const sites = await prisma.site.findMany({
    where: { publisherId: parseInt(userId) },
    include: {
      placements: {
        include: {
          impressions: {
            where: {
              createdAt: {
                gte: sevenDaysAgo,
              },
            },
            include: {
              clicks: {
                where: {
                  createdAt: {
                    gte: sevenDaysAgo,
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: { id: 'desc' },
    take: 5,
  });

  // Get user balance from transactions
  const balanceData = await prisma.transaction.aggregate({
    where: {
      userId: parseInt(userId),
      type: 'PAYOUT',
    },
    _sum: {
      amount: true,
    },
  });

  // Process site stats
  const processedSiteStats: SiteStats = {
    total: 0,
    approved: 0,
    pending: 0,
  };

  siteStats.forEach(stat => {
    processedSiteStats.total += stat._count.id;
    if (stat.approved) {
      processedSiteStats.approved += stat._count.id;
    } else {
      processedSiteStats.pending += stat._count.id;
    }
  });

  // Process placement stats
  const processedPlacementStats: PlacementStats = {
    total: 0,
    approved: 0,
    pending: 0,
  };

  placementStats.forEach(stat => {
    processedPlacementStats.total += stat._count.id;
    if (stat.approved) {
      processedPlacementStats.approved += stat._count.id;
    } else {
      processedPlacementStats.pending += stat._count.id;
    }
  });

  // Calculate earnings (assuming 70% publisher share)
  const totalCostMicros = performanceData._sum.costMicros || 0;
  const totalCost = totalCostMicros / 1000000; // Convert from micro-cents to dollars
  const publisherShare = totalCost * 0.7; // 70% publisher share

  // Process sites data
  const processedSites: Site[] = sites.map(site => {
    let siteImpressions = 0;
    let siteClicks = 0;
    let siteEarnings = 0;

    site.placements.forEach(placement => {
      const placementImpressions = placement.impressions.length;
      const placementClicks = placement.impressions.reduce((sum, impression) => sum + impression.clicks.length, 0);
      const placementCost = (placementImpressions * 0.005); // $5 CPM
      const placementEarnings = placementCost * 0.7; // 70% publisher share

      siteImpressions += placementImpressions;
      siteClicks += placementClicks;
      siteEarnings += placementEarnings;
    });

    return {
      id: site.id,
      domain: site.domain,
      status: site.approved ? 'APPROVED' : 'PENDING',
      placements: site.placements.length,
      impressions: siteImpressions,
      clicks: siteClicks,
      earnings: siteEarnings,
    };
  });

  // Generate setup checklist based on actual data
  const hasApprovedSite = processedSiteStats.approved > 0;
  const hasPlacements = processedPlacementStats.total > 0;
  const hasApprovedPlacements = processedPlacementStats.approved > 0;

  const setupChecklist: SetupChecklistItem[] = [
    {
      id: "verify-site",
      title: "Verify Site",
      description: "Complete site verification process",
      completed: hasApprovedSite,
      href: "/app/publisher/sites"
    },
    {
      id: "create-placement",
      title: "Create Placement",
      description: "Set up ad placements on your site",
      completed: hasPlacements,
      href: "/app/publisher/placements"
    },
    {
      id: "copy-tag",
      title: "Copy Tag",
      description: "Install the ad tag on your site",
      completed: hasApprovedPlacements,
      href: "/app/publisher/placements"
    },
    {
      id: "request-payout",
      title: "Request Payout",
      description: "Set up payout method and request earnings",
      completed: publisherShare > 0,
      href: "/app/publisher/earnings"
    }
  ];

  return {
    siteStats: processedSiteStats,
    placementStats: processedPlacementStats,
    performance: {
      impressions: performanceData._count.id || 0,
      clicks: clicksData,
      earnings: publisherShare,
    },
    sites: processedSites,
    setupChecklist,
    balance: balanceData._sum.amount || 0,
  };
}

// Loading skeleton component
function PublisherLoadingSkeleton() {
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
        </div>
      </div>

      {/* KPI cards skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
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

      {/* Setup checklist skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-5 w-5" />
                  <div>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32 mt-1" />
                  </div>
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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

      {/* Sites skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <div className="grid grid-cols-4 gap-4">
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

export default async function PublisherOverview() {
  // Check authentication and role
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "PUBLISHER") {
    redirect("/auth/signin");
  }

  let dashboardData: PublisherDashboardData;
  let error: string | null = null;

  try {
    dashboardData = await getPublisherDashboardData(session.user.id);
  } catch (err) {
    console.error("Failed to fetch publisher dashboard data:", err);
    error = "Failed to load dashboard data. Please try again later.";
    // Return error state
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {session.user.name || 'Publisher'}
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
      case 'APPROVED': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400';
      case 'PENDING': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400';
      case 'REJECTED': return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400';
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
            Welcome back, {session.user.name || 'Publisher'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/app/publisher/sites">
              <Plus className="mr-2 h-4 w-4" />
              Add Site
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
            <CardTitle className="text-sm font-medium">Est. Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData.performance.earnings)}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData.balance)}</div>
            <p className="text-xs text-muted-foreground">Available for payout</p>
          </CardContent>
        </Card>
      </div>

      {/* Setup Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Checklist</CardTitle>
          <CardDescription>
            Complete these steps to start monetizing your site
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData.setupChecklist.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {item.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <h3 className="text-sm font-medium">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={item.href}>
                    {item.completed ? "View" : "Go to"}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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

      {/* Sites Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Sites</CardTitle>
          <CardDescription>Manage your sites and placements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData.sites.map((site) => (
              <div key={site.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium text-foreground">{site.domain}</h3>
                    <Badge className={getStatusColor(site.status)}>
                      {site.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">{site.placements}</span> placements
                    </div>
                    <div>
                      <span className="font-medium">{formatNumber(site.impressions)}</span> impressions
                    </div>
                    <div>
                      <span className="font-medium">{formatNumber(site.clicks)}</span> clicks
                    </div>
                    <div>
                      <span className="font-medium">{formatCurrency(site.earnings)}</span> earned
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/app/publisher/sites/${site.id}`}>
                      View
                    </Link>
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
              <Link href="/app/publisher/sites">
                View All Sites
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Empty State for No Sites */}
      {dashboardData.sites.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Globe className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium text-foreground">No sites yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your first site to start monetizing your traffic.
            </p>
            <div className="mt-6">
              <Button asChild>
                <Link href="/app/publisher/sites/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Site
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
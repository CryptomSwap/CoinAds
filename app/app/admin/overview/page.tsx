import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  Globe, 
  Megaphone, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Activity,
  Eye,
  Clock,
  BarChart3,
  PieChart,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

// Types for our data
interface UserCounts {
  advertisers: number;
  publishers: number;
  admins: number;
  total: number;
}

interface AdminKPIs {
  userCounts: UserCounts;
  totalCampaigns: number;
  pendingCreatives: number;
  pendingPayouts: number;
  last24hImpressions: number;
  last24hClicks: number;
}

interface PendingApproval {
  id: string;
  type: 'campaign' | 'creative' | 'site' | 'placement';
  title: string;
  description: string;
  createdAt: string;
  href: string;
  priority: 'high' | 'medium' | 'low';
}

interface AdminDashboardData {
  kpis: AdminKPIs;
  pendingApprovals: PendingApproval[];
}

// Server component to fetch admin dashboard data
async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

  // Get user counts by role
  const userCounts = await prisma.user.groupBy({
    by: ['role'],
    _count: { id: true },
  });

  // Get total campaigns
  const totalCampaigns = await prisma.campaign.count();

  // Get pending creatives (assuming creatives need approval)
  const pendingCreatives = await prisma.creative.count({
    where: {
      // Assuming there's a status field or we need to add one
      // For now, we'll count all creatives as pending approval
    },
  });

  // Get pending payouts
  const pendingPayouts = await prisma.transaction.count({
    where: {
      type: 'PAYOUT',
      status: 'PENDING',
    },
  });

  // Get last 24h impressions
  const last24hImpressions = await prisma.impression.count({
    where: {
      createdAt: {
        gte: twentyFourHoursAgo,
      },
    },
  });

  // Get last 24h clicks
  const last24hClicks = await prisma.click.count({
    where: {
      createdAt: {
        gte: twentyFourHoursAgo,
      },
    },
  });

  // Get pending approvals
  const pendingCampaigns = await prisma.campaign.findMany({
    where: { status: 'PENDING' },
    take: 2,
    orderBy: { createdAt: 'desc' },
  });

  const pendingSites = await prisma.site.findMany({
    where: { approved: false },
    take: 2,
    orderBy: { id: 'desc' },
  });

  const pendingPlacements = await prisma.placement.findMany({
    where: { approved: false },
    take: 1,
    orderBy: { id: 'desc' },
  });

  // Process user counts
  const processedUserCounts: UserCounts = {
    advertisers: 0,
    publishers: 0,
    admins: 0,
    total: 0,
  };

  userCounts.forEach(count => {
    processedUserCounts.total += count._count.id;
    switch (count.role) {
      case 'ADVERTISER':
        processedUserCounts.advertisers = count._count.id;
        break;
      case 'PUBLISHER':
        processedUserCounts.publishers = count._count.id;
        break;
      case 'ADMIN':
        processedUserCounts.admins = count._count.id;
        break;
    }
  });

  // Process pending approvals
  const pendingApprovals: PendingApproval[] = [];

  // Add pending campaigns
  pendingCampaigns.forEach(campaign => {
    pendingApprovals.push({
      id: `campaign-${campaign.id}`,
      type: 'campaign',
      title: `Campaign: ${campaign.name}`,
      description: `Budget: $${campaign.budget} - Created ${campaign.createdAt.toLocaleDateString()}`,
      createdAt: campaign.createdAt.toISOString(),
      href: `/app/admin/approvals?type=campaign&id=${campaign.id}`,
      priority: 'high',
    });
  });

  // Add pending sites
  pendingSites.forEach(site => {
    pendingApprovals.push({
      id: `site-${site.id}`,
      type: 'site',
      title: `Site: ${site.domain}`,
      description: `Publisher site awaiting verification`,
      createdAt: site.id.toString(), // Using ID as timestamp placeholder
      href: `/app/admin/approvals?type=site&id=${site.id}`,
      priority: 'medium',
    });
  });

  // Add pending placements
  pendingPlacements.forEach(placement => {
    pendingApprovals.push({
      id: `placement-${placement.id}`,
      type: 'placement',
      title: `Placement: ${placement.size}`,
      description: `Price: $${placement.price} - ${placement.pricing}`,
      createdAt: placement.id.toString(), // Using ID as timestamp placeholder
      href: `/app/admin/approvals?type=placement&id=${placement.id}`,
      priority: 'low',
    });
  });

  // Sort by priority and limit to top 5
  const sortedApprovals = pendingApprovals
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    })
    .slice(0, 5);

  return {
    kpis: {
      userCounts: processedUserCounts,
      totalCampaigns,
      pendingCreatives,
      pendingPayouts,
      last24hImpressions,
      last24hClicks,
    },
    pendingApprovals: sortedApprovals,
  };
}

export default async function AdminOverview() {
  // Check authentication and role
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/auth/signin");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  let dashboardData: AdminDashboardData;
  let error: string | null = null;

  try {
    dashboardData = await getAdminDashboardData();
  } catch (err) {
    console.error("Failed to fetch admin dashboard data:", err);
    error = "Failed to load dashboard data. Please try again later.";
    // Return error state
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
            <p className="text-muted-foreground">
              Monitor platform activity and manage operations
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

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "campaign":
        return <Megaphone className="h-5 w-5 text-blue-600" />;
      case "creative":
        return <CheckCircle className="h-5 w-5 text-purple-600" />;
      case "site":
        return <Globe className="h-5 w-5 text-green-600" />;
      case "placement":
        return <Activity className="h-5 w-5 text-orange-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getAlertColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20";
      case "medium":
        return "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20";
      case "low":
        return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20";
      default:
        return "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950/20";
    }
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
          <p className="text-muted-foreground">
            Monitor platform activity and manage operations
          </p>
        </div>
      </div>

      {/* KPI Tiles */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Advertisers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(dashboardData.kpis.userCounts.advertisers)}</div>
            <p className="text-xs text-muted-foreground">Total registered</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publishers</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(dashboardData.kpis.userCounts.publishers)}</div>
            <p className="text-xs text-muted-foreground">Total registered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(dashboardData.kpis.totalCampaigns)}</div>
            <p className="text-xs text-muted-foreground">All campaigns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(dashboardData.kpis.pendingPayouts)}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24h Impressions</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(dashboardData.kpis.last24hImpressions)}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24h Clicks</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(dashboardData.kpis.last24hClicks)}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Creatives</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(dashboardData.kpis.pendingCreatives)}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(dashboardData.kpis.userCounts.total)}</div>
            <p className="text-xs text-muted-foreground">All users</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
          <CardDescription>
            Top 5 items requiring admin approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData.pendingApprovals.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <h3 className="mt-2 text-sm font-medium text-foreground">All caught up!</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  No pending approvals at this time.
                </p>
              </div>
            ) : (
              dashboardData.pendingApprovals.map((approval) => (
                <div key={approval.id} className={`p-4 border rounded-lg ${getAlertColor(approval.priority)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getAlertIcon(approval.type)}
                      <div>
                        <h3 className="text-sm font-medium">{approval.title}</h3>
                        <p className="text-sm text-muted-foreground">{approval.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={approval.priority === 'high' ? 'border-red-500 text-red-700' : approval.priority === 'medium' ? 'border-yellow-500 text-yellow-700' : 'border-blue-500 text-blue-700'}>
                        {approval.priority}
                      </Badge>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={approval.href}>
                          Review
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {dashboardData.pendingApprovals.length > 0 && (
            <div className="mt-4 text-center">
              <Button variant="outline" asChild>
                <Link href="/app/admin/approvals">
                  View All Approvals
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>


      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance Overview
          </CardTitle>
          <CardDescription>
            Key performance indicators for the last 24 hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] bg-muted rounded-md flex items-center justify-center">
            <span className="text-muted-foreground">Chart placeholder - Performance metrics</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" asChild>
              <Link href="/app/admin/approvals">
                <CheckCircle className="mr-2 h-4 w-4" />
                Approvals
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/app/admin/delivery">
                <Activity className="mr-2 h-4 w-4" />
                Delivery Monitor
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/app/admin/transactions">
                <DollarSign className="mr-2 h-4 w-4" />
                Transactions
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/app/admin/users">
                <Users className="mr-2 h-4 w-4" />
                Users
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  MousePointer, 
  DollarSign, 
  Globe,
  CheckCircle,
  AlertCircle,
  Plus,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

// Mock data for MVP
const mockData = {
  kpis: {
    impressions: 125430,
    clicks: 2847,
    earnings: 125.50,
    balance: 89.25
  },
  sites: [
    {
      id: "1",
      domain: "mycryptosite.com",
      status: "APPROVED",
      placements: 3,
      impressions: 45230,
      clicks: 1023,
      earnings: 45.25
    },
    {
      id: "2",
      domain: "blockchainnews.io",
      status: "PENDING",
      placements: 2,
      impressions: 0,
      clicks: 0,
      earnings: 0
    }
  ],
  setupChecklist: [
    {
      id: "verify-site",
      title: "Verify Site",
      description: "Complete site verification process",
      completed: true,
      href: "/app/publisher/sites"
    },
    {
      id: "create-placement",
      title: "Create Placement",
      description: "Set up ad placements on your site",
      completed: true,
      href: "/app/publisher/placements"
    },
    {
      id: "copy-tag",
      title: "Copy Tag",
      description: "Install the ad tag on your site",
      completed: false,
      href: "/app/publisher/placements"
    },
    {
      id: "request-payout",
      title: "Request Payout",
      description: "Set up payout method and request earnings",
      completed: false,
      href: "/app/publisher/earnings"
    }
  ]
};

export default function PublisherOverview() {
  const { data: session } = useSession();

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
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {session?.user?.name || 'Publisher'}
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
            <CardTitle className="text-sm font-medium">Today's Impressions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(mockData.kpis.impressions)}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(mockData.kpis.clicks)}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Est. Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockData.kpis.earnings)}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockData.kpis.balance)}</div>
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
            {mockData.setupChecklist.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {item.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-gray-400" />
                  )}
                  <div>
                    <h3 className="text-sm font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
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
          <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
            <div className="text-center">
              <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Chart Coming Soon</h3>
              <p className="mt-1 text-sm text-gray-500">
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
            {mockData.sites.map((site) => (
              <div key={site.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <h3 className="text-sm font-medium">{site.domain}</h3>
                    <Badge className={getStatusColor(site.status)}>
                      {site.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm text-gray-500">
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
      {mockData.sites.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Globe className="h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No sites yet</h3>
            <p className="mt-1 text-sm text-gray-500">
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
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Globe, 
  Megaphone, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Activity
} from "lucide-react";
import Link from "next/link";

// Mock data for MVP
const mockData = {
  kpis: {
    advertisers: 45,
    publishers: 23,
    activeCampaigns: 12,
    totalSpend: 12500.50
  },
  alerts: [
    {
      id: "1",
      type: "pending_approval",
      title: "Pending Approvals",
      description: "3 campaigns, 2 sites, 5 creatives awaiting review",
      count: 10,
      href: "/app/admin/approvals"
    },
    {
      id: "2",
      type: "delivery_error",
      title: "Recent Errors",
      description: "2 delivery errors in the last hour",
      count: 2,
      href: "/app/admin/delivery"
    },
    {
      id: "3",
      type: "low_balance",
      title: "Low Balances",
      description: "5 advertisers with low account balances",
      count: 5,
      href: "/app/admin/users"
    }
  ],
  recentActivity: [
    {
      id: "1",
      type: "campaign_created",
      user: "john@cryptoexchange.com",
      action: "created campaign",
      target: "Crypto Exchange Launch",
      timestamp: "2 minutes ago"
    },
    {
      id: "2",
      type: "site_approved",
      user: "admin@coinads.com",
      action: "approved site",
      target: "blockchainnews.io",
      timestamp: "15 minutes ago"
    },
    {
      id: "3",
      type: "creative_rejected",
      user: "admin@coinads.com",
      action: "rejected creative",
      target: "DeFi Banner Ad",
      timestamp: "1 hour ago"
    },
    {
      id: "4",
      type: "payout_requested",
      user: "publisher@mycryptosite.com",
      action: "requested payout",
      target: "$125.50",
      timestamp: "2 hours ago"
    }
  ]
};

export default function AdminOverview() {
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
      case "pending_approval":
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case "delivery_error":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case "low_balance":
        return <DollarSign className="h-5 w-5 text-yellow-600" />;
      default:
        return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "pending_approval":
        return "border-blue-200 bg-blue-50";
      case "delivery_error":
        return "border-red-200 bg-red-50";
      case "low_balance":
        return "border-yellow-200 bg-yellow-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "campaign_created":
        return <Megaphone className="h-4 w-4 text-blue-600" />;
      case "site_approved":
        return <Globe className="h-4 w-4 text-green-600" />;
      case "creative_rejected":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "payout_requested":
        return <DollarSign className="h-4 w-4 text-teal-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
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
            <div className="text-2xl font-bold">{formatNumber(mockData.kpis.advertisers)}</div>
            <p className="text-xs text-muted-foreground">Total registered</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publishers</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(mockData.kpis.publishers)}</div>
            <p className="text-xs text-muted-foreground">Total registered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(mockData.kpis.activeCampaigns)}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockData.kpis.totalSpend)}</div>
            <p className="text-xs text-muted-foreground">Platform revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
          <CardDescription>
            Important notifications requiring attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.alerts.map((alert) => (
              <div key={alert.id} className={`p-4 border rounded-lg ${getAlertColor(alert.type)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getAlertIcon(alert.type)}
                    <div>
                      <h3 className="text-sm font-medium">{alert.title}</h3>
                      <p className="text-sm text-gray-600">{alert.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{alert.count}</Badge>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={alert.href}>
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest platform activity and user actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                {getActivityIcon(activity.type)}
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>{" "}
                    {activity.action}{" "}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
            ))}
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
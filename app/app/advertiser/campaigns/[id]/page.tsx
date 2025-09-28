"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  Edit, 
  Play, 
  Pause, 
  BarChart3, 
  DollarSign, 
  Eye, 
  MousePointer,
  TrendingUp,
  Calendar,
  Target,
  Plus,
  Loader2
} from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import { useToast } from "@/lib/toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: string;
  budgetCents: number;
  spentCents: number;
  startAt?: string;
  endAt?: string;
  objective?: string;
  createdAt: string;
  lineItems: any[];
  stats: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    spentCents: number;
  };
}

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchCampaign();
  }, [params.id]);

  const fetchCampaign = async () => {
    try {
      const response = await fetch(`/api/advertiser/campaigns/${params.id}`);
      const data = await response.json();

      if (response.ok) {
        setCampaign(data.campaign);
      } else {
        setError(data.error || "Failed to fetch campaign");
      }
    } catch (error) {
      setError("Error fetching campaign");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/advertiser/campaigns/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        success(`Campaign status changed to ${newStatus}`);
        fetchCampaign(); // Refresh the campaign data
      } else {
        const data = await response.json();
        showError(data.error || "Failed to update campaign");
      }
    } catch (error) {
      console.error('Error updating campaign:', error);
      showError("Error updating campaign");
    }
  };

  const handleDeleteCampaign = async () => {
    if (!campaign) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/advertiser/campaigns/${campaign.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete campaign');
      }

      success('Campaign deleted successfully');
      setShowDeleteDialog(false);
      router.push('/app/advertiser/campaigns');
    } catch (error) {
      console.error('Error deleting campaign:', error);
      showError(error instanceof Error ? error.message : 'Failed to delete campaign');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-500">Active</Badge>;
      case "PAUSED":
        return <Badge variant="secondary">Paused</Badge>;
      case "DRAFT":
        return <Badge variant="outline">Draft</Badge>;
      case "ENDED":
        return <Badge variant="outline">Ended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <RequireAuth>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </RequireAuth>
    );
  }

  if (error || !campaign) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Campaign Not Found</h1>
        </div>
        <Alert variant="destructive">
          <AlertDescription>{error || "Campaign not found"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <RequireAuth>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold">{campaign.name}</h1>
              {getStatusBadge(campaign.status)}
            </div>
            <p className="text-muted-foreground">
              Created {formatDate(campaign.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link href={`/app/advertiser/campaigns/${campaign.id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          
          {campaign.status === "ACTIVE" && (
            <Button 
              variant="outline" 
              onClick={() => handleStatusChange("PAUSED")}
            >
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}
          
          {campaign.status === "PAUSED" && (
            <Button 
              onClick={() => handleStatusChange("ACTIVE")}
            >
              <Play className="h-4 w-4 mr-2" />
              Resume
            </Button>
          )}

          <Button 
            variant="outline" 
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive hover:text-destructive"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Campaign Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Budget</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Budget:</span>
                <span className="font-semibold">{formatCurrency(campaign.budgetCents)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Spent:</span>
                <span className="font-semibold">{formatCurrency(campaign.spentCents)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Remaining:</span>
                <span className="font-semibold">{formatCurrency(campaign.budgetCents - campaign.spentCents)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Schedule</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Start:</span>
                <span className="font-semibold">
                  {campaign.startAt ? formatDate(campaign.startAt) : "Not set"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">End:</span>
                <span className="font-semibold">
                  {campaign.endAt ? formatDate(campaign.endAt) : "Not set"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Objective</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Goal:</span>
                <span className="font-semibold">{campaign.objective || "Not set"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Line Items:</span>
                <span className="font-semibold">{campaign.lineItems.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{campaign.stats.impressions.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center">
                <Eye className="h-4 w-4 mr-1" />
                Impressions
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{campaign.stats.clicks.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center">
                <MousePointer className="h-4 w-4 mr-1" />
                Clicks
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{campaign.stats.ctr}%</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                CTR
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{campaign.stats.conversions.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center">
                <Target className="h-4 w-4 mr-1" />
                Conversions
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      {campaign.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{campaign.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Line Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Line Items</CardTitle>
              <CardDescription>
                Manage your campaign line items and creatives
              </CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Line Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {campaign.lineItems.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 rounded bg-gray-100 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No line items yet
              </h3>
              <p className="text-gray-500 mb-4">
                Add line items to start serving ads
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Line Item
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {campaign.lineItems.map((lineItem) => (
                <div key={lineItem.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Line Item {lineItem.id}</h4>
                      <p className="text-sm text-muted-foreground">
                        {lineItem.creatives.length} creatives
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={lineItem.status === "ACTIVE" ? "default" : "secondary"}>
                        {lineItem.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Campaign"
        description={`Are you sure you want to delete "${campaign?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleDeleteCampaign}
      />
      </div>
    </RequireAuth>
  );
}

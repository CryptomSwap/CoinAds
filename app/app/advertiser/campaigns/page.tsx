"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus,
  Search,
  Play,
  Pause,
  Copy,
  Trash2,
  Loader2
} from "lucide-react";
import Link from "next/link";
import RequireAuth from "@/components/RequireAuth";
import { useToast } from "@/lib/toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { updateCampaignStatus, deleteCampaign } from "@/lib/server-actions/campaigns";

const statusFilters = [
  { label: "All", value: "all" },
  { label: "Active", value: "ACTIVE" },
  { label: "Paused", value: "PAUSED" },
  { label: "Pending", value: "PENDING" },
  { label: "Completed", value: "COMPLETED" }
];

interface Campaign {
  id: string;
  name: string;
  status: string;
  impressions: number;
  clicks: number;
  spend: number;
  updatedAt: string;
}

export default function CampaignsPage() {
  const { success, error: showError } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingCampaign, setDeletingCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/advertiser/campaigns');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCampaigns(data.campaigns.map((campaign: any) => ({
        id: campaign.id.toString(),
        name: campaign.name,
        status: campaign.status,
        budget: campaign.budget,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        createdAt: campaign.createdAt,
        impressions: 0, // TODO: Calculate from campaign data
        clicks: 0, // TODO: Calculate from campaign data
        spend: 0, // TODO: Calculate from campaign data
        updatedAt: campaign.createdAt, // Use createdAt as updatedAt fallback
      })));
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      showError('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (campaignId: string, newStatus: string) => {
    try {
      await updateCampaignStatus(campaignId, newStatus as "ACTIVE" | "PAUSED");
      
      // Update local state
      setCampaigns(prev => 
        prev.map(campaign => 
          campaign.id === campaignId 
            ? { ...campaign, status: newStatus }
            : campaign
        )
      );
      
      success(`Campaign status changed to ${newStatus}`);
    } catch (error) {
      console.error("Failed to change campaign status:", error);
      showError(error instanceof Error ? error.message : "Failed to change campaign status");
    }
  };

  const handleCopyCampaign = async (campaignId: string) => {
    try {
      const response = await fetch(`/api/advertiser/campaigns/${campaignId}/copy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to copy campaign');
      }

      await response.json();
      success('Campaign copied successfully');
      fetchCampaigns(); // Refresh the list
    } catch (error) {
      console.error("Failed to copy campaign:", error);
      showError(error instanceof Error ? error.message : "Failed to copy campaign");
    }
  };

  const openDeleteDialog = (campaign: Campaign) => {
    setDeletingCampaign(campaign);
    setShowDeleteDialog(true);
  };

  const handleDeleteCampaign = async () => {
    if (!deletingCampaign) return;

    try {
      await deleteCampaign(deletingCampaign.id);
      success('Campaign deleted successfully');
      setShowDeleteDialog(false);
      setDeletingCampaign(null);
      fetchCampaigns(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete campaign:", error);
      showError(error instanceof Error ? error.message : "Failed to delete campaign");
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
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800';
      case 'PENDING': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <RequireAuth>
        <div className="flex items-center justify-center min-h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage your advertising campaigns
          </p>
        </div>
        <Button asChild>
          <Link href="/app/advertiser/campaigns/new">
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search campaigns, sites, placements"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filters */}
            <div className="flex gap-2">
              {statusFilters.map((filter) => (
                <Button
                  key={filter.value}
                  variant={statusFilter === filter.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(filter.value)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaigns</CardTitle>
          <CardDescription>
            {filteredCampaigns.length} campaign{filteredCampaigns.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCampaigns.length > 0 ? (
            <div className="space-y-4">
              {filteredCampaigns.map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-sm font-medium">{campaign.name}</h3>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm text-gray-500">
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
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/app/advertiser/campaigns/${campaign.id}`}>
                        View
                      </Link>
                    </Button>
                    {campaign.status === "ACTIVE" ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStatusChange(campaign.id, "PAUSED")}
                      >
                        <Pause className="h-4 w-4" />
                      </Button>
                    ) : campaign.status === "PAUSED" ? (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStatusChange(campaign.id, "ACTIVE")}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    ) : null}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCopyCampaign(campaign.id)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openDeleteDialog(campaign)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <Search className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by creating your first campaign."
                }
              </p>
              {!searchTerm && statusFilter === "all" && (
                <div className="mt-6">
                  <Button asChild>
                    <Link href="/app/advertiser/campaigns/new">
                      <Plus className="mr-2 h-4 w-4" />
                      New Campaign
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Campaign"
        description={`Are you sure you want to delete "${deletingCampaign?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleDeleteCampaign}
      />
      </div>
    </RequireAuth>
  );
}
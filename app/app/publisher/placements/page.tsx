"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Settings, Eye, Edit, Trash2, Copy, Loader2 } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import { useToast } from "@/lib/toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface Placement {
  id: number;
  name: string;
  size: string;
  position: string;
  description?: string;
  approved: boolean;
  site: {
    id: number;
    domain: string;
  };
}

interface Site {
  id: number;
  domain: string;
}

export default function PlacementsPage() {
  const { data: session } = useSession();
  const { success, error: showError } = useToast();
  
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingPlacement, setEditingPlacement] = useState<Placement | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingPlacement, setDeletingPlacement] = useState<Placement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    siteId: '',
    name: '',
    size: '',
    position: '',
    description: '',
  });

  useEffect(() => {
    fetchPlacements();
    fetchSites();
  }, []);

  const fetchPlacements = async () => {
    try {
      const response = await fetch('/api/publisher/placements');
      if (!response.ok) throw new Error('Failed to fetch placements');
      const data = await response.json();
      setPlacements(data.placements);
    } catch (error) {
      console.error('Error fetching placements:', error);
      showError('Failed to load placements');
    } finally {
      setLoading(false);
    }
  };

  const fetchSites = async () => {
    try {
      const response = await fetch('/api/publisher/sites');
      if (!response.ok) throw new Error('Failed to fetch sites');
      const data = await response.json();
      setSites(data.sites);
    } catch (error) {
      console.error('Error fetching sites:', error);
      showError('Failed to load sites');
    }
  };

  const handleCreatePlacement = async () => {
    if (!formData.siteId || !formData.name || !formData.size || !formData.position) {
      showError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/publisher/placements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          siteId: parseInt(formData.siteId),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create placement');
      }

      success('Placement created successfully');
      setShowCreateDialog(false);
      resetForm();
      fetchPlacements();
    } catch (error) {
      console.error('Error creating placement:', error);
      showError(error instanceof Error ? error.message : 'Failed to create placement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPlacement = async () => {
    if (!editingPlacement || !formData.name || !formData.size || !formData.position) {
      showError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/publisher/placements/${editingPlacement.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          size: formData.size,
          position: formData.position,
          description: formData.description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update placement');
      }

      success('Placement updated successfully');
      setShowEditDialog(false);
      setEditingPlacement(null);
      resetForm();
      fetchPlacements();
    } catch (error) {
      console.error('Error updating placement:', error);
      showError(error instanceof Error ? error.message : 'Failed to update placement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePlacement = async () => {
    if (!deletingPlacement) return;

    try {
      const response = await fetch(`/api/publisher/placements/${deletingPlacement.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete placement');
      }

      success('Placement deleted successfully');
      setShowDeleteDialog(false);
      setDeletingPlacement(null);
      fetchPlacements();
    } catch (error) {
      console.error('Error deleting placement:', error);
      showError(error instanceof Error ? error.message : 'Failed to delete placement');
    }
  };

  const resetForm = () => {
    setFormData({
      siteId: '',
      name: '',
      size: '',
      position: '',
      description: '',
    });
  };

  const openEditDialog = (placement: Placement) => {
    setEditingPlacement(placement);
    setFormData({
      siteId: placement.site.id.toString(),
      name: placement.name,
      size: placement.size,
      position: placement.position,
      description: placement.description || '',
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (placement: Placement) => {
    setDeletingPlacement(placement);
    setShowDeleteDialog(true);
  };

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Ad Placements</h1>
            <p className="text-muted-foreground">
              Manage your ad placements and zones
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Placement
          </Button>
        </div>

        {placements.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground mb-4">No placements found</p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create your first placement
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {placements.map((placement) => (
              <Card key={placement.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {placement.name}
                    <Badge variant={placement.approved ? "default" : "secondary"}>
                      {placement.approved ? "Approved" : "Pending"}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {placement.description || `${placement.position} placement`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-[728/90] bg-gray-100 rounded-md flex items-center justify-center">
                    <span className="text-gray-500">{placement.size}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Site:</span>
                      <span className="font-medium">{placement.site.domain}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Position:</span>
                      <span className="font-medium">{placement.position}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Status:</span>
                      <span className="font-medium">
                        {placement.approved ? "Active" : "Awaiting Approval"}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => openEditDialog(placement)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => openDeleteDialog(placement)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create Placement Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Placement</DialogTitle>
              <DialogDescription>
                Add a new ad placement to your site
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="siteId">Site</Label>
                <Select value={formData.siteId} onValueChange={(value) => setFormData(prev => ({ ...prev, siteId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a site" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.id.toString()}>
                        {site.domain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Header Banner"
                />
              </div>
              <div>
                <Label htmlFor="size">Size</Label>
                <Select value={formData.size} onValueChange={(value) => setFormData(prev => ({ ...prev, size: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ad size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="728x90">728x90 (Leaderboard)</SelectItem>
                    <SelectItem value="300x250">300x250 (Medium Rectangle)</SelectItem>
                    <SelectItem value="160x600">160x600 (Wide Skyscraper)</SelectItem>
                    <SelectItem value="320x50">320x50 (Mobile Banner)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Select value={formData.position} onValueChange={(value) => setFormData(prev => ({ ...prev, position: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="header">Header</SelectItem>
                    <SelectItem value="sidebar">Sidebar</SelectItem>
                    <SelectItem value="footer">Footer</SelectItem>
                    <SelectItem value="content">Content</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this placement..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePlacement} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Create Placement
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Placement Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Placement</DialogTitle>
              <DialogDescription>
                Update placement details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Header Banner"
                />
              </div>
              <div>
                <Label htmlFor="edit-size">Size</Label>
                <Select value={formData.size} onValueChange={(value) => setFormData(prev => ({ ...prev, size: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ad size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="728x90">728x90 (Leaderboard)</SelectItem>
                    <SelectItem value="300x250">300x250 (Medium Rectangle)</SelectItem>
                    <SelectItem value="160x600">160x600 (Wide Skyscraper)</SelectItem>
                    <SelectItem value="320x50">320x50 (Mobile Banner)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-position">Position</Label>
                <Select value={formData.position} onValueChange={(value) => setFormData(prev => ({ ...prev, position: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="header">Header</SelectItem>
                    <SelectItem value="sidebar">Sidebar</SelectItem>
                    <SelectItem value="footer">Footer</SelectItem>
                    <SelectItem value="content">Content</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-description">Description (Optional)</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe this placement..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditPlacement} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Update Placement
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          title="Delete Placement"
          description={`Are you sure you want to delete "${deletingPlacement?.name}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          variant="destructive"
          onConfirm={handleDeletePlacement}
        />
      </div>
    </RequireAuth>
  );
}

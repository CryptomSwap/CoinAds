"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Upload, Edit, Trash2, Eye, Loader2, X } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import { useToast } from "@/lib/toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface Creative {
  id: string;
  name: string;
  url: string;
  clickUrl: string;
  size: string;
  campaignId?: string;
  createdAt: string;
}

export default function CreativesPage() {
  const { success, error: showError } = useToast();
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingCreative, setDeletingCreative] = useState<Creative | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    clickUrl: '',
    campaignId: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchCreatives();
  }, []);

  const fetchCreatives = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/creatives');
      if (!response.ok) throw new Error('Failed to fetch creatives');
      const data = await response.json();
      setCreatives(data.creatives || []);
    } catch (error) {
      console.error('Error fetching creatives:', error);
      showError('Failed to load creatives');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showError('Please select an image file');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      showError('File size must be less than 2MB');
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  const handleUpload = async () => {
    if (!selectedFile || !formData.name || !formData.clickUrl) {
      showError('Please fill in all fields and select a file');
      return;
    }

    setUploading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', selectedFile);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('clickUrl', formData.clickUrl);
      if (formData.campaignId) {
        formDataToSend.append('campaignId', formData.campaignId);
      }

      const response = await fetch('/api/creatives/upload', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload creative');
      }

      success('Creative uploaded successfully');
      setShowUploadDialog(false);
      resetForm();
      fetchCreatives();
    } catch (error) {
      console.error('Error uploading creative:', error);
      showError(error instanceof Error ? error.message : 'Failed to upload creative');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteCreative = async () => {
    if (!deletingCreative) return;

    try {
      const response = await fetch(`/api/creatives/${deletingCreative.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete creative');
      }

      success('Creative deleted successfully');
      setShowDeleteDialog(false);
      setDeletingCreative(null);
      fetchCreatives();
    } catch (error) {
      console.error('Error deleting creative:', error);
      showError(error instanceof Error ? error.message : 'Failed to delete creative');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      clickUrl: '',
      campaignId: '',
    });
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const openDeleteDialog = (creative: Creative) => {
    setDeletingCreative(creative);
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
            <h1 className="text-3xl font-bold tracking-tight">Creatives</h1>
            <p className="text-muted-foreground">
              Manage your ad creatives and assets
            </p>
          </div>
          <Button onClick={() => setShowUploadDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Upload Creative
          </Button>
        </div>

        {creatives.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground mb-4">No creatives found</p>
            <Button onClick={() => setShowUploadDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Upload your first creative
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {creatives.map((creative) => (
              <Card key={creative.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {creative.name}
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => window.open(creative.url, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openDeleteDialog(creative)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    {creative.size}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[728/90] bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                    {creative.url ? (
                      <img 
                        src={creative.url} 
                        alt={creative.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500">No preview</span>
                    )}
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    Click URL: {creative.clickUrl}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Upload Dialog */}
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Creative</DialogTitle>
              <DialogDescription>
                Upload a new creative asset for your campaigns
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium mb-2">Drag and drop your file here</p>
                <p className="text-muted-foreground mb-4">
                  or click to browse files
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                  id="file-upload"
                />
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Choose File
                </Button>
              </div>

              {/* File Preview */}
              {previewUrl && selectedFile && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="border rounded-lg p-4">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="max-w-full max-h-48 mx-auto"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Creative Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter creative name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="clickUrl">Click URL</Label>
                  <Input
                    id="clickUrl"
                    value={formData.clickUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, clickUrl: e.target.value }))}
                    placeholder="https://example.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="campaignId">Campaign (Optional)</Label>
                  <Input
                    id="campaignId"
                    value={formData.campaignId}
                    onChange={(e) => setFormData(prev => ({ ...prev, campaignId: e.target.value }))}
                    placeholder="Campaign ID"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowUploadDialog(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpload} 
                  disabled={uploading || !selectedFile || !formData.name || !formData.clickUrl}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Upload Creative'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          title="Delete Creative"
          description={`Are you sure you want to delete "${deletingCreative?.name}"? This action cannot be undone.`}
          onConfirm={handleDeleteCreative}
          confirmText="Delete"
          variant="destructive"
        />
      </div>
    </RequireAuth>
  );
}

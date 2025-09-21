"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Upload, Edit, Trash2, Eye } from "lucide-react";

export default function CreativesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Creatives</h1>
          <p className="text-muted-foreground">
            Manage your ad creatives and assets
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Upload Creative
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Banner Ad
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              728x90 Leaderboard Banner
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-[728/90] bg-gray-100 rounded-md flex items-center justify-center">
              <span className="text-gray-500">728x90</span>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Status: <span className="text-green-600">Active</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Square Ad
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              300x300 Square Display
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
              <span className="text-gray-500">300x300</span>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Status: <span className="text-yellow-600">Pending Review</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Video Ad
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              16:9 Video Creative
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
              <span className="text-gray-500">16:9 Video</span>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Status: <span className="text-green-600">Active</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload New Creative</CardTitle>
          <CardDescription>
            Upload images, videos, or other creative assets for your campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium mb-2">Drag and drop your files here</p>
            <p className="text-muted-foreground mb-4">
              or click to browse files
            </p>
            <Button variant="outline">
              Choose Files
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Upload, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreativeActions() {
  const handleUploadCreative = () => {
    // TODO: Implement creative upload logic
    console.log('Opening creative upload dialog...');
  };

  const handleUploadFirstCreative = () => {
    // TODO: Implement creative upload logic
    console.log('Opening creative upload dialog...');
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Creative Assets</h1>
          <p className="text-muted-foreground mt-2">
            Manage your advertising creatives and assets
          </p>
        </div>
        <Button 
          size="lg" 
          data-testid="upload-creative"
          onClick={handleUploadCreative}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Creative
        </Button>
      </div>

      <div className="text-center py-12 text-muted-foreground">
        <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-medium mb-2">No creatives uploaded yet</h3>
        <p className="text-sm mb-4">
          Upload your first creative asset to get started with advertising
        </p>
        <Button 
          data-testid="upload-first-creative"
          onClick={handleUploadFirstCreative}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Your First Creative
        </Button>
      </div>

      <div className="flex items-center gap-4 mt-8">
        <Button asChild variant="outline">
          <Link href="/app/advertiser">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </>
  );
}

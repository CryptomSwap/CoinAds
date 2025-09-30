"use client";

import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export default function CreativeUploadButton() {
  const handleUploadFirstCreative = () => {
    // TODO: Implement creative upload logic
    console.log('Opening creative upload dialog...');
  };

  return (
    <Button 
      data-testid="upload-first-creative"
      onClick={handleUploadFirstCreative}
    >
      <Upload className="mr-2 h-4 w-4" />
      Upload Your First Creative
    </Button>
  );
}

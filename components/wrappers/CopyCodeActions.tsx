"use client";

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface CopyCodeActionsProps {
  code: string;
}

export default function CopyCodeActions({ code }: CopyCodeActionsProps) {
  const handleCopyCode = () => {
    // TODO: Implement copy to clipboard functionality
    console.log('Copying code to clipboard...');
    navigator.clipboard.writeText(code).catch(console.error);
  };

  return (
    <Button 
      size="sm" 
      variant="outline" 
      className="mt-2"
      onClick={handleCopyCode}
    >
      <Copy className="mr-2 h-4 w-4" />
      Copy Code
    </Button>
  );
}

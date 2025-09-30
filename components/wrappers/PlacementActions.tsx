"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PlacementActions() {
  const handleCreatePlacement = () => {
    // TODO: Implement placement creation logic
    console.log('Creating placement...');
  };

  return (
    <div className="flex items-center gap-4 mt-8">
      <Button asChild variant="outline">
        <Link href="/app/publisher/placements">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Placements
        </Link>
      </Button>
      <Button 
        size="lg" 
        data-testid="create-placement"
        onClick={handleCreatePlacement}
      >
        Create Placement
      </Button>
    </div>
  );
}

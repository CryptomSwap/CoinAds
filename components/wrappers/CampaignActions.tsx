"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CampaignActions() {
  const handleCreateCampaign = () => {
    // TODO: Implement campaign creation logic
    console.log('Creating campaign...');
  };

  return (
    <div className="flex items-center gap-4 mt-8">
      <Button asChild variant="outline">
        <Link href="/app/advertiser/campaigns">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Campaigns
        </Link>
      </Button>
      <Button 
        size="lg" 
        data-testid="create-campaign"
        onClick={handleCreateCampaign}
      >
        Create Campaign
      </Button>
    </div>
  );
}

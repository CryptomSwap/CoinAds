"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SiteActions() {
  const handleSubmitSite = () => {
    // TODO: Implement site submission logic
    console.log('Submitting site for review...');
  };

  return (
    <div className="flex items-center gap-4 mt-8">
      <Button asChild variant="outline">
        <Link href="/app/publisher/sites">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sites
        </Link>
      </Button>
      <Button 
        size="lg" 
        data-testid="submit-site"
        onClick={handleSubmitSite}
      >
        Submit for Review
      </Button>
    </div>
  );
}

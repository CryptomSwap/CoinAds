"use client";

import { Button } from "@/components/ui/button";
import { CreditCard, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function WalletActions() {
  const handleAddCreditCard = () => {
    // TODO: Implement credit card setup logic
    console.log('Setting up credit card...');
  };

  const handleTopUpWallet = () => {
    // TODO: Implement wallet top-up logic
    console.log('Opening wallet top-up dialog...');
  };

  return (
    <>
      <div className="space-y-2">
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          data-testid="add-credit-card"
          onClick={handleAddCreditCard}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Credit/Debit Card
        </Button>
      </div>

      <Button 
        className="w-full" 
        data-testid="top-up-wallet"
        onClick={handleTopUpWallet}
      >
        Add Funds to Wallet
      </Button>

      <div className="flex items-center gap-4 mt-8">
        <Button asChild variant="outline">
          <Link href="/app/advertiser">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <Button variant="outline" asChild data-testid="view-billing">
          <Link href="/app/billing">
            View Billing History
          </Link>
        </Button>
      </div>
    </>
  );
}

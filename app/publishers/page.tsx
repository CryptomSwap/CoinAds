import TopBar from "@/components/TopBar";
import HeroPublishers from "@/components/publishers/HeroPublishers";
import BenefitsPublishers from "@/components/publishers/BenefitsPublishers";
import HowItWorks from "@/components/marketing/HowItWorks";
import CtaBand from "@/components/publishers/CtaBand";

export default function PublishersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white/90 to-blue-600/20 dark:from-slate-900 dark:to-blue-900/40">
      <TopBar />
      <HeroPublishers />
      <BenefitsPublishers />
      <HowItWorks variant="publisher" className="bg-gradient-to-b from-background to-muted/15" />
      <CtaBand />
    </div>
  );
}

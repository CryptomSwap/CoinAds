import TopBar from "@/components/TopBar";
import HeroPublishers from "@/components/publishers/HeroPublishers";
import BenefitsPublishers from "@/components/publishers/BenefitsPublishers";
import HowItWorksPublishers from "@/components/publishers/HowItWorksPublishers";
import CtaBand from "@/components/publishers/CtaBand";

export default function PublishersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white/90 to-blue-600/20 dark:from-slate-900 dark:to-blue-900/40">
      <TopBar />
      <HeroPublishers />
      <BenefitsPublishers />
      <HowItWorksPublishers />
      <CtaBand />
    </div>
  );
}

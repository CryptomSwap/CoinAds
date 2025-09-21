import TopBar from "@/components/TopBar";
import HeroPublishers from "@/components/publishers/HeroPublishers";
import BenefitsPublishers from "@/components/publishers/BenefitsPublishers";
import HowItWorksPublishers from "@/components/publishers/HowItWorksPublishers";
import CtaBand from "@/components/publishers/CtaBand";

export default function PublishersPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <HeroPublishers />
      <BenefitsPublishers />
      <HowItWorksPublishers />
      <CtaBand />
    </div>
  );
}

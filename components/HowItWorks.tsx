import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, CreditCard, Upload, Play } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Create account",
    description: "Sign up as an advertiser in minutes."
  },
  {
    icon: CreditCard,
    title: "Add credits",
    description: "Fund your account with flexible billing options."
  },
  {
    icon: Upload,
    title: "Upload creatives",
    description: "Banners or native; pass validation instantly."
  },
  {
    icon: Play,
    title: "Go live",
    description: "Target by geo/device/site and launch."
  }
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Get started in minutes with our simple 4-step process
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <Card 
                key={index} 
                className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors focus-within:ring-2 focus-within:ring-teal-300 focus-within:ring-offset-2 focus-within:ring-offset-white dark:focus-within:ring-offset-slate-900"
              >
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-teal-500/20 rounded-full">
                      <IconComponent className="h-6 w-6 text-teal-400" strokeWidth={1.5} />
                    </div>
                  </div>
                  <CardTitle className="text-slate-900 dark:text-white text-lg">
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 dark:text-slate-300 text-center">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

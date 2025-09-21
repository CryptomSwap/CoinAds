import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <nav className={cn("flex items-center justify-center", className)}>
      <ol className="flex items-center space-x-8">
        {steps.map((step, index) => (
          <li key={step.id} className="flex items-center">
            <div className="flex items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium",
                  step.completed || index < currentStep
                    ? "border-primary bg-primary text-primary-foreground"
                    : index === currentStep
                    ? "border-primary bg-background text-primary"
                    : "border-slate-300 bg-background text-slate-500"
                )}
              >
                {step.completed || index < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              <div className="ml-4 min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium",
                    step.completed || index < currentStep
                      ? "text-slate-900"
                      : index === currentStep
                      ? "text-primary"
                      : "text-slate-500"
                  )}
                >
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-xs text-slate-500">{step.description}</p>
                )}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "ml-8 h-0.5 w-16",
                  index < currentStep ? "bg-primary" : "bg-slate-300"
                )}
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

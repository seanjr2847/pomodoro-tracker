"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { Check } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/shared/utils/cn";

interface WizardContextValue {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
  goTo: (step: number) => void;
  next: () => void;
  prev: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const WizardContext = createContext<WizardContextValue | null>(null);

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used within <Wizard>");
  return ctx;
}

// --- Wizard Container ---

interface WizardProps {
  onComplete: () => void;
  children: ReactNode;
}

export function Wizard({ onComplete, children }: WizardProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = Array.isArray(children)
    ? (children as React.ReactElement<WizardStepProps>[])
    : [children as React.ReactElement<WizardStepProps>];

  const totalSteps = steps.length;
  const stepTitles = steps.map(
    (s) => (s as React.ReactElement<WizardStepProps>).props.title,
  );

  const goTo = useCallback(
    (i: number) => {
      if (i >= 0 && i < totalSteps) setCurrentStep(i);
    },
    [totalSteps],
  );

  const next = useCallback(() => {
    if (currentStep < totalSteps - 1) setCurrentStep((s) => s + 1);
    else onComplete();
  }, [currentStep, totalSteps, onComplete]);

  const prev = useCallback(() => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }, [currentStep]);

  return (
    <WizardContext.Provider
      value={{
        currentStep,
        totalSteps,
        stepTitles,
        goTo,
        next,
        prev,
        isFirst: currentStep === 0,
        isLast: currentStep === totalSteps - 1,
      }}
    >
      <div className="space-y-6">
        <WizardProgress />
        {steps[currentStep]}
        <WizardNavigation />
      </div>
    </WizardContext.Provider>
  );
}

// --- Step ---

interface WizardStepProps {
  title: string;
  children: ReactNode;
}

export function WizardStep({ children }: WizardStepProps) {
  return <div>{children}</div>;
}

// --- Progress ---

export function WizardProgress() {
  const { currentStep, totalSteps, stepTitles, goTo } = useWizard();

  return (
    <div className="flex items-center gap-2">
      {stepTitles.map((title, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <button
            key={i}
            type="button"
            className={cn(
              "flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              done &&
                "cursor-pointer border-primary/30 bg-primary/10 text-primary",
              active && "border-primary bg-primary text-primary-foreground",
              !done && !active && "cursor-default border-muted text-muted-foreground",
            )}
            onClick={() => done && goTo(i)}
            disabled={!done}
          >
            {done ? (
              <Check className="h-3 w-3" />
            ) : (
              <span>{i + 1}</span>
            )}
            <span className="hidden sm:inline">{title}</span>
          </button>
        );
      })}
      <div className="ml-auto text-xs text-muted-foreground">
        {currentStep + 1} / {totalSteps}
      </div>
    </div>
  );
}

// --- Navigation ---

export function WizardNavigation() {
  const { prev, next, isFirst, isLast } = useWizard();

  return (
    <div className="flex justify-between">
      <Button variant="outline" size="sm" onClick={prev} disabled={isFirst}>
        Previous
      </Button>
      <Button size="sm" onClick={next}>
        {isLast ? "Complete" : "Next"}
      </Button>
    </div>
  );
}

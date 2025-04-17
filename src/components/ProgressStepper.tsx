import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useBooking } from "@/context/BookingContext";
import { Step } from "@/types";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CreditCard,
  MapPin,
  ShieldCheck,
  Trash2,
  Truck,
} from "lucide-react";
import React from "react";

interface StepIconProps {
  step: Step;
  isActive: boolean;
  isCompleted: boolean;
}

const StepIcon: React.FC<StepIconProps> = ({ step, isActive, isCompleted }) => {
  // Only use brand color for active step or completed steps
  const activeClass =
    isActive || isCompleted ? "text-brand-blue" : "text-[#6b6b6b]";

  switch (step) {
    case "postcode":
      return <MapPin className={activeClass} />;
    case "wasteType":
      return <Trash2 className={activeClass} />;
    case "skipSize":
      return <Truck className={activeClass} />;
    case "permitCheck":
      return <ShieldCheck className={activeClass} />;
    case "chooseDate":
      return <CalendarDays className={activeClass} />;
    case "payment":
      return <CreditCard className={activeClass} />;
    default:
      return null;
  }
};

const StepLabel: React.FC<{
  step: Step;
  isActive: boolean;
  isCompleted: boolean;
}> = ({ step, isActive, isCompleted }) => {
  // Only use white text for active or completed steps
  const textClass = isActive || isCompleted ? "text-white" : "text-[#6b6b6b]";

  const getLabel = () => {
    switch (step) {
      case "postcode":
        return "Postcode";
      case "wasteType":
        return "Waste Type";
      case "skipSize":
        return "Select Skip";
      case "permitCheck":
        return "Permit Check";
      case "chooseDate":
        return "Choose Date";
      case "payment":
        return "Payment";
      default:
        return "";
    }
  };

  return (
    <span className={`hidden md:inline text-sm ${textClass}`}>
      {getLabel()}
    </span>
  );
};

// Detailed descriptions for tooltips
const getStepTooltipDescription = (step: Step): string => {
  switch (step) {
    case "postcode":
      return "Enter your location to find available services in your area";
    case "wasteType":
      return "Select what type of waste you'll be disposing of (household, garden, construction, etc.)";
    case "skipSize":
      return "Choose the appropriate skip size based on your waste volume";
    case "permitCheck":
      return "Determine if you need a permit for skip placement on public roads";
    case "chooseDate":
      return "Select delivery and collection dates that work for you";
    case "payment":
      return "Review your order and complete secure payment";
    default:
      return "";
  }
};

const ProgressStepper: React.FC = () => {
  const { currentStep, highestStepReached, setCurrentStep } = useBooking();

  const steps: Step[] = [
    "postcode",
    "wasteType",
    "skipSize",
    "permitCheck",
    "chooseDate",
    "payment",
  ];

  // Get status of a step: active, completed, or inactive
  const getStepStatus = (step: Step) => {
    if (step === currentStep) return "active";
    const stepIndex = steps.indexOf(step);
    const currentIndex = steps.indexOf(currentStep);
    // Only mark as completed if it's a previous step (before current)
    return stepIndex < currentIndex ? "completed" : "inactive";
  };

  // Helper function to get the appropriate CSS class based on step status
  const getStepClass = (step: Step) => {
    const status = getStepStatus(step);
    if (status === "active") return "step-active";
    if (status === "completed") return "step-completed";
    return "step-inactive";
  };

  // Helper function to get the appropriate line CSS class
  const getLineClass = (step: Step) => {
    const stepIndex = steps.indexOf(step);
    const currentIndex = steps.indexOf(currentStep);
    // Only color lines for steps before the current one
    return stepIndex < currentIndex ? "step-line-active" : "step-line-inactive";
  };

  // Get description for a step
  const getStepDescription = (step: Step): string => {
    switch (step) {
      case "postcode":
        return "Enter your location";
      case "wasteType":
        return "Choose waste types";
      case "skipSize":
        return "Select skip size";
      case "permitCheck":
        return "Choose placement location";
      case "chooseDate":
        return "Schedule collection";
      case "payment":
        return "Complete payment";
      default:
        return "";
    }
  };

  // Get name/title for a step
  const getStepTitle = (step: Step): string => {
    switch (step) {
      case "postcode":
        return "Location";
      case "wasteType":
        return "Waste Type";
      case "skipSize":
        return "Skip Size";
      case "permitCheck":
        return "Permit";
      case "chooseDate":
        return "Schedule";
      case "payment":
        return "Payment";
      default:
        return "";
    }
  };

  // Get tooltip variant based on step status
  const getTooltipVariant = (step: Step): "default" | "info" | "success" => {
    const status = getStepStatus(step);
    if (status === "active") return "info";
    if (status === "completed") return "success";
    return "default";
  };

  // Only allow navigating backward to completed steps
  const handleStepClick = (step: Step) => {
    const currentIndex = steps.indexOf(currentStep);
    const targetIndex = steps.indexOf(step);

    // Only allow navigating backward to completed steps
    if (targetIndex < currentIndex) {
      setCurrentStep(step);
    }
  };

  return (
    <div className="py-2 px-4 md:py-8 lg:py-6 max-w-7xl mx-auto">
      {/* Desktop progress stepper */}
      <div className="hidden sm:flex flex-row justify-between items-start">
        {steps.map((step, index) => {
          const status = getStepStatus(step);
          const isActive = status === "active";
          const isCompleted = status === "completed";
          const canNavigate = isCompleted && !isActive;
          const statusClass = getStepClass(step);
          const lineClass = getLineClass(step);
          const isLast = index === steps.length - 1;
          const tooltipVariant = getTooltipVariant(step);

          return (
            <div
              key={step}
              className={`flex flex-col items-center ${
                !isLast ? "w-auto flex-1" : ""
              }`}
            >
              <div className="flex items-center w-full">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => canNavigate && handleStepClick(step)}
                        className={`flex items-center justify-center text-sm font-medium ${
                          canNavigate
                            ? "cursor-pointer hover:underline"
                            : "cursor-default"
                        } ${statusClass}`}
                        disabled={!canNavigate}
                        aria-current={isActive ? "step" : undefined}
                        aria-label={`${getStepTitle(step)} ${
                          isActive
                            ? "(current)"
                            : isCompleted
                            ? "(completed)"
                            : "(upcoming)"
                        }`}
                      >
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full mr-2 transition-all duration-300 ${
                            isActive || isCompleted
                              ? "text-white"
                              : "text-app-inactive-text"
                          }`}
                        >
                          <StepIcon
                            step={step}
                            isActive={isActive}
                            isCompleted={isCompleted}
                          />
                        </div>
                        <span
                          className={`inline-block text-lg ${
                            isActive || isCompleted
                              ? "text-white"
                              : "text-app-inactive-text"
                          }`}
                        >
                          {getStepTitle(step)}
                        </span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      variant={tooltipVariant}
                      side="bottom"
                      className="max-w-xs"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{getStepTitle(step)}</p>
                        <p className="text-xs opacity-90">
                          {getStepDescription(step)}
                        </p>
                        <p className="text-xs">
                          {getStepTooltipDescription(step)}
                        </p>
                        {canNavigate && (
                          <p className="text-xs font-medium mt-1 text-brand-blue">
                            Click to go back to this step
                          </p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {!isLast && (
                  <div
                    className={`step-line flex-grow mx-2 ${lineClass}`}
                    aria-hidden="true"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile view - only show current step */}
      <div className="sm:hidden flex flex-col items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center cursor-help">
                <div className="flex items-center justify-center w-10 h-10 rounded-full text-white mb-2">
                  <StepIcon
                    step={currentStep}
                    isActive={true}
                    isCompleted={false}
                  />
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent variant="info" side="bottom" className="max-w-xs">
              <div className="space-y-1">
                <p className="font-medium">{getStepTitle(currentStep)}</p>
                <p className="text-xs opacity-90">
                  {getStepDescription(currentStep)}
                </p>
                <p className="text-xs">
                  {getStepTooltipDescription(currentStep)}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="text-center font-medium">
          {getStepTitle(currentStep)}
        </div>
        <motion.div
          className="text-center text-xs text-app-inactive-text mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {getStepDescription(currentStep)}
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressStepper;

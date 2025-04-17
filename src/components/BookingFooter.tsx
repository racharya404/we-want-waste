import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useBooking } from "@/context/BookingContext";
import { fadeInVariants } from "@/lib/animation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import React from "react";

interface BookingFooterProps {
  canContinue: boolean;
  onContinue: () => void;
  summary?: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const buttonVariants = {
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
  disabled: { opacity: 0.5 },
};

const BookingFooter: React.FC<BookingFooterProps> = ({
  canContinue,
  onContinue,
  summary,
  title,
  subtitle,
}) => {
  const { currentStep, goToPreviousStep, canMoveForward, getStepTitle } =
    useBooking();

  // Get appropriate tooltip text based on current step and state
  const getTooltipText = () => {
    if (!canContinue) {
      return "Please make a selection to continue";
    }
    if (!canMoveForward) {
      return "You cannot proceed as you've gone back from a later step";
    }

    const nextStepMap: Record<string, string> = {
      postcode: "Continue to select waste types",
      wasteType: "Continue to choose skip size",
      skipSize: "Continue to permit requirements",
      permitCheck: "Continue to select dates",
      chooseDate: "Continue to payment",
      payment: "Complete your order",
    };

    return nextStepMap[currentStep] || "Proceed to next step";
  };

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  return (
    <motion.footer
      className="sticky-footer w-full border-t bg-gray-900 py-2 px-4 sm:px-3 lg:px-4"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={footerVariants}
      role="contentinfo"
      aria-label="Booking navigation"
    >
      <div className="sticky-footer-content max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div className="flex-1">
            <h3
              className="text-base sm:text-md font-semibold text-white"
              id="booking-step-title"
            >
              {title || getStepTitle(currentStep)}
            </h3>
            {subtitle && (
              <p className="text-xs text-gray-400" id="booking-step-subtitle">
                {subtitle}
              </p>
            )}

            {summary && (
              <motion.div
                className="hidden sm:block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                aria-labelledby="booking-step-title"
              >
                {summary}
              </motion.div>
            )}
          </div>

          {/* Mobile summary view - moved above the buttons for mobile */}
          {summary && (
            <motion.div
              className="sm:hidden w-full"
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              aria-labelledby="booking-step-title"
            >
              {summary}
            </motion.div>
          )}

          <div className="flex sm:justify-center md:justify-end space-x-3 items-center w-full sm:w-auto">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={goToPreviousStep}
                    className="secondary-button w-full justify-center py-2.5 px-4 text-sm font-medium rounded-md transition-colors flex items-center"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    aria-label="Go back to previous step"
                  >
                    <ArrowLeft
                      size={14}
                      className="mr-1.5"
                      aria-hidden="true"
                    />
                    <span className="sr-only">Back to previous step</span>
                    <span aria-hidden="true">Back</span>
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent variant="info" size="sm">
                  <p className="text-sm">Return to previous step</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={onContinue}
                    disabled={!canContinue || !canMoveForward}
                    className={`primary-button w-full py-2.5 px-4 flex text-sm font-medium items-center justify-center rounded-md transition-all ${
                      !canContinue || !canMoveForward
                        ? "cursor-not-allowed"
                        : "active:scale-[0.98]"
                    }`}
                    variants={buttonVariants}
                    whileHover={
                      canContinue && canMoveForward ? "hover" : "disabled"
                    }
                    whileTap={
                      canContinue && canMoveForward ? "tap" : "disabled"
                    }
                    aria-label={
                      !canContinue
                        ? "Continue button (disabled, make a selection first)"
                        : !canMoveForward
                        ? "Continue button (disabled, cannot proceed from a later step)"
                        : "Continue to next step"
                    }
                  >
                    <span className="sr-only">Continue to next step</span>
                    <span aria-hidden="true">Continue</span>
                    <ArrowRight size={16} className="ml-2" aria-hidden="true" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent
                  variant={
                    canContinue && canMoveForward ? "success" : "warning"
                  }
                  size="sm"
                >
                  <p className="text-sm">{getTooltipText()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {!canMoveForward && (
          <motion.div
            className="text-sm text-gray-400 text-center mt-3 bg-gray-800 p-2 rounded-md flex items-center justify-center"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            role="alert"
            aria-live="polite"
          >
            <Info size={14} className="mr-1.5" />
            <p>You cannot proceed as you've gone back from a later step</p>
          </motion.div>
        )}
      </div>
    </motion.footer>
  );
};

export default BookingFooter;

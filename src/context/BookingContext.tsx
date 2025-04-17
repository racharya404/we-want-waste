import { OrderDetails, SkipLocation, Step, WasteType } from "@/types";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface BookingContextType {
  currentStep: Step;
  setCurrentStep: (step: Step) => void;
  highestStepReached: Step;
  orderDetails: OrderDetails;
  updateOrderDetails: (details: Partial<OrderDetails>) => void;
  wasteTypes: WasteType[];
  setWasteTypes: (types: WasteType[]) => void;
  skipLocation: SkipLocation | null;
  setSkipLocation: (location: SkipLocation) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  canMoveForward: boolean;
  getStepTitle: (step: Step) => string;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const steps: Step[] = [
  "postcode",
  "wasteType",
  "skipSize",
  "permitCheck",
  "chooseDate",
  "payment",
];

export const BookingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentStep, setCurrentStep] = useState<Step>("postcode");
  const [highestStepReached, setHighestStepReached] =
    useState<Step>("postcode");
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({});
  const [wasteTypes, setWasteTypes] = useState<WasteType[]>(
    orderDetails.wasteTypes || []
  );
  const [skipLocation, setSkipLocation] = useState<SkipLocation | null>(
    orderDetails.skipLocation || null
  );

  // Determine if user can move forward
  const canMoveForward =
    steps.indexOf(currentStep) <= steps.indexOf(highestStepReached);

  const updateOrderDetails = (details: Partial<OrderDetails>) => {
    setOrderDetails((prevDetails) => ({ ...prevDetails, ...details }));

    // Update wasteTypes if included in the update
    if (details.wasteTypes) {
      setWasteTypes(details.wasteTypes);
    }

    // Update skipLocation if included in the update
    if (details.skipLocation) {
      setSkipLocation(details.skipLocation);
    }
  };

  const goToNextStep = () => {
    const currentIndex = steps.indexOf(currentStep);

    if (currentIndex < steps.length - 1 && canMoveForward) {
      const nextStep = steps[currentIndex + 1];
      setCurrentStep(nextStep);

      // Update the highest step reached if moving to a new step
      const highestIndex = steps.indexOf(highestStepReached);
      if (currentIndex + 1 > highestIndex) {
        setHighestStepReached(nextStep);
      }
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const getStepTitle = (step: Step): string => {
    switch (step) {
      case "postcode":
        return "Confirm Postcode";
      case "wasteType":
        return "Waste Types";
      case "skipSize":
        return "Skip Size";
      case "permitCheck":
        return "Skip Location";
      case "chooseDate":
        return "Selected Date";
      case "payment":
        return "Payment";
      default:
        return "";
    }
  };

  return (
    <BookingContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        highestStepReached,
        orderDetails,
        updateOrderDetails,
        wasteTypes,
        setWasteTypes,
        skipLocation,
        setSkipLocation,
        goToNextStep,
        goToPreviousStep,
        canMoveForward,
        getStepTitle,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};

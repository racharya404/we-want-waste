import { useBooking } from "@/context/BookingContext";
import React from "react";
import ProgressStepper from "./ProgressStepper";
import ChooseDateStep from "./steps/ChooseDateStep";
import PaymentStep from "./steps/PaymentStep";
import PermitCheckStep from "./steps/PermitCheckStep";
import PostcodeStep from "./steps/PostcodeStep";
import SkipSizeStep from "./steps/SkipSizeStep";
import WasteTypeStep from "./steps/WasteTypeStep";

const BookingContainer: React.FC = () => {
  const { currentStep } = useBooking();

  const renderStep = () => {
    switch (currentStep) {
      case "postcode":
        return <PostcodeStep />;
      case "wasteType":
        return <WasteTypeStep />;
      case "skipSize":
        return <SkipSizeStep />;
      case "permitCheck":
        return <PermitCheckStep />;
      case "chooseDate":
        return <ChooseDateStep />;
      case "payment":
        return <PaymentStep />;
      default:
        return <PostcodeStep />;
    }
  };

  return (
    <div className="min-h-screen bg-app-dark">
      <div className="px-4 sm:px-6 lg:px-8 mx-auto max-w-[90rem]">
        <div>
          <ProgressStepper />
        </div>
        <div className="pb-24 sm:pb-32">{renderStep()}</div>
      </div>
    </div>
  );
};

export default BookingContainer;

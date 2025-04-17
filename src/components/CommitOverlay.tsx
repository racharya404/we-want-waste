import { useBooking } from "@/context/BookingContext";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import React from "react";

interface CommitOverlayProps {
  title: string;
  subtitle?: string;
  onContinue: () => void;
  onBack?: () => void;
}

const CommitOverlay: React.FC<CommitOverlayProps> = ({
  title,
  subtitle,
  onContinue,
  onBack,
}) => {
  const { currentStep, wasteTypes, orderDetails } = useBooking();

  const renderStepSummary = () => {
    switch (currentStep) {
      case "postcode":
        return (
          <div className="p-6 max-w-4xl mx-auto">
            <div className="bg-app-dark-card rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Delivery Address:</h3>
              <div className="bg-app-dark rounded-md p-4 border border-app-dark-border">
                <div className="space-y-2">
                  <p className="text-lg font-medium">
                    {orderDetails.houseNumber} {orderDetails.street}
                  </p>
                  <p className="text-lg">{orderDetails.city}</p>
                  <p className="text-lg">{orderDetails.postcode}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "wasteType":
        return (
          <div className="p-6 max-w-4xl mx-auto">
            <div className="bg-app-dark-card rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">
                Selected Waste Types:
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {wasteTypes.map((type) => (
                  <div
                    key={type}
                    className="bg-app-dark rounded-md p-3 border border-app-dark-border"
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)} Waste
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "skipSize":
        return (
          <div className="p-6 max-w-4xl mx-auto">
            <div className="bg-app-dark-card rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Selected Skip Size:</h3>
              <div className="bg-app-dark rounded-md p-4 border border-app-dark-border">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xl font-semibold">
                      {orderDetails.skipSize} Yard Skip
                    </p>
                    <p className="text-app-inactive-text">14 day hire period</p>
                  </div>
                  <div className="text-brand-blue text-xl font-bold">
                    £{orderDetails.skipPrice}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "permitCheck":
        return (
          <div className="p-6 max-w-4xl mx-auto">
            <div className="bg-app-dark-card rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Skip Location:</h3>
              <div className="bg-app-dark rounded-md p-4 border border-app-dark-border">
                <p className="text-lg">
                  {orderDetails.skipLocation === "private"
                    ? "Private Property (No permit required)"
                    : "Public Road (Permit required)"}
                </p>
              </div>
            </div>
          </div>
        );

      case "chooseDate":
        return (
          <div className="p-6 max-w-4xl mx-auto">
            <div className="bg-app-dark-card rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">Selected Dates:</h3>
              <div className="bg-app-dark rounded-md p-4 border border-app-dark-border space-y-4">
                <div>
                  <p className="text-app-inactive-text">Delivery Date:</p>
                  <p className="text-lg">
                    {orderDetails.deliveryDate
                      ? format(orderDetails.deliveryDate, "EEEE, do MMMM yyyy")
                      : "Not selected"}
                  </p>
                </div>
                <div>
                  <p className="text-app-inactive-text">Collection Date:</p>
                  <p className="text-lg">
                    {orderDetails.collectionDate
                      ? format(
                          orderDetails.collectionDate,
                          "EEEE, do MMMM yyyy"
                        )
                      : "Not selected"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex flex-col justify-between z-50">
      <div className="bg-app-dark shadow-md border-b border-app-dark-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            {subtitle && (
              <p className="text-sm text-app-inactive-text">{subtitle}</p>
            )}
          </div>
          <div className="flex space-x-3">
            {onBack && (
              <button
                onClick={onBack}
                className="px-4 py-2 rounded-md border border-app-dark-border text-white hover:bg-app-dark-card transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={onContinue}
              className="primary-button flex items-center"
            >
              Continue
              <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">{renderStepSummary()}</div>
    </div>
  );
};

export default CommitOverlay;

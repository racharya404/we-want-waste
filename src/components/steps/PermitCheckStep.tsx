import { useBooking } from "@/context/BookingContext";
import { SkipLocation } from "@/types";
import { motion } from "framer-motion";
import { FileText, Home, Info, Truck, Upload, X } from "lucide-react";
import { useState } from "react";
import BookingFooter from "../BookingFooter";
import FieldTooltip from "../ui/FieldTooltip";
import HelpTooltip from "../ui/HelpTooltip";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const PermitCheckStep: React.FC = () => {
  const { skipLocation, setSkipLocation, updateOrderDetails, goToNextStep } =
    useBooking();
  const [showModal, setShowModal] = useState(false);
  const [skipUpload, setSkipUpload] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<SkipLocation | null>(
    skipLocation
  );

  const handleSelectLocation = (location: SkipLocation) => {
    setSelectedLocation(location);

    // If public, show the modal
    if (location === "public") {
      setShowModal(true);
    }
  };

  const handleModalContinue = () => {
    if (selectedLocation) {
      setSkipLocation(selectedLocation);
      updateOrderDetails({
        skipLocation: selectedLocation,
        placementPhoto: skipUpload ? "uploaded" : undefined,
      });
    }
    setShowModal(false);
  };

  const handleContinue = () => {
    if (selectedLocation) {
      // Make sure selectedLocation is in the state
      setSkipLocation(selectedLocation);
      updateOrderDetails({
        skipLocation: selectedLocation,
      });
      goToNextStep();
    }
  };

  // Render summary for the footer
  const renderSummary = () => {
    if (!selectedLocation) return null;

    return (
      <div>
        <span className="text-base sm:text-lg font-medium">
          {selectedLocation === "private"
            ? "Private Property (No permit required)"
            : "Public Road (Permit required)"}
        </span>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 content-with-footer">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-2">
        Where will the skip be placed?
      </h2>
      <p className="text-center text-sm sm:text-base text-app-inactive-text mb-6 sm:mb-8">
        This helps us determine if you need a permit for your skip
        <HelpTooltip
          text="A permit is required for skips placed on public roads. This is to ensure safety and compliance with local regulations."
          variant="info"
          className="ml-1.5 inline-flex"
          iconSize={14}
        />
      </p>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <FieldTooltip
            text="Placing a skip on private property doesn't require a permit. The skip must be fully contained within your property boundaries and not obstruct access."
            variant="info"
            side="top"
          >
            <div
              className={`card-item cursor-pointer transition-all duration-200 ${
                selectedLocation === "private"
                  ? "border-2 border-brand-blue"
                  : "hover:shadow-lg"
              }`}
              onClick={() => handleSelectLocation("private")}
            >
              <div className="flex flex-col items-center p-4 text-center">
                <Home size={36} className="text-brand-blue mb-4" />
                <h3 className="text-base sm:text-lg font-medium">
                  Private Property
                </h3>
                <p className="text-xs sm:text-sm text-app-inactive-text mb-4">
                  Driveway or private land
                </p>
                <div className="flex items-center justify-center text-xs sm:text-sm text-app-inactive-text mt-2">
                  <p>No permit required when placed on your private property</p>
                </div>
              </div>
            </div>
          </FieldTooltip>
        </motion.div>

        <motion.div variants={itemVariants}>
          <FieldTooltip
            text="Placing a skip on a public road requires a permit from the local council. We will handle the permit application for you, but there may be additional fees."
            variant="info"
            side="top"
          >
            <div
              className={`card-item cursor-pointer transition-all duration-200 ${
                selectedLocation === "public"
                  ? "border-2 border-brand-blue"
                  : "hover:shadow-lg"
              }`}
              onClick={() => handleSelectLocation("public")}
            >
              <div className="flex flex-col items-center p-4 text-center">
                <Truck size={36} className="text-brand-blue mb-4" />
                <h3 className="text-base sm:text-lg font-medium">
                  Public Road
                </h3>
                <p className="text-xs sm:text-sm text-app-inactive-text mb-4">
                  Street or public highway
                </p>
                <div className="flex items-center justify-center text-xs sm:text-sm text-app-inactive-text mt-2">
                  <FileText size={14} className="mr-1 text-brand-blue" />
                  <p>Permit required for placement on public roads</p>
                </div>
              </div>
            </div>
          </FieldTooltip>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-6 bg-app-dark-card border border-app-dark-border rounded-md p-3 sm:p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-start space-x-3">
          <Info className="text-brand-blue flex-shrink-0 mt-1" size={18} />
          <div>
            <p className="text-sm sm:text-base text-app-active-text mb-1 flex items-center">
              Public Road Permit Information
              <HelpTooltip
                text="Skip permits typically cost £30-£75 and take 2-3 working days to process. This will be added to your total."
                variant="info"
                className="ml-1.5"
                iconSize={14}
              />
            </p>
            <ul className="list-disc pl-5 text-xs sm:text-sm text-app-inactive-text space-y-1">
              <li>We'll handle the permit application process for you</li>
              <li>Permit costs will be added to your final price</li>
              <li>Processing typically takes 2-3 working days</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-app-dark-card rounded-lg max-w-md w-full p-4 sm:p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 0.4 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-medium flex items-center">
                Skip Placement Photo
                <HelpTooltip
                  text="A photo helps us understand the exact placement location, ensuring proper access and avoiding potential issues during delivery."
                  variant="info"
                  className="ml-1.5"
                  iconSize={14}
                />
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-app-inactive-text hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-app-inactive-text mb-6">
              Please provide a photo of where you plan to place the skip. This
              helps us ensure proper placement and identify any potential access
              issues.
            </p>

            <FieldTooltip
              text="Upload a clear photo of the location where you want the skip placed. This helps our delivery team assess access and avoid any potential issues."
              variant="info"
              side="top"
            >
              <div className="border border-dashed border-app-dark-border rounded-lg p-6 sm:p-8 flex flex-col items-center justify-center mb-6 hover:border-brand-blue transition-colors">
                <Upload className="text-brand-blue mb-2" size={24} />
                <button className="text-sm sm:text-base text-brand-blue hover:underline">
                  Upload Photo
                </button>
              </div>
            </FieldTooltip>

            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="skipUpload"
                checked={skipUpload}
                onChange={() => setSkipUpload(!skipUpload)}
                className="mr-2"
              />
              <label
                htmlFor="skipUpload"
                className="text-xs sm:text-sm text-app-inactive-text flex items-center"
              >
                Skip this step to upload a photo
                <HelpTooltip
                  text="You can skip uploading a photo now, but it may delay delivery if our team needs to clarify the placement location later."
                  variant="warning"
                  className="ml-1.5"
                  iconSize={14}
                />
              </label>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="secondary-button flex-1 order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
                onClick={handleModalContinue}
                className="primary-button flex-1 order-1 sm:order-2"
              >
                Continue
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <BookingFooter
        canContinue={!!selectedLocation}
        onContinue={handleContinue}
        summary={renderSummary()}
      />
    </div>
  );
};

export default PermitCheckStep;

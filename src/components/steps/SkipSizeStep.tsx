import { useBooking } from "@/context/BookingContext";
import { cn } from "@/lib/utils";
import { Skip, SkipSize } from "@/types";
import { motion } from "framer-motion";
import { AlertTriangle, Check, InfoIcon, Ruler } from "lucide-react";
import { useState } from "react";
import BookingFooter from "../BookingFooter";
import FieldTooltip from "../ui/FieldTooltip";
import HelpTooltip from "../ui/HelpTooltip";

const skipSizes: Skip[] = [
  {
    size: "4",
    price: 252,
    period: "14 day hire period",
    imageUrl: "/placeholder.svg",
  },
  {
    size: "6",
    price: 303,
    period: "14 day hire period",
    imageUrl: "/placeholder.svg",
  },
  {
    size: "8",
    price: 331,
    period: "14 day hire period",
    imageUrl: "/placeholder.svg",
  },
  {
    size: "10",
    price: 377,
    period: "14 day hire period",
    imageUrl: "/placeholder.svg",
    warning: "Not Allowed On The Road",
  },
  {
    size: "12",
    price: 411,
    period: "14 day hire period",
    imageUrl: "/placeholder.svg",
    warning: "Not Allowed On The Road",
  },
  {
    size: "14",
    price: 442,
    period: "14 day hire period",
    imageUrl: "/placeholder.svg",
    warning: "Not Allowed On The Road",
  },
];

// Tooltip texts for skip sizes
const skipSizeTooltips = {
  "4": "Small skip ideal for domestic waste, small clear-outs, and garden waste. Can hold approximately 40-45 black bags.",
  "6": "Medium skip suitable for home renovations, small landscaping projects, and moderate cleanouts. Can hold approximately 60-65 black bags.",
  "8": "Large skip great for home renovations, larger garden clearances, and construction debris. Can hold approximately 80-85 black bags.",
  "10": "Extra large skip for larger renovation projects and commercial waste. Not permitted on public roads due to size. Can hold approximately 100-110 black bags.",
  "12": "Very large skip for substantial construction projects and large-scale clearances. Not permitted on public roads due to size. Can hold approximately 120-130 black bags.",
  "14": "Largest skip size available, ideal for major construction projects and large commercial clearances. Not permitted on public roads due to size. Can hold approximately 140-150 black bags.",
};

const warningTooltip =
  "Due to highway regulations, skips larger than 8 yards cannot be placed on public roads. These must be placed on private property only.";

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

const SkipSizeStep: React.FC = () => {
  const { orderDetails, updateOrderDetails, goToNextStep } = useBooking();
  const [selectedSize, setSelectedSize] = useState<SkipSize | null>(
    orderDetails.skipSize || null
  );
  const [selectedPrice, setSelectedPrice] = useState<number | null>(
    orderDetails.skipPrice || null
  );

  const handleSelectSkip = (size: SkipSize, price: number) => {
    setSelectedSize(size);
    setSelectedPrice(price);
  };

  const handleContinue = () => {
    if (selectedSize && selectedPrice !== null) {
      updateOrderDetails({
        skipSize: selectedSize,
        skipPrice: selectedPrice,
      });
      goToNextStep();
    }
  };

  // Render summary for the footer
  const renderSummary = () => {
    if (!selectedSize || selectedPrice === null) return null;

    return (
      <div className="flex justify-between items-center">
        <div>
          <span className="text-lg font-medium">{selectedSize} Yard Skip</span>
          <span className="text-sm text-app-inactive-text ml-2">
            14 day hire period (£{selectedPrice})
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 content-with-footer">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-2 text-white">
        Choose Your Skip Size
      </h2>
      <p className="text-center text-sm sm:text-base text-app-inactive-text mb-6 sm:mb-8">
        Select the skip size that best suits your needs
        <HelpTooltip
          text="Skip sizes are measured in cubic yards. Larger skips are more cost-effective but may have placement restrictions."
          variant="info"
          className="ml-1.5 inline-flex"
          iconSize={14}
        />
      </p>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {skipSizes.map((skip) => {
          const isSelected = selectedSize === skip.size;

          return (
            <motion.div
              key={skip.size}
              variants={itemVariants}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <FieldTooltip
                text={
                  skipSizeTooltips[skip.size as keyof typeof skipSizeTooltips]
                }
                variant="info"
                side="top"
              >
                <div
                  className={cn(
                    "bg-app-card rounded-lg overflow-hidden flex flex-col shadow-md transition-all cursor-pointer",
                    isSelected
                      ? "ring-2 ring-brand-blue"
                      : "hover:shadow-lg ring-1 ring-app-dark-border"
                  )}
                  onClick={() => handleSelectSkip(skip.size, skip.price)}
                >
                  <div className="relative">
                    <div className="bg-brand-blue text-white text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-br-md absolute top-0 left-0 z-10 flex items-center">
                      <Ruler size={12} className="mr-1" />
                      {skip.size} Yards
                    </div>
                    <img
                      src={skip.imageUrl}
                      alt={`${skip.size} yard skip`}
                      className="w-full h-36 sm:h-48 object-cover"
                    />
                    {skip.warning && (
                      <FieldTooltip text={warningTooltip} variant="warning">
                        <div className="absolute bottom-0 left-0 right-0 bg-amber-800/90 text-white text-xs px-2 py-1.5 flex items-center justify-center space-x-1">
                          <AlertTriangle size={14} />
                          <span>{skip.warning}</span>
                        </div>
                      </FieldTooltip>
                    )}
                  </div>

                  <div className="p-3 sm:p-4 flex flex-col flex-grow">
                    <h3 className="text-base sm:text-lg font-medium text-white">
                      {skip.size} Yard Skip
                    </h3>
                    <p className="text-xs sm:text-sm text-app-inactive-text">
                      {skip.period}
                    </p>

                    <div className="text-xl sm:text-2xl font-bold text-brand-blue mt-2 mb-4">
                      £{skip.price}
                    </div>

                    <div
                      className={cn(
                        "mt-auto py-2 px-3 rounded-md flex items-center justify-center text-sm",
                        isSelected
                          ? "bg-green-600 text-white"
                          : "bg-app-dark-card"
                      )}
                    >
                      {isSelected ? (
                        <>
                          <Check size={16} className="mr-2" />
                          Selected
                        </>
                      ) : (
                        "Click to select"
                      )}
                    </div>
                  </div>
                </div>
              </FieldTooltip>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="mt-6 bg-app-dark-card border border-app-dark-border rounded-md p-3 sm:p-4">
        <div className="flex items-start space-x-3">
          <InfoIcon className="text-brand-blue flex-shrink-0 mt-1" size={18} />
          <div>
            <p className="text-sm sm:text-base text-app-active-text mb-1">
              Not sure which size to choose?
            </p>
            <p className="text-xs sm:text-sm text-app-inactive-text">
              For household waste, a 4-6 yard skip is typically sufficient. For
              renovation projects or larger clearances, consider an 8-12 yard
              skip. Skips 10 yards and larger must be placed on private
              property.
            </p>
          </div>
        </div>
      </div>

      <BookingFooter
        canContinue={!!selectedSize}
        onContinue={handleContinue}
        summary={renderSummary()}
      />
    </div>
  );
};

export default SkipSizeStep;

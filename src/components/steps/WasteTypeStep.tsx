import { useBooking } from "@/context/BookingContext";
import { WasteType } from "@/types";
import { motion } from "framer-motion";
import { Building, Building2, Home, Info, Leaf } from "lucide-react";
import BookingFooter from "../BookingFooter";
import FieldTooltip from "../ui/FieldTooltip";
import HelpTooltip from "../ui/HelpTooltip";

interface WasteTypeCardProps {
  type: WasteType;
  title: string;
  description: string;
  icon: React.ReactNode;
  examples: string[];
  isSelected: boolean;
  onSelect: () => void;
  tooltipText: string;
}

const WasteTypeCard: React.FC<WasteTypeCardProps> = ({
  title,
  description,
  icon,
  examples,
  isSelected,
  onSelect,
  tooltipText,
}) => {
  return (
    <FieldTooltip
      text={tooltipText}
      variant="info"
      side="top"
      align="center"
      className="h-full"
    >
      <motion.div
        className={`${
          isSelected ? "card-item-selected" : "card-item"
        } cursor-pointer h-full overflow-auto transition-all duration-200 hover:shadow-md`}
        onClick={onSelect}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex justify-between">
          <div className="text-2xl mb-2">{icon}</div>
          <div className="w-5 h-5 border rounded flex items-center justify-center">
            {isSelected && <div className="w-3 h-3 bg-brand-blue rounded-sm" />}
          </div>
        </div>
        <h3 className="text-xl font-medium mt-2 mb-1">{title}</h3>
        <p className="text-md text-app-inactive-text mb-4">{description}</p>

        <div className="mt-2">
          <h4 className="text-md mb-1">Examples:</h4>
          <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
            {examples.map((example, index) => (
              <li
                key={index}
                className="text-sm text-app-inactive-text flex items-center"
              >
                • {example}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </FieldTooltip>
  );
};

const WasteTypeStep: React.FC = () => {
  const {
    wasteTypes: selectedTypes,
    setWasteTypes,
    updateOrderDetails,
    goToNextStep,
  } = useBooking();

  const handleTypeToggle = (type: WasteType) => {
    if (selectedTypes.includes(type)) {
      setWasteTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setWasteTypes([...selectedTypes, type]);
    }
  };

  const handleContinue = () => {
    updateOrderDetails({ wasteTypes: selectedTypes });
    goToNextStep();
  };

  // Render summary for the footer
  const renderSummary = () => {
    if (selectedTypes.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2">
        {selectedTypes.length === 1 ? (
          <div
            key={selectedTypes[0]}
            className="bg-app-dark rounded-md px-3 py-1 border border-app-dark-border text-xs"
          >
            {selectedTypes[0].charAt(0).toUpperCase() + selectedTypes[0].slice(1)} Waste
          </div>
        ) : (
          <>
            <div
              key={selectedTypes[0]}
              className="bg-app-dark rounded-md px-3 py-1 border border-app-dark-border text-xs"
            >
              {selectedTypes[0].charAt(0).toUpperCase() + selectedTypes[0].slice(1)} Waste
            </div>
            <div className="bg-app-dark rounded-md px-3 py-1 border border-app-dark-border text-xs">
              +{selectedTypes.length - 1} more
            </div>
          </>
        )}
      </div>
    );
  };

  // Tooltip texts for the waste types
  const tooltipTexts = {
    household:
      "Household waste includes general domestic items, furniture, appliances, and garden clippings that are typically generated in homes.",
    construction:
      "Construction waste includes materials generated from building, renovation, or demolition work such as concrete, timber, and plasterboard.",
    garden:
      "Garden waste includes organic materials from gardening like plant cuttings, tree branches, grass clippings, and soil.",
    commercial:
      "Commercial waste includes materials from businesses, offices, and shops including furniture, equipment, and packaging.",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 content-with-footer">
      <h2 className="text-xl sm:text-xl md:text-2xl font-bold text-center mb-4">
        Which type of waste best describes what you are disposing of?
      </h2>

      <div className="bg-app-dark-card border border-app-dark-border rounded-md p-3 sm:p-4 mb-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1 flex">
            <HelpTooltip
              text="Some types of waste require special handling and may be subject to additional fees or restrictions. Make sure to select the most appropriate waste type for your situation."
              variant="info"
              className="ml-1"
              iconSize={14}
            />
          </div>
          <div>
            <p className="text-sm sm:text-base text-app-active-text mb-1">
              You can select multiple waste types. Some items may require
              special handling:
            </p>
            <ul className="list-disc pl-5 text-xs sm:text-sm text-app-inactive-text space-y-1">
              <li>Plasterboard and drywall materials</li>
              <li>Heavy construction materials (soil, concrete, etc.)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <WasteTypeCard
          type="household"
          title="Household Waste"
          description="General household items and furniture"
          icon={<Home className="text-brand-blue" />}
          examples={[
            "Furniture",
            "Garden waste",
            "Appliances",
            "General household items",
          ]}
          isSelected={selectedTypes.includes("household")}
          onSelect={() => handleTypeToggle("household")}
          tooltipText={tooltipTexts.household}
        />

        <WasteTypeCard
          type="construction"
          title="Construction Waste"
          description="Building materials and renovation debris"
          icon={<Building2 className="text-brand-blue" />}
          examples={["Bricks", "Concrete", "Timber", "Plasterboard"]}
          isSelected={selectedTypes.includes("construction")}
          onSelect={() => handleTypeToggle("construction")}
          tooltipText={tooltipTexts.construction}
        />

        <WasteTypeCard
          type="garden"
          title="Garden Waste"
          description="Green waste and landscaping materials"
          icon={<Leaf className="text-brand-blue" />}
          examples={["Soil", "Plants", "Branches", "Grass cuttings"]}
          isSelected={selectedTypes.includes("garden")}
          onSelect={() => handleTypeToggle("garden")}
          tooltipText={tooltipTexts.garden}
        />

        <WasteTypeCard
          type="commercial"
          title="Commercial Waste"
          description="Business and office clearance"
          icon={<Building className="text-brand-blue" />}
          examples={[
            "Office furniture",
            "Equipment",
            "Shop fittings",
            "Commercial debris",
          ]}
          isSelected={selectedTypes.includes("commercial")}
          onSelect={() => handleTypeToggle("commercial")}
          tooltipText={tooltipTexts.commercial}
        />
      </div>

      <BookingFooter
        canContinue={selectedTypes.length > 0}
        onContinue={handleContinue}
        summary={renderSummary()}
      />
    </div>
  );
};

export default WasteTypeStep;

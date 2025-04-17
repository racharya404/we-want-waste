import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useBooking } from "@/context/BookingContext";
import { OrderDetails } from "@/types";
import { motion } from "framer-motion";
import { InfoIcon } from "lucide-react";
import { useEffect, useState } from "react";
import BookingFooter from "../BookingFooter";

// Define the address fields interface
interface AddressDetails {
  line1: string;
  line2: string;
  city: string;
  postcode: string;
  country: string;
  [key: string]: string;
}

const AddressStep: React.FC = () => {
  const { orderDetails, updateOrderDetails, goToNextStep } = useBooking();

  // Initialize address from orderDetails or empty values
  const [address, setAddress] = useState<AddressDetails>({
    line1: orderDetails.street || "",
    line2: "",
    city: orderDetails.city || "",
    postcode: orderDetails.postcode || "",
    country: "",
  });

  // Store the initial state to detect changes
  const [initialAddress, setInitialAddress] = useState<AddressDetails>(address);

  // Track if the user has modified anything
  const [hasModified, setHasModified] = useState<boolean>(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Initialize the initial state
  useEffect(() => {
    setInitialAddress({ ...address });
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!address.line1) newErrors.line1 = "Address is required";
    if (!address.city) newErrors.city = "City is required";
    if (!address.postcode) newErrors.postcode = "Postcode is required";
    if (!address.country) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    const newAddress = { ...address, [field]: value };
    setAddress(newAddress);

    // Check if anything has changed from the initial state
    checkForModifications(newAddress);

    // Clear error when typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  // Check if the current address differs from the initial state
  const checkForModifications = (currentAddress: AddressDetails) => {
    const isDifferent = Object.keys(initialAddress).some(
      (key) => initialAddress[key] !== currentAddress[key]
    );

    setHasModified(isDifferent);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Update the orderDetails with the appropriate fields from address
      const details: Partial<OrderDetails> = {
        street: address.line1,
        city: address.city,
        postcode: address.postcode,
      };

      updateOrderDetails(details);
      goToNextStep();
    }
  };

  // Check if the user has entered any address data
  const hasAddressData = () => {
    return Object.values(address).some((value) => value.trim() !== "");
  };

  // Only show the footer if the user has modified the form
  const shouldShowFooter = () => {
    return hasModified;
  };

  const renderSummary = () => {
    const filledFields = Object.entries(address).filter(([_, value]) => value);

    if (filledFields.length === 0) return null;

    return (
      <motion.div
        className="flex flex-col space-y-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {filledFields.map(([key, value]) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="text-sm"
          >
            <span className="text-app-inactive-text capitalize">{key}: </span>
            <span>{value}</span>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  const inputFields = [
    {
      name: "line1",
      label: "Address Line 1",
      placeholder: "e.g., 123 Main Street",
    },
    {
      name: "line2",
      label: "Address Line 2 (Optional)",
      placeholder: "e.g., Apartment 4B",
    },
    { name: "city", label: "City", placeholder: "e.g., London" },
    { name: "postcode", label: "Postcode", placeholder: "e.g., SW1A 1AA" },
    { name: "country", label: "Country", placeholder: "e.g., United Kingdom" },
  ];

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto p-4 content-with-footer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.h2
        className="text-2xl font-bold text-center mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Where do you need waste collection?
      </motion.h2>

      <motion.div
        className="bg-app-dark-card border border-app-dark-border rounded-md p-4 mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex items-start space-x-3">
          <InfoIcon className="text-brand-blue flex-shrink-0 mt-1" size={20} />
          <div>
            <p className="text-app-active-text mb-1">
              Please provide the address where you need the waste collection
              service.
            </p>
            <p className="text-app-inactive-text text-sm">
              This helps us determine availability and pricing for your area.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="bg-app-dark-card border border-app-dark-border rounded-md p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="grid grid-cols-1 gap-4">
          {inputFields.map((field, index) => (
            <motion.div key={field.name} variants={itemVariants}>
              <label
                htmlFor={field.name}
                className="block text-sm font-medium mb-1"
              >
                {field.label}
              </label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Input
                      id={field.name}
                      value={address[field.name as keyof typeof address] || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className={`w-full ${
                        errors[field.name] ? "border-red-500" : ""
                      }`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSubmit();
                        }
                      }}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Enter your {field.label.toLowerCase()}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {errors[field.name] && (
                <motion.p
                  className="text-red-500 text-sm mt-1"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.2 }}
                >
                  {errors[field.name]}
                </motion.p>
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Only show the footer if the user has modified the form */}
      {shouldShowFooter() && (
        <BookingFooter
          canContinue={true}
          onContinue={handleSubmit}
          summary={renderSummary()}
          title="Address Information"
          subtitle="Where we'll collect your waste"
        />
      )}
    </motion.div>
  );
};

export default AddressStep;

import { useBooking } from "@/context/BookingContext";
import { useState, useEffect } from "react";
import { X, Search, Loader2, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PostcodeStep: React.FC = () => {
  const { orderDetails, updateOrderDetails, goToNextStep } = useBooking();
  const [postcode, setPostcode] = useState(orderDetails.postcode || "");
  const [city, setCity] = useState(orderDetails.city || "");
  const [street, setStreet] = useState(orderDetails.street || "");
  const [houseNumber, setHouseNumber] = useState(
    orderDetails.houseNumber || ""
  );
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAddressFields, setShowAddressFields] = useState(false);
  const [searchResults, setSearchResults] = useState<
    { postcode: string; area: string }[]
  >([]);
  const [selectedPostcode, setSelectedPostcode] = useState("");

  useEffect(() => {
    if (postcode.length >= 4) {
      fetchLocationData();
    } else {
      setSearchResults([]);
    }
  }, [postcode]);

  const fetchLocationData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(
        `https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch location data");
      }
      const data = await response.json();

      // Extract unique postcode/area combinations
      const uniqueLocations = data.reduce(
        (
          acc: { postcode: string; area: string }[],
          item: { postcode: string; area: string }
        ) => {
          const exists = acc.some(
            (loc) => loc.postcode === item.postcode && loc.area === item.area
          );

          if (!exists) {
            acc.push({
              postcode: item.postcode,
              area: item.area || "",
            });
          }
          return acc;
        },
        []
      );

      setSearchResults(uniqueLocations);
      setIsLoading(false);
    } catch (err) {
      setError("Error fetching location data. Please try again.");
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    updateOrderDetails({
      postcode,
      city,
      street,
      houseNumber,
    });
    goToNextStep();
  };

  const handleClearSearch = () => {
    setPostcode("");
    setSearchResults([]);
    setShowAddressFields(false);
    setSelectedPostcode("");
  };

  const handleLocationSelect = (location: {
    postcode: string;
    area: string;
  }) => {
    setPostcode(location.postcode);
    setCity(location.postcode); // Setting city as postcode per requirements
    setStreet(location.area || ""); // Setting street as area per requirements
    setShowAddressFields(true);
    setIsSearchFocused(false); // Hide results after selection
    setSelectedPostcode(location.postcode); // Store the selected postcode
  };

  const allFieldsFilled = postcode && city && street && houseNumber;

  // Only show results if search is focused AND the current postcode doesn't match the previously selected one
  const shouldShowResults =
    isSearchFocused &&
    searchResults.length > 0 &&
    postcode !== selectedPostcode;

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Enter your location</h2>
        <div className="relative mb-3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            value={postcode}
            onChange={(e) => {
              const newValue = e.target.value.toUpperCase();
              setPostcode(newValue);
              // If user changes the postcode, reset the selected postcode if it no longer matches
              if (newValue !== selectedPostcode) {
                setSelectedPostcode("");
              }
            }}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            placeholder="Enter postcode"
            className="input-field pl-10 pr-10"
          />
          {postcode && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-3 flex items-center"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center my-4"
          >
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-100 text-red-700 p-3 rounded-md mb-4"
          >
            {error}
          </motion.div>
        )}

        {shouldShowResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 bg-gray-800 rounded-lg shadow-md overflow-hidden max-h-80 overflow-y-auto"
          >
            {searchResults.map((location, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleLocationSelect(location)}
                className="flex items-center p-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-700"
              >
                <div className="mr-3 text-blue-500">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{location.postcode}</div>
                  {location.area && (
                    <div className="text-sm text-gray-600">{location.area}</div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddressFields && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm mb-1.5">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm mb-1.5">Street Name</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Enter street name"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm mb-1.5">House/Flat Number</label>
              <input
                type="text"
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
                placeholder="Enter house or flat number"
                className="input-field"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddressFields && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            whileHover={{ scale: allFieldsFilled ? 1.02 : 1 }}
            whileTap={{ scale: allFieldsFilled ? 0.98 : 1 }}
            onClick={handleContinue}
            disabled={!allFieldsFilled}
            className={`primary-button w-full mt-6 ${
              !allFieldsFilled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Continue <span className="ml-2">→</span>
          </motion.button>
        )}
      </AnimatePresence>

      <div className="text-center mt-10 text-xs text-gray-500">
        Version 1.0.42
      </div>
    </div>
  );
};

export default PostcodeStep;

import { useBooking } from '@/context/BookingContext';
import { useState } from 'react';
import { MapPin, Calendar, CreditCard, Check, Lock, ShieldCheck, Info } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from "@/components/ui/sonner";
import HelpTooltip from '../ui/HelpTooltip';
import FieldTooltip from '../ui/FieldTooltip';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const PaymentStep: React.FC = () => {
  const { orderDetails, goToPreviousStep } = useBooking();
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [country, setCountry] = useState('United Kingdom');
  const [saveCard, setSaveCard] = useState(false);

  // Calculate VAT and total
  const price = orderDetails.skipPrice || 0;
  const vat = price * 0.2;
  const total = price + vat;

  // Format delivery address
  const formattedAddress = `${orderDetails.houseNumber} ${orderDetails.street}, ${orderDetails.city}`;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    let formattedValue = '';

    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += ' ';
      }
      formattedValue += value[i];
    }

    setCardNumber(formattedValue.slice(0, 19));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    let formattedValue = '';

    if (value.length >= 1) {
      formattedValue = value.slice(0, 2);
    }

    if (value.length > 2) {
      formattedValue += '/' + value.slice(2, 4);
    }

    setExpiryDate(formattedValue);
  };

  const handleSecurityCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setSecurityCode(value.slice(0, 3));
  };

  const handleCompletePayment = () => {
    toast.success("Payment completed successfully! Your skip will be delivered on the selected date.", {
      position: "top-center",
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 content-with-footer">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-white">
        Complete Your Order
      </h2>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Order summary */}
        <motion.div variants={itemVariants}>
          <div className="card-item">
            <h2 className="text-lg sm:text-xl font-bold mb-6 flex items-center">
              Order Summary
              <HelpTooltip
                text="Review your order details before completing payment"
                variant="info"
                className="ml-1.5"
                iconSize={14}
              />
            </h2>

            <div className="flex items-start space-x-3 mb-4 border-b border-app-dark-border pb-4">
              <MapPin
                size={18}
                className="text-brand-blue flex-shrink-0 mt-1"
              />
              <div>
                <h3 className="font-medium text-sm sm:text-base">
                  Delivery Address
                </h3>
                <p className="text-sm text-app-active-text">
                  {formattedAddress}
                </p>
                <p className="text-xs sm:text-sm text-app-inactive-text">
                  {orderDetails.postcode}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 mb-4 border-b border-app-dark-border pb-4">
              <Calendar
                size={18}
                className="text-brand-blue flex-shrink-0 mt-1"
              />
              <div>
                <h3 className="font-medium text-sm sm:text-base">
                  Delivery & Collection
                </h3>
                <p className="text-xs sm:text-sm">
                  <span className="text-app-inactive-text">Delivery:</span>{" "}
                  <span className="text-app-active-text">
                    {orderDetails.deliveryDate
                      ? format(orderDetails.deliveryDate, "EEEE d MMMM yyyy")
                      : "Not selected"}
                  </span>
                </p>
                <p className="text-xs sm:text-sm">
                  <span className="text-app-inactive-text">Collection:</span>{" "}
                  <span className="text-app-active-text">
                    {orderDetails.collectionDate
                      ? format(orderDetails.collectionDate, "EEEE d MMMM yyyy")
                      : "Not selected"}
                  </span>
                </p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm sm:text-lg">
                  {orderDetails.skipSize} Yard Skip
                </span>
                <span className="text-sm sm:text-lg font-bold">
                  £{orderDetails.skipPrice?.toFixed(2)}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-app-inactive-text">
                14 day hire period
              </p>
            </div>

            <div className="border-t border-app-dark-border pt-4">
              <div className="flex justify-between text-app-inactive-text mb-2 text-xs sm:text-sm">
                <span>Subtotal (excl. VAT)</span>
                <span>£{price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-app-inactive-text mb-4 text-xs sm:text-sm">
                <span className="flex items-center">
                  VAT (20%)
                  <HelpTooltip
                    text="Value Added Tax at the standard UK rate of 20%"
                    variant="default"
                    className="ml-1"
                    iconSize={12}
                  />
                </span>
                <span>£{vat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base sm:text-xl font-bold">
                <span>Total</span>
                <span>£{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-app-dark-border">
              <div className="flex items-center text-xs sm:text-sm text-app-inactive-text">
                <Lock size={14} className="text-green-500 mr-1.5" />
                <span>
                  Secure payment - your data is encrypted and protected
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment details */}
        <motion.div variants={itemVariants}>
          <div className="card-item">
            <div className="flex items-center mb-6">
              <CreditCard size={18} className="text-brand-blue mr-2" />
              <h2 className="text-lg sm:text-xl font-bold">Payment Details</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm mb-1.5 flex items-center">
                  Card number
                  <HelpTooltip
                    text="Enter your 16-digit card number without spaces"
                    variant="info"
                    className="ml-1"
                    iconSize={12}
                  />
                </label>
                <FieldTooltip text="We accept Visa, Mastercard, and American Express">
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 1234 1234 1234"
                      className="input-field pr-12 text-sm"
                      maxLength={19}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
                      <img
                        src="/placeholder.svg"
                        alt="Visa"
                        className="h-5 sm:h-6 w-auto"
                      />
                      <img
                        src="/placeholder.svg"
                        alt="Mastercard"
                        className="h-5 sm:h-6 w-auto"
                      />
                      <img
                        src="/placeholder.svg"
                        alt="Amex"
                        className="h-5 sm:h-6 w-auto"
                      />
                    </div>
                  </div>
                </FieldTooltip>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm mb-1.5 flex items-center">
                    Expiry date
                    <HelpTooltip
                      text="The expiration date on your card (MM/YY)"
                      variant="info"
                      className="ml-1"
                      iconSize={12}
                    />
                  </label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={handleExpiryChange}
                    placeholder="MM / YY"
                    className="input-field text-sm"
                    maxLength={5}
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm mb-1.5 flex items-center">
                    Security code
                    <HelpTooltip
                      text="The 3 or 4 digit security code (CVV/CVC) on the back of your card"
                      variant="info"
                      className="ml-1"
                      iconSize={12}
                    />
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={securityCode}
                      onChange={handleSecurityCodeChange}
                      placeholder="CVC"
                      className="input-field pr-10 text-sm"
                      maxLength={3}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <img
                        src="placeholder.png"
                        alt="CVC"
                        className="h-5 sm:h-6 w-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm mb-1.5">
                  Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Nepal">Nepal</option>
                </select>
              </div>

              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="saveCard"
                  checked={saveCard}
                  onChange={() => setSaveCard(!saveCard)}
                  className="mr-2"
                />
                <label
                  htmlFor="saveCard"
                  className="text-xs sm:text-sm text-app-inactive-text flex items-center"
                >
                  Save this card as default payment method
                  <HelpTooltip
                    text="Your card details will be securely stored for future orders"
                    variant="info"
                    className="ml-1"
                    iconSize={12}
                  />
                </label>
              </div>
            </div>

            <div className="mt-4 mb-6 p-3 bg-app-dark border border-app-dark-border rounded-md">
              <div className="flex items-start space-x-2">
                <ShieldCheck
                  size={16}
                  className="text-green-500 flex-shrink-0 mt-0.5"
                />
                <p className="text-xs text-app-inactive-text">
                  Your payment information is encrypted and secure. We never
                  store complete card details on our servers.
                </p>
              </div>
            </div>

            <motion.button
              onClick={handleCompletePayment}
              className="primary-button w-full mb-3 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <Lock size={14} />
              Complete Payment (£{total.toFixed(2)})
            </motion.button>

            <button
              onClick={goToPreviousStep}
              className="secondary-button w-full"
            >
              Back
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentStep;

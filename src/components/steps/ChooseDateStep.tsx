import { useBooking } from "@/context/BookingContext";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isAfter,
  isBefore,
  isSameDay,
  startOfMonth,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import BookingFooter from "../BookingFooter";

const ChooseDateStep: React.FC = () => {
  const { updateOrderDetails, goToNextStep } = useBooking();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const today = new Date();

  // Calculate days in current month view
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Handle date selection
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
  };

  // Navigate between months
  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Is date selectable?
  const isDateSelectable = (date: Date) => {
    return !isBefore(date, today) && !isAfter(date, addDays(today, 60));
  };

  // Is date today or in the past?
  const isDisabled = (date: Date) => {
    return isBefore(date, today) && !isSameDay(date, today);
  };

  const handleContinue = () => {
    if (selectedDate) {
      // Add 14 days for collection date
      const collectionDate = addDays(selectedDate, 14);

      updateOrderDetails({
        deliveryDate: selectedDate,
        collectionDate: collectionDate,
      });

      goToNextStep();
    }
  };

  // Render summary for the footer
  const renderSummary = () => {
    if (!selectedDate) return null;

    const collectionDate = addDays(selectedDate, 14);

    return (
      <div className="space-y-2">
        <div>
          <span className="text-sm text-app-inactive-text mr-2">
            Delivery Date:
          </span>
          <span className="text-lg font-medium">
            {format(selectedDate, "EEEE, do MMMM yyyy")}
          </span>
        </div>
        <div>
          <span className="text-sm text-app-inactive-text mr-2">
            Collection Date:
          </span>
          <span className="text-lg font-medium">
            {format(collectionDate, "EEEE, do MMMM yyyy")}
          </span>
        </div>
      </div>
    );
  };

  // Generate weekday headers
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="max-w-xl mx-auto p-4 content-with-footer">
      <h2 className="text-2xl font-bold text-center mb-2">
        Choose Your Delivery Date
      </h2>
      <p className="text-center text-app-inactive-text mb-8">
        Select your preferred skip delivery date. We'll aim to deliver between
        7am and 6pm on your chosen day.
      </p>

      <div className="bg-app-dark-card rounded-lg overflow-hidden mb-6">
        <div className="flex justify-between items-center p-4">
          <button onClick={previousMonth} className="p-2">
            <ChevronLeft className="text-app-inactive-text" />
          </button>
          <h3 className="text-xl font-medium">
            {format(currentMonth, "MMMM yyyy")}
          </h3>
          <button onClick={nextMonth} className="p-2">
            <ChevronRight className="text-app-inactive-text" />
          </button>
        </div>

        <div className="grid grid-cols-7 text-center border-b border-app-dark-border">
          {weekdays.map((day) => (
            <div key={day} className="p-2 text-sm text-app-inactive-text">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 p-2">
          {Array.from({ length: monthStart.getDay() }).map((_, index) => (
            <div key={`empty-start-${index}`} className="p-2"></div>
          ))}

          {daysInMonth.map((date) => {
            const dayNumber = date.getDate();
            const isToday = isSameDay(date, today);
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const canSelect = isDateSelectable(date);
            const disabled = isDisabled(date);

            return (
              <div
                key={date.toISOString()}
                className={`p-2 ${
                  !canSelect || disabled ? "" : "cursor-pointer"
                }`}
                onClick={() => canSelect && !disabled && handleSelectDate(date)}
              >
                <div
                  className={`
                  calendar-day
                  ${isSelected ? "calendar-day-active" : ""}
                  ${
                    isToday && !isSelected
                      ? "border border-brand-blue text-brand-blue"
                      : ""
                  }
                  ${disabled ? "calendar-day-disabled" : ""}
                  ${
                    canSelect && !disabled && !isSelected
                      ? "calendar-day-available"
                      : ""
                  }
                `}
                >
                  {dayNumber}
                </div>
              </div>
            );
          })}

          {Array.from({ length: 6 - monthEnd.getDay() }).map((_, index) => (
            <div key={`empty-end-${index}`} className="p-2"></div>
          ))}
        </div>
      </div>

      <BookingFooter
        canContinue={!!selectedDate}
        onContinue={handleContinue}
        summary={renderSummary()}
      />
    </div>
  );
};

export default ChooseDateStep;

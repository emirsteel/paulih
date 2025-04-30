import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ChatBoxSearchCalendarProps {
  onDateSelect?: (date: Date) => void;
}

/** Turkish days of the week (Mon–Sun) */
const DAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

/** Turkish month names (Jan–Dec) */
const MONTHS = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

const ChatBoxSearchCalendar: React.FC<ChatBoxSearchCalendarProps> = ({
  onDateSelect,
}) => {
  /** The displayed month/year in the calendar */
  const [currentDate, setCurrentDate] = useState(new Date());

  /** The actual selected date (defaults to "today") */
  const [selectedDate, setSelectedDate] = useState(new Date());

  /** The actual "today" date for reference */
  const today = new Date();

  /**
   * Returns the first day of the current month (e.g., 1st)
   * and the total number of days in that month.
   */
  const getMonthDetails = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    // First day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    // Last day of the month
    const lastDayOfMonth = new Date(year, month + 1, 0);
    // Total days in the month
    const totalDaysInMonth = lastDayOfMonth.getDate();
    // The weekday index of the first day (0=Sunday, 1=Monday, etc.)
    const startDay = firstDayOfMonth.getDay();

    return { year, month, startDay, totalDaysInMonth };
  };

  const { year, month, startDay, totalDaysInMonth } =
    getMonthDetails(currentDate);

  /** Move to previous month */
  const handlePrevMonth = () => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };

  /** Move to next month (only if it doesn't exceed the current month) */
  const handleNextMonth = () => {
    const nextMonthDate = new Date(year, month + 1, 1);
    if (nextMonthDate <= today) {
      setCurrentDate(nextMonthDate);
    }
  };

  /** When user clicks a specific day */
  const handleDayClick = (dayNumber: number) => {
    const clickedDate = new Date(year, month, dayNumber);
    if (clickedDate <= today) {
      setSelectedDate(clickedDate);
      if (onDateSelect) {
        onDateSelect(clickedDate);
      }
    }
  };

  /** Helper to see if a day is "in the future" */
  const isFutureDay = (dayNumber: number) => {
    return new Date(year, month, dayNumber) > today;
  };

  /** Helper to see if a day is currently selected */
  const isSelected = (dayNumber: number) => {
    return (
      dayNumber === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    );
  };

  /** Helper to see if a day is today */
  const isToday = (dayNumber: number) => {
    return (
      dayNumber === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  /** Render days in a grid (with empty slots for days before the 1st). */
  const renderDays = () => {
    const daysArray = [];

    // Fill in empty slots (for days before the 1st).
    for (let i = 0; i < startDay; i++) {
      daysArray.push(<div key={`empty-${i}`} />);
    }

    // Fill actual days
    for (let dayNum = 1; dayNum <= totalDaysInMonth; dayNum++) {
      const future = isFutureDay(dayNum);
      const selected = isSelected(dayNum);
      const todayClass = isToday(dayNum) ? "border border-blue-600" : "";

      daysArray.push(
        <div
          key={dayNum}
          className={`flex items-center justify-center w-8 h-8 cursor-pointer rounded-full
            ${future ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-200"}
            ${selected ? "bg-blue-600 text-white font-bold" : ""}
            ${todayClass}
          `}
          onClick={() => !future && handleDayClick(dayNum)}
        >
          {dayNum}
        </div>
      );
    }
    return daysArray;
  };

  return (
    <div className="bg-white text-gray-800 p-4 w-64 rounded shadow-lg">
      {/* Header: Month & Year, plus navigation arrows */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={handlePrevMonth}
          className="text-gray-600 hover:text-gray-800 disabled:text-gray-300"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="font-semibold">
          {MONTHS[month]} {year}
        </div>

        <button
          onClick={handleNextMonth}
          disabled={year === today.getFullYear() && month === today.getMonth()}
          className="text-gray-600 hover:text-gray-800 disabled:text-gray-300"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Days of the week (Mon-Sun) */}
      <div className="grid grid-cols-7 text-center mb-2 text-sm text-gray-500">
        {DAYS.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar grid for actual dates */}
      <div className="grid grid-cols-7 text-sm gap-y-2 text-center">
        {renderDays()}
      </div>
    </div>
  );
};

export default ChatBoxSearchCalendar;

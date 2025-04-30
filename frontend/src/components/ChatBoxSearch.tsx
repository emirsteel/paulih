import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronUp, ChevronDown } from "lucide-react";
import ChatBoxSearchCalendar from "./ChatBoxSearchCalendar";

interface ChatBoxSearchProps {
  onClose: () => void;
}

const ChatBoxSearch: React.FC<ChatBoxSearchProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCalendarClick = () => {
    setShowCalendar((prev) => !prev);
  };

  // Close the calendar popup when clicking outside of the component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  return (
    <div ref={containerRef} className="w-full relative">
      {/* Top Bar */}
      <div
        className="
          flex
          items-center
          w-full
          bg-white
          px-4
          py-2
          border-b
          border-gray-200
          rounded-none
        "
      >
        {/* Calendar Icon (click to toggle calendar popup) */}
        <Calendar
          size={16}
          className="text-blue-600 mr-2 cursor-pointer"
          onClick={handleCalendarClick}
        />

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search through messages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="
            flex-1
            bg-transparent
            outline-none
            text-gray-700
            placeholder:text-gray-400
            text-sm
          "
        />

        {/* Up Arrow Button */}
        <button className="ml-2 text-blue-600 hover:text-blue-700">
          <ChevronUp size={16} />
        </button>

        {/* Down Arrow Button */}
        <button className="ml-2 text-blue-600 hover:text-blue-700">
          <ChevronDown size={16} />
        </button>

        {/* Done Button */}
        <button
          className="ml-3 text-blue-600 hover:text-blue-700 text-sm"
          onClick={onClose}
        >
          Done
        </button>
      </div>

      {/* Calendar Popup */}
      {showCalendar && (
        <div className="absolute top-full left-0 z-50 mt-2">
          <ChatBoxSearchCalendar />
        </div>
      )}
    </div>
  );
};

export default ChatBoxSearch;

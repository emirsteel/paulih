import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";

const OrderFoodCartOverviewNoteToCourier: React.FC = () => {
  const [note, setNote] = useState<string>("");
  const [submittedNote, setSubmittedNote] = useState<string | null>(null);

  const handleSendNote = () => {
    if (!note.trim()) return;
    setSubmittedNote(note); // Store the note to display below
    setNote(""); // Clear input after sending
  };

  const handleDeleteNote = () => {
    setSubmittedNote(null); // Remove the submitted note
  };

  return (
    <div className="mb-6 mt-5 bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Note to Courier
      </h3>
      <div className="relative w-full">
        <input
          type="text"
          id="note-to-courier"
          className="w-full px-4 pt-3 pb-1 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-0 transition peer pr-16"
          placeholder=" " // Empty placeholder for spacing
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <label
          htmlFor="note-to-courier"
          className={`absolute left-4 px-1 bg-white text-sm transition-all duration-200 
            ${
              note
                ? "-top-2 text-blue-500" // Label stays above when input has value
                : "top-3 text-gray-400" // Label behaves like placeholder
            }
            peer-focus:-top-2 peer-focus:text-blue-500 peer-focus:bg-white`}
        >
          Enter your note
        </label>

        {/* Note Button */}
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-600 transition"
          onClick={handleSendNote}
        >
          Note
        </button>
      </div>

      {/* Display the submitted note below the input */}
      {submittedNote && (
        <div className="mt-4 bg-blue-50 p-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-blue-400 flex items-center justify-center mr-2">
              <span className="text-white text-sm">📝</span>
            </div>
            <p className="text-gray-600 text-sm">{submittedNote}</p>
          </div>

          {/* Delete Button */}
          <button
            onClick={handleDeleteNote}
            className="w-7 h-7 flex items-center justify-center bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition"
          >
            <FaTrash className="text-xs" />
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderFoodCartOverviewNoteToCourier;

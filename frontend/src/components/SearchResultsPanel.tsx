// src/components/SearchResultsPanel.tsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

interface SearchResultsPanelProps {
  query: string;
  results: any[];
  loggedInUserId: string;
  onClose: () => void;
}

const SearchResultsPanel: React.FC<SearchResultsPanelProps> = ({
  query,
  results,
  loggedInUserId,
  onClose,
}) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredResults = results.filter(
    (person) => person._id !== loggedInUserId
  );

  return (
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
        <div className="flex flex-col">
          <h2 className="text-sm font-semibold text-gray-700">
            Arama Sonuçları
          </h2>
          <p className="text-xs text-gray-500">
            "{query}" için {filteredResults.length} kullanıcı bulundu
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <X size={20} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 bg-white">
        <button
          className="px-4 py-1.5 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full"
          disabled
        >
          Kullanıcılar
        </button>
      </div>

      {/* Results */}
      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredResults.length > 0 ? (
          filteredResults.map((person) => (
            <div
              key={person._id}
              onClick={() => {
                navigate(`/profile/${person.username}`);
                onClose();
              }}
              className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-blue-50 transition"
            >
              <div className="flex items-center gap-3">
                <img
                  src={`http://localhost:5001/${person.profileImage}`}
                  alt={person.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-800">
                    {person.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    @{person.username}
                  </span>
                </div>
              </div>
              <span className="text-blue-500 text-xs font-medium hover:underline">
                Profili Görüntüle
              </span>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center p-8">
            <p className="text-sm text-gray-400">Kullanıcı bulunamadı.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center p-3 border-t border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-400 text-center">
          <p className="text-xs text-gray-400 text-center">
            Hacettepe'de, her arama yeni bir keşif fırsatıdır! 🚀
          </p>
        </p>
      </div>
    </div>
  );
};

export default SearchResultsPanel;

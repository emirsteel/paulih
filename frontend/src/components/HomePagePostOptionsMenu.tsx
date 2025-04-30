import React, { useState, useRef, useEffect } from "react";
import { FaEllipsisH, FaEdit, FaTrashAlt, FaFlag } from "react-icons/fa";

const HomePagePostOptionsMenu: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsMenuOpen(!isMenuOpen);
        }}
        className="flex items-center justify-center text-gray-600 h-8 w-8 cursor-pointer rounded-full transition hover:bg-gray-200"
      >
        <FaEllipsisH size={20} />
      </button>
      {isMenuOpen && (
        <div className="absolute right-0 top-10 bg-white rounded-xl shadow-lg w-56 p-2 z-10 border border-gray-200">
          <ul className="flex flex-col">
            <li className="flex items-center px-4 py-2 hover:text-blue-600 hover:bg-gray-100 rounded-lg cursor-pointer transition">
              <FaEdit size={18} className="text-gray-500 mr-3" />
              <span className="text-sm font-medium">Edit Post</span>
            </li>
            <li className="flex items-center px-4 py-2 hover:text-red-600 hover:bg-gray-100 rounded-lg cursor-pointer transition">
              <FaTrashAlt size={18} className="text-gray-500 mr-3" />
              <span className="text-sm font-medium">Delete Post</span>
            </li>
            <li className="flex items-center px-4 py-2 hover:text-yellow-600 hover:bg-gray-100 rounded-lg cursor-pointer transition">
              <FaFlag size={18} className="text-gray-500 mr-3" />
              <span className="text-sm font-medium">Report Post</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default HomePagePostOptionsMenu;

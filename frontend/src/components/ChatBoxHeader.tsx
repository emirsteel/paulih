import React, { useState, useRef } from "react";
import { Search, MoreVertical } from "lucide-react";
import ChatBoxSearch from "./ChatBoxSearch"; // import the new component

interface ChatBoxHeaderProps {
  friend?: {
    _id: string;
    name: string;
    username: string;
    profileImage: string;
  } | null;
  group?: {
    _id: string;
    name: string;
    image?: string;
    members: { _id: string; profileImage?: string }[];
    createdAt: string;
  } | null;
}

const ChatBoxHeader: React.FC<ChatBoxHeaderProps> = ({ friend, group }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative" ref={headerRef}>
      {/* Actual header bar */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white"
        style={{ height: "65px" }}
      >
        <div className="flex items-center">
          {/* Friend or group avatar/name */}
          {friend ? (
            <>
              <img
                src={`http://localhost:5001/${friend.profileImage}`}
                alt={`${friend.name}'s profile`}
                className="w-8 h-8 rounded-full object-cover mr-2"
              />
              <div>
                <p className="font-medium text-sm">{friend.name}</p>
                <p className="text-xs text-gray-500">@{friend.username}</p>
              </div>
            </>
          ) : group ? (
            <>
              {group.image ? (
                <img
                  src={`http://localhost:5001/${group.image}`}
                  alt={`${group.name}'s profile`}
                  className="w-8 h-8 rounded-full object-cover mr-2"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                  <span className="text-sm text-gray-700 font-bold">
                    {group.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <p className="font-medium text-sm">{group.name}</p>
                <p className="text-xs text-gray-500">
                  {group.members.length} members
                </p>
              </div>
            </>
          ) : null}
        </div>

        {/* Header icons */}
        <div className="flex items-center space-x-2">
          {/* Search button toggles ChatBoxSearch */}
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition duration-200"
            onClick={() => setIsSearchOpen((prev) => !prev)}
          >
            <Search size={16} className="text-gray-500" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 transition duration-200">
            <MoreVertical size={16} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Conditionally render the ChatBoxSearch below the header */}
      {isSearchOpen && <ChatBoxSearch onClose={() => setIsSearchOpen(false)} />}
    </div>
  );
};

export default ChatBoxHeader;

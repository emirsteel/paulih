// src/components/MobileNavItems.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, MessageSquare, PlusCircle, Settings, User } from "lucide-react";

interface MobileNavItemsProps {
  onOpenCreatePost: () => void;
  username?: string;
}

const MobileNavItems: React.FC<MobileNavItemsProps> = ({
  onOpenCreatePost,
  username,
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const leftNavItems = [
    { to: "/home", label: "Ana Sayfa", Icon: Home },
    { to: "/chat", label: "Mesajlar", Icon: MessageSquare },
  ];

  const rightNavItems = [
    { to: "/settings", label: "Ayarlar", Icon: Settings },
    {
      to: `/profile/${username || "defaultuser"}`,
      label: "Profil",
      Icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow lg:hidden">
      <div className="flex justify-around items-center">
        {leftNavItems.map(({ to, label, Icon }) => {
          const isActive = currentPath === to;
          return (
            <Link key={to} to={to} className="flex flex-col items-center py-2">
              <Icon
                className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-600"}`}
              />
              <span
                className={`text-xs ${isActive ? "text-blue-600" : "text-gray-600"}`}
              >
                {label}
              </span>
            </Link>
          );
        })}

        <button
          onClick={onOpenCreatePost}
          className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 rounded-full p-3 shadow-lg border border-transparent"
        >
          <PlusCircle className="w-6 h-6 text-white" />
        </button>

        {rightNavItems.map(({ to, label, Icon }) => {
          const isActive = currentPath === to;
          return (
            <Link key={to} to={to} className="flex flex-col items-center py-2">
              <Icon
                className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-600"}`}
              />
              <span
                className={`text-xs ${isActive ? "text-blue-600" : "text-gray-600"}`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavItems;

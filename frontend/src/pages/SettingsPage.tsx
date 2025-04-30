import React, { useState, useEffect } from "react";
import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import UserSettingsSidebar from "../components/UserSettingsSidebar";
import UserSettingsChangePassword from "../components/Settings/ProfileSettings/UserSettingsChangePassword";

const SettingsPage: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(true);
  const location = useLocation();

  // Open sidebar on desktop by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex w-full h-screen relative">
      {/* Sidebar */}
      <UserSettingsSidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* Main Content */}
      <div className="flex-1 h-full w-full overflow-y-auto relative mt-8 md:mt-0">
        {/* Toggle Button (visible on mobile only) */}
        {!menuOpen && (
          <button
            onClick={() => setMenuOpen(true)}
            className="fixed top-3 left-3 z-50 p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 hover:text-blue-600 transition-colors md:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        )}

        <Routes>
          <Route
            path="profile/change-password"
            element={<UserSettingsChangePassword />}
          />
        </Routes>
        <Outlet />
      </div>
    </div>
  );
};

export default SettingsPage;

// src/components/MainLayout.tsx
import React, {
  ReactNode,
  useState,
  useEffect,
  useRef,
  useContext,
} from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import SearchResultsPanel from "./SearchResultsPanel";
import RightSidebar from "./RightSidebar";
import { AuthUserContext } from "../context/AuthUserContext";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user } = useContext(AuthUserContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Shared search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Ref for Sidebar to measure its width
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [sidebarWidth, setSidebarWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsLargeScreen(true);
        setSidebarOpen(true); // Open sidebar by default on large screens
      } else {
        setIsLargeScreen(false);
        setSidebarOpen(false); // Hide sidebar on small screens
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (sidebarRef.current) {
      setSidebarWidth(sidebarRef.current.offsetWidth);
    }
  }, [sidebarOpen, isLargeScreen]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col relative">
      {/* Navbar at the top */}
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Left Sidebar (only for desktop) */}
      {sidebarOpen && isLargeScreen && (
        <div
          ref={sidebarRef}
          className="fixed top-0 left-0 z-50 w-full lg:w-60"
        >
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 ${isLargeScreen && sidebarOpen ? "lg:ml-60" : ""}`}
      >
        {children}
      </div>

      {/* Desktop Right Sidebar (only on large screens) */}
      {isLargeScreen && (
        <div className="hidden lg:block fixed top-16 right-0 w-100">
          <RightSidebar
            interestedUsers={[]}
            currentUser={user} // Ensure 'user' is the actual logged-in user
            getProfileImageUrl={(img) =>
              img
                ? `http://localhost:5001/uploads/${img}`
                : "/default-profile.png"
            }
          />
        </div>
      )}

      {/* Search Results Panel (desktop only) */}
      {searchQuery.trim() !== "" && (
        <div
          className="absolute z-50 hidden lg:block"
          style={{ top: "4rem", left: "302px" }}
        >
          <SearchResultsPanel
            query={searchQuery}
            results={searchResults}
            loggedInUserId={user._id} // Pass the current user's ID here
            onClose={() => {
              setSearchResults([]);
              setSearchQuery("");
            }}
          />
        </div>
      )}
    </div>
  );
};

export default MainLayout;

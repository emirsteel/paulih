// src/components/Sidebar.tsx
import React, { useContext, useState, useRef, useEffect } from "react";
import {
  Home,
  User,
  ShoppingCart,
  Briefcase,
  Calendar,
  Newspaper,
  ShoppingBag,
  Bookmark,
  Settings,
  LogOut,
  Plus,
  Zap,
  Aperture,
  MapPin,
  Search as LucideSearch,
  Bird,
} from "lucide-react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { AuthUserContext } from "../context/AuthUserContext";
import {
  searchUsers,
  fetchUserOrders,
  getUserBookmarkCount,
} from "../services/api";
import CreatePost from "./CreatePost";
import Upgrade from "./Upgrade"; // Import the Upgrade component
import axios from "axios";
import SidebarOrderPopup from "./SidebarOrderPopup";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSearchQueryChange?: (query: string) => void;
  onSearchResultsChange?: (results: any[]) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onSearchQueryChange,
  onSearchResultsChange,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthUserContext);

  const [sidebarSearchQuery, setSidebarSearchQuery] = useState<string>("");
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [hasNewPosts, setHasNewPosts] = useState<boolean>(false);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [bookmarkCount, setBookmarkCount] = useState<number>(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [showOrderPopup, setShowOrderPopup] = useState<boolean>(false); // New state for order popup

  // For "Sayfalarım" (my pages)
  const [myPages, setMyPages] = useState<any[]>([]);
  const [selectedPage, setSelectedPage] = useState<any>(null);

  // On mount, load any previously selected page from localStorage
  useEffect(() => {
    const savedPage = localStorage.getItem("selectedPage");
    if (savedPage) {
      setSelectedPage(JSON.parse(savedPage));
    }
  }, []);

  // Poll localStorage for changes to "selectedPage" every 1 second
  useEffect(() => {
    const interval = setInterval(() => {
      const savedPage = localStorage.getItem("selectedPage");
      if (savedPage) {
        const parsedPage = JSON.parse(savedPage);
        if (!selectedPage || selectedPage._id !== parsedPage._id) {
          setSelectedPage(parsedPage);
        }
      } else if (selectedPage) {
        setSelectedPage(null);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedPage]);

  // --- Poll for bookmark count every 5 seconds ---
  useEffect(() => {
    const fetchCount = async () => {
      if (!user?._id) return;
      try {
        const count = await getUserBookmarkCount(user._id);
        setBookmarkCount(count);
      } catch (error) {
        console.error("Error fetching bookmark count:", error);
      }
    };
    fetchCount();
    const interval = setInterval(fetchCount, 5000);
    return () => clearInterval(interval);
  }, [user]);

  // --- Simulate new posts indicator ---
  useEffect(() => {
    const postsInterval = setInterval(() => {
      setHasNewPosts(true);
    }, 10000);
    return () => clearInterval(postsInterval);
  }, []);

  // --- Fetch latest order status ---
  useEffect(() => {
    const fetchLatestOrderStatus = async () => {
      if (!user?._id) return;
      try {
        const orders = await fetchUserOrders(user._id);
        if (orders.length > 0) {
          const latestOrder = orders.sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0];
          setCurrentOrder(latestOrder);
        } else {
          setCurrentOrder(null);
        }
      } catch (error) {
        console.error("Error fetching user orders:", error);
      }
    };
    fetchLatestOrderStatus();
    const orderInterval = setInterval(fetchLatestOrderStatus, 10000);
    return () => clearInterval(orderInterval);
  }, [user]);

  // --- Sidebar search handler ---
  const handleSidebarSearch = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const query = e.target.value;
    setSidebarSearchQuery(query);
    onSearchQueryChange?.(query);
    if (query.trim()) {
      try {
        const userResults = await searchUsers(query);
        onSearchResultsChange?.(userResults);
      } catch (error) {
        console.error("Sidebar search error:", error);
        onSearchResultsChange?.([]);
      }
    } else {
      onSearchResultsChange?.([]);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // --- Navigation items with icons ---
  const navigation = [
    { name: "Ana Sayfa", path: "/home", icon: <Home size={20} /> },
    {
      name: "Profil",
      path: `/profile/${user?.username}`,
      icon: <User size={20} />,
    },
    { name: "Harita", path: "/map", icon: <MapPin size={20} /> },
    // For "Sipariş", we will open our popup instead of a route.
    { name: "Sipariş", path: "/coming-soon", icon: <ShoppingCart size={20} /> },
    { name: "Kariyer", path: "/career", icon: <Briefcase size={20} /> },
    {
      name: "Üniversitem",
      path: "/coming-soon",
      icon: <Newspaper size={20} />,
    },
    {
      name: "Pazar Yeri",
      path: "/marketplace",
      icon: <ShoppingBag size={20} />,
    },
    { name: "Kaydedilenler", path: "/bookmarks", icon: <Bookmark size={20} /> },
    {
      name: "Ayarlar",
      path: `/settings/${user?._id}`,
      icon: <Settings size={20} />,
    },
  ];

  // --- Helper to build image URLs ---
  const getProfileImageUrl = (imagePath: string): string => {
    return imagePath
      ? `http://localhost:5001/${imagePath}`
      : "/default-profile.png";
  };

  // --- Fetch "Sayfalarım" (my pages) ---
  useEffect(() => {
    const fetchMyPages = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/pages/mine",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMyPages(response.data.pages);
      } catch (error) {
        console.error("Error fetching my pages:", error);
      }
    };
    fetchMyPages();
  }, []);

  // --- Determine if current route belongs to one of the user's pages ---
  const currentPath = location.pathname;
  const currentPage = myPages.find((page: any) =>
    currentPath.startsWith(`/pages/${page.username}`)
  );

  // --- Build profile data based on whether a page is selected ---
  const profileData = selectedPage
    ? {
        name: selectedPage.name,
        username: selectedPage.username,
        profileImage: selectedPage.profileImage,
        role: "Sayfa Yöneticisi",
      }
    : {
        name: user?.name || "Kullanıcı",
        username: user?.username || "",
        profileImage: user?.profileImage || "",
        role: "Öğrenci",
      };

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-screen w-80 bg-white text-gray-800 border-r border-gray-200 transform transition-transform duration-300 z-50 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Marka / Logo */}
        <div className="flex items-center px-4 py-4 text-blue-600">
          <Bird size={24} />
          <span className="ml-2 text-xl font-semibold">Paulih</span>
          <button
            onClick={onClose}
            className="ml-auto text-gray-400 hover:text-gray-600 lg:hidden"
          >
            &times;
          </button>
        </div>

        {/* Ana Navigasyon */}
        <nav className="mt-2 px-2 flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {navigation.map((item) => {
              if (item.name === "Sipariş") {
                return (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate("/coming-soon")} // <<<<< Direct to coming-soon
                      className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    >
                      <span className="mr-3 text-base">{item.icon}</span>
                      <span>{item.name}</span>
                      <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        Çok Yakında
                      </span>
                    </button>
                  </li>
                );
              } else {
                return (
                  <li key={item.name}>
                    <NavLink
                      to={item.path}
                      onClick={() => {
                        if (item.name === "Ana Sayfa") {
                          setHasNewPosts(false);
                        }
                      }}
                      className={({ isActive }) =>
                        `flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                            : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                        }`
                      }
                    >
                      <span className="mr-3 text-base">{item.icon}</span>
                      <span>{item.name}</span>
                      {item.name === "Kaydedilenler" && (
                        <span className="ml-auto text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                          {bookmarkCount}
                        </span>
                      )}
                      {item.name === "Kariyer" && (
                        <span className="ml-auto text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full">
                          Yakında
                        </span>
                      )}
                      {item.name === "Etkinlikler" && (
                        <span className="ml-auto text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full">
                          Yakında
                        </span>
                      )}
                      {item.name === "Üniversitem" && (
                        <span className="ml-auto text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full">
                          Yakında
                        </span>
                      )}
                      {item.name === "Pazar Yeri" && (
                        <span className="ml-auto text-xs bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full">
                          Yakında
                        </span>
                      )}

                      {item.name === "Ana Sayfa" && hasNewPosts && (
                        <span className="ml-auto w-2 h-2 bg-red-500 rounded-full" />
                      )}
                      {item.name === "Sipariş" && (
                        <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          {currentOrder
                            ? currentOrder.orderStatus
                            : "İlk Siparişini Ver"}
                        </span>
                      )}
                    </NavLink>
                  </li>
                );
              }
            })}
          </ul>
        </nav>

        {/* Upgrade & Profil/Çıkış Bölümü */}
        <div className="border-t border-gray-200 mt-2 px-2 py-3">
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="flex items-center justify-between w-full px-3 py-2 bg-yellow-100 hover:bg-yellow-200 rounded-md text-sm font-medium text-yellow-800"
          >
            <span>PRO'ya Yükselt</span>
            <Zap className="text-yellow-500" size={20} />
          </button>
          <NavLink
            to={
              selectedPage
                ? `/pages/${selectedPage.username}`
                : `/profile/${user?.username}`
            }
            className="mt-3 flex items-center justify-between w-full px-3 py-2 text-sm rounded-md hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <img
                src={getProfileImageUrl(profileData.profileImage || "")}
                alt="Profil"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-gray-700 flex items-center">
                  {profileData.name}
                </p>
                <p className="text-xs text-gray-400">{profileData.role}</p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
              className="flex items-center text-gray-400 hover:text-red-500"
            >
              <LogOut size={20} />
            </button>
          </NavLink>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 mt-4 px-4">
          <p className="mb-1">Paulih v1.0</p>
          <p>© {new Date().getFullYear()} Paulih. Tüm hakları saklıdır.</p>
        </div>
      </div>

      {/* Render CreatePost modal */}
      {modalOpen && (
        <CreatePost
          fetchPosts={() => {}}
          userData={user}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
        />
      )}

      {/* Render Upgrade modal */}
      {showUpgradeModal && (
        <Upgrade onClose={() => setShowUpgradeModal(false)} />
      )}

      {/* Render the Order Popup */}
      {showOrderPopup && (
        <SidebarOrderPopup onClose={() => setShowOrderPopup(false)} />
      )}
    </>
  );
};

export default Sidebar;

import React, { useContext, useState, useRef, useEffect } from "react";
import {
  Bell,
  MessageSquare,
  Settings,
  LogOut,
  User,
  CreditCard,
  Globe2,
  HelpCircle,
  List,
  Triangle,
  UserPlus,
  Users,
  CheckCircle,
  LucideSearch,
  Bird,
} from "lucide-react";
import {
  FaChevronDown,
  FaBars,
  FaUniversity,
  FaList,
  FaUserFriends,
  FaClock,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import {
  fetchAllUnreadMessages,
  getUserBookmarkCount,
  searchUsers,
} from "../services/api";
import CreatePost from "./CreatePost";
import NotificationsPopup from "./NotificationsPopup";
import { AuthUserContext } from "../context/AuthUserContext";
import axios from "axios";
import RightSidebar from "./RightSidebar";
import SearchResultsPanel from "./SearchResultsPanel";

interface NavbarProps {
  onToggleSidebar: () => void;
  profileUser?: {
    name: string;
    username: string;
    profileImage?: string;
    postCount?: number;
  };
}

// Map filter options to icons with adjusted size
const filterIcons: { [key: string]: JSX.Element } = {
  University: <FaUniversity className="w-4 h-4 mr-2" />,
  "All Posts": <FaList className="w-4 h-4 mr-2" />,
  Friends: <FaUserFriends className="w-4 h-4 mr-2" />,
  "Recently Added": <FaClock className="w-4 h-4 mr-2" />,
};

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, setUser } = useContext(AuthUserContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Modals & Dropdowns
  const [modalOpen, setModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mobile sidebar overlay state (for RightSidebar on phones)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Counts
  const [notificationCount, setNotificationCount] = useState(0);
  const [readNotifications, setReadNotifications] = useState<string[]>([]);
  const [chatCount, setChatCount] = useState(0);

  // NEW: Bookmark count for Navbar (for /bookmarks header)
  const [navbarBookmarkCount, setNavbarBookmarkCount] = useState<number>(0);

  // State for "Günün Favorileri" active style
  const [favorilerActive, setFavorilerActive] = useState(false);

  const [navbarSearchQuery, setNavbarSearchQuery] = useState<string>("");
  const [navbarSearchFocus, setNavbarSearchFocus] = useState<boolean>(false);
  const [navbarSearchResults, setNavbarSearchResults] = useState<any[]>([]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
        setFilterDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Build profile image URL
  const getProfileImageUrl = (imagePath: string) => {
    return imagePath.startsWith("http")
      ? imagePath
      : `http://localhost:5001/${imagePath}`;
  };

  // Helper for user initials if no profile image
  const getUserInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    return parts.length > 1
      ? parts[0][0].toUpperCase() + parts[1][0].toUpperCase()
      : parts[0][0].toUpperCase();
  };

  // ========== Notifications ==========
  const handleNotificationsClick = () => {
    if (user) {
      setNotificationsOpen(true);
    } else {
      alert("Bildirimleri görebilmek için giriş yapmalısınız.");
    }
  };

  useEffect(() => {
    const fetchNotificationCount = async () => {
      if (!user) {
        setNotificationCount(0);
        return;
      }

      try {
        const postResponse = await axios.get(
          `http://localhost:5001/api/posts/${user._id}`
        );
        const fetchedPosts = postResponse.data.posts || [];

        const likesCount = fetchedPosts.reduce((acc: number, post: any) => {
          const likeCount = (post.likes || []).filter(
            (like: any) => like.user !== user._id
          ).length;
          return acc + likeCount;
        }, 0);

        const commentResponse = await axios.get(
          `http://localhost:5001/api/posts/${user._id}/notificationcomments`
        );
        const comments = commentResponse.data.comments || [];

        const friendRequestResponse = await axios.get(
          `http://localhost:5001/api/friends/requests/${user._id}`
        );
        const friendRequests = friendRequestResponse.data || [];

        setNotificationCount(
          likesCount + comments.length + friendRequests.length
        );
      } catch (error) {
        console.error("Bildirim sayısı alınırken hata oluştu:", error);
      }
    };

    fetchNotificationCount();
  }, [user]);

  useEffect(() => {
    const computeNotificationCount = async () => {
      if (!user) return;

      const stored = localStorage.getItem(`readNotifications-${user._id}`);
      const readKeys: string[] = stored ? JSON.parse(stored) : [];
      setReadNotifications(readKeys); // ✅ Update state on load

      try {
        const [postRes, commentRes, friendRes] = await Promise.all([
          axios.get(`http://localhost:5001/api/posts/${user._id}`),
          axios.get(
            `http://localhost:5001/api/posts/${user._id}/notificationcomments`
          ),
          axios.get(`http://localhost:5001/api/friends/requests/${user._id}`),
        ]);

        const likes = postRes.data.posts.flatMap((post: any) =>
          (post.likes || [])
            .filter((like: any) => like.user !== user._id)
            .map((like: any) => `like-${like.username}-${post._id}`)
        );

        const comments = commentRes.data.comments.map(
          (c: any) => `comment-${c.commenter.username}-${c.postId}`
        );

        const friendRequests = friendRes.data.map(
          (f: any) => `friendRequest-${f.username}-${f.username}`
        );

        const allKeys = [...likes, ...comments, ...friendRequests];
        const unreadKeys = allKeys.filter((key) => !readKeys.includes(key));

        setNotificationCount(unreadKeys.length);
      } catch (error) {
        console.error("Bildirim sayısı alınamadı:", error);
      }
    };

    computeNotificationCount();
  }, [user, notificationsOpen]);

  // ========== Chat ==========
  useEffect(() => {
    const fetchChatCount = async () => {
      if (!user) {
        setChatCount(0);
        return;
      }
      try {
        const unreadMessages = await fetchAllUnreadMessages();
        setChatCount(unreadMessages.length);
      } catch (error) {
        console.error("Sohbet sayısı alınırken hata oluştu:", error);
      }
    };
    fetchChatCount();
    const interval = setInterval(fetchChatCount, 5000);
    return () => clearInterval(interval);
  }, [user]);

  // ========== Bookmark Count for Navbar ==========
  useEffect(() => {
    const fetchBookmarksCount = async () => {
      if (!user?._id) return;
      try {
        const count = await getUserBookmarkCount(user._id);
        setNavbarBookmarkCount(count);
      } catch (error) {
        console.error("Kaydedilen sayısı alınırken hata oluştu:", error);
      }
    };

    if (location.pathname.startsWith("/bookmarks")) {
      fetchBookmarksCount();
    }
  }, [user, location.pathname]);

  // ========== Logout ==========
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    navigate("/login");
  };

  // Toggle profile dropdown
  const toggleProfileDropdown = () =>
    setProfileDropdownOpen(!profileDropdownOpen);

  // ========= Filter Options ==========
  const filterOptions = [
    "University",
    "All Posts",
    "Friends",
    "Recently Added",
  ];
  const [selectedFilter, setSelectedFilter] = useState("University");

  // Toggle filter dropdown
  const toggleFilterDropdown = () => setFilterDropdownOpen(!filterDropdownOpen);

  const handleFilterSelect = (option: string) => {
    setSelectedFilter(option);
    setFilterDropdownOpen(false);
    console.log("Selected filter:", option);
  };

  // Toggle mobile sidebar overlay (for phones)
  const toggleMobileSidebar = () => setMobileSidebarOpen(!mobileSidebarOpen);

  return (
    <>
      {/* Fixed Navbar */}
      <nav className="fixed top-0 right-0 w-full lg:w-4/5 bg-white border-b border-gray-200 z-50 h-16 flex items-center px-4">
        {/* Marka / Logo */}
        <div className="flex items-center px-4 py-4 text-blue-600 lg:hidden">
          <Bird size={24} />
        </div>
        {/* Center Container */}
        <div className="flex-1 flex items-center justify-center px-2 sm:px-4">
          <div className="w-full max-w-md relative">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
              <LucideSearch className="text-gray-500" size={18} />
              <input
                type="text"
                value={navbarSearchQuery}
                onChange={async (e) => {
                  const value = e.target.value;
                  setNavbarSearchQuery(value);

                  if (value.trim()) {
                    try {
                      const results = await searchUsers(value);
                      setNavbarSearchResults(results);
                    } catch (error) {
                      console.error("Navbar search error:", error);
                      setNavbarSearchResults([]);
                    }
                  } else {
                    setNavbarSearchResults([]);
                  }
                }}
                onFocus={() => setNavbarSearchFocus(true)}
                onBlur={() => {
                  if (!navbarSearchQuery) setNavbarSearchFocus(false);
                }}
                placeholder="Ara..."
                className="ml-2 w-full bg-transparent placeholder-gray-500 text-sm focus:outline-none"
              />
            </div>

            {navbarSearchFocus && navbarSearchQuery && (
              <div className="absolute left-0 right-0 mt-2 w bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-50">
                <SearchResultsPanel
                  query={navbarSearchQuery}
                  results={navbarSearchResults}
                  loggedInUserId={user?._id}
                  onClose={() => {
                    setNavbarSearchFocus(false);
                    setNavbarSearchQuery("");
                    setNavbarSearchResults([]);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: Icons */}
        <div className="flex items-center space-x-2 ml-auto">
          {/* Only Desktop (lg:flex) */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* Profile Dropdown (sola alındı) */}
            {user && (
              <div className="relative">
                {/* Profile + Dropdown */}
                <div
                  onClick={toggleProfileDropdown}
                  className="flex items-center bg-gray-100 mr-8 ml-[29.5px] px-3 py-1 rounded-full cursor-pointer transition hover:bg-gray-200"
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-100">
                    {user.profileImage ? (
                      <img
                        src={getProfileImageUrl(user.profileImage)}
                        alt={user.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="font-bold text-sm text-black flex items-center justify-center h-full">
                        {user.name ? getUserInitials(user.name) : "U"}
                      </span>
                    )}
                  </div>

                  <span className="ml-2 text-sm font-medium text-gray-800">
                    {user.name?.split(" ")[0] || "Kullanıcı"}
                  </span>

                  <FaChevronDown className="ml-2 w-3 h-3 text-black" />
                </div>

                {profileDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-3 w-64 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden"
                  >
                    {/* Top User Info */}
                    <div
                      className="px-4 py-3 flex items-center cursor-pointer hover:bg-blue-100 transition"
                      onClick={() => {
                        navigate(`/profile/${user.username}`);
                        setProfileDropdownOpen(false);
                      }}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                        <img
                          src={getProfileImageUrl(user.profileImage)}
                          alt={`${user.name}'s profile`}
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-semibold text-gray-800">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user.email || "support@example.com"}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200" />

                    {/* Main Menu Items */}
                    <ul className="py-2 text-sm text-gray-700">
                      <li className="px-2">
                        <button
                          onClick={() => {
                            navigate(`/profile/${user.username}`);
                            setProfileDropdownOpen(false);
                          }}
                          className="group flex items-center w-full px-3 py-2 rounded-md transition hover:bg-blue-100 hover:text-blue-600"
                        >
                          <User className="w-4 h-4 mr-2 transition group-hover:text-blue-600" />
                          <span className="flex-grow text-left">
                            Profil Görüntüle
                          </span>
                        </button>
                      </li>
                      <li className="px-2">
                        <button
                          onClick={() => {
                            navigate("/settings");
                            setProfileDropdownOpen(false);
                          }}
                          className="group flex items-center w-full px-3 py-2 rounded-md transition hover:bg-blue-100 hover:text-blue-600"
                        >
                          <Settings className="w-4 h-4 mr-2 transition group-hover:text-blue-600" />
                          <span className="flex-grow text-left">Ayarlar</span>
                        </button>
                      </li>
                      <li className="px-2">
                        <button
                          onClick={() => {
                            navigate("/settings/support/contact");
                            setProfileDropdownOpen(false);
                          }}
                          className="group flex items-center w-full px-3 py-2 rounded-md transition hover:bg-blue-100 hover:text-blue-600"
                        >
                          <HelpCircle className="w-4 h-4 mr-2 transition group-hover:text-blue-600" />
                          <span className="flex-grow text-left">Destek</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={handleNotificationsClick}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
              >
                <Bell className="w-5 h-5 text-gray-700" />
              </button>
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </div>

            {/* Chat */}
            <div className="relative">
              <button
                onClick={() => navigate("/chat")}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
              >
                <MessageSquare className="w-5 h-5 text-gray-700" />
              </button>
              {chatCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {chatCount}
                </span>
              )}
            </div>

            {/* Settings */}
            <button
              onClick={() => navigate("/settings")}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
              <Settings className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Only Mobile/Tablet (lg:hidden) */}
          <div className="flex lg:hidden items-center space-x-2">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={handleNotificationsClick}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
              >
                <Bell className="w-5 h-5 text-gray-700" />
              </button>
              {notificationCount > 0 && (
                <>
                  {/* Red dot on all devices */}
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />

                  {/* Count only on desktop and above */}
                  <span className="hidden lg:flex absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 items-center justify-center rounded-full">
                    {notificationCount}
                  </span>
                </>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
              <LogOut className="w-5 h-5 text-gray-700" />
            </button>

            {/* Hamburger */}
            <button
              onClick={toggleMobileSidebar}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
              <FaBars className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Right Sidebar Overlay (visible only on mobile) */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed top-16 right-0 w-64 h-[calc(100vh-4rem)] bg-gray-100 border-l border-gray-200 z-50 shadow">
          <RightSidebar
            interestedUsers={[]}
            getProfileImageUrl={getProfileImageUrl}
            currentUser={user}
          />
        </div>
      )}

      <NotificationsPopup
        userId={user?._id}
        modalOpen={notificationsOpen}
        setModalOpen={setNotificationsOpen}
        readNotifications={readNotifications}
        setReadNotifications={setReadNotifications}
        setNotificationCount={setNotificationCount} // ✅ add this line
      />

      <CreatePost
        fetchPosts={() => {}}
        userData={user}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
    </>
  );
};

export default Navbar;

// src/pages/HomePage.tsx
import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import AllPosts from "../components/AllPosts";
import CreatePost from "../components/CreatePost";
import HomePageCreatePost from "../components/HomePageCreatePost";
import { AuthUserContext } from "../context/AuthUserContext";
import {
  Home,
  Heart,
  Search,
  User,
  PlusCircle,
  MessageSquare,
  Settings,
} from "lucide-react";
import {
  FaFilter,
  FaChevronDown,
  FaSort,
  FaUniversity,
  FaList,
  FaCalendarAlt,
} from "react-icons/fa";
import MobileNavItems from "../components/MobileNavItems";

const filterIcons: { [key: string]: JSX.Element } = {
  Tümü: <FaList className="w-4 h-4 mr-2" />,
  Üniversite: <FaUniversity className="w-4 h-4 mr-2" />,
  Etkinlikler: <FaCalendarAlt className="w-4 h-4 mr-2" />,
};

const HomePage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useContext(AuthUserContext);
  const [newPostsAvailable, setNewPostsAvailable] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setNewPostsAvailable(true);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleNewPostsClick = () => {
    setNewPostsAvailable(false);
  };

  const loggedInUser = user || {
    _id: "defaultUserId",
    name: "Varsayılan Kullanıcı",
    username: "defaultuser",
    profileImage: "",
  };

  const getProfileImageUrl = (imagePath: string) => {
    return imagePath && imagePath.trim() !== ""
      ? imagePath.startsWith("http")
        ? imagePath
        : `http://localhost:5001/${imagePath}`
      : "/default-profile.png";
  };

  const filterOptions = ["Tümü", "Üniversite", "Etkinlikler"];
  const [selectedFilter, setSelectedFilter] = useState("Üniversite");
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const toggleFilterDropdown = () => setFilterDropdownOpen(!filterDropdownOpen);
  const handleFilterSelect = (option: string) => {
    setSelectedFilter(option);
    setFilterDropdownOpen(false);
  };

  const sortOptions = ["En Yeni", "En Eski"];
  const [selectedSort, setSelectedSort] = useState("En Yeni");
  const [sortPopupOpen, setSortPopupOpen] = useState(false);
  const toggleSortPopup = () => setSortPopupOpen(!sortPopupOpen);
  const handleSortSelect = (option: string) => {
    setSelectedSort(option);
    setSortPopupOpen(false);
  };

  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  const activeClasses = "border-blue-500 text-blue-500 bg-white";
  const inactiveClasses =
    "border-gray-200 text-gray-600 bg-gray-100 hover:bg-gray-200";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setFilterDropdownOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortPopupOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const leftNavItems = [
    { to: "/", label: "Ana Sayfa", Icon: Home },
    { to: "/chat", label: "Mesajlar", Icon: MessageSquare },
  ];

  const rightNavItems = [
    { to: "/settings", label: "Ayarlar", Icon: Settings },
    {
      to: `/profile/${user?.username || "defaultuser"}`,
      label: "Profil",
      Icon: User,
    },
  ];

  return (
    <MainLayout>
      <div className="pt-16 px-4 md:ml-20 lg:mr-80 relative">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full max-w-none md:max-w-2xl mx-auto px-2 md:px-4">
            {/* Modern "What's Happening" */}
            <HomePageCreatePost
              userData={loggedInUser}
              onPostClick={() => setModalOpen(true)}
            />

            {/* Modal Açılınca Eski CreatePost */}
            <CreatePost
              fetchPosts={() => {}}
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
              userData={loggedInUser}
            />

            {/* Filter and Sort */}
            <div className="flex justify-between items-center mt-4 mb-4 px-2">
              {/* Filter Button */}
              <div className="relative" ref={filterRef}>
                <button
                  onClick={toggleFilterDropdown}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-gray-700 text-sm font-medium hover:shadow-md transition"
                >
                  {filterIcons[selectedFilter]}
                  <span>{selectedFilter}</span>
                  <FaChevronDown className="w-3 h-3" />
                </button>

                {filterDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                    {filterOptions.map((option) => {
                      const isSelected = option === selectedFilter;
                      return (
                        <button
                          key={option}
                          onClick={() => handleFilterSelect(option)}
                          className={`flex items-center gap-2 px-4 py-3 text-sm w-full text-left transition ${
                            isSelected
                              ? "bg-blue-600 text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {filterIcons[option]}
                          <span>{option}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Sort Button */}
              <div className="relative" ref={sortRef}>
                <button
                  onClick={toggleSortPopup}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-gray-700 text-sm font-medium hover:shadow-md transition"
                >
                  <FaSort className="w-4 h-4" />
                  <span>Sırala: {selectedSort}</span>
                  <FaChevronDown className="w-3 h-3" />
                </button>

                {sortPopupOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                    {sortOptions.map((option) => {
                      const isSelected = option === selectedSort;
                      return (
                        <button
                          key={option}
                          onClick={() => handleSortSelect(option)}
                          className={`flex items-center gap-2 px-4 py-3 text-sm w-full text-left transition ${
                            isSelected
                              ? "bg-blue-600 text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <span>{option}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Postlar */}
            <AllPosts
              loggedInUser={loggedInUser}
              getProfileImageUrl={getProfileImageUrl}
              sortOption={selectedSort}
              selectedFilter={selectedFilter}
            />
          </div>
        </div>
      </div>

      <MobileNavItems
        onOpenCreatePost={() => setModalOpen(true)}
        username={user?.username}
      />
    </MainLayout>
  );
};

export default HomePage;

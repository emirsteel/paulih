// src/components/RightSidebar.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import MapUserSmall from "./MapUserSmall";
import { Zap, ArrowLeft, Clock, MapPin, Plus } from "lucide-react"; // Imported ArrowLeft from lucide-react
import { FaInfoCircle } from "react-icons/fa";
import Upgrade from "./Upgrade";
import { fetchAllPages, fetchMyPages, getAllEvents } from "../services/api";

// Type definitions
interface UniversitySuggestion {
  _id: string;
  email: string;
  name?: string;
  profileImage?: string;
  username?: string;
}

interface Page {
  _id: string;
  name: string;
  username: string;
  profileImage?: string;
  bannerImage?: string;
  followersCount?: number;
}

// Extended Event interface with optional time and location fields
interface Event {
  _id: string;
  title: string;
  date: string;
  details: string;
  image: string;
  startTime?: string;
  endTime?: string;
  locationType?: string;
  locationLink?: string;
  page?: Page; // Added this line
}

interface RightSidebarProps {
  interestedUsers: any[];
  getProfileImageUrl: (imagePath: string) => string;
  currentUser: {
    _id: string;
    name: string;
    username: string;
    profileImage?: string;
  } | null;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  interestedUsers,
  getProfileImageUrl,
  currentUser,
}) => {
  // Local states for suggestions, pages, events, etc.
  const [universitySuggestions, setUniversitySuggestions] = useState<
    UniversitySuggestion[]
  >([]);
  const [displayCount, setDisplayCount] = useState<number>(5);
  const [showInfoPopup, setShowInfoPopup] = useState<boolean>(false);
  const [pages, setPages] = useState<Page[]>([]);
  const [myPages, setMyPages] = useState<Page[]>([]);
  const [randomPages, setRandomPages] = useState<Page[]>([]);
  const [displayPagesCount, setDisplayPagesCount] = useState<number>(5);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  // State to store the selected page (the page the user is “inside”)
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const limitedSuggestions = universitySuggestions.slice(0, displayCount);

  const maxSuggestions = 10;
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath: string = location.pathname;

  // On mount, load any previously selected page from localStorage
  useEffect(() => {
    const savedPage = localStorage.getItem("selectedPage");
    if (savedPage) {
      setSelectedPage(JSON.parse(savedPage));
    }
  }, []);

  // --- Fetch data ---
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5001/api/friends/university",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const filtered = response.data.filter(
          (s: UniversitySuggestion) =>
            s._id !== currentUser?._id && !friendsList.includes(s._id)
        );

        const shuffled = filtered.sort(() => Math.random() - 0.5);
        setUniversitySuggestions(shuffled);
      } catch (error) {
        console.error("Error fetching university suggestions:", error);
      }
    };
    fetchSuggestions();
  }, [currentUser?._id]);

  useEffect(() => {
    const getPages = async () => {
      const fetchedPages = await fetchAllPages();
      setPages(fetchedPages);
    };
    getPages();
  }, []);

  useEffect(() => {
    const getMyPages = async () => {
      const fetchedMyPages = await fetchMyPages();
      setMyPages(fetchedMyPages);
    };
    getMyPages();
  }, []);

  useEffect(() => {
    if (pages.length > 0) {
      const shuffled = [...pages].sort(() => Math.random() - 0.5);
      setRandomPages(shuffled);
      setDisplayPagesCount(5);
    }
  }, [pages]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const events = await getAllEvents();
        setUpcomingEvents(events);
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      }
    };
    fetchEvents();
  }, []);

  // --- Filtering suggestions based on friend list ---
  const loggedInUserStr = localStorage.getItem("user");
  const loggedInUser = loggedInUserStr ? JSON.parse(loggedInUserStr) : null;
  const friendsList: string[] =
    loggedInUser && loggedInUser.friends ? loggedInUser.friends : [];
  const filteredSuggestions = universitySuggestions.filter(
    (suggestion) =>
      suggestion._id !== currentUser?._id && // ✅ Use currentUser directly
      !friendsList.includes(suggestion._id)
  );
  const availableMax = Math.min(maxSuggestions, filteredSuggestions.length);

  // --- Toggle logic for "Arkadaş Önerileri" ---
  const handleToggleDisplay = () => {
    setDisplayCount(displayCount > 5 ? 5 : 10);
  };
  const isMaxDisplayed = displayCount >= availableMax;
  const buttonLabel = isMaxDisplayed ? "Daha Az Göster" : "Daha Fazla Göster";

  // --- Toggle logic for "Önerilen Sayfalar" ---
  const handleTogglePagesDisplay = () => {
    if (displayPagesCount >= randomPages.length) {
      setDisplayPagesCount(5);
    } else {
      setDisplayPagesCount((prev) => Math.min(prev + 5, randomPages.length));
    }
  };
  const pagesToggleText =
    displayPagesCount >= randomPages.length ? "Daha Az Göster" : "Daha Fazla";

  // --- Navigate to page and store the selected page in localStorage ---
  const goToPage = (username: string) => {
    const page = myPages.find((p: Page) => p.username === username);
    if (page) {
      setSelectedPage(page);
      localStorage.setItem("selectedPage", JSON.stringify(page));
    } else {
      localStorage.removeItem("selectedPage");
      setSelectedPage(null);
    }
    navigate(`/pages/${username}`);
  };

  const handleSuggestionClick = (user: UniversitySuggestion) => {
    const username =
      user.username?.trim() !== "" && user.username
        ? user.username
        : user.email.split("@")[0];
    navigate(`/profile/${username}`);
  };
  const [currentDate, setCurrentDate] = useState(() => {
    const timeZone = "Europe/Istanbul";
    const now = new Date(new Date().toLocaleString("en-US", { timeZone }));
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // Dynamic values based on currentDate
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const monthName = new Intl.DateTimeFormat("tr-TR", {
    month: "long",
    timeZone: "Europe/Istanbul",
  }).format(currentDate);

  const todayDate = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Europe/Istanbul" })
  ).getDate();
  const todayMonth = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Europe/Istanbul" })
  ).getMonth();
  const todayYear = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Europe/Istanbul" })
  ).getFullYear();

  // Calendar cells generator
  const getCalendarCells = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const cells: (number | null)[] = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      cells.push(day);
    }
    return cells;
  };

  const cells = getCalendarCells();

  // Dates that have upcoming events
  const eventDates = upcomingEvents
    .filter((event) => {
      const eventDate = new Date(event.date);
      const isSameMonth =
        eventDate.getMonth() === currentMonth &&
        eventDate.getFullYear() === currentYear;
      const isTodayOrLater =
        eventDate.getDate() >= todayDate ||
        eventDate.getMonth() > todayMonth ||
        eventDate.getFullYear() > todayYear;
      return isSameMonth && isTodayOrLater;
    })
    .map((event) => new Date(event.date).getDate());

  // --- Render upcoming events with a fade overlay and text at the bottom ---
  const renderUpcomingEvents = () => (
    <div className="pb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        Yaklaşan Etkinlikler
      </h2>
      <div className="space-y-4">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event: Event) => {
            const rawImage = event.image || (event as any).photo;
            const imageUrl = rawImage
              ? rawImage.startsWith("http")
                ? rawImage
                : `http://localhost:5001/uploads/${rawImage}`
              : "/default-event.png";

            const dateObj = new Date(event.date);
            const dateBubbleText = dateObj.toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "short",
            });

            const timeRange =
              event.startTime && event.endTime
                ? `${event.startTime} - ${event.endTime}`
                : event.startTime || event.endTime || "";

            const locationText = event.locationLink || "Konum belirtilmedi";

            return (
              <div
                key={event._id}
                className="relative w-full h-64 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              >
                {/* Background Image */}
                <img
                  src={imageUrl}
                  alt={event.title}
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />

                {/* Softer gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                {/* Time Bubble */}
                {timeRange && (
                  <div className="absolute top-2 left-2 bg-white text-blue-600 font-semibold text-xs px-2 py-1 rounded-full shadow-sm">
                    {timeRange}
                  </div>
                )}

                {/* Date Bubble */}
                <div className="absolute top-2 right-2 bg-white text-blue-600 font-semibold text-xs px-2 py-1 rounded-full shadow-sm">
                  {dateBubbleText}
                </div>

                {/* Bottom Text Container */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/40 backdrop-blur-md">
                  <h3 className="text-base font-bold text-white truncate">
                    {event.title}
                  </h3>

                  {event.page?.name && (
                    <p className="text-xs text-blue-200 mt-1">
                      Sayfa: {event.page.name}
                    </p>
                  )}

                  <div className="mt-1 flex items-center text-xs text-blue-300">
                    <MapPin size={14} className="mr-1" />
                    <span className="truncate">{locationText}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-gray-500">Etkinlik bulunamadı</p>
        )}
      </div>
    </div>
  );

  // --- Determine profile data to show in the lower section ---
  // If a page is selected (via localStorage), use that; otherwise, use the currentUser.
  const profileData = selectedPage
    ? {
        name: selectedPage.name,
        username: selectedPage.username,
        profileImage: selectedPage.profileImage,
        role: "Sayfa Yöneticisi",
      }
    : {
        name: currentUser?.name || "Kullanıcı",
        username: currentUser?.username || "",
        profileImage: currentUser?.profileImage || "",
        role: "Öğrenci",
      };

  return (
    <>
      <aside
        className="flex-shrink-0 fixed top-16 right-0 w-80 h-[calc(100vh-4rem)] border-l border-gray-200 bg-white overflow-y-auto p-4 custom-scrollbar-hover"
        style={{ zIndex: 40 }}
      >
        {/* ---- SAYFALARIM ---- */}
        {selectedPage && (
          <div
            className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer flex items-center justify-between hover:bg-blue-100 transition"
            onClick={() => {
              localStorage.removeItem("selectedPage");
              setSelectedPage(null);
              navigate(`/home`);
            }}
          >
            <div className="flex items-center space-x-3">
              <ArrowLeft size={16} className="text-blue-600" />
              {currentUser && (
                <>
                  {console.log(
                    "Profile URL:",
                    getProfileImageUrl(currentUser.profileImage || "")
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {currentUser.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      @{currentUser.username}
                    </p>
                  </div>
                </>
              )}
            </div>
            <div className="text-blue-600 font-bold text-sm">
              Hesaba Geri Git
            </div>
          </div>
        )}

        {/* ---- SAYFALARIM Section ---- */}
        {myPages.length > 0 && (
          <div className="pb-6 mb-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-md font-semibold text-gray-800">
                Sayfalarım
              </h2>
            </div>
            <div className="space-y-3">
              {myPages.map((page) => {
                const imageUrl = page.profileImage
                  ? encodeURI(getProfileImageUrl(page.profileImage))
                  : "/default-profile.png";
                const isCurrentlyEditing =
                  currentPath === `/pages/${page.username}` ||
                  selectedPage?.username === page.username;
                return (
                  <div
                    key={page._id}
                    className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer"
                    onClick={() => goToPage(page.username)}
                  >
                    <img
                      src={
                        page.profileImage
                          ? encodeURI(getProfileImageUrl(page.profileImage))
                          : "/default-profile.png"
                      }
                      alt={page.name}
                      className="w-10 h-10 rounded-full object-cover mr-3"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {page.name}
                      </p>
                      <p className="text-xs text-gray-500">@{page.username}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToPage(page.username);
                      }}
                      className="bg-blue-100 text-blue-600 text-sm px-2 py-1 rounded hover:bg-blue-200"
                    >
                      {isCurrentlyEditing ? "Düzenleniyor" : "Düzenle"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---- ARKADAŞ ÖNERİLERİ ---- */}
        <div className="pb-6 mb-6 border-b border-gray-200 relative">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1">
              <h2 className="text-md font-semibold text-gray-800">
                Arkadaş Önerileri
              </h2>
              <FaInfoCircle
                className="text-gray-400 cursor-pointer"
                size={14}
                onClick={() => setShowInfoPopup(!showInfoPopup)}
              />
            </div>
            {universitySuggestions.length > 5 && (
              <button
                onClick={handleToggleDisplay}
                className="text-xs text-blue-600 hover:underline"
              >
                {displayCount > 5 ? "Daha Az Göster" : "Daha Fazla Göster"}
              </button>
            )}
            {showInfoPopup && (
              <div className="absolute top-full left-0 bg-white border border-gray-300 shadow-md p-3 rounded text-sm max-w-xs">
                <button
                  className="absolute top-1 right-1 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowInfoPopup(false)}
                >
                  &times;
                </button>
                <p className="pr-2">
                  İlginizi çeken şeyleri takip ederek akışınızı kişiselleştirin.{" "}
                  <a
                    href="#"
                    className="text-blue-600 underline ml-1"
                    onClick={() => setShowInfoPopup(false)}
                  >
                    Daha fazla bilgi.
                  </a>
                </p>
              </div>
            )}
          </div>
          {(filteredSuggestions.length > displayCount ||
            (filteredSuggestions.length > 5 &&
              filteredSuggestions.length <= displayCount)) && (
            <button
              onClick={handleToggleDisplay}
              className="text-xs text-blue-600 hover:underline mb-3"
            >
              {buttonLabel}
            </button>
          )}
          <div className="space-y-3">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.slice(0, displayCount).map((user) => (
                <div
                  key={user._id}
                  className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer"
                  onClick={() => handleSuggestionClick(user)}
                >
                  <img
                    src={
                      user.profileImage
                        ? `http://localhost:5001/${user.profileImage}`
                        : "/default-profile.png"
                    }
                    alt={user.name || user.email}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {user.name || user.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      @
                      {user.username?.trim() !== "" && user.username
                        ? user.username
                        : user.email.split("@")[0]}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSuggestionClick(user);
                    }}
                    className="bg-blue-100 text-blue-600 text-sm px-2 py-1 rounded hover:bg-blue-200"
                  >
                    Arkadaş Ekle
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Öneri bulunamadı</p>
            )}
          </div>
        </div>

        {/* ---- ÖNERİLEN SAYFALAR ---- */}
        <div className="pb-6 mb-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              Önerilen Sayfalar
            </h2>
            {randomPages.length > 5 && (
              <button
                onClick={handleTogglePagesDisplay}
                className="text-xs text-blue-600 hover:text-blue-800 transition"
              >
                {pagesToggleText}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6">
            {randomPages.filter((page) => {
              const followers = (page as any).followers || [];
              return !followers.includes(loggedInUser?._id);
            }).length > 0 ? (
              randomPages
                .filter((page) => {
                  const followers = (page as any).followers || [];
                  return !followers.includes(loggedInUser?._id);
                })
                .slice(0, displayPagesCount)
                .map((page) => {
                  const profileImage = page.profileImage
                    ? encodeURI(getProfileImageUrl(page.profileImage))
                    : "/default-profile.png";

                  const bannerImage = page.bannerImage
                    ? encodeURI(getProfileImageUrl(page.bannerImage))
                    : "/default-banner.png";

                  const followersCount = (page as any).followers
                    ? (page as any).followers.length
                    : 0;

                  const formattedFollowers =
                    followersCount >= 1000
                      ? `${(followersCount / 1000).toFixed(1)}B Takipçi`
                      : `${followersCount} Takipçi`;

                  return (
                    <div
                      key={page._id}
                      className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-white to-gray-50 shadow-md border border-gray-200 hover:shadow-lg hover:scale-[1.02] transition-transform duration-200 cursor-pointer group"
                      onClick={() => goToPage(page.username)}
                    >
                      {/* Banner */}
                      <div className="relative w-full h-24 overflow-hidden">
                        <img
                          src={bannerImage}
                          alt={page.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-20 transition" />
                      </div>

                      {/* Profile image */}
                      <div className="absolute left-4 top-16 w-14 h-14">
                        <img
                          src={profileImage}
                          alt={page.name}
                          className="w-14 h-14 rounded-full border-4 border-white shadow-lg object-cover"
                        />
                      </div>

                      {/* Page Info */}
                      <div className="pt-8 pl-4 pr-4 pb-4 mt-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-semibold text-gray-800 truncate">
                              {page.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {formattedFollowers}
                            </p>
                          </div>
                          {/* Plus Icon Button */}
                          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 transition">
                            <Plus className="w-4 h-4 text-blue-600" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
            ) : (
              <p className="text-sm text-gray-500 text-center">
                Takip edebileceğin yeni sayfa bulunamadı.
              </p>
            )}
          </div>
        </div>

        {/* ---- HARİTANIZ ---- */}
        <div className="pb-6 mb-6 border-b border-gray-200">
          <h2 className="text-md font-semibold text-gray-800 mb-3">
            Haritanız
          </h2>
          <div className="flex items-center justify-center">
            <MapUserSmall />
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Konumunuz alınırken algoritma bazen sorun yaşayabilir.
          </p>
        </div>

        {/* ---- TAKVİM ---- */}
        <div className="pb-6 mb-6 border-b border-gray-200">
          <h2 className="text-md font-semibold text-gray-800 mb-3">Takvim</h2>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth() - 1,
                      1
                    )
                  )
                }
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="text-center font-semibold text-gray-800">
                {monthName} {currentYear}
              </div>
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth() + 1,
                      1
                    )
                  )
                }
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} className="rotate-180" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-xs text-center">
              {["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"].map((day) => (
                <div key={day} className="font-medium">
                  {day}
                </div>
              ))}
              {cells.map((cell, idx) =>
                cell ? (
                  <div
                    key={idx}
                    className={`relative p-1 rounded ${
                      cell === todayDate &&
                      currentMonth === todayMonth &&
                      currentYear === todayYear
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-800"
                    }`}
                  >
                    {cell}
                    {eventDates.includes(cell) && (
                      <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                ) : (
                  <div key={idx} className="p-1 rounded"></div>
                )
              )}
            </div>
          </div>
        </div>

        {/* ---- UPCOMING EVENTS with more details ---- */}
        {renderUpcomingEvents()}
      </aside>

      {showUpgradeModal && (
        <Upgrade onClose={() => setShowUpgradeModal(false)} />
      )}
    </>
  );
};

export default RightSidebar;

// src/components/PagesInfo.tsx
import React, { useState, useEffect } from "react";
import {
  Edit3,
  CheckCircle,
  Plus,
  UserCheck,
  UserPlus,
  UserMinus,
} from "lucide-react";
import PagesInfoCreateEventsPopup from "./PagesInfoCreateEventsPopup";
import {
  fetchMyPages,
  fetchEventsByPage,
  followPageAPI,
  unfollowPageAPI,
} from "../services/api";

/** Helper functions for date/time badges **/
function formatDateToDay(dateStr: string) {
  if (!dateStr) return "--";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
}

function formatDateToBadge(dateStr: string) {
  if (!dateStr) return "--";
  const d = new Date(dateStr);
  return d
    .toLocaleDateString("en-US", { month: "short", day: "numeric" })
    .toUpperCase();
}

function formatTimeToBadge(timeStr: string) {
  if (!timeStr) return "-";
  const parts = timeStr.split(":").map(Number);
  if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) {
    return timeStr; // return the original string or a fallback value
  }
  const [hour, minute] = parts;
  const h = hour % 12 || 12;
  const suffix = hour < 12 ? "AM" : "PM";
  return `${h}:${minute.toString().padStart(2, "0")} ${suffix}`;
}

interface PagesInfoProps {
  pageData: any;
  /** Returns the full URL for a given image path */
  getPageImageUrl: (imagePath: string) => string;
  user: any;
  toggleModal: () => void;
}

const PagesInfo: React.FC<PagesInfoProps> = ({
  pageData,
  getPageImageUrl,
  user,
  toggleModal,
}) => {
  const [activeTab, setActiveTab] = useState("Künye");
  const [showEventsPopup, setShowEventsPopup] = useState(false);
  const [myPages, setMyPages] = useState<any[]>([]);
  const [pageEvents, setPageEvents] = useState<any[]>([]);
  const [currentPageData, setCurrentPageData] = useState(pageData);
  const [isFollowing, setIsFollowing] = useState(false);

  // Fetch logged-in user's created pages (if needed for other purposes)
  useEffect(() => {
    const getMyPagesData = async () => {
      try {
        const pages = await fetchMyPages();
        setMyPages(pages);
      } catch (error) {
        console.error("Error fetching my pages:", error);
      }
    };
    getMyPagesData();
  }, []);

  // Fetch events for this page when "Etkinlikler" tab is active
  useEffect(() => {
    if (activeTab === "Etkinlikler") {
      const getEvents = async () => {
        try {
          const events = await fetchEventsByPage(currentPageData._id);
          setPageEvents(events);
        } catch (error) {
          console.error("Error fetching events for page:", error);
        }
      };
      getEvents();
    }
  }, [activeTab, currentPageData._id]);

  // Set follow status based on currentPageData.followers and the current user's id.
  useEffect(() => {
    if (currentPageData && currentPageData.followers) {
      setIsFollowing(currentPageData.followers.includes(user._id));
    }
  }, [currentPageData, user._id]);

  const getTabClasses = (tabName: string) =>
    `flex-1 text-center py-2 text-sm cursor-pointer ${
      activeTab === tabName
        ? "font-medium text-blue-600 border-b-2 border-blue-600"
        : "text-gray-600 hover:text-gray-800"
    }`;

  // Function to toggle follow/unfollow
  const handleFollowToggle = async () => {
    try {
      if (!isFollowing) {
        const response = await followPageAPI(currentPageData._id);
        setCurrentPageData(response.data.page);
        setIsFollowing(true);
      } else {
        const response = await unfollowPageAPI(currentPageData._id);
        setCurrentPageData(response.data.page);
        setIsFollowing(false);
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-300 overflow-hidden max-w-[700px] mx-auto">
      {/* BANNER SECTION */}
      <div className="relative">
        {currentPageData.bannerImage ? (
          <div
            className="h-48 bg-cover bg-center"
            style={{
              backgroundImage: `url(${encodeURI(getPageImageUrl(currentPageData.bannerImage))})`,
            }}
          />
        ) : (
          <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-500"></div>
        )}

        {/* Edit banner button */}
        {user.username === currentPageData.username && (
          <div className="absolute top-2 right-2">
            <button
              onClick={toggleModal}
              className="flex items-center bg-white rounded-full shadow-md hover:bg-gray-100 px-2 py-1"
            >
              <Edit3 className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600 ml-1">
                Edit your banner image
              </span>
            </button>
          </div>
        )}

        {/* PROFILE IMAGE */}
        <div className="absolute -bottom-10 left-6">
          {currentPageData.profileImage ? (
            <img
              src={encodeURI(getPageImageUrl(currentPageData.profileImage))}
              alt={`${currentPageData.name}'s page`}
              className="rounded-full border-4 border-white shadow-md h-28 w-28 object-cover"
            />
          ) : (
            <div className="rounded-full border-4 border-white shadow-md h-28 w-28 flex items-center justify-center bg-gray-400 text-white text-sm">
              No Image
            </div>
          )}
          {user.username === currentPageData.username && (
            <button
              onClick={toggleModal}
              className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
            >
              <Edit3 className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* PAGE MAIN INFO */}
      <div className="pt-12 pb-4 px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            {currentPageData.name}
          </h1>
          {/* Always show the follow/unfollow button regardless of ownership */}
          <button
            onClick={handleFollowToggle}
            className="flex items-center px-4 py-1 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition duration-300 text-sm"
          >
            {isFollowing ? (
              <>
                <UserMinus className="w-4 h-4 mr-1" />
                <span>Takipten Çık</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-1" />
                <span>Takip Et</span>
              </>
            )}
          </button>
          {/* Optionally, if you still want to show an edit button for owners,
              you can render it in a separate location or alongside the follow button. */}
        </div>
        <div className="flex items-center mt-1">
          <p className="text-gray-600 flex items-center text-sm">
            @{currentPageData.username}
            {currentPageData.isVerified && (
              <CheckCircle className="w-4 h-4 text-blue-600 ml-1" />
            )}
          </p>
        </div>
        <p className="text-gray-500 text-sm mt-2">
          {currentPageData.description}
        </p>

        {/* Render Followers Images */}
        {currentPageData.followers && (
          <div className="mt-6 flex items-center space-x-2 text-gray-800 text-sm font-medium">
            <span className="text-gray-500">
              {" "}
              {currentPageData.followers.length} Takipçi
            </span>
          </div>
        )}

        {/* Moderator Declaration */}
        {myPages.some((page) => page._id === currentPageData._id) && (
          <div className="mt-4 p-2 bg-blue-50 border border-blue-200 rounded flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-blue-600">
              Bu sayfa sizin tarafınızdan oluşturuldu. Moderatör olarak, sayfayı
              yönetebilirsiniz.
            </p>
          </div>
        )}
      </div>

      {/* TAB NAVIGATION */}
      <div className="px-4 border-b border-gray-200 flex">
        <button
          onClick={() => setActiveTab("Künye")}
          className={getTabClasses("Künye")}
        >
          Künye
        </button>
        <button
          onClick={() => setActiveTab("Gönderiler")}
          className={getTabClasses("Gönderiler")}
        >
          Gönderiler
        </button>
        <button
          onClick={() => setActiveTab("Hakkında")}
          className={getTabClasses("Hakkında")}
        >
          Hakkında
        </button>
        <button
          onClick={() => setActiveTab("Takipçiler")}
          className={getTabClasses("Takipçiler")}
        >
          Takipçiler
        </button>
        <button
          onClick={() => setActiveTab("Etkinlikler")}
          className={getTabClasses("Etkinlikler")}
        >
          Etkinlikler
        </button>
      </div>

      {/* TAB CONTENT */}
      <div className="p-4">
        {activeTab === "Künye" && (
          <div className="bg-gray-50 rounded-lg shadow-inner p-4 break-words">
            <h2 className="text-xl font-semibold mb-2">Künye</h2>
            <p className="text-sm text-gray-700">
              {currentPageData.description || "Sayfanın kısa bir özeti burada."}
            </p>
          </div>
        )}
        {activeTab === "Gönderiler" && (
          <div className="bg-gray-50 rounded-lg shadow-inner p-4 break-words">
            <h2 className="text-xl font-semibold mb-2">Gönderiler</h2>
            <p className="text-sm text-gray-700">
              Bu sayfaya ait gönderiler burada listelenir.
            </p>
          </div>
        )}
        {activeTab === "Hakkında" && (
          <div className="bg-gray-50 rounded-lg shadow-inner p-4 break-words space-y-2">
            <h2 className="text-xl font-semibold mb-2">Hakkında</h2>
            {currentPageData.category && (
              <p className="text-sm text-gray-800">
                <strong>Kategori:</strong> {currentPageData.category}
              </p>
            )}
            {currentPageData.website && (
              <p className="text-sm text-gray-800">
                <strong>Web Sitesi:</strong>{" "}
                <a
                  href={currentPageData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {currentPageData.website}
                </a>
              </p>
            )}
            {currentPageData.phone && (
              <p className="text-sm text-gray-800">
                <strong>Telefon:</strong> {currentPageData.phone}
              </p>
            )}
            {currentPageData.location && (
              <p className="text-sm text-gray-800">
                <strong>Konum:</strong> {currentPageData.location}
              </p>
            )}
            {currentPageData.businessHours && (
              <p className="text-sm text-gray-800">
                <strong>Çalışma Saatleri:</strong>{" "}
                {currentPageData.businessHours}
              </p>
            )}
            {currentPageData.additionalInfo && (
              <p className="text-sm text-gray-800">
                <strong>Ek Bilgi:</strong> {currentPageData.additionalInfo}
              </p>
            )}
          </div>
        )}
        {activeTab === "Takipçiler" && (
          <div className="bg-gray-50 rounded-lg shadow-inner p-4 break-words">
            <h2 className="text-xl font-semibold mb-2">Takipçiler</h2>
            <p className="text-sm text-gray-700">
              Bu sayfanın takipçileri burada görünecek.
            </p>
          </div>
        )}
        {activeTab === "Etkinlikler" && (
          <div>
            {myPages.some((page) => page._id === currentPageData._id) && (
              <div className="flex justify-center mb-4">
                <button
                  onClick={() => setShowEventsPopup(true)}
                  className="w-fit bg-white border border-blue-600 text-blue-600 text-sm px-3 py-1 rounded-full font-semibold hover:bg-blue-50 transition flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Etkinlik Oluştur
                </button>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              {pageEvents && pageEvents.length > 0 ? (
                pageEvents.map((event: any) => {
                  const eventImageUrl = event.photo?.startsWith("http")
                    ? event.photo
                    : `http://localhost:5001/uploads/${event.photo}`;
                  const dayOfWeek = formatDateToDay(event.date);
                  const startTimeBadge = formatTimeToBadge(event.startTime);
                  const leftBadge = `${dayOfWeek} ${startTimeBadge}`;
                  const rightBadge = formatDateToBadge(event.date);
                  return (
                    <div
                      key={event._id}
                      className="relative bg-white rounded-lg shadow p-4"
                    >
                      <div className="relative w-full h-40 rounded-md overflow-hidden mb-4">
                        <img
                          src={eventImageUrl}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                          {leftBadge}
                        </div>
                        <div className="absolute top-2 right-2 bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {rightBadge}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold mb-1">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        Location •{" "}
                        {event.locationLink
                          ? event.locationLink
                          : "Konum belirtilmedi"}
                      </p>
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3].map((num) => (
                          <img
                            key={num}
                            src={`https://i.pravatar.cc/32?img=${num + 10}`}
                            alt="attendee"
                            className="w-6 h-6 rounded-full border-2 border-white"
                          />
                        ))}
                        <span className="text-sm text-gray-500 ml-1">
                          +2 more
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-600 text-center col-span-2">
                  Etkinlik bulunamadı.
                </p>
              )}
            </div>
          </div>
        )}
        {showEventsPopup && (
          <PagesInfoCreateEventsPopup
            onClose={() => setShowEventsPopup(false)}
            pageId={currentPageData._id}
          />
        )}
      </div>
    </div>
  );
};

export default PagesInfo;

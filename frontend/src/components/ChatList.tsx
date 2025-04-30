import React, { useEffect, useState, useContext } from "react";
import {
  fetchFriends,
  fetchUserGroups,
  fetchAllUnreadMessages,
} from "../services/api";
import io from "socket.io-client";
import { FaUserPlus } from "react-icons/fa";
import { FiFilter, FiMoreVertical, FiMoreHorizontal } from "react-icons/fi";
import { Check, LucideSearch } from "lucide-react";
import { AuthUserContext } from "../context/AuthUserContext";
import UserOptionsPopup from "./UserOptionsPopup";
import FriendsPopup from "./FriendsPopup";
import Input from "../ui/Input";

const socket = io("http://localhost:5001");

export interface User {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  lastActive?: string;
}

interface ListItemBase {
  type: string;
}

export interface Friend extends ListItemBase {
  _id: string;
  name: string;
  username: string; // ✅ ADD THIS
  profileImage: string;
  lastActive: string;
  unreadCount?: number;
  lastChat?: string;
  lastChatTime?: string;
}

export interface Group extends ListItemBase {
  _id: string;
  name: string;
  image?: string;
  createdAt: string; // ✅ ADD THIS
  members: {
    _id: string;
    name: string;
    username: string;
    profileImage: string;
  }[]; // ✅ ADD THIS detailed structure
  unreadCount?: number;
  lastChatTime?: string;
  lastChat?: string;
}

interface ChatListProps {
  onSelectFriend: (friend: Friend) => void;
  onSelectGroup: (group: Group) => void;
}

interface Message {
  _id: string;
  sender: string | { _id: string; name: string; profileImage?: string } | null;
  receiver: string;
  groupId?: string;
  message: string;
  timestamp: string;
  seen: boolean;
}

/* 
  Helper to determine if the last message displayed for a friend was sent by
  the logged in user.
  For now, we assume it always returns true. (Update with your logic as needed.)
*/
const isLastMessageFromLoggedInUser = (friend: Friend): boolean => {
  return true;
};

const ChatList: React.FC<ChatListProps> = ({
  onSelectFriend,
  onSelectGroup,
}) => {
  // State variables
  const [friends, setFriends] = useState<Friend[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [combinedList, setCombinedList] = useState<(Friend | Group)[]>([]);
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isFriendsPopupVisible, setFriendsPopupVisible] = useState(false);

  const authContext = useContext(AuthUserContext);
  if (!authContext)
    throw new Error("AuthUserContext must be used within AuthUserProvider");
  const { user, loading } = authContext;

  // Helpers for image URLs
  const getProfileImageUrl = (imagePath: string) =>
    imagePath ? `http://localhost:5001/${imagePath}` : "/default-profile.png";
  const getGroupImage = (imagePath?: string) =>
    imagePath ? `http://localhost:5001${imagePath}` : "/default-group.png";

  // Data fetching for friends and groups
  useEffect(() => {
    const fetchData = async () => {
      try {
        const friendsList = await fetchFriends();
        const groupsList = await fetchUserGroups();
        setFriends(friendsList);
        setGroups(
          groupsList.map((group: Group) => ({
            ...group,
            type: "group",
            lastChatTime: group.lastChatTime || null,
            lastChat: group.lastChat || "",
          }))
        );
      } catch (error) {
        console.error("Arkadaşlar veya gruplar alınırken hata:", error);
      }
    };
    fetchData();
  }, []);

  // Fetch unread counts and update friends
  useEffect(() => {
    const loadUnreadCounts = async () => {
      try {
        const unreadMessages: Message[] = await fetchAllUnreadMessages();
        const counts: { [key: string]: number } = {};
        unreadMessages.forEach((msg) => {
          let senderId = "";
          if (typeof msg.sender === "string") senderId = msg.sender;
          else if (msg.sender && typeof msg.sender === "object")
            senderId = msg.sender._id;
          if (senderId) counts[senderId] = (counts[senderId] || 0) + 1;
        });
        setFriends((prev) =>
          prev.map((friend) => ({
            ...friend,
            unreadCount: counts[friend._id] || 0,
          }))
        );
      } catch (error) {
        console.error("Okunmamış mesajlar alınırken hata:", error);
      }
    };
    loadUnreadCounts();
    const interval = setInterval(loadUnreadCounts, 5000);
    return () => clearInterval(interval);
  }, []);

  // Socket listeners for real-time messages
  useEffect(() => {
    if (!user) return;
    socket.on("receiveMessage", (message: Message) => {
      if (message.groupId) {
        setGroups((prev) =>
          prev.map((group) => {
            if (group._id === message.groupId) {
              const newCount =
                group._id === selectedGroupId
                  ? 0
                  : (group.unreadCount || 0) + 1;
              return {
                ...group,
                lastChat: message.message,
                lastChatTime: message.timestamp,
                unreadCount: newCount,
              };
            }
            return group;
          })
        );
      } else if (typeof message.sender === "string") {
        setFriends((prev) =>
          prev.map((friend) => {
            if (friend._id === message.sender) {
              return {
                ...friend,
                lastChat: message.message,
                lastChatTime: message.timestamp,
                unreadCount: (friend.unreadCount || 0) + 1,
              };
            } else if (friend._id === message.receiver) {
              return {
                ...friend,
                lastChat: message.message,
                lastChatTime: message.timestamp,
              };
            }
            return friend;
          })
        );
      }
    });
    socket.on("updateLastMessage", (message: Message) => {
      if (message.groupId) {
        setGroups((prev) =>
          prev.map((group) => {
            if (group._id === message.groupId) {
              const newCount =
                group._id === selectedGroupId
                  ? 0
                  : (group.unreadCount || 0) + 1;
              return {
                ...group,
                lastChat: message.message,
                lastChatTime: message.timestamp,
                unreadCount: newCount,
              };
            }
            return group;
          })
        );
      } else if (typeof message.sender === "string") {
        setFriends((prev) =>
          prev.map((friend) => {
            if (
              friend._id === message.sender ||
              friend._id === message.receiver
            ) {
              return {
                ...friend,
                lastChat: message.message,
                lastChatTime: message.timestamp,
                unreadCount:
                  friend._id === message.sender
                    ? (friend.unreadCount || 0) + 1
                    : friend.unreadCount,
              };
            }
            return friend;
          })
        );
      }
    });
    return () => {
      socket.off("receiveMessage");
      socket.off("updateLastMessage");
    };
  }, [user, selectedGroupId]);

  // Create combined list and sort by lastChatTime
  useEffect(() => {
    const filteredFriends = friends.filter((f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredGroups = groups.filter((g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const combined = [
      ...filteredFriends.map((f) => ({ ...f, type: "friend" })),
      ...filteredGroups.map((g) => ({ ...g, type: "group" })),
    ];

    combined.sort((a, b) => {
      const timeA = a.lastChatTime ? new Date(a.lastChatTime).getTime() : 0;
      const timeB = b.lastChatTime ? new Date(b.lastChatTime).getTime() : 0;
      return timeB - timeA;
    });

    setCombinedList(combined);
  }, [searchQuery, friends, groups]);

  // Handlers for selecting friend or group
  const handleSelectFriend = (friend: Friend) => {
    setSelectedFriendId(friend._id);
    setSelectedGroupId(null);
    onSelectFriend(friend);
    setFriends((prev) =>
      prev.map((f) => (f._id === friend._id ? { ...f, unreadCount: 0 } : f))
    );
  };

  const handleSelectGroup = (group: Group) => {
    setSelectedGroupId(group._id);
    setSelectedFriendId(null);
    onSelectGroup(group);
    setGroups((prev) =>
      prev.map((g) => (g._id === group._id ? { ...g, unreadCount: 0 } : g))
    );
  };

  // Handler for Friends Popup
  const handleOpenFriendsPopup = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    // Set the popup position to appear 20px below the friends button
    setPopupPosition({ top: rect.bottom + 20, left: rect.left });
    setFriendsPopupVisible(true);
  };

  const handleCloseFriendsPopup = () => setFriendsPopupVisible(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-xs text-gray-600 animate-pulse">Yükleniyor...</p>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-xs text-gray-600">Kullanıcı giriş yapmamış.</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-80 flex flex-col bg-white shadow-md border-r border-gray-200">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between rounded-t-xl border-b border-gray-200">
        {/* Left: Profile Info */}
        <div className="flex items-center">
          <img
            src={getProfileImageUrl(user.profileImage || "")}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100 shadow-md"
          />
          <div className="ml-3 leading-tight">
            <h2 className="text-sm font-semibold text-gray-800">{user.name}</h2>
            <p className="text-[11px] text-blue-600">@{user.username}</p>
          </div>
        </div>

        {/* Right: Options Button */}
        <div className="relative">
          <button
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setPopupPosition({ top: rect.bottom, left: rect.left });
              setPopupVisible((prev) => !prev);
            }}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-200"
          >
            <FiMoreVertical size={18} className="text-gray-600" />
          </button>

          {/* Options Popup */}
          <UserOptionsPopup
            isVisible={isPopupVisible}
            position={popupPosition}
            onClose={() => setPopupVisible(false)}
          />
        </div>
      </div>

      {/* Search & Add Friend */}
      <div className="px-4 py-2 mt-3 flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            id="search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Sohbet ara..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition placeholder-gray-400 bg-gray-50 hover:bg-white"
          />
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <LucideSearch className="text-gray-500" size={16} />
          </div>
        </div>
        {/* Add Friend Button */}
        <button
          onClick={handleOpenFriendsPopup}
          className="flex items-center justify-center w-9 h-9 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-600 transition"
          title="Arkadaş Ekle"
        >
          <FaUserPlus size={16} />
        </button>

        {/* Friends Popup */}
        {isFriendsPopupVisible && (
          <FriendsPopup
            friends={friends}
            onClose={handleCloseFriendsPopup}
            onSelectFriend={handleSelectFriend}
            position={popupPosition}
          />
        )}
      </div>

      {/* Section Title */}
      <div className="px-4 py-2">
        <h3 className="text-[10px] font-semibold text-gray-700 uppercase tracking-wider">
          Sohbetler
        </h3>
      </div>

      {/* Combined List of Friends + Groups */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {combinedList.length > 0 ? (
          <ul className="space-y-1">
            {combinedList.map((item) => {
              if (item.type === "friend") {
                const friendItem = item as Friend;
                const unreadCount = friendItem.unreadCount || 0;
                return (
                  <li
                    key={friendItem._id}
                    onClick={() => handleSelectFriend(friendItem)}
                    className={`group relative flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors ${
                      friendItem._id === selectedFriendId
                        ? "bg-blue-50 border-l-4 border-blue-600"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {/* Friend Content */}
                    <div className="flex items-center">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                        <img
                          src={getProfileImageUrl(friendItem.profileImage)}
                          alt={`${friendItem.name}'s profile`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="ml-3 flex flex-col">
                        <p className="text-sm font-semibold text-gray-800">
                          {friendItem.name}
                        </p>
                        <p className="text-xs text-gray-500 max-w-[180px] truncate">
                          {friendItem.lastChat || "Henüz mesaj yok"}
                        </p>
                      </div>
                    </div>

                    {/* Unread Badge */}
                    {unreadCount > 0 && (
                      <div className="ml-2 w-5 h-5 bg-blue-500 text-white text-xs font-semibold flex items-center justify-center rounded-full">
                        {unreadCount}
                      </div>
                    )}
                  </li>
                );
              } else if (item.type === "group") {
                const groupItem = item as Group;
                const unreadCount = groupItem.unreadCount || 0;
                return (
                  <li
                    key={groupItem._id}
                    onClick={() => handleSelectGroup(groupItem)}
                    className={`group relative flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors ${
                      groupItem._id === selectedGroupId
                        ? "bg-blue-50 border-l-4 border-blue-600"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {/* Group Content */}
                    <div className="flex items-center">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                        <img
                          src={getGroupImage(groupItem.image)}
                          alt={`${groupItem.name} group`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="ml-3 flex flex-col">
                        <p className="text-sm font-semibold text-gray-800">
                          {groupItem.name}
                        </p>
                      </div>
                    </div>

                    {/* Unread Badge */}
                    {unreadCount > 0 && (
                      <div className="ml-2 w-5 h-5 bg-blue-500 text-white text-xs font-semibold flex items-center justify-center rounded-full">
                        {unreadCount}
                      </div>
                    )}
                  </li>
                );
              }
              return null;
            })}
          </ul>
        ) : (
          <div className="flex justify-center py-6 text-gray-400 text-sm">
            Sonuç bulunamadı
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;

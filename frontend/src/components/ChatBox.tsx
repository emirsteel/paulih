/********************************************************************
 * ChatBox.tsx
 *
 * - Mesajlarda reaksiyon balonları, hover aksiyonları, yanıt özelliği,
 *   okuyucunun vurgulanması ve daha fazlası sağlanmıştır.
 *
 * (Türkçe metinler kullanılmıştır.)
 ********************************************************************/

import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  fetchConversation,
  markMessagesAsSeen,
  sendMessage,
  reactToMessage,
  fetchBlockedUsers,
  fetchBlockedByOthers,
} from "../services/api";
import io from "socket.io-client";
import {
  Search,
  MoreVertical,
  Send,
  Plus,
  FileText,
  Image as LucideImage,
  BarChart2,
  Smile,
  X,
  MoreHorizontal,
  CornerUpLeft,
  Download,
  CornerUpRight,
  Check,
  Menu,
  ArrowLeftFromLine,
} from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import Modal from "react-modal";
import ImagePopupForChatBox from "./ImagePopupForChatBox";
import ChatBoxSendFiles from "./ChatBoxSendFiles";
import ChatBoxMessageEmoji from "./ChatBoxMessageEmoji";
import ChatBoxRemoveEmojis from "./ChatBoxRemoveEmojis";
import ChatBoxReplyMessage from "./ChatBoxReplyMessage";
import RightSidebar from "./ChatRightSidebar";
import ChatList from "./ChatList";

Modal.setAppElement("#root");

const TYPING_TIMEOUT = 2000;

// Yardımcı Fonksiyonlar
const getFileExtension = (filename: string): string => {
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : "";
};

const getFileTypeLabel = (filename: string): string => {
  const ext = getFileExtension(filename);
  if (ext === "PDF") return "PDF Belgesi";
  if (ext === "XLS" || ext === "XLSX") return "Excel Tablosu";
  if (ext === "DOC" || ext === "DOCX") return "Word Belgesi";
  if (ext === "PPT" || ext === "PPTX") return "PowerPoint Sunumu";
  return ext || "Dosya";
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  else if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  else if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

const getFileSizeLabel = (size?: number): string =>
  size !== undefined ? formatFileSize(size) : "Bilinmeyen boyut";

const renderFileIcon = (filename: string, isSender: boolean) => {
  const ext = getFileExtension(filename);
  switch (ext) {
    case "PDF":
      return (
        <span
          className={`text-xs font-bold ${isSender ? "text-red-600" : "text-red-500"}`}
        >
          PDF
        </span>
      );
    case "DOC":
    case "DOCX":
      return (
        <span
          className={`text-xs font-bold ${isSender ? "text-blue-600" : "text-blue-500"}`}
        >
          DOC
        </span>
      );
    case "XLS":
    case "XLSX":
      return (
        <span
          className={`text-xs font-bold ${isSender ? "text-green-600" : "text-green-500"}`}
        >
          XLS
        </span>
      );
    case "PPT":
    case "PPTX":
      return (
        <span
          className={`text-xs font-bold ${isSender ? "text-orange-600" : "text-orange-500"}`}
        >
          PPT
        </span>
      );
    default:
      return (
        <FileText
          size={16}
          className={`${isSender ? "text-blue-600" : "text-gray-500"}`}
        />
      );
  }
};

const getReactionBubbleClass = (isSender: boolean) =>
  isSender
    ? "w-6 h-6 text-sm flex items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-700 shadow-sm"
    : "w-6 h-6 text-sm flex items-center justify-center rounded-full border border-gray-300 bg-gray-50 text-gray-700 shadow-sm";

const getBubbleClass = (isSender: boolean) =>
  isSender
    ? "bg-gray-100 text-gray-900 rounded-xl"
    : "bg-white border border-gray-200 text-gray-800 rounded-xl";

const isImageFile = (url: string): boolean => {
  const ext = url.split(".").pop()?.toUpperCase();
  return ["PNG", "JPG", "JPEG", "GIF"].includes(ext || "");
};

const linkify = (text: string): React.ReactNode => {
  const urlRegex =
    /(\b(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/\S*)?)/gi;
  const parts = text.split(urlRegex);
  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      let href = part;
      if (!href.startsWith("http://") && !href.startsWith("https://")) {
        href = "https://" + href;
      }
      return (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-blue-600"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

// Profil resmi ve grup resmi yardımcı fonksiyonları
const getProfileImageUrl = (imagePath: string): string =>
  imagePath ? `http://localhost:5001/${imagePath}` : "/default-profile.png";

const getGroupImage = (imagePath?: string): string =>
  imagePath ? `http://localhost:5001${imagePath}` : "/default-group.png";

interface ChatBoxProps {
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
    members: {
      _id: string;
      name: string;
      username: string;
      profileImage: string;
    }[];
    createdAt: string;
  } | null;
  onSelectFriend?: (friend: {
    _id: string;
    name: string;
    username: string;
    profileImage: string;
  }) => void;
  onSelectGroup?: (group: {
    _id: string;
    name: string;
    image?: string;
    members: {
      _id: string;
      name: string;
      username: string;
      profileImage: string;
    }[];
    createdAt: string;
  }) => void;
  showChatList: boolean;
  setShowChatList: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Reaction {
  user: string;
  emoji: string;
  timestamp: string;
}

interface Message {
  _id: string;
  sender: string;
  receiver?: string;
  groupId?: string;
  message: string;
  image?: string;
  audio?: string;
  file?: string;
  fileSize?: number;
  description?: string;
  timestamp: string;
  seen: boolean;
  reactions?: Reaction[];
  repliedTo?: string;
}

// --- ChatBox Component ---
const ChatBox: React.FC<ChatBoxProps> = ({
  friend,
  group,
  onSelectFriend = () => {},
  onSelectGroup = () => {},
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [showFilePopup, setShowFilePopup] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [fullImageUrl, setFullImageUrl] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [reactionPopupMessageId, setReactionPopupMessageId] = useState<
    string | null
  >(null);
  const [removeEmojisMessageId, setRemoveEmojisMessageId] = useState<
    string | null
  >(null);
  const [removeEmojisReactions, setRemoveEmojisReactions] = useState<
    Reaction[]
  >([]);
  const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(
    null
  );

  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const messageSound = useRef(new Audio("/message.mp3"));
  const typingTimeoutRef = useRef<any>(null);

  const userId = localStorage.getItem("userId");

  const [isBlockedBetweenUsers, setIsBlockedBetweenUsers] = useState(false);

  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showChatList, setShowChatList] = useState(false);

  // Belirli bir mesaja kaydır ve vurgula
  const scrollToMessage = (messageId: string) => {
    const targetElement = document.getElementById(`message-${messageId}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
      targetElement.classList.add("animate-pulse");
      setTimeout(() => {
        targetElement.classList.remove("animate-pulse");
      }, 2000);
    }
  };

  useEffect(() => {
    const checkIfBlocked = async () => {
      if (!friend || !userId) {
        setIsBlockedBetweenUsers(false); // <= BURAYA BAK!
        return;
      }

      try {
        const [myBlockedList, blockedByOthersList] = await Promise.all([
          fetchBlockedUsers(userId),
          fetchBlockedByOthers(userId),
        ]);

        const myBlockedArray = Array.isArray(myBlockedList)
          ? myBlockedList
          : [];
        const blockedByOthersArray = Array.isArray(blockedByOthersList)
          ? blockedByOthersList
          : [];

        const iBlockedThisFriend = myBlockedArray.some(
          (block: any) => block.blockedId === friend._id
        );
        const thisFriendBlockedMe = blockedByOthersArray.some(
          (block: any) => block.blockerId === friend._id
        );

        setIsBlockedBetweenUsers(iBlockedThisFriend || thisFriendBlockedMe);
      } catch (error) {
        console.error("Blok durumu kontrol edilemedi:", error);
        setIsBlockedBetweenUsers(false); // Hata olursa da güvenli olsun
      }
    };

    // Her seferinde sıfırlayarak başla!
    setIsBlockedBetweenUsers(false);
    checkIfBlocked();
  }, [friend, userId]);

  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  useEffect(() => {
    socketRef.current = io("http://localhost:5001");

    socketRef.current.on("receiveMessage", (message: Message) => {
      if (message.sender === userId) return;
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    socketRef.current.on("receiveReaction", (updatedMessage: Message) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === updatedMessage._id ? updatedMessage : msg
        )
      );
    });

    socketRef.current.on("userTyping", ({ userId: typingUserId }) => {
      if (typingUserId !== userId) {
        setTypingUsers((prev) =>
          !prev.includes(typingUserId) ? [...prev, typingUserId] : prev
        );
      }
    });

    socketRef.current.on("userStopTyping", ({ userId: typingUserId }) => {
      setTypingUsers((prev) => prev.filter((id) => id !== typingUserId));
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [userId, scrollToBottom]);

  useEffect(() => {
    if (!socketRef.current) return;
    if (friend) {
      socketRef.current.emit("join", userId);
    } else if (group) {
      socketRef.current.emit("join", group._id);
    }
  }, [friend, group, userId]);

  useEffect(() => {
    const getConversation = async () => {
      if (!friend && !group) return;
      try {
        const conversation = friend
          ? await fetchConversation(friend._id)
          : await fetchConversation(group!._id);
        setMessages(conversation);
        scrollToBottom();
      } catch (error) {
        console.error("Konuşma getirilirken hata:", error);
      }
    };
    getConversation();
  }, [friend, group, scrollToBottom]);

  useEffect(() => {
    if (friend && socketRef.current) {
      socketRef.current.emit("markAsSeen", {
        senderId: friend._id,
        receiverId: userId,
      });
      markMessagesAsSeen(friend._id);
    }
  }, [friend, messages, userId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setShowAddPopup(false);
      }
    };
    if (showAddPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAddPopup]);

  const toggleAddPopup = () => {
    setShowAddPopup((prev) => !prev);
  };

  const startTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      const roomId = friend ? userId : group?._id;
      socketRef.current.emit("typing", { roomId, userId });
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, TYPING_TIMEOUT);
  };

  const stopTyping = () => {
    if (isTyping) {
      setIsTyping(false);
      const roomId = friend ? userId : group?._id;
      socketRef.current.emit("stopTyping", { roomId, userId });
    }
  };

  const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 10);
      setSelectedImages(files);
      setShowImagePopup(true);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setSelectedImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const closeImagePopup = () => {
    setSelectedImages([]);
    setShowImagePopup(false);
  };

  const handleImageUpload = async (imagesToSend: File[]) => {
    if (imagesToSend.length === 0) return;

    const formData = new FormData();
    if (friend) {
      formData.append("receiverId", friend._id);
    } else if (group) {
      formData.append("groupId", group._id);
    }

    imagesToSend.forEach((img) => {
      formData.append("images", img);
    });

    formData.append("message", " "); // no dummy text needed

    try {
      const response = await fetch("http://localhost:5001/api/chat/messages", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Resim gönderilemedi");
      }

      const newMessage = await response.json();
      setMessages((prev) => [...prev, newMessage]);
      messageSound.current.play();
      setSelectedImages([]); // clear
      closeImagePopup();
      scrollToBottom();
    } catch (error) {
      console.error("Resimler yüklenirken hata:", error);
    }
  };

  const handleFileSent = (newMessage: Message) => {
    setMessages((prev) => [...prev, newMessage]);
    scrollToBottom();
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    stopTyping();

    if (inputMessage.trim() === "") return;

    if (!userId || (!friend && !group)) return;

    if (isBlockedBetweenUsers) {
      console.warn("Bu kullanıcıya mesaj gönderemezsiniz. Engellenmişsiniz.");
      return;
    }

    const senderId = userId;
    const messageData: any = friend
      ? { senderId, receiverId: friend._id, message: inputMessage }
      : group
        ? { senderId, groupId: group._id, message: inputMessage }
        : null;

    if (replyingToMessage) {
      messageData.repliedTo = replyingToMessage._id;
    }

    if (!messageData) return;

    try {
      const newMessage = await sendMessage(messageData);
      setMessages((prev) => [...prev, newMessage]);
      setInputMessage("");
      messageSound.current.play();
      setReplyingToMessage(null);
      scrollToBottom();
    } catch (error) {
      console.error("Mesaj gönderilirken hata:", error);
    }
  };

  const handleEmojiClick = (emojiObject: any) => {
    setInputMessage((prev) => prev + emojiObject.emoji);
    startTyping();
  };

  if (!friend && !group) {
    const isMobile = window.innerWidth < 640;

    return isMobile ? (
      <div className="h-screen w-full">
        <ChatList
          onSelectFriend={onSelectFriend}
          onSelectGroup={onSelectGroup}
        />
      </div>
    ) : (
      <div className="flex items-center bg-white justify-center h-screen w-full flex flex-col">
        <p className="text-gray-500">
          Bir arkadaş veya grup seçerek sohbet etmeye başlayın.
        </p>
      </div>
    );
  }

  const inputPlaceholder = replyingToMessage ? "Yanıtla..." : "Mesaj yazın...";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const messagesByDate = messages.reduce(
    (acc: Record<string, Message[]>, msg) => {
      const dateLabel = formatDate(msg.timestamp);
      if (!acc[dateLabel]) acc[dateLabel] = [];
      acc[dateLabel].push(msg);
      return acc;
    },
    {}
  );

  const handleDownloadFile = async (filePath: string, fileName: string) => {
    try {
      const response = await fetch(`http://localhost:5001/uploads/${filePath}`);
      if (!response.ok) throw new Error("Ağ yanıtı uygun değil");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "indir";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Dosya indirilirken hata:", error);
    }
  };

  const getRepliedMessage = (msg: Message) => {
    if (!msg.repliedTo) return null;
    return messages.find((m) => m._id === msg.repliedTo) || null;
  };

  const handleReply = (msg: Message) => {
    setReplyingToMessage(msg);
  };

  const handleCancelReply = () => {
    setReplyingToMessage(null);
  };

  const getSenderName = (senderId: string): string => {
    if (senderId === userId) return "Sen";
    if (friend && friend._id === senderId) return friend.name;
    if (group) {
      const member = group.members.find((m) => m._id === senderId);
      if (member) {
        return member.profileImage || "Grup üyesi";
      }
    }
    return "Bilinmiyor";
  };

  interface ChatBoxHeaderProps extends ChatBoxProps {
    onToggleSidebar: () => void;
    showChatList: boolean;
    setShowChatList: React.Dispatch<React.SetStateAction<boolean>>;
  }

  const ChatBoxHeader: React.FC<ChatBoxHeaderProps> = ({
    friend,
    group,
    onToggleSidebar,
  }) => {
    return (
      <div className="px-4 py-2 sm:py-3 bg-white border-b border-gray-200 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          {/* Back to chatlist button for mobile */}
          <button
            onClick={() => setShowChatList(true)}
            className="block sm:hidden p-2 rounded-md hover:bg-gray-100 transition"
          >
            <ArrowLeftFromLine className="w-5 h-5 text-gray-600" />
          </button>

          {/* Profile Section */}
          {friend ? (
            <>
              <img
                src={getProfileImageUrl(friend.profileImage)}
                alt={friend.name}
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
                loading="lazy"
              />
              <div className="flex flex-col">
                <h2 className="text-sm font-semibold text-gray-800">
                  {friend.name}
                </h2>
                <p className="text-xs text-gray-500">@{friend.username}</p>
              </div>
            </>
          ) : group ? (
            <>
              <img
                src={getGroupImage(group.image)}
                alt={group.name}
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
                loading="lazy"
              />
              <div className="flex flex-col">
                <h2 className="text-sm font-semibold text-gray-800">
                  {group.name}
                </h2>
              </div>
            </>
          ) : null}
        </div>

        {/* Sidebar open button (for mobile) */}
        <button
          onClick={onToggleSidebar}
          className="block lg:hidden p-2 rounded-md hover:bg-gray-100 transition"
        >
          <Menu className="w-6 h-6 text-gray-600" />
        </button>

        {/* Mobile Sidebar */}
        {showMobileSidebar && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setShowMobileSidebar(false)}
            ></div>

            {/* Sidebar Content */}
            <div className="fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-lg transition-transform transform translate-x-0">
              <div className="p-4">
                <RightSidebar friend={friend} group={group} />
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // Then memoize
  const MemoizedChatBoxHeader = React.memo(ChatBoxHeader);

  return (
    <>
      {showChatList && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
            onClick={() => setShowChatList(false)}
          ></div>

          {/* Slide-in ChatList drawer */}
          <div className="fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-lg transition-transform transform translate-x-0 sm:hidden">
            <div className="overflow-y-auto h-full">
              <ChatList
                onSelectFriend={(friend) => {
                  onSelectFriend?.(friend);
                  setShowChatList(false);
                }}
                onSelectGroup={(group) => {
                  onSelectGroup?.(group);
                  setShowChatList(false);
                }}
              />
            </div>
          </div>
        </>
      )}

      <div className="h-screen w-full flex flex-col bg-white">
        <div className="flex flex-col h-full">
          {/* Header */}
          <MemoizedChatBoxHeader
            friend={friend}
            group={group}
            onToggleSidebar={() => setShowMobileSidebar(true)}
            showChatList={showChatList}
            setShowChatList={setShowChatList}
          />

          {/* Sohbet mesaj alanı */}
          <div className="flex-1 overflow-y-auto px-1 pt-2 bg-white rounded-t-lg">
            {Object.keys(messagesByDate).map((dateKey: string) => {
              const dailyMessages = messagesByDate[dateKey];
              return (
                <div key={dateKey} className="mb-6">
                  <div className="flex justify-center mb-4">
                    <div className="px-3 py-1 text-xs text-gray-500 bg-white border border-gray-200 rounded-full">
                      {dateKey}
                    </div>
                  </div>
                  {dailyMessages.map((msg: Message, index: number) => {
                    const isSender = msg.sender === userId;
                    const bubbleWrapperClass = isSender ? "mr-8" : "ml-8";
                    const showProfile =
                      !isSender &&
                      (index === dailyMessages.length - 1 ||
                        dailyMessages[index + 1]?.sender !== msg.sender);
                    const extraMargin =
                      msg.reactions && msg.reactions.length > 0 ? "10px" : "0";
                    const repliedMsg = getRepliedMessage(msg);

                    return (
                      <div
                        key={msg._id}
                        id={`message-${msg._id}`}
                        className={`flex items-end my-1 ${isSender ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[50%] md:max-w-sm lg:max-w-md relative ${bubbleWrapperClass}`}
                          style={{ marginBottom: extraMargin }}
                        >
                          {msg.file ? (
                            <div
                              className={`group mt-2 p-4 rounded-md shadow-sm relative ${
                                isSender
                                  ? "bg-gray-100 text-gray-900"
                                  : "bg-white border border-gray-200 text-gray-800"
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                <div
                                  className={`w-8 h-8 flex items-center justify-center rounded ${
                                    isSender ? "bg-gray-200" : "bg-gray-100"
                                  }`}
                                >
                                  {renderFileIcon(msg.message, isSender)}
                                </div>
                                <p
                                  className="text-sm font-semibold truncate"
                                  style={{ maxWidth: "150px" }}
                                  title={msg.message}
                                >
                                  {msg.message}
                                </p>
                              </div>
                              <p
                                className={`mt-1 text-xs ${isSender ? "text-gray-700" : "text-gray-600"}`}
                              >
                                {msg.fileSize
                                  ? `${(msg.fileSize / 1024).toFixed(1)} KB`
                                  : "Bilinmeyen boyut"}{" "}
                                · {getFileExtension(msg.message).toLowerCase()}
                              </p>
                              <p
                                className="mt-1 text-xs underline cursor-pointer hover:text-blue-600"
                                onClick={() =>
                                  setFullImageUrl(
                                    `http://localhost:5001/uploads/${msg.file}`
                                  )
                                }
                              >
                                İncele
                              </p>
                              {msg.description && (
                                <p
                                  className={`mt-2 pt-2 text-sm border-t ${
                                    isSender
                                      ? "border-gray-200"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {msg.description}
                                </p>
                              )}
                              <button
                                onClick={() =>
                                  handleDownloadFile(msg.file!, msg.message)
                                }
                                className={`mt-3 w-full flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium focus:outline-none transition ${
                                  isSender
                                    ? "bg-gray-200 hover:bg-gray-300 text-gray-800"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                }`}
                                title="Dosyayı indir"
                              >
                                <Download size={16} className="mr-2" />
                                İndir
                              </button>
                              <div className="absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 flex flex-row space-x-2 opacity-0 group-hover:opacity-100 transition">
                                <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200">
                                  <MoreHorizontal size={16} />
                                </button>
                                <button
                                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handleReply(msg);
                                  }}
                                >
                                  <CornerUpLeft size={16} />
                                </button>
                                <button
                                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setReactionPopupMessageId((prev) =>
                                      prev === msg._id ? null : msg._id
                                    );
                                  }}
                                >
                                  <Smile size={16} />
                                </button>
                              </div>
                              {msg.reactions && msg.reactions.length > 0 && (
                                <div
                                  className={`absolute bottom-0 translate-y-1/2 flex space-x-1 ${isSender ? "right-2" : "left-2"}`}
                                >
                                  {msg.reactions.map((reaction, i) => (
                                    <div
                                      key={`${reaction.user}-${i}`}
                                      className={getReactionBubbleClass(
                                        isSender
                                      )}
                                      onClick={() => {
                                        setRemoveEmojisMessageId(msg._id);
                                        setRemoveEmojisReactions(
                                          msg.reactions!
                                        );
                                      }}
                                    >
                                      {reaction.emoji}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div
                              className={`group p-3 relative break-words whitespace-pre-wrap leading-relaxed ${getBubbleClass(isSender)}`}
                              style={{ marginBottom: extraMargin }}
                            >
                              {msg.repliedTo && repliedMsg && (
                                <div
                                  className="mb-2 px-3 py-2 rounded-md cursor-pointer"
                                  style={{ borderLeft: "4px solid #3762E4" }}
                                  onClick={() =>
                                    scrollToMessage(repliedMsg._id)
                                  }
                                >
                                  <p className="font-semibold text-xs text-blue-600 mb-1 flex items-center">
                                    <CornerUpRight size={14} className="mr-1" />
                                    Yanıtlanan:
                                  </p>
                                  <p className="font-semibold text-sm text-black mb-1">
                                    {getSenderName(repliedMsg.sender)}
                                  </p>
                                  <p className="text-sm text-black whitespace-pre-wrap">
                                    {repliedMsg.message || "[İçerik yok]"}
                                  </p>
                                </div>
                              )}
                              {msg.message && !msg.image && (
                                <p className="text-sm">
                                  {linkify(msg.message)}
                                </p>
                              )}
                              {msg.image && (
                                <img
                                  src={`http://localhost:5001/uploads/${msg.image}`}
                                  alt="Gönderilen"
                                  className="mt-2 rounded-lg w-full max-w-full object-cover cursor-pointer border"
                                  onClick={() =>
                                    setFullImageUrl(
                                      `http://localhost:5001/uploads/${msg.image}`
                                    )
                                  }
                                />
                              )}
                              <div
                                className={`absolute top-1/2 ${
                                  isSender
                                    ? "left-0 -translate-x-full"
                                    : "right-0 translate-x-full"
                                } -translate-y-1/2 flex flex-row space-x-2 opacity-0 group-hover:opacity-100 transition`}
                              >
                                <button
                                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    handleReply(msg);
                                  }}
                                >
                                  <CornerUpLeft size={16} />
                                </button>
                                <button
                                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setReactionPopupMessageId((prev) =>
                                      prev === msg._id ? null : msg._id
                                    );
                                  }}
                                >
                                  <Smile size={16} />
                                </button>
                              </div>
                              {msg.reactions && msg.reactions.length > 0 && (
                                <div
                                  className={`absolute bottom-0 translate-y-1/2 flex space-x-1 ${isSender ? "right-2" : "left-2"}`}
                                >
                                  {msg.reactions.map((reaction, i) => (
                                    <div
                                      key={`${reaction.user}-${i}`}
                                      className={getReactionBubbleClass(
                                        isSender
                                      )}
                                      onClick={() => {
                                        setRemoveEmojisMessageId(msg._id);
                                        setRemoveEmojisReactions(
                                          msg.reactions!
                                        );
                                      }}
                                    >
                                      {reaction.emoji}
                                    </div>
                                  ))}
                                </div>
                              )}
                              {reactionPopupMessageId === msg._id && (
                                <ChatBoxMessageEmoji
                                  isSender={isSender}
                                  onClose={() =>
                                    setReactionPopupMessageId(null)
                                  }
                                  onEmojiSelect={(emoji) => {
                                    reactToMessage({
                                      messageId: msg._id,
                                      emoji,
                                    })
                                      .then((updatedMessage) => {
                                        setMessages((prev) =>
                                          prev.map((m) =>
                                            m._id === updatedMessage._id
                                              ? updatedMessage
                                              : m
                                          )
                                        );
                                      })
                                      .catch((err) =>
                                        console.error(
                                          "Reaksiyon gönderilemedi",
                                          err
                                        )
                                      );
                                  }}
                                />
                              )}
                            </div>
                          )}

                          {!msg.file &&
                            (index === dailyMessages.length - 1 ||
                              dailyMessages[index + 1]?.sender !==
                                msg.sender) && (
                              <div className="mt-1 flex items-center space-x-1">
                                {!isSender && showProfile && friend && (
                                  <img
                                    src={`http://localhost:5001/${friend.profileImage}`}
                                    alt="Profil"
                                    className="w-8 h-8 rounded-full object-cover mr-2"
                                  />
                                )}
                                <p className="text-xs text-gray-400">
                                  {new Date(msg.timestamp).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    }
                                  )}
                                </p>
                                {isSender && (
                                  <>
                                    <span className="text-gray-400">·</span>
                                    <span
                                      className={`text-xs ${msg.seen ? "text-blue-500" : "text-gray-400"}`}
                                    >
                                      {msg.seen ? "Görüldü" : "Gönderildi"}
                                    </span>
                                  </>
                                )}
                              </div>
                            )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {replyingToMessage && (
            <ChatBoxReplyMessage
              originalMessage={replyingToMessage}
              onCancel={handleCancelReply}
            />
          )}

          {isBlockedBetweenUsers ? (
            <div
              className="relative px-4 py-3 bg-white border-t border-gray-200 flex items-center justify-center text-sm text-red-500 font-semibold"
              style={{ height: "60px" }}
            >
              Bu kullanıcı tarafından engellenmiş veya bu kullanıcıyı
              engellemişsiniz. Mesaj gönderemezsiniz.
            </div>
          ) : (
            <form
              onSubmit={handleSendMessage}
              className="relative px-4 py-3 bg-white border-t border-gray-200 flex items-center space-x-2"
              style={{ height: "60px" }}
            >
              <div className="relative" ref={popupRef}>
                <button
                  type="button"
                  disabled={isBlockedBetweenUsers}
                  onClick={toggleAddPopup}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                    isBlockedBetweenUsers
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                  }`}
                >
                  <Plus size={18} />
                </button>

                {showAddPopup && !isBlockedBetweenUsers && (
                  <div className="absolute bottom-full mb-2 left-0 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-2 space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded">
                      <LucideImage size={16} className="text-gray-600" />
                      <span className="text-sm text-gray-700">
                        Resim Gönder
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelection}
                        className="hidden"
                        multiple
                      />
                    </label>

                    <button
                      className="flex items-center space-x-2 w-full text-left hover:bg-gray-100 p-2 rounded"
                      onClick={() => {
                        setShowFilePopup(true);
                        setShowAddPopup(false);
                      }}
                    >
                      <FileText size={16} className="text-gray-600" />
                      <span className="text-sm text-gray-700">
                        Dosya Gönder
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  id="type-message"
                  className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-0 transition text-sm disabled:bg-gray-100"
                  placeholder={
                    isBlockedBetweenUsers
                      ? "Mesaj gönderemezsiniz"
                      : inputPlaceholder
                  }
                  value={inputMessage}
                  disabled={isBlockedBetweenUsers}
                  onChange={(e) => {
                    setInputMessage(e.target.value);
                    startTyping();
                  }}
                />
                <label htmlFor="type-message" className="sr-only">
                  {inputPlaceholder}
                </label>

                <button
                  type="submit"
                  disabled={isBlockedBetweenUsers}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition ${
                    isBlockedBetweenUsers
                      ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  <Send size={16} />
                </button>
              </div>

              {/* Emoji Picker */}
              <div className="relative">
                <button
                  type="button"
                  disabled={isBlockedBetweenUsers}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                    isBlockedBetweenUsers
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                  }`}
                  onClick={() => setShowEmojiPicker((prev) => !prev)}
                >
                  <Smile size={18} />
                </button>
                {showEmojiPicker && !isBlockedBetweenUsers && (
                  <div className="absolute bottom-full mb-2 right-0">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                )}
              </div>
            </form>
          )}

          <Modal
            isOpen={!!fullImageUrl}
            onRequestClose={() => setFullImageUrl(null)}
            className="w-full max-w-4xl mx-auto bg-black flex justify-center items-center min-h-[600px]"
            overlayClassName="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          >
            <div className="relative w-full max-h-screen flex justify-center items-center">
              <button
                className="absolute top-4 right-4 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
                onClick={() => setFullImageUrl(null)}
              >
                <X size={20} className="text-gray-600" />
              </button>
              {fullImageUrl &&
                (isImageFile(fullImageUrl) ? (
                  <img
                    src={fullImageUrl}
                    alt="Tam görüntü"
                    className="max-w-full max-h-screen object-contain"
                  />
                ) : (
                  <iframe
                    src={fullImageUrl}
                    className="w-full h-full"
                    title="Dosya Önizleme"
                  />
                ))}
            </div>
          </Modal>
        </div>

        {showImagePopup && (
          <ImagePopupForChatBox
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
            onClose={closeImagePopup}
            onSend={handleImageUpload}
            chatInfo={{
              type: friend ? "user" : "group",
              name: friend ? friend.name : group?.name || "Grup",
            }}
          />
        )}

        {showFilePopup && (
          <ChatBoxSendFiles
            friend={friend}
            group={group}
            onClose={() => setShowFilePopup(false)}
            onFileSent={handleFileSent}
          />
        )}

        {removeEmojisMessageId && (
          <ChatBoxRemoveEmojis
            messageId={removeEmojisMessageId}
            reactions={removeEmojisReactions}
            onClose={() => {
              setRemoveEmojisMessageId(null);
              setRemoveEmojisReactions([]);
            }}
            onReactionRemoved={(updatedMessage) => {
              setMessages((prev) =>
                prev.map((m) =>
                  m._id === updatedMessage._id ? updatedMessage : m
                )
              );
            }}
          />
        )}
      </div>
    </>
  );
};

export default ChatBox;

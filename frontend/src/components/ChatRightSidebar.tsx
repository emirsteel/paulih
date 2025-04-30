import React, { useEffect, useState, useContext } from "react";
import { X, MoreVertical, Ban, AlertTriangle } from "lucide-react";
import {
  fetchConversation,
  blockUserAPI,
  unblockUserAPI,
  fetchBlockedUsers,
  leaveGroupAPI,
} from "../services/api";
import ChatRightSidebarReport from "./ChatRightSidebarReport";
import ChatRightSidebarBlock from "./ChatRightSidebarBlock";
import { AuthUserContext } from "../context/AuthUserContext";
import ChatRightSidebarLeaveGroup from "./ChatRightSidebarLeaveGroup";

interface RightSidebarProps {
  friend?: {
    _id: string;
    name: string;
    username: string;
    profileImage: string;
    bio?: string;
    mobile?: string;
    lastActive?: string;
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
  timestamp: string;
  seen: boolean;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ friend, group }) => {
  const [sharedImages, setSharedImages] = useState<string[]>([]);
  const [sharedFiles, setSharedFiles] = useState<string[]>([]);
  const [visibleImages, setVisibleImages] = useState<string[]>([]);
  const [visibleFiles, setVisibleFiles] = useState<string[]>([]);

  const [seeAllImages, setSeeAllImages] = useState(false);
  const [seeAllFiles, setSeeAllFiles] = useState(false);
  const [imagePage, setImagePage] = useState(1);
  const [filePage, setFilePage] = useState(1);
  const imagesPerPage = 21;

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isBlockPopupOpen, setIsBlockPopupOpen] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  const [fullImageUrl, setFullImageUrl] = useState<string | null>(null);

  const [isLeaveGroupOpen, setIsLeaveGroupOpen] = useState(false);
  const [showMembers, setShowMembers] = useState(false);

  const authContext = useContext(AuthUserContext);
  const { user } = authContext;

  useEffect(() => {
    if (user) setCurrentUserId(user._id);
  }, [user]);

  useEffect(() => {
    const checkBlockStatus = async () => {
      if (!friend || !user) return;
      try {
        const blockedList = await fetchBlockedUsers(user._id);
        const isFriendBlocked = blockedList.some(
          (block: { blockedId: string }) => block.blockedId === friend._id
        );
        setIsBlocked(isFriendBlocked);
      } catch (err) {
        console.error("Failed to fetch blocked users:", err);
      }
    };
    checkBlockStatus();
  }, [friend, user]);

  useEffect(() => {
    const fetchSharedContent = async () => {
      if (!friend && !group) return;
      try {
        const conversationId = friend ? friend._id : group?._id;
        if (!conversationId) return;
        const messages: Message[] = await fetchConversation(conversationId);
        const images = messages.filter((m) => m.image).map((m) => m.image!);
        const files = messages.filter((m) => m.file).map((m) => m.file!);
        setSharedImages(images.reverse());
        setSharedFiles(files.reverse());
      } catch (error) {
        console.error("Paylaşılan içerikler çekilirken hata:", error);
      }
    };
    fetchSharedContent();
  }, [friend, group]);

  useEffect(() => {
    if (seeAllImages) {
      const end = imagePage * imagesPerPage;
      setVisibleImages(sharedImages.slice(0, end));
    } else {
      setVisibleImages(sharedImages.slice(0, 3));
    }
  }, [sharedImages, imagePage, seeAllImages]);

  useEffect(() => {
    if (seeAllFiles) {
      const end = filePage * imagesPerPage;
      setVisibleFiles(sharedFiles.slice(0, end));
    } else {
      setVisibleFiles(sharedFiles.slice(0, 5));
    }
  }, [sharedFiles, filePage, seeAllFiles]);

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

  const getFullImageUrl = (img: string) => {
    if (img.startsWith("http")) return img; // Already full URL
    if (img.startsWith("/")) return `http://localhost:5001${img}`; // Normal
    return `http://localhost:5001/uploads/${img}`; // Missing first slash
  };

  const getGroupImage = (imagePath?: string) => {
    if (!imagePath) return "/default-group.png"; // public klasöründen default görsel
    if (imagePath.startsWith("http")) return imagePath; // zaten tam url ise
    if (imagePath.startsWith("/")) return `http://localhost:5001${imagePath}`; // "/" ile başlıyorsa
    return `http://localhost:5001/uploads/${imagePath}`; // normal string ise
  };

  const handleBlockConfirm = async () => {
    if (!friend || !currentUserId) return;
    try {
      isBlocked
        ? await unblockUserAPI(currentUserId, friend._id)
        : await blockUserAPI(currentUserId, friend._id);
      setIsBlocked(!isBlocked);
    } catch (err) {
      console.error("Bloklama durumu değiştirilemedi:", err);
    } finally {
      setIsBlockPopupOpen(false);
    }
  };

  const isActive = () => {
    if (!friend?.lastActive) return false;
    const lastSeen = new Date(friend.lastActive).getTime();
    return Date.now() - lastSeen <= 5 * 60 * 1000;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderFriendActions = () => (
    <div className="mt-4 space-y-2">
      <button
        onClick={() => setIsBlockPopupOpen(true)}
        className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-500 hover:bg-red-50 transition"
      >
        <Ban className="mr-3 text-lg" />
        {isBlocked ? "Engeli Kaldır" : "Engelle"}
      </button>
      <button
        onClick={() => setIsReportOpen(true)}
        className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-500 hover:bg-red-50 transition"
      >
        <AlertTriangle className="mr-3 text-lg" />
        Rapor Et
      </button>
    </div>
  );
  const renderGroupActions = () => (
    <div className="mt-4 space-y-2">
      <button
        onClick={() => setIsLeaveGroupOpen(true)}
        className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-500 hover:bg-red-50 transition"
      >
        <Ban className="mr-3 text-lg" />
        Gruptan Çık
      </button>
      <button
        onClick={() => setIsReportOpen(true)}
        className="w-full flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-500 hover:bg-red-50 transition"
      >
        <AlertTriangle className="mr-3 text-lg" />
        Grubu Rapor Et
      </button>
    </div>
  );

  if (!friend && !group) {
    return (
      <div className="flex-1 bg-white flex items-center justify-center">
        <p className="text-gray-500">
          Detayları görüntülemek için bir arkadaş veya grup seçin.
        </p>
      </div>
    );
  }

  const getFileExtension = (filename: string) =>
    filename?.split(".").pop()?.toUpperCase() || "";

  const renderFileIcon = (filename: string) => {
    const ext = getFileExtension(filename);
    const baseStyle = "text-xs font-bold px-2 py-1 rounded";
    switch (ext) {
      case "PDF":
        return (
          <span className={`${baseStyle} bg-red-100 text-red-600`}>PDF</span>
        );
      case "DOC":
      case "DOCX":
        return (
          <span className={`${baseStyle} bg-blue-100 text-blue-600`}>DOC</span>
        );
      case "XLS":
      case "XLSX":
        return (
          <span className={`${baseStyle} bg-green-100 text-green-600`}>
            XLS
          </span>
        );
      case "PPT":
      case "PPTX":
        return (
          <span className={`${baseStyle} bg-orange-100 text-orange-600`}>
            PPT
          </span>
        );
      default:
        return (
          <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
            FILE
          </span>
        );
    }
  };

  const renderSharedImages = () => (
    <div>
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-semibold text-gray-600">Resimler</p>
        {sharedImages.length > 3 && (
          <button
            onClick={() => {
              setSeeAllImages(!seeAllImages);
              setImagePage(1);
            }}
            className="text-sm text-blue-500"
          >
            {seeAllImages ? "Gizle" : "Tümünü Gör"}
          </button>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {visibleImages.length > 0 ? (
          visibleImages.map((img, idx) => (
            <img
              key={idx}
              src={getFullImageUrl(img)}
              onClick={() => setFullImageUrl(getFullImageUrl(img))}
              className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
              alt={`resim-${idx}`}
            />
          ))
        ) : (
          <p className="text-sm text-gray-400">Paylaşılan resim yok.</p>
        )}
      </div>
      {seeAllImages && sharedImages.length > visibleImages.length && (
        <button
          className="text-sm text-blue-500 mt-4"
          onClick={() => setImagePage((prev) => prev + 1)}
        >
          Daha Fazla Göster
        </button>
      )}
    </div>
  );

  const renderSharedFiles = () => (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-semibold text-gray-600">
          Dosyalar ({sharedFiles.length})
        </p>
        {sharedFiles.length > 5 && (
          <button
            onClick={() => {
              setSeeAllFiles(!seeAllFiles);
              setFilePage(1);
            }}
            className="text-sm text-blue-500"
          >
            {seeAllFiles ? "Gizle" : "Tümünü Gör"}
          </button>
        )}
      </div>
      <div className="space-y-3">
        {visibleFiles.length > 0 ? (
          visibleFiles.map((file, index) => {
            const fileName = file.split("/").pop() || "Dosya";
            return (
              <div
                key={index}
                onClick={() => handleDownloadFile(file, fileName)}
                className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 transition cursor-pointer"
              >
                {renderFileIcon(fileName)}
                <span className="text-sm text-gray-700 truncate max-w-[180px]">
                  {fileName}
                </span>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-gray-400">Paylaşılan dosya yok.</p>
        )}
      </div>
      {seeAllFiles && sharedFiles.length > visibleFiles.length && (
        <button
          className="text-sm text-blue-500 mt-4"
          onClick={() => setFilePage((prev) => prev + 1)}
        >
          Daha Fazla Göster
        </button>
      )}
    </div>
  );

  return (
    <>
      <div className="h-screen w-[320px] flex flex-col bg-white border-l border-gray-200">
        <div className="flex items-center justify-between px-4 py-[18px] border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700">
            {friend ? "İletişim Bilgileri" : "Grup Bilgileri"}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {(friend || group) && (
            <>
              {friend && (
                <div>
                  {/* Profil Resmi Başlık */}
                  <div className="mb-2">
                    <p className="text-sm font-semibold text-gray-600">
                      Profil Resmi
                    </p>
                  </div>

                  {/* Profil Resmi */}
                  <div className="relative w-20 h-20">
                    <img
                      src={`http://localhost:5001/${friend.profileImage}`}
                      className="w-20 h-20 rounded-full object-cover cursor-pointer hover:opacity-80 transition"
                      alt="profil"
                      onClick={() =>
                        setFullImageUrl(
                          `http://localhost:5001/${friend.profileImage}`
                        )
                      }
                    />
                    {isActive() && (
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>

                  {/* Kullanıcı Bilgileri */}
                  <div className="mt-4 space-y-2 w-full">
                    <div>
                      <p className="text-sm font-semibold text-gray-600">
                        İsim
                      </p>
                      <p className="text-sm text-gray-600">{friend.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">
                        Kullanıcı Adı
                      </p>
                      <a
                        href={`http://localhost:3000/profile/${friend.username}`}
                        className="text-sm text-blue-500 hover:underline"
                      >
                        @{friend.username}
                      </a>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600">
                        Biyografi
                      </p>
                      <p className="text-sm text-gray-600">
                        {friend.bio || "Biyografi bulunmuyor"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {group && (
                <div>
                  <img
                    src={getGroupImage(group.image)}
                    className="w-20 h-20 rounded-full object-cover"
                    alt="grup"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-600">
                      Grup İsmi
                    </p>
                    <p className="text-sm text-gray-600">{group.name}</p>
                  </div>
                  <div className="mt-4 space-y-2 w-full">
                    <div>
                      <p className="text-sm font-semibold text-gray-600">
                        Oluşturulma Tarihi
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDate(group.createdAt)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-600">
                        Üyeler
                      </p>
                      <button
                        onClick={() => setShowMembers((prev) => !prev)}
                        className="text-sm text-blue-500 hover:underline"
                      >
                        {group.members.length} üye
                      </button>

                      {showMembers && (
                        <div className="mt-2 space-y-2">
                          {group.members.map((member) => (
                            <a
                              key={member._id}
                              href={`/profile/${member.username}`}
                              className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-100 transition"
                            >
                              <img
                                src={
                                  member.profileImage.startsWith("http")
                                    ? member.profileImage
                                    : `http://localhost:5001/${member.profileImage}`
                                }
                                onError={(e) =>
                                  (e.currentTarget.src = "/default-avatar.png")
                                }
                                alt="Profil"
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <span className="text-sm text-gray-700">
                                {member.name}
                              </span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Paylaşılan Resimler */}
              {renderSharedImages()}

              {/* Paylaşılan Dosyalar */}
              {renderSharedFiles()}

              {/* HR Çizgisi */}
              <hr className="my-6 border-t border-gray-200" />

              {/* Diğer Seçenekler Başlığı */}
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">
                  Diğer Seçenekler
                </p>
              </div>

              {/* Kullanıcı veya Grup İçin Seçenekler */}
              {friend ? renderFriendActions() : renderGroupActions()}
            </>
          )}
        </div>
      </div>

      {/* Tam Sayfa Görsel Açma */}
      {fullImageUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl p-4">
            <button
              onClick={() => setFullImageUrl(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center"
            >
              <X size={24} className="text-gray-800" />
            </button>
            <img
              src={fullImageUrl}
              alt="Paylaşılan Görsel"
              className="w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      <ChatRightSidebarLeaveGroup
        isOpen={isLeaveGroupOpen}
        onClose={() => setIsLeaveGroupOpen(false)}
        onLeave={async () => {
          if (group && user) {
            try {
              await leaveGroupAPI(group._id, user._id);
              console.log("Gruptan başarıyla çıkıldı!");
            } catch (error) {
              console.error(error);
            }
          }
        }}
        groupName={group?.name || ""}
      />
      {/* Rapor Etme ve Bloklama Popup */}
      <ChatRightSidebarReport
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        entityId={friend?._id || group?._id || ""}
        entityType={friend ? "user" : "group"}
      />

      <ChatRightSidebarBlock
        isOpen={isBlockPopupOpen}
        onClose={() => setIsBlockPopupOpen(false)}
        isBlocked={isBlocked}
        onConfirm={handleBlockConfirm}
        userName={friend?.username || ""}
        friendName={friend?.name || ""}
      />
    </>
  );
};

export default RightSidebar;

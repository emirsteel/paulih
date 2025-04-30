import React, { useEffect, useState, useContext } from "react";
import { AuthUserContext } from "../../../context/AuthUserContext";
import { fetchBlockedUsers, unblockUserAPI } from "../../../services/api";
import { X } from "lucide-react";
import { AlertBox, AlertVariant } from "../../Alerts"; // 👈 import AlertBox and types

interface BlockedUser {
  _id: string;
  blockedId: {
    _id: string;
    name: string;
    username: string;
    profileImage?: string;
  };
}

const UserSettingsBlockedUsers: React.FC = () => {
  const { user } = useContext(AuthUserContext);
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [unblockingId, setUnblockingId] = useState<string | null>(null);
  const [alert, setAlert] = useState<{
    variant: AlertVariant;
    title: string;
    description?: string;
  } | null>(null);

  useEffect(() => {
    const getBlockedUsers = async () => {
      if (!user) return;
      try {
        const blocked = await fetchBlockedUsers(user._id);
        setBlockedUsers(blocked);
      } catch (error) {
        console.error("Blocked users could not be fetched:", error);
      } finally {
        setLoading(false);
      }
    };
    getBlockedUsers();
  }, [user]);

  const handleUnblock = async (blockedUserId: string, blockId: string) => {
    if (!user) return;
    setUnblockingId(blockId);
    try {
      await unblockUserAPI(user._id, blockedUserId);
      setBlockedUsers((prev) => prev.filter((b) => b._id !== blockId));
      setAlert({
        variant: "success",
        title: "Engel Kaldırıldı",
        description: "Kullanıcının engeli başarıyla kaldırıldı.",
      });
    } catch (error) {
      console.error("Engel kaldırılamadı:", error);
      setAlert({
        variant: "error",
        title: "Hata",
        description: "Engel kaldırılamadı. Lütfen tekrar deneyin.",
      });
    } finally {
      setUnblockingId(null);
    }
  };

  const getProfileImageUrl = (path?: string) => {
    return path ? `http://localhost:5001/${path}` : "/default-profile.png";
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-start justify-center py-10 px-4">
      <div className="max-w-4xl w-full space-y-8">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Engellenen Kullanıcılar
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Burada Paulih hesabınızla engellediğiniz kullanıcıları
            görüntüleyebilirsiniz.
          </p>
        </div>

        {/* Alert Message */}
        {alert && (
          <AlertBox
            variant={alert.variant}
            title={alert.title}
            description={alert.description}
            onClose={() => setAlert(null)}
          />
        )}

        {/* Card Area */}
        <div className="bg-white p-8 rounded-2xl border shadow-sm space-y-6">
          {loading ? (
            <p className="text-gray-500 text-sm">Yükleniyor...</p>
          ) : blockedUsers.length === 0 ? (
            <div className="text-center text-gray-400 text-sm py-12">
              Şu anda engellediğiniz bir kullanıcı bulunmamaktadır.
            </div>
          ) : (
            <div className="space-y-4">
              {blockedUsers.map((blocked) => (
                <div
                  key={blocked._id}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={getProfileImageUrl(blocked.blockedId?.profileImage)}
                      alt={blocked.blockedId?.name || "Kullanıcı"}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) =>
                        (e.currentTarget.src = "/default-profile.png")
                      }
                    />
                    <div>
                      <h2 className="text-sm font-semibold text-gray-800">
                        {blocked.blockedId?.name}
                      </h2>
                      <p className="text-xs text-gray-600">
                        @{blocked.blockedId?.username}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      handleUnblock(blocked.blockedId._id, blocked._id)
                    }
                    disabled={unblockingId === blocked._id}
                    className={`flex items-center gap-1 ${
                      unblockingId === blocked._id
                        ? "bg-gray-200 text-gray-400"
                        : "bg-red-100 hover:bg-red-200 text-red-600"
                    } text-xs font-medium px-3 py-1.5 rounded-md transition`}
                  >
                    <X size={14} className="mr-1" />
                    {unblockingId === blocked._id
                      ? "Kaldırılıyor..."
                      : "Engeli Kaldır"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSettingsBlockedUsers;

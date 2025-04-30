import React from "react";
import {
  CheckCircle,
  Edit3,
  Users,
  UserPlus,
  UserX,
  Check,
  XCircle,
  UserCheck,
  Camera,
} from "lucide-react";

interface ProfileInfoProps {
  profileData: any;
  getProfileImageUrl: (imagePath: string) => string;
  user: any;
  toggleModal: () => void;
  openBadgesPopup: () => void;
  isFriend: boolean;
  isFriendRequestSent: boolean;
  isFriendRequestReceived: boolean;
  sendFriendRequest: () => void;
  handleFriendRequestAction: (requesterId: string, action: string) => void;
  handleCancelFriendRequest: (targetUserId: string) => void; // 🛠 FIX HERE
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  profileData,
  getProfileImageUrl,
  user,
  toggleModal,
  openBadgesPopup,
  isFriend,
  isFriendRequestSent,
  isFriendRequestReceived,
  sendFriendRequest,
  handleFriendRequestAction,
  handleCancelFriendRequest,
}) => {
  const isOwner = user.username === profileData.username;

  return (
    <div className="bg-white rounded-xl border border-gray-300 overflow-hidden max-w-[700px] mx-auto">
      {/* Banner */}
      <div className="relative">
        {profileData.bannerImage ? (
          <div
            className="h-48 bg-cover bg-center"
            style={{
              backgroundImage: `url(${encodeURI(
                getProfileImageUrl(profileData.bannerImage)
              )}?t=${new Date().getTime()})`,
            }}
          />
        ) : (
          <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-500" />
        )}
        {isOwner && (
          <div className="absolute top-2 right-2">
            <button
              className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
              onClick={toggleModal}
            >
              <Camera className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}
        <div className="absolute -bottom-10 left-6">
          <img
            src={encodeURI(getProfileImageUrl(profileData.profileImage))}
            alt={profileData.name}
            className="rounded-full border-4 border-white shadow-md h-28 w-28 object-cover"
          />
          {isOwner && (
            <button
              className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow hover:bg-gray-100"
              onClick={toggleModal}
            >
              <Edit3 className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="pt-12 pb-6 px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 className="text-2xl font-bold text-gray-800">
            {profileData.name}
          </h1>
          <div className="flex flex-wrap gap-2">
            {isOwner ? (
              <button
                onClick={toggleModal}
                className="flex items-center px-4 py-1.5 text-sm font-medium border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition"
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Profili Düzenle
              </button>
            ) : (
              <>
                {!isFriend &&
                  !isFriendRequestSent &&
                  !isFriendRequestReceived && (
                    <button
                      onClick={sendFriendRequest}
                      className="flex items-center px-4 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      Ekle
                    </button>
                  )}
                {isFriendRequestSent && (
                  <button
                    onClick={() => handleCancelFriendRequest(profileData._id)}
                    className="flex items-center px-4 py-1.5 text-sm font-medium bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                  >
                    <UserX className="w-4 h-4 mr-1" />
                    İptal
                  </button>
                )}
                {isFriendRequestReceived && (
                  <>
                    <button
                      onClick={() =>
                        handleFriendRequestAction(profileData._id, "accept")
                      }
                      className="flex items-center px-4 py-1.5 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Onayla
                    </button>
                    <button
                      onClick={() =>
                        handleFriendRequestAction(profileData._id, "reject")
                      }
                      className="flex items-center px-4 py-1.5 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reddet
                    </button>
                  </>
                )}
                {isFriend && !isFriendRequestReceived && (
                  <button
                    disabled
                    className="flex items-center px-4 py-1.5 text-sm font-medium bg-green-600 text-white rounded-md cursor-default"
                  >
                    <UserCheck className="w-4 h-4 mr-1" />
                    Arkadaş
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Username & Badges */}
        <div className="flex items-center justify-between mt-2">
          <p className="text-gray-600 text-sm flex items-center">
            @{profileData.username}
            {profileData.isVerified && (
              <CheckCircle className="w-4 h-4 text-blue-600 ml-1" />
            )}
          </p>
          <button onClick={openBadgesPopup}>
            {profileData.badges?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {profileData.badges.map((badge: string, index: number) => {
                  const badgeClasses =
                    badge === "Hacettepe Üniversitesi"
                      ? "bg-purple-500 text-white"
                      : "bg-amber-500 text-white";
                  return (
                    <span
                      key={index}
                      className={`text-xs px-2 py-0.5 rounded-full shadow ${badgeClasses} flex items-center`}
                    >
                      {badge === "Hacettepe Üniversitesi" && (
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Hacettepe_Üniversitesi_logo.svg/1432px-Hacettepe_Üniversitesi_logo.svg.png"
                          alt="Hacettepe Üniversitesi logo"
                          className="w-3 h-3 mr-1"
                        />
                      )}
                      {badge}
                    </span>
                  );
                })}
              </div>
            )}
          </button>
        </div>

        {/* Bio */}
        <p className="text-gray-500 text-sm mt-2">{profileData.bio}</p>

        {/* Friends */}
        <div className="mt-4 flex items-center space-x-1 hover:underline cursor-pointer">
          <Users className="w-4 h-4 text-blue-600" />
          <span className="text-blue-600 text-sm font-bold">
            {profileData.friends?.length || 0} Arkadaş
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;

import React, { useState } from "react";
import { Edit3, X, UploadCloud } from "lucide-react";
import ProfileEditProfileEditProfileImagePopup from "./ProfileEditProfileEditProfileImagePopup";
import ProfileEditProfileEditBannerPopup from "./ProfileEditProfileEditBannerPopup";

interface ProfileEditProfileProps {
  updatedProfile: any;
  setUpdatedProfile: (data: any) => void;
  profileImageFile: File | null;
  bannerImageFile: File | null;
  saving: boolean;
  handleProfileUpdate: (e: React.FormEvent) => Promise<void> | void;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBannerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleModal: () => void;
  getProfileImageUrl: (imagePath: string) => string;
}

const ProfileEditProfile: React.FC<ProfileEditProfileProps> = ({
  updatedProfile,
  setUpdatedProfile,
  profileImageFile,
  bannerImageFile,
  saving,
  handleProfileUpdate,
  handleImageChange,
  handleBannerChange,
  toggleModal,
  getProfileImageUrl,
}) => {
  const [isCropPopupOpen, setIsCropPopupOpen] = useState(false);
  const [tempProfileImage, setTempProfileImage] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isBannerCropPopupOpen, setIsBannerCropPopupOpen] = useState(false);
  const [tempBannerImage, setTempBannerImage] = useState<File | null>(null);
  const [isBannerDragActive, setIsBannerDragActive] = useState(false);

  const localHandleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const personalFields = [
      "salutations",
      "work",
      "city",
      "birthplace",
      "relationship",
      "phoneNumber",
      "highSchool",
      "college",
    ];
    const universityFields = ["major", "year", "classes", "lessons"];

    if (personalFields.includes(name)) {
      setUpdatedProfile((prev: any) => ({
        ...prev,
        personalInfo: { ...(prev.personalInfo || {}), [name]: value },
      }));
    } else if (universityFields.includes(name)) {
      setUpdatedProfile((prev: any) => ({
        ...prev,
        universityInfo: { ...(prev.universityInfo || {}), [name]: value },
      }));
    } else {
      setUpdatedProfile((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const onSaveChanges = async (e: React.FormEvent) => {
    await handleProfileUpdate(e);
    window.location.reload();
  };

  const onImageInteraction = (file: File, type: "profile" | "banner") => {
    if (type === "profile") {
      setTempProfileImage(file);
      setIsCropPopupOpen(true);
    } else {
      setTempBannerImage(file);
      setIsBannerCropPopupOpen(true);
    }
  };

  const handleFileDrop = (
    e: React.DragEvent<HTMLLabelElement>,
    type: "profile" | "banner"
  ) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      onImageInteraction(e.dataTransfer.files[0], type);
      e.dataTransfer.clearData();
    }
  };

  const saveCropped = (cropped: File, type: "profile" | "banner") => {
    const fakeEvent = {
      target: { files: [cropped] },
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    if (type === "profile") {
      handleImageChange(fakeEvent);
      setTempProfileImage(null);
      setIsCropPopupOpen(false);
    } else {
      handleBannerChange(fakeEvent);
      setTempBannerImage(null);
      setIsBannerCropPopupOpen(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div
          className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 overflow-y-auto"
          style={{ maxHeight: "90vh" }}
        >
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Profili Düzenle
            </h2>
            <button
              onClick={toggleModal}
              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center"
            >
              <X size={20} />
            </button>
          </div>

          {/* Banner */}
          <div className="relative w-full h-48 bg-gray-100 rounded-lg mt-6 overflow-hidden">
            {bannerImageFile ? (
              <img
                src={URL.createObjectURL(bannerImageFile)}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            ) : updatedProfile.bannerImage ? (
              <img
                src={getProfileImageUrl(updatedProfile.bannerImage)}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex justify-center items-center h-full text-gray-400 text-sm">
                Banner bulunamadı
              </div>
            )}
            <label
              htmlFor="bannerImage"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleFileDrop(e, "banner")}
              className="absolute top-3 right-3 bg-white p-2 rounded-full shadow cursor-pointer hover:bg-gray-200"
            >
              <Edit3 className="w-5 h-5 text-gray-600" />
            </label>
            <input
              id="bannerImage"
              type="file"
              accept="image/*"
              onChange={(e) => onImageInteraction(e.target.files![0], "banner")}
              className="hidden"
            />
          </div>

          {/* Profile Image */}
          <div className="relative -mt-12 ml-6 w-24 h-24 rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-md">
            <img
              src={
                profileImageFile
                  ? URL.createObjectURL(profileImageFile)
                  : getProfileImageUrl(updatedProfile.profileImage)
              }
              alt="Profil"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="profileImage"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleFileDrop(e, "profile")}
              className="flex items-center justify-center px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer text-sm text-gray-600 hover:bg-gray-50"
            >
              <UploadCloud className="w-5 h-5 mr-2 text-blue-500" />
              Profil fotoğrafı yükle ya da sürükle
            </label>
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={(e) =>
                onImageInteraction(e.target.files![0], "profile")
              }
              className="hidden"
            />
          </div>

          {/* Name and Username */}
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-gray-600 font-medium">
                Ad Soyad
              </label>
              <input
                name="name"
                value={updatedProfile.name}
                onChange={localHandleInputChange}
                className="w-full px-4 py-2 mt-1 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Adınızı girin"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">
                Kullanıcı Adı
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2 text-sm bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                  paulih.com/profile/
                </span>
                <input
                  name="username"
                  value={updatedProfile.username}
                  onChange={localHandleInputChange}
                  className="w-full px-4 py-2 text-sm bg-white border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="kullaniciadi"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 font-medium">
                Hakkımda
              </label>
              <textarea
                name="bio"
                rows={3}
                value={updatedProfile.bio}
                onChange={localHandleInputChange}
                className="w-full px-4 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Kendiniz hakkında kısa bir açıklama yazın"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={onSaveChanges}
              disabled={saving}
              className="w-full px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
            >
              {saving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </div>
      </div>

      {isCropPopupOpen && tempProfileImage && (
        <ProfileEditProfileEditProfileImagePopup
          isOpen={isCropPopupOpen}
          imageFile={tempProfileImage}
          onClose={() => {
            setIsCropPopupOpen(false);
            setTempProfileImage(null);
          }}
          onSave={(file) => saveCropped(file, "profile")}
        />
      )}

      {isBannerCropPopupOpen && tempBannerImage && (
        <ProfileEditProfileEditBannerPopup
          isOpen={isBannerCropPopupOpen}
          imageFile={tempBannerImage}
          onClose={() => {
            setIsBannerCropPopupOpen(false);
            setTempBannerImage(null);
          }}
          onSave={(file) => saveCropped(file, "banner")}
        />
      )}
    </>
  );
};

export default ProfileEditProfile;

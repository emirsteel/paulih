import React, { useState } from "react";
import Cropper from "react-easy-crop";
import Modal from "react-modal";

interface Friend {
  _id: string;
  name: string;
  profileImage?: string;
}

interface CreateGroupPopupProps {
  friends: Friend[];
  onClose: () => void;
  onCreate: (groupData: FormData) => void;
}

const CreateGroupPopup: React.FC<CreateGroupPopupProps> = ({
  friends,
  onClose,
  onCreate,
}) => {
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [groupImage, setGroupImage] = useState<File | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  const getProfileImageUrl = (imagePath: string | undefined): string => {
    return imagePath
      ? `http://localhost:5001/${imagePath}`
      : "/default-profile.png";
  };

  const handleToggleFriend = (friendId: string) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const groupedFriends = friends.reduce(
    (acc, friend) => {
      const firstLetter = friend.name[0].toUpperCase();
      if (!acc[firstLetter]) acc[firstLetter] = [];
      acc[firstLetter].push(friend);
      return acc;
    },
    {} as Record<string, Friend[]>
  );

  const sortedLetters = Object.keys(groupedFriends).sort();

  const handleCreateGroup = () => {
    if (!groupName || selectedFriends.length === 0) {
      console.error("Grup adı veya üye seçimi eksik.");
      return;
    }

    const formData = new FormData();
    formData.append("name", groupName);
    formData.append("members", JSON.stringify(selectedFriends));
    if (groupImage) formData.append("image", groupImage);

    onCreate(formData);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setGroupImage(file);
      setIsCropModalOpen(true);
    }
  };

  const handleCropComplete = () => {
    setCroppedImage(URL.createObjectURL(groupImage!));
    setIsCropModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white w-96 rounded-2xl shadow-2xl p-6 flex flex-col gap-6 relative">
        <h3 className="text-lg font-bold text-gray-800 text-center">
          Yeni Grup Oluştur
        </h3>

        {/* Grup Fotoğrafı Yükleme */}
        <div className="flex flex-col items-center gap-2">
          {croppedImage ? (
            <img
              src={croppedImage}
              alt="Grup Fotoğrafı"
              className="w-20 h-20 rounded-full object-cover border border-gray-300"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl font-semibold">
              +
            </div>
          )}
          <label className="text-sm font-medium text-blue-600 cursor-pointer hover:underline">
            {croppedImage ? "Fotoğrafı Değiştir" : "Fotoğraf Ekle"}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Grup Adı Girişi */}
        <div className="relative w-full">
          <input
            type="text"
            id="group-name"
            className="w-full px-4 pt-3 pb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
            placeholder=" "
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <label
            htmlFor="group-name"
            className="absolute left-4 top-3 text-gray-400 text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-focus:top-[-8px] peer-focus:text-xs peer-focus:text-blue-500 transition-all bg-white px-1"
          >
            Grup Adı Girin
          </label>
        </div>

        {/* Arkadaş Seçimi */}
        <div className="flex flex-col gap-2 overflow-y-auto max-h-52">
          <label className="text-sm font-medium text-gray-700">
            Arkadaş Seç
          </label>
          {sortedLetters.length > 0 ? (
            sortedLetters.map((letter, index) => (
              <div key={letter}>
                <h4 className="text-blue-600 text-xs font-semibold mb-1">
                  {letter}
                </h4>
                <ul className="space-y-1">
                  {groupedFriends[letter].map((friend) => (
                    <li
                      key={friend._id}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition ${
                        selectedFriends.includes(friend._id)
                          ? "bg-blue-100"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => handleToggleFriend(friend._id)}
                    >
                      {/* Profil Resmi */}
                      {friend.profileImage ? (
                        <img
                          src={getProfileImageUrl(friend.profileImage)}
                          alt={friend.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm">
                          {friend.name[0].toUpperCase()}
                        </div>
                      )}
                      {/* İsim */}
                      <span className="flex-1 text-sm text-gray-700">
                        {friend.name}
                      </span>
                      {/* Seçim Durumu */}
                      {selectedFriends.includes(friend._id) && (
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      )}
                    </li>
                  ))}
                </ul>
                {index < sortedLetters.length - 1 && (
                  <div className="border-t border-gray-100 my-3"></div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">Arkadaş bulunamadı.</p>
          )}
        </div>

        {/* Butonlar */}
        <div className="flex flex-col gap-2 mt-4">
          <button
            onClick={handleCreateGroup}
            className="w-full py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
          >
            Grup Oluştur
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition"
          >
            İptal Et
          </button>
        </div>
      </div>

      {/* Fotoğraf Kırpma Modalı */}
      {isCropModalOpen && (
        <Modal
          isOpen={isCropModalOpen}
          onRequestClose={() => setIsCropModalOpen(false)}
          className="fixed inset-0 flex items-center justify-center"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Fotoğrafı Kırp
            </h3>
            <div className="relative h-56 bg-gray-100 rounded-md">
              <Cropper
                image={URL.createObjectURL(groupImage!)}
                crop={crop}
                zoom={zoom}
                cropShape="round"
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CreateGroupPopup;

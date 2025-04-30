import React, { useEffect, useRef } from "react";
import { FiX, FiMessageCircle } from "react-icons/fi";

interface Friend {
  _id: string;
  name: string;
}

interface FriendsPopupProps {
  friends: Friend[];
  onClose: () => void;
  onSelectFriend: (friend: Friend) => void;
  position: { top: number; left: number };
}

const FriendsPopup: React.FC<FriendsPopupProps> = ({
  friends,
  onClose,
  onSelectFriend,
  position,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Grup arkadaşları alfabetik
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

  return (
    <div
      ref={popupRef}
      className="absolute bg-white border border-gray-200 shadow-lg rounded-xl w-72 p-4 z-50 transition-all"
      style={{
        top: position.top + 15,
        left: position.left - 165,
      }}
    >
      {/* Başlık */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-sm font-semibold text-gray-800">
          Sohbet Arkadaşları
        </h2>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all"
        >
          <FiX size={16} className="text-gray-600" />
        </button>
      </div>

      {/* Arkadaş Listesi */}
      <div className="overflow-y-auto max-h-72 space-y-3 px-1">
        {sortedLetters.map((letter, index) => (
          <div key={letter}>
            <h3 className="text-xs font-semibold text-blue-600 mb-1">
              {letter}
            </h3>
            <ul className="space-y-1">
              {groupedFriends[letter].map((friend) => (
                <li
                  key={friend._id}
                  className="flex items-center justify-between cursor-pointer px-3 py-2 text-sm rounded-lg hover:bg-gray-50 transition-all"
                  onClick={() => onSelectFriend(friend)}
                >
                  {/* Sol: İsim */}
                  <span className="text-gray-700">{friend.name}</span>

                  {/* Sağ: Mesaj İkonu */}
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
                    <FiMessageCircle size={14} />
                  </div>
                </li>
              ))}
            </ul>

            {/* Bölüm çizgisi */}
            {index < sortedLetters.length - 1 && (
              <div className="border-t border-gray-100 my-3"></div>
            )}
          </div>
        ))}
        {sortedLetters.length === 0 && (
          <p className="text-gray-500 text-sm">Arkadaş bulunamadı.</p>
        )}
      </div>
    </div>
  );
};

export default FriendsPopup;

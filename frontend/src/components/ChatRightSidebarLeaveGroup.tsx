import React, { useState } from "react";
import { X, CheckCircle } from "lucide-react";

interface ChatRightSidebarLeaveGroupProps {
  isOpen: boolean;
  onClose: () => void;
  onLeave: () => Promise<void>;
  groupName: string;
}

const ChatRightSidebarLeaveGroup: React.FC<ChatRightSidebarLeaveGroupProps> = ({
  isOpen,
  onClose,
  onLeave,
  groupName,
}) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [animate, setAnimate] = useState(false);

  const handleLeave = async () => {
    await onLeave();
    setShowSuccess(true);
    setTimeout(() => setAnimate(true), 150);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="relative bg-white rounded-2xl shadow-lg max-w-md w-full px-6 py-8 overflow-hidden">
        {showSuccess ? (
          <div className="relative z-10 text-center animate-fade-in">
            <div className="mt-6 flex justify-center">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center bg-green-100 ${
                  animate
                    ? "scale-100 opacity-100 animate-pulse-ring"
                    : "scale-75 opacity-0"
                } transition-all duration-500 ease-out`}
              >
                <CheckCircle className="text-green-500 w-12 h-12" />
              </div>
            </div>

            <h3 className="mt-6 text-lg font-bold text-gray-900">
              Gruptan Çıkıldı
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              {groupName} grubundan başarıyla ayrıldınız.
            </p>

            <div className="mt-6">
              <button
                onClick={() => {
                  setShowSuccess(false);
                  setAnimate(false);
                  onClose();
                }}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              >
                Kapat
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Gruptan Çık
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              "{groupName}" grubundan çıkmak istediğinize emin misiniz?
              Çıktıktan sonra sohbeti göremezsiniz.
            </p>

            <div className="mt-6 space-y-2">
              <button
                onClick={onClose}
                className="w-full px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleLeave}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Gruptan Çık
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatRightSidebarLeaveGroup;

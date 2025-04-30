// src/components/PostOptionsMenuReportPopup.tsx
import React, { useState } from "react";
import { X, CheckCircle } from "lucide-react"; // Using lucide-react
import { reportPost } from "../services/api"; // Import your API function

interface PostOptionsMenuReportPopupProps {
  isOpen: boolean;
  postId: string;
  onClose: () => void;
}

const PostOptionsMenuReportPopup: React.FC<PostOptionsMenuReportPopupProps> = ({
  isOpen,
  postId,
  onClose,
}) => {
  // Form state
  const [category, setCategory] = useState("Inappropriate Content");
  const [reason, setReason] = useState("");

  // UI state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  if (!isOpen) return null;

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await reportPost({ postId, category, reason });
      setReportSubmitted(true);
    } catch (error) {
      console.error("Error reporting post:", error);
      setErrorMessage("Şikayet gönderilemedi. Lütfen tekrar deneyin.");
    }
  };

  // Success screen
  const renderSuccessScreen = () => (
    <div className="flex flex-col items-center text-center">
      {/* Check icon has the popScale animation */}
      <CheckCircle className="text-green-500 animate-popScale" size={50} />
      <h2 className="text-xl font-semibold mt-4">
        Görüşlerini ilettiğin için teşekkürler
      </h2>
      <p className="mt-3 text-sm text-gray-600 max-w-xs">
        Paulih üzerinde hoşuna gitmeyen bir şey gördüğünde, Topluluk
        Standartlarımıza uyuyorsa şikayet edebilir veya içeriği paylaşan kişiyi
        deneyiminden kaldırabilirsin.
      </p>
      <button
        className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={onClose}
      >
        Kapat
      </button>
    </div>
  );

  // Report form
  const renderForm = () => (
    <>
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Lütfen bu gönderiyi neden şikayet ettiğinizi seçin ve ayrıntılı bir
          açıklama ekleyin, böylece uygun önlemleri alabiliriz.
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="reportCategory"
            className="block text-sm font-medium text-gray-700"
          >
            Şikayet Kategorisi
          </label>
          <select
            id="reportCategory"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Spam">Spam</option>
            <option value="Harassment">Taciz / Zorbalık</option>
            <option value="Inappropriate Content">Uygunsuz İçerik</option>
            <option value="Misinformation">Yanlış Bilgi</option>
            <option value="Other">Diğer</option>
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="reportReason"
            className="block text-sm font-medium text-gray-700"
          >
            Şikayet Sebebi
          </label>
          <textarea
            id="reportReason"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Neden şikayet ediyorsunuz?"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>
        {errorMessage && (
          <p className="mb-2 text-sm text-red-600">{errorMessage}</p>
        )}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded 
                     hover:bg-blue-700 transition"
        >
          Gönder
        </button>
      </form>
    </>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="relative bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Inline style for fade transitions and check icon pop */}
        <style>{`
          .transition-container {
            transition: opacity 0.4s ease-in-out;
          }
          @keyframes popScale {
            0% { transform: scale(0.5); opacity: 0; }
            50% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); }
          }
          .animate-popScale {
            animation: popScale 0.4s ease-out forwards;
          }
        `}</style>

        {/* Header with title and close button in the same line */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">
            {reportSubmitted ? "" : "Gönderiyi Şikayet Et"}
          </h2>
          <button
            className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center 
                       hover:bg-gray-300 transition shadow"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <X className="text-gray-600" size={20} />
          </button>
        </div>

        {/* Container that transitions between form and success */}
        <div
          className="transition-container"
          style={{ opacity: reportSubmitted ? 1 : 1 }}
        >
          {reportSubmitted ? renderSuccessScreen() : renderForm()}
        </div>
      </div>
    </div>
  );
};

export default PostOptionsMenuReportPopup;

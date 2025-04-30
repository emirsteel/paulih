import React, { useState, useEffect } from "react";
import { reportEntity } from "../services/api";
import { X, CheckCircle } from "lucide-react";

interface ChatRightSidebarReportProps {
  isOpen: boolean;
  onClose: () => void;
  entityId: string;
  entityType: "user" | "group";
}

const ChatRightSidebarReport: React.FC<ChatRightSidebarReportProps> = ({
  isOpen,
  onClose,
  entityId,
  entityType,
}) => {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [animate, setAnimate] = useState(false);

  const handleSubmit = async () => {
    if (!reason) {
      alert("Lütfen bir raporlama nedeni seçin.");
      return;
    }

    try {
      setIsSubmitting(true);
      await reportEntity({
        entityId,
        category: entityType,
        reason,
        details,
      });
      setShowSuccess(true);
      setTimeout(() => setAnimate(true), 150);
      setReason("");
      setDetails("");
    } catch (error) {
      alert("Rapor gönderilirken bir hata oluştu.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="relative bg-white rounded-2xl shadow-lg max-w-md w-full px-6 py-8 overflow-hidden">
        {showSuccess ? (
          <div className="relative z-10 text-center animate-fade-in">
            {/* ✅ Animated Check */}
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
              Raporunuz başarıyla oluşturuldu
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Bildirdiğiniz durum başarıyla sistemimize kaydedildi. Ekip
              arkadaşlarımız en kısa sürede konuyla ilgilenecektir.
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
              Rapor Et
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Lütfen durumu daha iyi anlayabilmemiz için aşağıdaki bilgileri
              doldurun.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Raporlama Nedeni
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                >
                  <option value="">Bir neden seçin</option>
                  <option value="spam">Spam</option>
                  <option value="offensive">Hakaret / Uygunsuz Dil</option>
                  <option value="harassment">Taciz</option>
                  <option value="misinformation">Yanlış Bilgi</option>
                  <option value="other">Diğer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durumu Açıklayın
                </label>
                <textarea
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Durumu detaylıca açıklayın..."
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm resize-none"
                ></textarea>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <button
                onClick={onClose}
                className="w-full px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? "Gönderiliyor..." : "Raporu Gönder"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatRightSidebarReport;

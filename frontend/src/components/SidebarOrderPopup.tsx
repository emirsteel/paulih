import React from "react";
import { X, ShoppingCart } from "lucide-react";

interface SidebarOrderPopupProps {
  onClose: () => void;
}

const SidebarOrderPopup: React.FC<SidebarOrderPopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 flex flex-col items-center gap-6 animate-scaleFade z-50 overflow-hidden">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          onClick={onClose}
        >
          <X size={26} />
        </button>

        {/* Icon inside decorative circle */}
        <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-inner">
          <ShoppingCart size={50} className="text-white" />
        </div>

        {/* "Coming Soon" badge */}
        <div className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full uppercase tracking-wider">
          Çok Yakında
        </div>

        {/* Title */}
        <h2 className="text-2xl font-extrabold text-gray-800 text-center leading-tight">
          Sipariş Sistemi Geliyor
        </h2>

        {/* Description */}
        <p className="text-gray-500 text-center leading-relaxed text-sm px-2 max-w-sm">
          Kampüs içi ve çevresindeki restoranlar ve kafelerle anlaşmalar
          yapılıyor. Yakında Paulih ile anında, hızlı ve uygun fiyatlı sipariş
          verebileceksiniz.
        </p>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold text-sm hover:scale-105 active:scale-95 transition-transform shadow-md"
        >
          Tamam
        </button>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes scaleFade {
          0% {
            opacity: 0;
            transform: scale(0.92);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scaleFade {
          animation: scaleFade 0.35s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SidebarOrderPopup;

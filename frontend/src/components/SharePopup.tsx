import React, { useEffect, useState } from "react";
import {
  FaTimes,
  FaCopy,
  FaFacebook,
  FaWhatsapp,
  FaInstagram,
  FaTwitter,
  FaEnvelope,
} from "react-icons/fa";
import { fetchFriends } from "../services/api";
import { sharePostToFriend } from "../services/api"; // Yeni API fonksiyonunu içe aktar

interface Friend {
  _id: string;
  name: string;
  profileImage?: string;
  username?: string;
}

interface SharePopupProps {
  post: any;
  onClose: () => void;
}

const SharePopup: React.FC<SharePopupProps> = ({ post, onClose }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const baseUrl = "http://localhost:3000";
  const postUrl = `${baseUrl}/post/${post._id}`;
  const quote = post.content ? post.content : "";

  // İsteğe bağlı: Daha sonra kullanılmak üzere arkadaşları yüklemek için
  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendsList = await fetchFriends();
        setFriends(friendsList);
      } catch (error) {
        console.error("Kullanıcı arkadaşları alınırken hata:", error);
      }
    };
    getFriends();
  }, []);

  // Arkadaşa gönderiyi paylaşma işleyicisi (gelecekte ihtiyaç duyulursa)
  const handleShareWithFriend = async (friend: Friend) => {
    try {
      await sharePostToFriend(friend._id, post);
      alert("Gönderi başarıyla paylaşıldı!");
      // Arkadaş ile sohbet ekranına yönlendir
      window.location.href = `${baseUrl}/chat?user=${friend._id}`;
    } catch (error) {
      console.error("Gönderi arkadaşa paylaşılırken hata:", error);
      alert("Gönderi paylaşılırken hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl p-6 shadow-2xl relative max-w-2xl w-full">
        {/* Üst Bilgi */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Paylaş</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:bg-gray-100 rounded-full p-2 transition duration-200 focus:outline-none"
          >
            <FaTimes size={20} />
          </button>
        </div>
        {/* Mesajla paylaş */}
        <div className="mb-6">
          <h3 className="text-md font-semibold text-gray-700 mb-2">
            Mesajla paylaş:
          </h3>
          <div className="flex items-center justify-center h-16 bg-gray-100 rounded-lg">
            <span className="text-xs text-gray-500">
              Mesajla paylaş özelliği çok yakında Paulih'de olacak.
            </span>
          </div>
        </div>
        {/* Sosyal paylaşım seçenekleri */}
        <div>
          <h3 className="text-md font-semibold text-gray-700 mb-2">Paylaş:</h3>
          <div className="flex justify-around">
            {[
              {
                icon: <FaCopy />,
                label: "URL Kopyala",
                onClick: async () => {
                  try {
                    await navigator.clipboard.writeText(postUrl);
                    alert("URL panoya kopyalandı!");
                  } catch (err) {
                    console.error("URL kopyalanamadı", err);
                  }
                },
              },
              {
                icon: <FaFacebook />,
                label: "Facebook",
                onClick: () => {
                  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    postUrl
                  )}&quote=${encodeURIComponent(quote)}`;
                  window.open(
                    facebookShareUrl,
                    "_blank",
                    "width=600,height=400"
                  );
                },
              },
              {
                icon: <FaWhatsapp />,
                label: "WhatsApp",
                onClick: () => {
                  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
                    postUrl
                  )}`;
                  window.open(
                    whatsappShareUrl,
                    "_blank",
                    "width=600,height=400"
                  );
                },
              },
              {
                icon: <FaInstagram />,
                label: "Instagram",
                onClick: async () => {
                  try {
                    await navigator.clipboard.writeText(postUrl);
                    alert(
                      "Instagram web üzerinden doğrudan URL paylaşımını desteklemiyor. Gönderi URL'si panoya kopyalandı. Instagram uygulamanızda yapıştırın."
                    );
                  } catch (err) {
                    console.error("URL kopyalanamadı", err);
                  }
                },
              },
              {
                icon: <FaTwitter />,
                label: "Twitter",
                onClick: () => {
                  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    postUrl
                  )}&text=${encodeURIComponent(quote)}`;
                  window.open(
                    twitterShareUrl,
                    "_blank",
                    "width=600,height=400"
                  );
                },
              },
              {
                icon: <FaEnvelope />,
                label: "Email",
                onClick: () => {
                  const subject = encodeURIComponent("Bu gönderiye göz atın!");
                  const body = encodeURIComponent(
                    `Bu gönderiye ilgi duyabileceğinizi düşündüm: ${postUrl}`
                  );
                  const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
                  window.open(mailtoUrl, "_self");
                },
              },
            ].map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="group flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 transition w-20"
              >
                <div className="p-2 rounded-full group-hover:bg-gray-100 flex items-center justify-center transition duration-200">
                  {React.cloneElement(item.icon, {
                    size: 20,
                    className: "text-black",
                  })}
                </div>
                <span className="text-xs font-medium mt-1 text-black text-center">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharePopup;

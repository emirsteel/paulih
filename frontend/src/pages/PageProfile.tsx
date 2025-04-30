// src/pages/PageProfile.tsx

import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import PagesInfo from "../components/PagesInfo";
import { fetchPageProfile } from "../services/api";
import { AuthUserContext } from "../context/AuthUserContext";
import Notification from "../components/Notification";
import MobileNavItems from "../components/MobileNavItems";

const PageProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const authContext = useContext(AuthUserContext);
  if (!authContext) {
    throw new Error("AuthUserContext must be used within AuthUserProvider");
  }
  const { user, loading: loadingUser } = authContext;

  // Notification state
  const [notification, setNotification] = useState({
    message: "",
    type: "",
    visible: false,
  });

  const showNotification = (message: string, type: string) => {
    setNotification({ message, type, visible: true });
    setTimeout(
      () => setNotification({ message: "", type: "", visible: false }),
      3000
    );
  };

  const getPageImageUrl = (imagePath: string) => {
    return imagePath
      ? `http://localhost:5001/uploads/${imagePath}`
      : "/default-page.png";
  };

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    setError(null);

    fetchPageProfile(username)
      .then((data) => {
        setPageData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching page:", err);
        setError("Sayfa bulunamadı.");
        setLoading(false);
      });
  }, [username]);

  const toggleModal = () => {
    showNotification(
      "Sayfa görselleri / bilgileri düzenleme modalı açılacak.",
      "info"
    );
  };

  if (loadingUser || loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-lg text-gray-600 animate-pulse">Yükleniyor...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </MainLayout>
    );
  }

  if (!pageData) {
    return (
      <MainLayout>
        <div className="p-4">
          <p>Sayfa bulunamadı.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {notification.visible && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() =>
            setNotification({ message: "", type: "", visible: false })
          }
        />
      )}

      {/* --- Responsive Layout --- */}
      <div className="mt-20 mb-4 px-4 md:ml-20 lg:mr-80 relative">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full max-w-none md:max-w-2xl mx-auto px-2 md:px-4">
            {/* Sayfa Bilgisi */}
            <PagesInfo
              pageData={pageData}
              getPageImageUrl={getPageImageUrl}
              user={user}
              toggleModal={toggleModal}
            />
            {/* İstersen buraya sayfa gönderileri vs ekleyebilirsin */}
          </div>
        </div>
      </div>

      {/* Mobil için alttan menü */}
      <MobileNavItems onOpenCreatePost={() => {}} username={user?.username} />
    </MainLayout>
  );
};

export default PageProfile;

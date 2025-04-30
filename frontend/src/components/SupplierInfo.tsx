import React, { useState } from "react";
import {
  FaStar,
  FaRegEdit,
  FaSave,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaBicycle,
  FaShoppingCart,
} from "react-icons/fa";
import {
  updateVenue,
  updateVenueBanner,
  updateVenueImage,
} from "../services/api";

interface Venue {
  _id: string;
  name: string;
  category: string;
  subcategory: string;
  location: { address: string; city: string };
  rating: number;
  phone: string;
  email: string;
  logo: string;
  photos: string[];
  description: string;
  deliveryTime: string;
  deliveryPrice: string;
  minimumPayment: string;
  discount: string;
  likedBy: string[];
  deliveryBy: string;
  paymentMethod: string[];
  menu: string[];
  username: string;
  activeDays: { day: string; open: string; close: string }[];
  banner?: string;
}

const SupplierInfo: React.FC<{ venue: Venue }> = ({ venue }) => {
  const [venueData, setVenueData] = useState<Venue>(venue);
  const [editing, setEditing] = useState(false);

  // Hardcoded müşteri yorumları
  const hardcodedReviews = [
    "Harika yemek ve çok hızlı teslimat!",
    "Tadı mükemmeldi ve porsiyonlar oldukça cömertti.",
    "Harika hizmet. Kesinlikle tekrar sipariş vereceğim!",
    "Teslimat zamanında geldi ve paketleme çok iyiydi.",
    "Döneri çok beğendim! Kesinlikle tavsiye ederim.",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "location.address") {
      setVenueData((prev) => ({
        ...prev,
        location: { ...prev.location, address: value },
      }));
    } else if (name === "location.city") {
      setVenueData((prev) => ({
        ...prev,
        location: { ...prev.location, city: value },
      }));
    } else {
      setVenueData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Week days array in Turkish
  const weekDays = [
    "Pazartesi",
    "Salı",
    "Çarşamba",
    "Perşembe",
    "Cuma",
    "Cumartesi",
    "Pazar",
  ];

  // Save handler: update venue data via API
  const handleSave = async () => {
    try {
      const response = await updateVenue(venueData._id, venueData);
      setVenueData(response.data);
      setEditing(false);
      alert("Bilgiler başarıyla güncellendi.");
    } catch (error) {
      console.error("Mekan güncelleme başarısız oldu:", error);
      alert("Güncelleme başarısız oldu.");
    }
  };

  // Handler for banner image upload
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await updateVenueBanner(venueData._id, formData);
      setVenueData(response.data);
      alert("Banner başarıyla yüklendi.");
    } catch (error) {
      console.error("Banner yükleme hatası:", error);
      alert("Banner yükleme başarısız oldu.");
    }
  };

  // Handler for profile image (logo) upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await updateVenueImage(venueData._id, formData);
      setVenueData(response.data);
      alert("Profil resmi başarıyla güncellendi.");
    } catch (error) {
      console.error("Profil resmi yükleme hatası:", error);
      alert("Profil resmi yükleme başarısız oldu.");
    }
  };

  return (
    <div className="p-5 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          Tedarikçi Bilgileri
        </h2>
        <button
          onClick={() => {
            if (editing) {
              handleSave();
            } else {
              setEditing(true);
            }
          }}
          className="flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-all bg-blue-500 text-white hover:bg-blue-600"
        >
          {editing ? (
            <>
              <FaSave className="mr-2" /> Kaydet
            </>
          ) : (
            <>
              <FaRegEdit className="mr-2" /> Düzenle
            </>
          )}
        </button>
      </div>

      {/* Banner Section */}
      <div className="mb-4">
        {venueData.banner ? (
          <img
            src={`http://localhost:5001/uploads/${venueData.banner}`}
            alt="Banner"
            className="w-full h-48 object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg text-gray-500">
            Banner Yok
          </div>
        )}
        {editing && (
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">
              Banner Güncelle
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerUpload}
              className="mt-1"
            />
          </div>
        )}
      </div>

      {/* Profile Image (Logo) Section */}
      <div className="mb-4">
        <img
          src={`http://localhost:5001/uploads/${venueData.logo}`}
          alt="Profil Resmi"
          className="w-24 h-24 rounded-full object-cover border-4 border-gray-300"
        />
        {editing && (
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700">
              Profil Resmi Güncelle
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="mt-1"
            />
          </div>
        )}
      </div>

      {/* Supplier Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sol Sütun: Temel Bilgiler ve Müşteri Yorumları */}
        <div className="flex flex-col items-center space-y-3 bg-gray-100 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold">
            {editing ? (
              <input
                type="text"
                name="name"
                value={venueData.name}
                onChange={handleChange}
                className="text-lg font-semibold border border-gray-300 rounded-md px-3 py-1 text-center"
              />
            ) : (
              venueData.name
            )}
          </h3>
          <span className="text-sm text-gray-500">
            {venueData.location.city}
          </span>
          {editing ? (
            <input
              type="text"
              name="category"
              value={venueData.category}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-1"
              placeholder="Kategori"
            />
          ) : (
            <p className="text-gray-700">Kategori: {venueData.category}</p>
          )}
          {editing ? (
            <input
              type="text"
              name="subcategory"
              value={venueData.subcategory}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-1"
              placeholder="Alt Kategori"
            />
          ) : (
            <p className="text-gray-700">
              Alt Kategori: {venueData.subcategory}
            </p>
          )}

          {/* Müşteri Yorumları */}
          <div className="w-full mt-4">
            <h3 className="text-sm font-medium text-gray-800 mb-2 text-center">
              Müşteri Yorumları
            </h3>
            <ul className="space-y-1 text-xs text-gray-600">
              {hardcodedReviews.map((review, index) => (
                <li key={index}>- {review}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sağ Sütun: İletişim, Adres, Diğer Bilgiler, Aktif Günler ve Fotoğraflar */}
        <div className="flex flex-col space-y-3 bg-gray-100 p-4 rounded-lg shadow">
          <div className="flex items-center text-gray-700">
            <FaMapMarkerAlt className="mr-2 text-blue-500" />
            {editing ? (
              <input
                type="text"
                name="location.address"
                value={venueData.location.address}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-1 w-full"
              />
            ) : (
              <span>{venueData.location.address}</span>
            )}
          </div>
          <div className="flex items-center text-gray-700">
            <FaPhone className="mr-2 text-blue-500" />
            {editing ? (
              <input
                type="text"
                name="phone"
                value={venueData.phone}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-1 w-full"
              />
            ) : (
              <span>{venueData.phone}</span>
            )}
          </div>
          <div className="flex items-center text-gray-700">
            <FaEnvelope className="mr-2 text-blue-500" />
            {editing ? (
              <input
                type="email"
                name="email"
                value={venueData.email}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-1 w-full"
              />
            ) : (
              <span>{venueData.email}</span>
            )}
          </div>
          <div className="flex items-center text-gray-700">
            <FaBicycle className="mr-2 text-gray-500" />
            {editing ? (
              <input
                type="text"
                name="deliveryTime"
                value={venueData.deliveryTime}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-1 w-full"
                placeholder="Teslimat Süresi"
              />
            ) : (
              <span>Teslimat Süresi: {venueData.deliveryTime}</span>
            )}
          </div>
          <div className="flex items-center text-gray-700">
            <FaShoppingCart className="mr-2 text-gray-500" />
            {editing ? (
              <input
                type="text"
                name="minimumPayment"
                value={venueData.minimumPayment}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-1 w-full"
                placeholder="Minimum Ödeme"
              />
            ) : (
              <span>Min. Ödeme: {venueData.minimumPayment}</span>
            )}
          </div>
          <div className="flex items-center text-gray-700">
            <FaStar className="mr-2 text-yellow-500" />
            <span>{venueData.rating}/5</span>
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Teslimat Ücreti</label>
            {editing ? (
              <input
                type="text"
                name="deliveryPrice"
                value={venueData.deliveryPrice}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-1"
                placeholder="Teslimat Ücreti"
              />
            ) : (
              <span>{venueData.deliveryPrice}</span>
            )}
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">İndirim</label>
            {editing ? (
              <input
                type="text"
                name="discount"
                value={venueData.discount}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-3 py-1"
                placeholder="İndirim"
              />
            ) : (
              <span>{venueData.discount}</span>
            )}
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">
              Kullanılan Ödeme Yöntemleri
            </label>
            {editing ? (
              <input
                type="text"
                name="paymentMethod"
                value={venueData.paymentMethod.join(", ")}
                onChange={(e) =>
                  setVenueData({
                    ...venueData,
                    paymentMethod: e.target.value
                      .split(",")
                      .map((v) => v.trim()),
                  })
                }
                className="border border-gray-300 rounded-md px-3 py-1"
                placeholder="Ödeme Yöntemlerini Virgülle Ayırın"
              />
            ) : (
              <span>{venueData.paymentMethod.join(", ") || "Yok"}</span>
            )}
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Menü</label>
            {editing ? (
              <input
                type="text"
                name="menu"
                value={venueData.menu.join(", ")}
                onChange={(e) =>
                  setVenueData({
                    ...venueData,
                    menu: e.target.value.split(",").map((v) => v.trim()),
                  })
                }
                className="border border-gray-300 rounded-md px-3 py-1"
                placeholder="Menüleri Virgülle Ayırın"
              />
            ) : (
              <span>{venueData.menu.join(", ") || "Yok"}</span>
            )}
          </div>

          {/* Aktif Günler as a Calendar */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium mb-2">
              Aktif Günler
            </label>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => {
                const activeDay = venueData.activeDays.find(
                  (d) => d.day === day
                );
                return (
                  <div
                    key={day}
                    className="border rounded p-2 text-center text-xs"
                  >
                    <div className="font-semibold">{day}</div>
                    {editing ? (
                      <div>
                        <input
                          type="text"
                          placeholder="Açılış"
                          value={activeDay ? activeDay.open : ""}
                          onChange={(e) => {
                            const newOpen = e.target.value;
                            let newActiveDays = [...venueData.activeDays];
                            const index = venueData.activeDays.findIndex(
                              (d) => d.day === day
                            );
                            if (index !== -1) {
                              newActiveDays[index] = {
                                ...newActiveDays[index],
                                open: newOpen,
                              };
                            } else {
                              newActiveDays.push({
                                day,
                                open: newOpen,
                                close: "",
                              });
                            }
                            setVenueData({
                              ...venueData,
                              activeDays: newActiveDays,
                            });
                          }}
                          className="border border-gray-300 rounded-md px-1 py-0.5 w-full text-xs mb-1"
                        />
                        <input
                          type="text"
                          placeholder="Kapanış"
                          value={activeDay ? activeDay.close : ""}
                          onChange={(e) => {
                            const newClose = e.target.value;
                            let newActiveDays = [...venueData.activeDays];
                            const index = venueData.activeDays.findIndex(
                              (d) => d.day === day
                            );
                            if (index !== -1) {
                              newActiveDays[index] = {
                                ...newActiveDays[index],
                                close: newClose,
                              };
                            } else {
                              newActiveDays.push({
                                day,
                                open: "",
                                close: newClose,
                              });
                            }
                            setVenueData({
                              ...venueData,
                              activeDays: newActiveDays,
                            });
                          }}
                          className="border border-gray-300 rounded-md px-1 py-0.5 w-full text-xs"
                        />
                      </div>
                    ) : activeDay ? (
                      <div>
                        {activeDay.open} - {activeDay.close}
                      </div>
                    ) : (
                      <div className="text-red-500">Kapalı</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fotoğraflar */}
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Fotoğraflar</label>
            {editing ? (
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  className="border border-gray-300 rounded-md px-3 py-1"
                />
                <div className="flex flex-wrap gap-2">
                  {venueData.photos.map((url, index) => (
                    <img
                      key={index}
                      src={`http://localhost:5001/uploads/${url}`}
                      alt={`Fotoğraf ${index + 1}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {venueData.photos.map((url, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5001/uploads/${url}`}
                    alt={`Fotoğraf ${index + 1}`}
                    className="w-16 h-16 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierInfo;

import React, { useState, useEffect, useContext } from "react";
import { MdMyLocation } from "react-icons/md";
import {
  getUserAddresses,
  saveOrderAddress,
  updateSelectedAddress,
  updateOrderAddress,
  deleteOrderAddress,
} from "../services/api";
import { AuthUserContext } from "../context/AuthUserContext";
import {
  FaArrowRight,
  FaTimes,
  FaHeart,
  FaHome,
  FaCheckCircle,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Helper functions to calculate distance using the Haversine formula
const deg2rad = (deg: number) => deg * (Math.PI / 180);

const getDistanceFromLatLonInKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Helper function to truncate text after a given length
const truncate = (str: string, maxLength: number) =>
  str.length > maxLength ? str.slice(0, maxLength) + "..." : str;

interface Address {
  _id: string;
  addressTitle: string;
  addressDescription: string;
  address: string;
  latitude: number;
  longitude: number;
  selectedTag: string;
  isSelected: boolean;
  apartment?: string;
  flat?: string;
  floor?: string;
  phoneNumber?: string;
  noteToCourier?: string;
}

const LocationPopup: React.FC<{
  onClose: () => void;
  onNext: (addressTitle: string, icon: string) => void;
}> = ({ onClose, onNext }) => {
  const { user } = useContext(AuthUserContext);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [address, setAddress] = useState<string>("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [step, setStep] = useState(1);
  const [selectedIcon, setSelectedIcon] = useState<string>("home");

  // Additional fields for order address
  const [addressTitle, setAddressTitle] = useState<string>("");
  const [apartment, setApartment] = useState<string>("");
  const [flat, setFlat] = useState<string>("");
  const [floor, setFloor] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [addressDescription, setAddressDescription] = useState<string>("");
  const [noteToCourier, setNoteToCourier] = useState<string>("");

  // Fixed coordinate for Hacettepe
  const allowedLat = 39.868378;
  const allowedLon = 32.732107;
  const allowedRadiusKm = 1;

  useEffect(() => {
    if (user) {
      fetchSavedAddresses();
    }
  }, [user]);

  const fetchSavedAddresses = async () => {
    try {
      const addresses = await getUserAddresses(user._id);
      setSavedAddresses(addresses);
      const selectedAddr = addresses.find((addr) => addr.isSelected);
      if (selectedAddr) {
        setSelectedAddress(selectedAddr);
        setAddress(selectedAddr.address);
        setLatitude(selectedAddr.latitude);
        setLongitude(selectedAddr.longitude);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleSelectAddress = (selected: Address) => {
    setSelectedAddress(selected);
    setAddress(selected.address);
    setLatitude(selected.latitude);
    setLongitude(selected.longitude);
  };

  const handleEditAddress = (addr: Address) => {
    setSelectedAddress(addr);
    setAddress(addr.address);
    setLatitude(addr.latitude);
    setLongitude(addr.longitude);
    setAddressTitle(addr.addressTitle);
    setAddressDescription(addr.addressDescription);
    setSelectedIcon(addr.selectedTag);
    setApartment(addr.apartment || "");
    setFlat(addr.flat || "");
    setFloor(addr.floor || "");
    setPhoneNumber(addr.phoneNumber || "");
    setNoteToCourier(addr.noteToCourier || "");
    setStep(3);
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await deleteOrderAddress(addressId);
        alert("Adres başarıyla silindi!");
        fetchSavedAddresses();
      } catch (error) {
        console.error("Error deleting address:", error);
        alert("Adres silinirken hata oluştu!");
      }
    }
  };

  const handleSaveAddress = async () => {
    if (!user) {
      alert("Giriş yapmalısınız!");
      return;
    }

    const addressData = {
      userId: user._id,
      addressTitle,
      apartment,
      flat,
      floor,
      phoneNumber,
      addressDescription,
      noteToCourier,
      latitude,
      longitude,
      selectedTag: selectedIcon,
    };

    try {
      if (selectedAddress && selectedAddress._id) {
        await updateOrderAddress(selectedAddress._id, addressData);
        alert("Adres başarıyla güncellendi!");
      } else {
        await saveOrderAddress(addressData);
        alert("Adres başarıyla kaydedildi!");
      }
      fetchSavedAddresses();
      onClose();
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Adres kaydedilirken hata oluştu!");
    }
  };

  const handleUseThisAddress = async () => {
    if (selectedAddress && user?._id) {
      try {
        await updateSelectedAddress(user._id, selectedAddress._id);
        onNext(selectedAddress.addressTitle, selectedAddress.selectedTag);
        onClose();
      } catch (error) {
        console.error("Error updating selected address:", error);
      }
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
            .then((response) => response.json())
            .then((data) => {
              setAddress(data.display_name);
              setLatitude(latitude);
              setLongitude(longitude);
            })
            .catch(() => setAddress("Konum algılanamadı"));
        },
        () => setAddress("Konum algılanamadı")
      );
    } else {
      alert("Tarayıcınız konum servislerini desteklemiyor.");
    }
  };

  const getTagIcon = (tag: string) => {
    switch (tag) {
      case "home":
        return "🏡";
      case "heart":
        return "💖";
      case "work":
        return "🏢";
      case "school":
        return "🎓";
      default:
        return "📍";
    }
  };

  const isWithinAllowedArea = () => {
    if (latitude === null || longitude === null) return false;
    const distance = getDistanceFromLatLonInKm(
      latitude,
      longitude,
      allowedLat,
      allowedLon
    );
    return distance <= allowedRadiusKm;
  };

  const handleNextStep = () => {
    if (!isWithinAllowedArea()) {
      alert("Paulih şu an bu adrese hizmet vermiyor.");
      return;
    }
    if (step === 1 && address) setStep(2);
    else if (step === 2) setStep(3);
  };

  const customIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setLatitude(e.latlng.lat);
        setLongitude(e.latlng.lng);
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`
        )
          .then((response) => response.json())
          .then((data) => setAddress(data.display_name));
      },
    });

    return latitude && longitude ? (
      <Marker position={[latitude, longitude]} icon={customIcon} />
    ) : null;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative bg-white p-4 rounded-lg shadow-lg w-full max-w-xl max-h-[80vh] overflow-y-auto">
        {/* Close Button */}
        <button
          className="absolute top-3 right-4 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition z-[9999] shadow-lg"
          onClick={onClose}
        >
          <FiX size={20} className="text-gray-600" />
        </button>

        {step === 1 && (
          <>
            <h2 className="text-md font-medium text-gray-700 mb-5">
              Yeni Adres Ekle
            </h2>

            {/* Address Input */}
            <div className="flex items-center border border-gray-300 rounded-lg p-2">
              <input
                type="text"
                className="flex-grow outline-none text-gray-800 text-sm px-2"
                placeholder="Adresinizi girin veya haritadan seçin..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {address && (
                <button
                  onClick={() => setAddress("")}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={16} />
                </button>
              )}
              <button
                onClick={handleGetLocation}
                className="text-amber-500 hover:text-amber-600 ml-2"
              >
                <MdMyLocation size={20} />
              </button>
              <button
                onClick={handleNextStep}
                className="bg-blue-600 text-white p-2 rounded-lg ml-2 hover:bg-blue-700"
              >
                <FaArrowRight size={16} />
              </button>
            </div>
            {latitude && longitude && !isWithinAllowedArea() && (
              <p className="text-red-500 mt-2">
                Paulih şu an bu adrese hizmet vermiyor.
              </p>
            )}

            {/* Display Saved Addresses */}
            <div className="mb-5 mt-3">
              <h2 className="text-md font-medium text-gray-700 mb-3">
                Kayıtlı Adresler
              </h2>
              <ul className="space-y-2 overflow-y-auto max-h-64">
                {savedAddresses.map((addr) => (
                  <li key={addr._id} className="relative group">
                    <div
                      className={`flex items-center px-3 py-2 rounded-lg text-sm transition w-full cursor-pointer ${
                        selectedAddress?._id === addr._id
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                      }`}
                      onClick={() => handleSelectAddress(addr)}
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">
                            {getTagIcon(addr.selectedTag)}
                          </span>
                          <span className="text-md font-semibold">
                            {addr.addressTitle.length > 6
                              ? addr.addressTitle.slice(0, 6) + "..."
                              : addr.addressTitle}
                          </span>
                          <div className="w-[1px] h-4 bg-gray-300"></div>
                          <div className="relative max-w-[400px] truncate text-gray-500 text-sm">
                            {truncate(addr.addressDescription, 45)}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 truncate">
                          {addr.address}
                        </div>
                      </div>
                      <div className="ml-auto flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditAddress(addr);
                          }}
                          title="Düzenle"
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <FaEdit size={16} className="text-gray-600" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(addr._id);
                          }}
                          title="Sil"
                          className="p-1 hover:bg-red-200 rounded"
                        >
                          <FaTrash size={16} className="text-red-600" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleUseThisAddress}
                className="w-full bg-blue-600 text-white p-2 mt-3 rounded"
              >
                Bu Adresi Kullan
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-md font-medium text-gray-700 mb-5 font-semibold">
              Tam Konumunuz Nedir?
            </h2>
            <div className="flex items-center border border-gray-300 rounded-lg p-2 mb-4">
              <input
                type="text"
                className="flex-grow outline-none text-gray-800 text-sm px-2"
                placeholder="Adresinizi girin veya haritadan seçin..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    fetch(
                      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                        address
                      )}`
                    )
                      .then((response) => response.json())
                      .then((data) => {
                        if (data.length > 0) {
                          const { lat, lon } = data[0];
                          setLatitude(parseFloat(lat));
                          setLongitude(parseFloat(lon));
                        }
                      });
                  }
                }}
              />
              {address && (
                <button
                  onClick={() => setAddress("")}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={16} />
                </button>
              )}
              <button
                onClick={handleGetLocation}
                className="text-amber-500 hover:text-amber-600 ml-2"
              >
                <MdMyLocation size={20} />
              </button>
            </div>
            {latitude && longitude && !isWithinAllowedArea() && (
              <p className="text-red-500 mt-2">
                {" "}
                Paulih şu an bu adrese hizmet vermiyor.
              </p>
            )}
            <MapContainer
              center={[latitude || 38.4192, longitude || 27.1287]}
              zoom={13}
              style={{ height: "300px", width: "100%" }}
              className="rounded-lg"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationMarker />
            </MapContainer>
            <button
              onClick={handleNextStep}
              className="w-full bg-blue-600 text-white p-2 rounded mt-4"
            >
              İleri
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-md font-medium text-gray-700 mb-5 font-semibold">
              Adres Detayları
            </h2>
            <div className="relative">
              <MapContainer
                center={[latitude || 38.4192, longitude || 27.1287]}
                zoom={15}
                style={{ height: "200px", width: "100%" }}
                className="rounded-lg"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker
                  position={[latitude || 38.4192, longitude || 27.1287]}
                  icon={customIcon}
                />
              </MapContainer>
              <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow">
                <FaEdit />
              </button>
            </div>
            <p
              className="text-sm mt-3 bg-gray-100 p-2 rounded-lg cursor-pointer hover:bg-gray-200 transition flex items-center gap-2"
              onClick={() => setStep(2)}
            >
              📍 {address}
            </p>
            <div className="mb-4">
              <h3 className="text-gray-700 text-sm font-medium mt-3 mb-2">
                Bir Etiket Ekle
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { icon: "🏡", label: "Ev", value: "home" },
                  { icon: "💖", label: "Eş", value: "heart" },
                  { icon: "🏢", label: "İş", value: "work" },
                  { icon: "🎓", label: "Okul", value: "school" },
                ].map((item) => (
                  <button
                    key={item.value}
                    className={`flex flex-col items-center p-2 w-full rounded-lg transition ${
                      selectedIcon === item.value
                        ? "bg-blue-100"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedIcon(item.value)}
                  >
                    <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md">
                      <span className="text-xl">{item.icon}</span>
                    </div>
                    <span className="text-[10px] text-gray-700 mt-1 font-medium">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            {[
              {
                label: "Adres Başlığı",
                state: addressTitle,
                setter: setAddressTitle,
                maxLength: 16,
              },
              { label: "Apartman", state: apartment, setter: setApartment },
              { label: "Daire", state: flat, setter: setFlat },
              { label: "Kat", state: floor, setter: setFloor },
              {
                label: "Telefon Numarası",
                state: phoneNumber,
                setter: setPhoneNumber,
              },
              {
                label: "Adres Tarifi",
                state: addressDescription,
                setter: setAddressDescription,
              },
            ].map(({ label, state, setter, maxLength }, index) => (
              <div className="relative w-full mb-4" key={index}>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setter(e.target.value)}
                  maxLength={maxLength}
                  className="w-full px-4 pt-3 pb-1 border border-gray-300 rounded-lg shadow focus:outline-none peer"
                  placeholder=" "
                />
                <label className="absolute left-4 px-1 bg-white text-sm transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-blue-500 peer-focus:bg-white">
                  {label}
                </label>
              </div>
            ))}
            <div className="relative w-full mb-4">
              <textarea
                value={noteToCourier}
                onChange={(e) => setNoteToCourier(e.target.value)}
                className="w-full px-4 pt-3 pb-1 border border-gray-300 rounded-lg shadow focus:outline-none peer resize-none h-24"
                placeholder=" "
              />
              <label className="absolute left-4 px-1 bg-white text-sm transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-red-500 peer-focus:bg-white">
                Kuryeye Not (Opsiyonel)
              </label>
            </div>
            <button
              onClick={handleSaveAddress}
              className="w-full bg-blue-600 text-white p-2 rounded"
            >
              Adresi Kaydet
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LocationPopup;

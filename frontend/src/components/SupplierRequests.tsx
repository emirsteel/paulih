import React, { useState } from "react";
import { submitRequest } from "../services/api";
import {
  FaPaperPlane,
  FaUpload,
  FaFileAlt,
  FaChevronDown,
} from "react-icons/fa";

const SupplierRequests: React.FC = () => {
  const [formData, setFormData] = useState({
    supplierName: "",
    email: "",
    phone: "",
    requestType: "",
    message: "",
  });

  const [attachment, setAttachment] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "video/mp4",
      ];
      if (!allowedTypes.includes(file.type)) {
        setError(
          "Geçersiz dosya türü. Lütfen bir resim, video, PDF veya belge yükleyin."
        );
        return;
      }
      setAttachment(file);
      setError(""); // Geçerli dosya ise hatayı sıfırla
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      if (attachment) {
        formDataToSend.append("attachment", attachment);
      }

      const response = await submitRequest(formDataToSend);
      if (response.status === 201) {
        setSuccess(true);
        setFormData({
          supplierName: "",
          email: "",
          phone: "",
          requestType: "",
          message: "",
        });
        setAttachment(null);
      }
    } catch (err) {
      console.error("Request submission error:", err);
      setError("Gönderim sırasında bir hata oluştu, lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg border">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
        Tedarikçi Formu
      </h2>

      {success && (
        <p className="text-green-600 text-center mb-3">
          Form başarıyla gönderildi!
        </p>
      )}
      {error && <p className="text-red-500 text-center mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tedarikçi Adı */}
        <div className="relative w-full">
          <input
            type="text"
            name="supplierName"
            id="supplierName"
            className="w-full px-4 pt-3 pb-1 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-0 transition peer"
            placeholder=" "
            value={formData.supplierName}
            onChange={handleChange}
            required
          />
          <label
            htmlFor="supplierName"
            className="absolute left-4 px-1 bg-white text-sm transition-all duration-200 
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-blue-500"
          >
            Tedarikçi Adı
          </label>
        </div>

        {/* E-posta & Telefon - Yan Yana */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* E-posta */}
          <div className="relative w-full">
            <input
              type="email"
              name="email"
              id="email"
              className="w-full px-4 pt-3 pb-1 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-0 transition peer"
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label
              htmlFor="email"
              className="absolute left-4 px-1 bg-white text-sm transition-all duration-200 
                peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-blue-500"
            >
              E-posta
            </label>
          </div>

          {/* Telefon */}
          <div className="relative w-full">
            <input
              type="tel"
              name="phone"
              id="phone"
              className="w-full px-4 pt-3 pb-1 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-0 transition peer"
              placeholder=" "
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <label
              htmlFor="phone"
              className="absolute left-4 px-1 bg-white text-sm transition-all duration-200 
                peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-blue-500"
            >
              Telefon Numarası
            </label>
          </div>
        </div>

        {/* Özel İstek Türü Açılır Menüsü */}
        <div className="relative w-full">
          <label className="absolute left-4 px-1 bg-white text-sm transition-all duration-200 text-gray-500">
            Form Türü
          </label>
          <div className="relative">
            <select
              name="requestType"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 hover:bg-gray-200 transition appearance-none"
              value={formData.requestType}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Form Türü Seçiniz
              </option>
              <option value="order_issue">Sipariş Sorunu</option>
              <option value="payment_issue">Ödeme Sorunu</option>
              <option value="partnership">Ortaklık İsteği</option>
              <option value="other">Diğer</option>
            </select>
            <FaChevronDown className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Mesaj Girişi */}
        <div className="relative w-full">
          <textarea
            name="message"
            rows={4}
            id="message"
            className="w-full px-4 pt-3 pb-1 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-0 transition peer"
            placeholder=" "
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <label
            htmlFor="message"
            className="absolute left-4 px-1 bg-white text-sm transition-all duration-200 
              peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-blue-500"
          >
            Mesaj
          </label>
        </div>

        {/* Dosya Yükleme */}
        <div className="relative w-full">
          <label className="flex items-center space-x-2 text-gray-700 font-medium cursor-pointer bg-gray-100 px-4 py-3 rounded-lg hover:bg-blue-100 transition">
            <FaUpload className="text-blue-500" />
            <span>
              Bir dosya ekleyin{" "}
              <span className="text-amber-500 text-xs">(İsteğe bağlı)</span>
            </span>
            <input
              type="file"
              name="attachment"
              accept="image/*,video/*,.pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          {attachment && (
            <p className="text-sm text-gray-500 mt-1 flex items-center">
              <FaFileAlt className="mr-2" /> {attachment.name}
            </p>
          )}
        </div>

        {/* Gönder Butonu */}
        <button
          type="submit"
          className="w-full flex justify-center items-center bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          <FaPaperPlane className="mr-2" />{" "}
          {loading ? "Gönderiliyor..." : "Gönder"}
        </button>
      </form>
    </div>
  );
};

export default SupplierRequests;

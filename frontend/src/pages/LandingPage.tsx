import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaLinkedin,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { Bird, Megaphone, Share2, Users } from "lucide-react";
import LandingPageUsers from "../components/Landing/LandingPageUsers";

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // State for triggering the fade-in animation
  const [animate, setAnimate] = useState(false);
  // State for cookie consent banner visibility
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  // If user is already authenticated, redirect to /home
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  // Trigger fade-in animation after component mounts
  useEffect(() => {
    setAnimate(true);
  }, []);

  // Check for cookie consent in localStorage when component mounts
  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowCookieBanner(true);
    }
  }, []);

  // Handlers for cookie acceptance/rejection
  const handleAcceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowCookieBanner(false);
  };

  const handleRejectCookies = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setShowCookieBanner(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.7 } },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  };

  return (
    <motion.div
      className={`w-full min-h-screen flex flex-col transition-opacity duration-700 ${
        animate ? "opacity-100" : "opacity-0"
      }`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* HEADER */}
      <motion.header
        className="w-full bg-white shadow-sm border-b border-gray-200"
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo + Brand */}
          <Link
            to="/"
            className="flex items-center space-x-2 hover:text-blue-700 transition"
          >
            <Bird size={24} className="text-blue-600" />
            <span className="text-xl font-semibold tracking-tight text-black">
              Paulih
            </span>
          </Link>

          {/* Navigation */}
          <nav className="space-x-6">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition cursor-pointer"
            >
              Giriş
            </Link>
            <Link
              to="/signup"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition cursor-pointer"
            >
              Kayıt Ol
            </Link>
          </nav>
        </div>
      </motion.header>

      {/* HERO SECTION */}
      <motion.section
        className="w-full bg-gradient-to-b from-white via-blue-50 to-white py-16 md:py-28"
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center">
          {/* Left Content */}
          <div className="md:w-1/2 md:pr-12 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              <span className="text-blue-600">Paulih</span> ile
              <br />
              Kampüs Deneyimini Yeniden Tanımlayın
            </h1>
            <p className="text-gray-600 text-lg md:text-xl mb-10 max-w-xl">
              Arkadaşlık kurun, dersleri organize edin, etkinlikleri takip edin.
              Paulih, Hacettepe hayatınızı akıllıca yönetmeniz için ihtiyacınız
              olan her şeyi tek bir platformda sunar.
            </p>
            <Link
              to="/signup"
              className="inline-block bg-blue-600 text-white py-3 px-7 rounded-full text-lg font-semibold shadow-lg hover:bg-blue-700 transition"
            >
              Hemen Başlayın
            </Link>
          </div>

          {/* Right Image */}
          <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center relative">
            <div className="relative w-[360px] md:w-[460px] transform rotate-[-3deg] hover:rotate-[-1deg] transition duration-500 ease-in-out">
              {/* Background layer */}
              <div className="absolute inset-0 bg-blue-100 rounded-3xl -rotate-3 z-0 scale-[1.05] translate-x-4 translate-y-4 shadow-xl" />

              {/* Image */}
              <img
                src="https://hacettepe.edu.tr/images/hacettepe_galeri/14.jpg"
                alt="Üniversite Hayatı"
                className="relative z-10 w-full rounded-3xl object-cover shadow-2xl border border-white"
              />

              {/* Floating Badge */}
              <div className="absolute top-4 left-4 bg-blue-600 text-white text-[11px] font-bold px-3 py-1 rounded-full rotate-[-12deg] shadow-md z-20">
                Öğrenci Odaklı
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* "Size Yardımcı Olmak İçin Buradayız" */}
      <motion.section
        className="w-full py-20 bg-[radial-gradient(circle_at_top_left,_#f0f4ff,_#ffffff)]"
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-14">
            Size Yardımcı Olmak İçin Buradayız
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Card 1 */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 hover:shadow-md transition group">
              <div className="w-14 h-14 flex items-center justify-center mx-auto mb-5 rounded-full bg-white/60 backdrop-blur-sm border border-blue-100 group-hover:shadow-blue-200 group-hover:shadow-md transition">
                <Users size={28} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Arkadaşlarınızı Keşfedin
              </h3>
              <p className="text-gray-600 text-sm">
                Sınıf arkadaşlarınızı bulun, yeni insanlarla tanışın ve sosyal
                çevrenizi genişletin.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 hover:shadow-md transition group">
              <div className="w-14 h-14 flex items-center justify-center mx-auto mb-5 rounded-full bg-white/60 backdrop-blur-sm border border-blue-100 group-hover:shadow-blue-200 group-hover:shadow-md transition">
                <Share2 size={28} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Bilgi Paylaşın
              </h3>
              <p className="text-gray-600 text-sm">
                Ders notlarınızı, etkinlik duyurularınızı ve kampüs haberlerini
                paylaşın.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 hover:shadow-md transition group">
              <div className="w-14 h-14 flex items-center justify-center mx-auto mb-5 rounded-full bg-white/60 backdrop-blur-sm border border-blue-100 group-hover:shadow-blue-200 group-hover:shadow-md transition">
                <Megaphone size={28} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Kampüs Güncellemeleri
              </h3>
              <p className="text-gray-600 text-sm">
                Üniversitenizdeki en güncel etkinlikleri, haberleri ve
                duyuruları anında öğrenin.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="bg-gradient-to-b from-blue-50 to-white py-20 px-4 sm:px-8"
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">
            Paulih'in Özellikleri
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Card 1 */}
            <Link
              to="/signup"
              className="relative rounded-2xl overflow-hidden group shadow-xl transition-all hover:shadow-2xl"
            >
              <img
                src="https://images.pexels.com/photos/3314294/pexels-photo-3314294.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Anlık Bildirimler"
                className="w-full h-[420px] object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-20 transition duration-300"></div>

              <div className="absolute top-4 left-4">
                <button className="bg-white text-sm font-medium text-gray-900 px-4 py-1.5 rounded-full shadow">
                  Daha Fazlası İçin
                </button>
              </div>
              <div className="absolute top-4 right-4 bg-white w-9 h-9 rounded-full flex items-center justify-center shadow">
                <span className="text-lg">↗</span>
              </div>
              <div className="absolute bottom-16 left-4 text-white text-xl font-semibold drop-shadow-lg">
                Anlık Bildirimler
              </div>
              <div className="absolute bottom-4 left-4 text-white text-sm max-w-xs text-left drop-shadow-md">
                Etkinliklerden, mesajlardan ve kampüs duyurularından anında
                haberdar olun.
              </div>
            </Link>

            {/* Card 2 */}
            <Link
              to="/signup"
              className="relative rounded-2xl overflow-hidden group shadow-xl transition-all hover:shadow-2xl"
            >
              <img
                src="https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg"
                alt="Mesajlaşma"
                className="w-full h-[420px] object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-20 transition duration-300"></div>

              <div className="absolute top-4 left-4">
                <button className="bg-white text-sm font-medium text-gray-900 px-4 py-1.5 rounded-full shadow">
                  Daha Fazlası İçin
                </button>
              </div>
              <div className="absolute top-4 right-4 bg-white w-9 h-9 rounded-full flex items-center justify-center shadow">
                <span className="text-lg">↗</span>
              </div>
              <div className="absolute bottom-16 left-4 text-white text-xl font-semibold drop-shadow-lg">
                Mesajlaşma
              </div>
              <div className="absolute bottom-4 left-4 text-white text-sm max-w-xs text-left drop-shadow-md">
                Tek tıkla arkadaşlarınıza mesaj gönderin, grup sohbetlerine
                katılın.
              </div>
            </Link>

            {/* Card 3 */}
            <Link
              to="/signup"
              className="relative rounded-2xl overflow-hidden group shadow-xl transition-all hover:shadow-2xl"
            >
              <img
                src="https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg"
                alt="Etkinlik Takvimi"
                className="w-full h-[420px] object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-20 transition duration-300"></div>

              <div className="absolute top-4 left-4">
                <button className="bg-white text-sm font-medium text-gray-900 px-4 py-1.5 rounded-full shadow">
                  Daha Fazlası İçin
                </button>
              </div>
              <div className="absolute top-4 right-4 bg-white w-9 h-9 rounded-full flex items-center justify-center shadow">
                <span className="text-lg">↗</span>
              </div>
              <div className="absolute bottom-16 left-4 text-white text-xl font-semibold drop-shadow-lg">
                Etkinlik Takvimi
              </div>
              <div className="absolute bottom-4 left-4 text-white text-sm max-w-xs text-left drop-shadow-md">
                Sınavlar, seminerler ve kampüs etkinlikleri elinizin altında.
              </div>
            </Link>
          </div>
        </div>
      </motion.section>

      <LandingPageUsers sectionVariants={sectionVariants} />

      {/* İSTATİSTİKLER */}
      <motion.section
        className="relative bg-gradient-to-b from-white via-blue-50 to-white py-24 px-4 sm:px-8 overflow-hidden"
        variants={sectionVariants}
      >
        {/* Decorative Dots */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-blue-200 rounded-full animate-bounce delay-100" />
        <div className="absolute bottom-10 right-10 w-2 h-2 bg-blue-300 rounded-full animate-pulse delay-200" />
        <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-blue-100 rounded-full animate-pulse delay-500" />
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-blue-100 rounded-full animate-bounce delay-700" />

        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-16">
            Güvenilirlik Rakamlarla Kanıtlanır
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {/* Stat 1 */}
            <div className="bg-white/60 backdrop-blur-md border border-blue-100 rounded-2xl shadow-lg p-8">
              <h3 className="text-4xl font-extrabold text-blue-600 mb-2">
                10K+
              </h3>
              <p className="text-gray-800 font-medium">
                Paulih Kullanan Öğrenci
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Hacettepe'deki öğrenciler Paulih ile buluştu.
              </p>
            </div>

            {/* Stat 2 */}
            <div className="bg-white/60 backdrop-blur-md border border-blue-100 rounded-2xl shadow-lg p-8">
              <h3 className="text-4xl font-extrabold text-blue-600 mb-2">1</h3>
              <p className="text-gray-800 font-medium">Üniversite Desteği</p>
              <p className="text-gray-500 text-sm mt-2">
                Hacettepe'nin platformu sadece Hacettepe'ye özeldir.
              </p>
            </div>

            {/* Stat 3 */}
            <div className="bg-white/60 backdrop-blur-md border border-blue-100 rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-extrabold text-blue-600 mb-2">
                Ücretsiz
              </h3>
              <p className="text-gray-800 font-medium">
                Hacettepe Öğrencilerine Özel
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Tüm özellikler Hacettepe öğrencilerine %100 ücretsiz sunuluyor.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ÜCRETSİZ PLAN */}
      <motion.section
        className="bg-gradient-to-b from-blue-50 via-white to-white py-24 px-4 sm:px-8"
        variants={sectionVariants}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6">
            Ücretsiz Plan
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-12">
            Hacettepe Üniversitesi öğrencilerine özel olarak sunulan ücretsiz
            planımızla, tüm temel özelliklere{" "}
            <span className="font-semibold text-blue-600">limitsiz erişim</span>{" "}
            sağlayın.
          </p>

          <div className="relative bg-white shadow-2xl border border-blue-100 backdrop-blur-lg rounded-2xl px-10 py-12 text-left max-w-xl mx-auto">
            {/* Badge */}
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs uppercase px-4 py-1 rounded-full shadow-md tracking-wider">
              Hacettepe’ye Özel
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-1">
              Ücretsiz
            </h3>
            <p className="text-5xl font-extrabold text-blue-600 mb-6">0 TL</p>

            <ul className="space-y-4 text-gray-700 text-sm mb-8">
              <li className="flex items-center gap-3">
                <span className="text-blue-500 font-bold text-lg">✓</span>
                Limitsiz kullanıcı erişimi
              </li>
              <li className="flex items-center gap-3">
                <span className="text-blue-500 font-bold text-lg">✓</span>
                Temel gösterge panelleri
              </li>
              <li className="flex items-center gap-3">
                <span className="text-blue-500 font-bold text-lg">✓</span>
              </li>
            </ul>

            <div className="text-center">
              <Link
                to="/signup"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-sm font-semibold shadow-lg transition-all hover:shadow-xl"
              >
                Hemen Katıl
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* SON CTA */}
      <motion.section
        className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 py-24 px-4 sm:px-8 text-white overflow-hidden"
        variants={sectionVariants}
      >
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Üniversite Hayatınızı Zenginleştirmeye Hazır mısınız?
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-xl mx-auto">
            Bugün kaydolun, arkadaşlarınızla bağlantı kurun ve kampüs yaşamınızı
            daha verimli hale getirin.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-white text-blue-700 px-8 py-3 rounded-full font-semibold text-sm shadow-md hover:shadow-xl transition-all transform hover:scale-105"
          >
            Hemen Başlayın
          </Link>
        </div>

        {/* Optional background blur effect */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute w-80 h-80 bg-white opacity-10 rounded-full blur-3xl top-[-100px] left-[-100px]" />
          <div className="absolute w-80 h-80 bg-white opacity-10 rounded-full blur-3xl bottom-[-100px] right-[-100px]" />
        </div>
      </motion.section>

      {/* FOOTER */}
      <motion.footer
        className="bg-gray-50 text-gray-700 border-t border-gray-200 py-10"
        variants={sectionVariants}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:justify-between items-center gap-8 text-center md:text-left">
            {/* Brand Info */}
            <div>
              <h3 className="text-2xl font-bold text-blue-600">Paulih</h3>
              <p className="text-sm text-gray-600 mt-2 max-w-sm">
                Üniversite hayatınızı kolaylaştırmak, arkadaşlıkları
                güçlendirmek ve bilgi paylaşımını artırmak için Paulih ile daha
                akıllı bir yol.
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                className="text-gray-500 hover:text-blue-600 transition-transform hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebook className="text-2xl" />
              </a>
              <a
                href="https://twitter.com"
                className="text-gray-500 hover:text-blue-600 transition-transform hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter className="text-2xl" />
              </a>
              <a
                href="https://instagram.com"
                className="text-gray-500 hover:text-blue-600 transition-transform hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram className="text-2xl" />
              </a>
              <a
                href="https://linkedin.com"
                className="text-gray-500 hover:text-blue-600 transition-transform hover:scale-110"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin className="text-2xl" />
              </a>
            </div>
          </div>

          {/* Bottom Note */}
          <div className="mt-8 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Paulih. Tüm hakları saklıdır.
          </div>
        </div>
      </motion.footer>

      {/* COOKIE BANNER */}
      {showCookieBanner && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 w-full bg-white bg-opacity-90 border-t border-gray-200 px-6 py-4 flex items-center justify-between z-50 shadow-md"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-sm text-gray-700">
            Paulih'i kullanmaya devam ederseniz, otomatik olarak çerez
            kullanımını kabul etmiş sayılırsınız.
          </p>
          <button
            onClick={() => setShowCookieBanner(false)}
            className="text-sm text-blue-600 hover:underline transition ml-4"
          >
            Anladım
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default LandingPage;

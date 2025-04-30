import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const testimonials = [
  {
    name: "Elif D.",
    role: "Üniversite Öğrencisi",
    image: "https://randomuser.me/api/portraits/women/76.jpg",
    text: "Paulih ile tanıştığımdan beri, arkadaşlıklarım ve bilgi paylaşımım çok daha verimli. Her şey tek bir yerden yönetilebiliyor, bu da hayatımı kolaylaştırdı.",
  },
  {
    name: "Ahmet Y.",
    role: "Üniversite Öğrencisi",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "Paulih sayesinde kampüs hayatım çok daha düzenli ve keyifli hale geldi. Harika bir platform!",
  },
  {
    name: "Can K.",
    role: "Üniversite Öğrencisi",
    image: "https://randomuser.me/api/portraits/men/44.jpg",
    text: "Kampüs etkinliklerini anında öğrenebiliyorum. Paulih kampüs hayatını kolaylaştırıyor.",
  },
  {
    name: "Sena A.",
    role: "Üniversite Öğrencisi",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    text: "Ders notları ve etkinlikler için harika bir topluluk oluşturduk. Çok memnunum!",
  },
  {
    name: "Emre S.",
    role: "Üniversite Öğrencisi",
    image: "https://randomuser.me/api/portraits/men/66.jpg",
    text: "Paulih sayesinde okul arkadaşlarımı daha hızlı bulabildim. Gerçekten kullanışlı!",
  },
];

interface LandingPageUsersProps {
  sectionVariants: any;
}

const LandingPageUsers = ({ sectionVariants }: LandingPageUsersProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleAvatarClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <motion.section
      className="relative bg-white py-24 px-4 sm:px-8 overflow-hidden"
      variants={sectionVariants}
    >
      <div className="max-w-6xl mx-auto text-center">
        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
          Kullanıcılarımız Ne Diyor?
        </h2>
        <p className="text-gray-600 text-base max-w-xl mx-auto mb-16">
          Paulih kullanıcıları uygulamanın kampüs yaşamlarına olan etkilerini
          paylaşıyor.
        </p>

        {/* Centered Avatar with Rings */}
        <div className="relative w-40 h-40 mx-auto mb-8 z-10">
          {/* RING EFFECT */}
          <div className="absolute inset-0 rounded-full bg-blue-100 opacity-40 animate-ping scale-125" />
          <div className="absolute inset-3 rounded-full bg-blue-200 opacity-30 animate-ping scale-110" />

          {/* Avatar Image */}
          <motion.img
            key={testimonials[activeIndex].image}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            src={testimonials[activeIndex].image}
            alt={testimonials[activeIndex].name}
            className="relative w-full h-full object-cover rounded-full border-4 border-white shadow-xl"
          />
        </div>

        {/* Main Testimonial Box */}
        <AnimatePresence mode="wait">
          <motion.div
            key={testimonials[activeIndex].text}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 max-w-xl mx-auto bg-gray-900 text-white text-left rounded-2xl shadow-2xl p-6 md:p-8"
          >
            <p className="mb-4 text-sm leading-relaxed">
              “{testimonials[activeIndex].text}”
            </p>
            <p className="font-semibold text-white">
              {testimonials[activeIndex].name}
            </p>
            <p className="text-gray-400 text-sm">
              {testimonials[activeIndex].role}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Floating Avatars */}
        <div className="hidden md:flex justify-center mt-10 gap-6 flex-wrap">
          {testimonials.map((user, index) => (
            <button
              key={user.name}
              onClick={() => handleAvatarClick(index)}
              className={`w-14 h-14 rounded-full overflow-hidden border-4 ${
                index === activeIndex
                  ? "border-blue-600 shadow-lg"
                  : "border-white shadow-md"
              } transition-transform hover:scale-110`}
            >
              <img
                src={user.image}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default LandingPageUsers;

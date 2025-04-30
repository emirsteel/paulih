// src/components/Login/Left/LoginPageLeftComponent.tsx
import React, { useState, useEffect } from "react";
import { Bird } from "lucide-react";

const images = [
  "https://hacettepe.edu.tr/images/hacettepe_galeri/21.jpg",
  "https://images.pexels.com/photos/29549337/pexels-photo-29549337/free-photo-of-ankara-parkinda-karli-kis-manzarasi.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://hacettepe.edu.tr/images/hacettepe_galeri/22.jpg",
  "https://hacettepe.edu.tr/images/hacettepe_galeri/01.jpg",
  "https://hacettepe.edu.tr/images/hacettepe_galeri/08.jpg",
  "https://hacettepe.edu.tr/images/hacettepe_galeri/14.jpg",
  "https://hacettepe.edu.tr/images/hacettepe_galeri/25.jpg",
  "https://hacettepe.edu.tr/images/hacettepe_galeri/28.jpg",
  "https://hacettepe.edu.tr/images/hacettepe_galeri/35.jpg",
];

const LoginPageLeftComponent: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="bg-white shadow-xl rounded-xl overflow-hidden relative w-full md:w-[600px] h-[700px]">
      <div className="absolute flex items-center text-white text-xl font-bold z-10 m-6 p-2 rounded-full drop-shadow-md">
        <Bird className="w-6 h-6 mr-2 drop-shadow-md" />
        Paulih
      </div>

      {/* Image Slides */}
      <div className="w-full h-full relative">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Slide ${index + 1}`}
            className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      {/* Testimonial and Arrows Container */}
      <div className="absolute bottom-16 left-8 right-8 z-10 flex items-center justify-between">
        {/* Testimonial / Slogan Content */}
        <div className="text-white">
          <p className="font-semibold">
            ⚡ Hacettepe Üniversitesi Sosyal Platformu
          </p>
          <p className="text-xs opacity-90">
            Kampüsün Her Köşesine Ulaş, Tek Tıkla Yakınlaş.
          </p>
        </div>
        {/* Arrows side by side */}
        <div className="flex space-x-2">
          <button
            onClick={handlePrev}
            className="p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-1">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-blue-600" : "bg-white opacity-70"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default LoginPageLeftComponent;

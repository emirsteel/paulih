// src/components/PostAds.tsx
import React from "react";

const PostAds: React.FC = () => {
  return (
    <div className="my-4 bg-gray-100 border border-gray-300 p-4 text-center rounded">
      {/* Reklam görseli veya içerik */}
      <a href="https://example.com" target="_blank" rel="noopener noreferrer">
        <img
          src="/path/to/ad-image.jpg"
          alt="Reklam"
          className="mx-auto max-h-60 object-contain"
        />
      </a>
      <p className="mt-2 text-sm text-gray-600">Reklam Alanı</p>
    </div>
  );
};

export default PostAds;

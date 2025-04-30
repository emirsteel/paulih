// src/components/OrderFoodPageTopPlace.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
// If you use Heroicons for the star icon or others, import them:
// import { StarIcon } from "@heroicons/react/solid";

interface Post {
  id: number;
  title: string;
  imageUrl: string;
  likes: number;
  description?: string;
  // Add any other fields you need
}

const OrderFoodPageTopPlace: React.FC = () => {
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Example: Mock function or replace with your actual API endpoint
  const fetchPopularPosts = async () => {
    try {
      // For real data, replace with your API call:
      // const response = await axios.get<Post[]>('/api/posts/popular');
      // return response.data;

      // Mock data to illustrate
      return [
        {
          id: 1,
          title: "Pilavita",
          imageUrl: "https://via.placeholder.com/250x150?text=Pilavita",
          likes: 42,
          description: "Delicious rice bowl",
        },
        {
          id: 2,
          title: "Mamalo’s Pide & Kebap",
          imageUrl: "https://via.placeholder.com/250x150?text=Mamalo's+Pide",
          likes: 37,
          description: "Turkish flatbread specialties",
        },
        {
          id: 3,
          title: "Cafe Express",
          imageUrl: "https://via.placeholder.com/250x150?text=Cafe+Express",
          likes: 50,
          description: "Quick bites and coffee",
        },
        {
          id: 4,
          title: "Pilavcı Hacettepe",
          imageUrl:
            "https://via.placeholder.com/250x150?text=Pilavci+Hacettepe",
          likes: 28,
          description: "Rice meals near campus",
        },
      ];
    } catch (err) {
      throw new Error("Failed to fetch popular posts");
    }
  };

  useEffect(() => {
    const loadPopularPosts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const posts = await fetchPopularPosts();
        // Sort by descending likes
        const sortedPosts = posts.sort((a, b) => b.likes - a.likes);
        setPopularPosts(sortedPosts);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    loadPopularPosts();
  }, []);

  if (isLoading) {
    return <div className="p-4 text-gray-700">Loading popular places...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error loading popular places: {error}
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow my-4">
      {/* Top row: brand, countdown, greeting, discount cards */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 space-y-2 md:space-y-0">
        {/* Left side: "Joker" brand + countdown */}
        <div className="flex items-center space-x-3">
          {/* Replace with your actual Joker logo/image */}
          <img
            src="https://via.placeholder.com/80x40?text=Joker"
            alt="Joker"
            className="h-8 w-auto object-contain"
          />
          <div className="flex items-center text-sm text-gray-700 border-l pl-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-pink-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="ml-1 font-medium">14:56</span>
          </div>
        </div>

        {/* Middle: greeting text */}
        <div className="text-pink-600 font-semibold text-base">
          Merhaba Emir!
        </div>

        {/* Right side: discount cards */}
        <div className="flex items-center space-x-2">
          {/* Single discount card */}
          <div className="bg-pink-100 text-pink-800 text-sm p-2 rounded text-center">
            <div className="font-bold">60 TL</div>
            <div>indirim</div>
            <div className="text-xs text-gray-600">min. sepet 350 TL</div>
          </div>
          <div className="bg-pink-100 text-pink-800 text-sm p-2 rounded text-center">
            <div className="font-bold">100 TL</div>
            <div>indirim</div>
            <div className="text-xs text-gray-600">min. sepet 400 TL</div>
          </div>
          <div className="bg-pink-100 text-pink-800 text-sm p-2 rounded text-center">
            <div className="font-bold">150 TL</div>
            <div>indirim</div>
            <div className="text-xs text-gray-600">min. sepet 450 TL</div>
          </div>
        </div>
      </div>

      {/* Subtitle text */}
      <p className="text-sm text-gray-700 mb-3">
        İndirimi katla, siparişini ver!
      </p>

      {/* Horizontal scroll of popular posts */}
      <div className="flex space-x-4 overflow-x-auto">
        {popularPosts.map((post) => (
          <div
            className="min-w-[200px] flex-shrink-0 border rounded-md overflow-hidden shadow-sm"
            key={post.id}
          >
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-36 object-cover"
            />
            <div className="p-3">
              <h3 className="text-base font-medium text-gray-800">
                {post.title}
              </h3>

              {/* Example: Star rating + likes, or just likes. 
                  If you have a rating, you can combine it with likes. */}
              <div className="flex items-center text-sm text-yellow-500 my-1">
                {/* Example star icon (Heroicons) */}
                {/* <StarIcon className="h-4 w-4" /> */}
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.262 3.873a1 1 0 00.95.69h4.073c.969 0 1.371 1.24.588 1.81l-3.296 2.397a1 1 0 00-.364 1.118l1.262 3.873c.3.92-.755 1.688-1.54 1.118l-3.296-2.397a1 1 0 00-1.176 0l-3.296 2.397c-.784.57-1.84-.198-1.54-1.118l1.262-3.873a1 1 0 00-.364-1.118L2.176 9.3c-.783-.57-.38-1.81.589-1.81h4.073a1 1 0 00.95-.69l1.262-3.873z" />
                </svg>
                <span className="ml-1">{(4 + post.likes / 10).toFixed(1)}</span>
                <span className="ml-2 text-gray-500">({post.likes} likes)</span>
              </div>

              {/* Delivery time + Price + "Ücretsiz" (shipping) row */}
              <div className="flex items-center text-xs text-gray-600 space-x-1">
                <span>15-30 dk</span>
                <span className="text-gray-400">•</span>
                {/* Example: Use likes to simulate a price or add a real field */}
                <span>{(post.likes * 0.75).toFixed(2)} TL</span>
                <span className="text-gray-400">•</span>
                <span className="text-green-600">Ücretsiz</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderFoodPageTopPlace;

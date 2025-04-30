import React, { useState, useRef, useEffect } from "react";
import Modal from "react-modal";
import {
  FiImage,
  FiX,
  FiSend,
  FiFlag,
  FiEdit,
  FiPlusCircle,
  FiArrowLeft,
  FiMusic,
  FiCrop,
  FiFileText,
  FiRotateCw,
} from "react-icons/fi";
import { FaSmile } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";
import CreatePostUpperSide from "./CreatePostUpperSide";

Modal.setAppElement("#root");

interface CreatePostProps {
  fetchPosts: () => void;
  userData?: {
    profileImage?: string;
    name: string;
    pageName?: string;
  };
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

const SPOTIFY_CLIENT_ID = "e57e8653119743fbb08d6d7baa19e374";
const SPOTIFY_CLIENT_SECRET = "ff6ebede9e8643aab7dc1f059bbbb13b";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

const CreatePost: React.FC<CreatePostProps> = ({
  fetchPosts,
  userData,
  modalOpen,
  setModalOpen,
}) => {
  // State definitions
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const [anonymous, setAnonymous] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [visibility, setVisibility] = useState<
    "Everyone" | "Friends" | "Private"
  >("Everyone");
  const [visibilityPopupOpen, setVisibilityPopupOpen] = useState(false);
  const [fullImageUrl, setFullImageUrl] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editAllModalOpen, setEditAllModalOpen] = useState(false);
  const [currentImageToEdit, setCurrentImageToEdit] = useState<string | null>(
    null
  );

  // GIF state
  const [gifModalOpen, setGifModalOpen] = useState(false);

  // Music states
  const [musicModalOpen, setMusicModalOpen] = useState(false);
  const [spotifyToken, setSpotifyToken] = useState("");
  const [trendingMusic, setTrendingMusic] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSongEmbed, setSelectedSongEmbed] = useState<string | null>(
    null
  );

  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const visibilityPopupRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Rotation states for images
  const [rotations, setRotations] = useState(previewUrls.map(() => 0));
  const [rotation, setRotation] = useState(0);

  // States for cropping functionality
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  // ------------------------------
  // Giphy Popup Component
  // ------------------------------
  const GiphyPopup: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSelectGif: (gifUrl: string) => void;
  }> = ({ isOpen, onClose, onSelectGif }) => {
    const [gifs, setGifs] = useState<string[]>([]);
    const [placeholders, setPlaceholders] = useState<string[]>([]);
    const [categories] = useState<string[]>([
      "Trending",
      "Funny",
      "Animals",
      "Sports",
      "Reactions",
    ]);
    const [selectedCategory, setSelectedCategory] = useState("Trending");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    const GIPHY_API_KEY = "vYY8m5zcfHZPVToT1pC26hMOMvcwcfhm";
    const modalRef = useRef<HTMLDivElement>(null);

    const scrollToTop = () => {
      if (modalRef.current) {
        modalRef.current.scrollTop = 0;
      }
    };

    const randomColors = [
      "#4A90E2",
      "#50E3C2",
      "#F5A623",
      "#9013FE",
      "#FF3366",
      "FCFF36",
    ];

    const generateRandomColors = (count: number) => {
      return Array.from({ length: count }, () => {
        const randomIndex = Math.floor(Math.random() * randomColors.length);
        return randomColors[randomIndex];
      });
    };

    const fetchGifs = async (query: string, category: string, page: number) => {
      try {
        setLoading(true);
        const offset = (page - 1) * 20;
        const endpoint = query
          ? `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${query}&limit=20&offset=${offset}`
          : category === "Trending"
            ? `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=20&offset=${offset}`
            : `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${category}&limit=20&offset=${offset}`;

        const response = await axios.get(endpoint);
        const gifUrls = response.data.data.map(
          (gif: any) => gif.images.fixed_height.url
        );
        setPlaceholders((prev) => [
          ...prev,
          ...generateRandomColors(gifUrls.length),
        ]);
        setGifs((prev) => [...prev, ...gifUrls]);
      } catch (error) {
        console.error("Error fetching GIFs:", error);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchGifs(searchQuery, selectedCategory, page);
    }, [searchQuery, selectedCategory, page]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop === clientHeight && !loading) {
        setPage((prev) => prev + 1);
      }
    };

    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    useEffect(() => {
      if (isOpen) {
        document.addEventListener("mousedown", handleOutsideClick);
      } else {
        document.removeEventListener("mousedown", handleOutsideClick);
      }
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }, [isOpen]);

    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        ariaHideApp={false}
        className="modal-content w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg transform transition-transform duration-300"
        overlayClassName="modal-overlay bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center z-50"
      >
        <div
          ref={modalRef}
          onScroll={handleScroll}
          className="p-6 rounded-lg overflow-y-auto"
          style={{
            maxHeight: "80vh",
            scrollbarWidth: "thin",
            scrollbarColor: "#CBD5E0 #F7FAFC",
          }}
        >
          <style>
            {`
          .modal-content::-webkit-scrollbar {
            width: 6px;
          }
          .modal-content::-webkit-scrollbar-thumb {
            background-color: #cbd5e0;
            border-radius: 10px;
          }
          .modal-content::-webkit-scrollbar-track {
            background-color: #f7fafc;
          }
        `}
          </style>

          {/* Başlık ve kapatma butonu */}
          <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b">
            <h2 className="text-sm font-semibold text-gray-800 tracking-wide">
              GIF Seç
            </h2>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
            >
              <FiArrowLeft size={16} className="text-gray-700" />
            </button>
          </div>

          {/* Arama inputu */}
          <div className="mt-6">
            <input
              type="text"
              placeholder="GIF ara..."
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setGifs([]);
                setPlaceholders([]);
                setPage(1);
                scrollToTop();
              }}
            />
          </div>

          {/* Kategoriler */}
          <div className="flex items-center justify-center mt-4 space-x-4 border-b border-gray-300 pb-4 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setSearchQuery("");
                  setGifs([]);
                  setPlaceholders([]);
                  setPage(1);
                  scrollToTop();
                }}
                className={`relative px-4 pb-2 transition-all duration-300 ${
                  selectedCategory === category
                    ? "text-blue-600 font-semibold"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <span>{category}</span>
                {selectedCategory === category && (
                  <span className="absolute left-0 right-0 h-[2px] bg-blue-600 bottom-0"></span>
                )}
              </button>
            ))}
          </div>

          {/* GIF grid */}
          <div className="grid grid-cols-4 gap-4 overflow-y-auto">
            {gifs.map((gifUrl, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: placeholders[index] || "#fff",
                  height: "128px",
                }}
                className="relative rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={gifUrl}
                  alt="GIF"
                  className="w-full h-full object-cover"
                  onLoad={(e) => {
                    (e.target as HTMLImageElement).style.opacity = "1";
                  }}
                  style={{ opacity: 0, transition: "opacity 0.5s ease-in-out" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectGif(gifUrl);
                  }}
                />
              </div>
            ))}
          </div>

          {/* Yükleniyor */}
          {loading && (
            <div className="flex justify-center mt-4">
              <lottie-player
                src="https://lottie.host/36309ce1-a378-4077-afae-96a73f7db7fa/9k8BIsctE0.json"
                background="##ffffff"
                speed={1}
                style={{ width: "300px", height: "300px" }}
                loop
                autoplay
              ></lottie-player>
            </div>
          )}
        </div>
      </Modal>
    );
  };

  // ------------------------------
  // Handlers for Post, Media, and Editing
  // ------------------------------
  const handlePost = async () => {
    if (!content.trim() && previewUrls.length === 0 && !selectedSongEmbed) {
      alert("Post content, media, or music is required");
      return;
    }
    const token = localStorage.getItem("token");
    const isPage = !!userData?.pageName;
    const posterId = isPage
      ? localStorage.getItem("pageId")
      : localStorage.getItem("userId");
    if (!token || !posterId) {
      alert("User not logged in.");
      return;
    }
    const formData = new FormData();
    formData.append("content", content);
    formData.append(isPage ? "pageId" : "userId", posterId);
    formData.append("anonymous", String(anonymous));
    formData.append("visibility", visibility);
    const posterName = userData?.pageName ? userData.pageName : userData?.name;
    formData.append("posterName", posterName);
    for (let i = 0; i < previewUrls.length; i++) {
      try {
        const blob = await fetch(previewUrls[i]).then((res) => res.blob());
        formData.append("media", blob, `image-${i}.jpeg`);
      } catch (error) {
        console.error("Error converting image URL to Blob:", error);
      }
    }
    if (selectedSongEmbed) {
      const musicData = {
        name: "Song Name",
        artist: "Artist Name",
        albumImageUrl: "Album Image URL",
        embedUrl: selectedSongEmbed,
      };
      formData.append("music", JSON.stringify(musicData));
    }
    try {
      const response = await fetch("http://localhost:5001/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (response.ok) {
        setContent("");
        setMedia([]);
        setPreviewUrls([]);
        setSelectedSongEmbed(null);
        setModalOpen(false);
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        console.error("Error creating post:", await response.json());
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const existingImages = media.filter((file) =>
        file.type.startsWith("image/")
      );
      const existingVideos = media.filter((file) =>
        file.type.startsWith("video/")
      );
      const newImages = files.filter((file) => file.type.startsWith("image/"));
      const newVideos = files.filter((file) => file.type.startsWith("video/"));
      if (existingVideos.length + newVideos.length > 1) {
        alert("You can only upload 1 video.");
        return;
      }
      if (existingImages.length + newImages.length > 4) {
        alert("You can only upload up to 4 images.");
        return;
      }
      const updatedMedia = [...media, ...files];
      setMedia(updatedMedia);
      const updatedUrls = updatedMedia.map((file) => URL.createObjectURL(file));
      setPreviewUrls(updatedUrls);
      e.target.value = "";
    }
  };

  const handleAddMoreContent = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleEdit = (url: string) => {
    setCurrentImageToEdit(url);
    setEditModalOpen(true);
  };

  const handleEditAll = () => {
    setEditAllModalOpen(true);
  };

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setContent((prev) => prev + emojiObject.emoji);
  };

  const handleImageClick = (url: string) => {
    setFullImageUrl(url);
  };

  const handleCloseFullImage = () => {
    setFullImageUrl(null);
  };

  const handleDeleteImage = (index: number) => {
    const updatedPreviewUrls = [...previewUrls];
    const updatedMedia = [...media];
    const updatedDescriptions = [...descriptions];
    updatedPreviewUrls.splice(index, 1);
    updatedMedia.splice(index, 1);
    updatedDescriptions.splice(index, 1);
    setPreviewUrls(updatedPreviewUrls);
    setMedia(updatedMedia);
    setDescriptions(updatedDescriptions);
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const updatedDescriptions = [...descriptions];
    updatedDescriptions[index] = value;
    setDescriptions(updatedDescriptions);
  };

  const handleRotateImage = (index: number) => {
    setRotations((prev) => {
      const updated = [...prev];
      updated[index] = (updated[index] || 0) + 90;
      return updated;
    });
  };

  const handleRotate = () => {
    setRotation((prev) => prev + 90);
  };

  const generateRotatedImage = (
    imageUrl: string,
    rotationAngle: number
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = imageUrl;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("Failed to get canvas context"));
          return;
        }
        if (rotationAngle % 180 !== 0) {
          canvas.width = image.height;
          canvas.height = image.width;
        } else {
          canvas.width = image.width;
          canvas.height = image.height;
        }
        context.translate(canvas.width / 2, canvas.height / 2);
        context.rotate((rotationAngle * Math.PI) / 180);
        context.drawImage(image, -image.width / 2, -image.height / 2);
        resolve(canvas.toDataURL());
      };
      image.onerror = (error) => reject(error);
    });
  };

  const handleSaveEditedImage = async () => {
    try {
      const rotatedImageUrl: string = await generateRotatedImage(
        currentImageToEdit!,
        rotation
      );
      setPreviewUrls((prev) =>
        prev.map((url) => (url === currentImageToEdit ? rotatedImageUrl : url))
      );
      setRotation(0);
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error saving rotated image:", error);
    }
  };

  const modalRef = useRef<HTMLDivElement>(null);

  const handleEmojiPickerPosition = () => {
    const modalRect = modalRef.current?.getBoundingClientRect();
    const emojiPickerHeight = 300;
    const textareaBottom = document
      .querySelector("textarea")
      ?.getBoundingClientRect()?.bottom;
    if (modalRect && textareaBottom) {
      const spaceBelow = modalRect.bottom - textareaBottom;
      const spaceAbove = textareaBottom - modalRect.top;
      if (spaceBelow < emojiPickerHeight && spaceAbove > emojiPickerHeight) {
        return { position: "above" };
      }
    }
    return { position: "below" };
  };

  const getProfileImageUrl = (imagePath: string | undefined) => {
    return imagePath
      ? `http://localhost:5001/${imagePath}`
      : "/default-profile.png";
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(event.target as Node) &&
      showEmojiPicker
    ) {
      setShowEmojiPicker(false);
    }
    if (
      visibilityPopupRef.current &&
      !visibilityPopupRef.current.contains(event.target as Node) &&
      visibilityPopupOpen
    ) {
      setVisibilityPopupOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker, visibilityPopupOpen]);

  // ------------------------------
  // Spotify and Music Fetching
  // ------------------------------
  const fetchSpotifyToken = async () => {
    try {
      const response = await axios.post(
        SPOTIFY_TOKEN_URL,
        new URLSearchParams({
          grant_type: "client_credentials",
          client_id: SPOTIFY_CLIENT_ID,
          client_secret: SPOTIFY_CLIENT_SECRET,
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      setSpotifyToken(response.data.access_token);
    } catch (error) {
      console.error("Error fetching Spotify token:", error);
    }
  };

  const fetchTrendingMusic = async () => {
    try {
      const response = await axios.get(
        "https://api.spotify.com/v1/browse/featured-playlists",
        {
          headers: { Authorization: `Bearer ${spotifyToken}` },
        }
      );
      const playlists = response.data.playlists.items;
      setTrendingMusic(playlists);
    } catch (error) {
      console.error("Error fetching trending music:", error);
    }
  };

  const searchMusic = async (query: string) => {
    try {
      const response = await axios.get("https://api.spotify.com/v1/search", {
        headers: { Authorization: `Bearer ${spotifyToken}` },
        params: { q: query, type: "track", limit: 10 },
      });
      setSearchResults(response.data.tracks.items);
    } catch (error) {
      console.error("Error searching music:", error);
    }
  };

  useEffect(() => {
    if (musicModalOpen && !spotifyToken) {
      fetchSpotifyToken();
    }
  }, [musicModalOpen]);

  useEffect(() => {
    if (spotifyToken && musicModalOpen) {
      fetchTrendingMusic();
    }
  }, [spotifyToken, musicModalOpen]);

  const [categories, setCategories] = useState([
    { name: "Happy", keywords: "upbeat, feel good", songs: [] },
    { name: "Love", keywords: "love songs, romance", songs: [] },
    { name: "HipHop", keywords: "rap, hip-hop", songs: [] },
    { name: "RnB and Soul", keywords: "r&b, soul", songs: [] },
    { name: "Rock", keywords: "rock, alternative rock", songs: [] },
  ]);

  const fetchCategorySongs = async () => {
    const updatedCategories = await Promise.all(
      categories.map(async (category) => {
        const response = await axios.get("https://api.spotify.com/v1/search", {
          headers: { Authorization: `Bearer ${spotifyToken}` },
          params: { q: category.name, type: "track", limit: 5 },
        });
        return { ...category, songs: response.data.tracks.items };
      })
    );
    setCategories(updatedCategories);
  };

  useEffect(() => {
    if (spotifyToken) {
      fetchCategorySongs();
    }
  }, [spotifyToken]);

  const loadMoreSongs = async (categoryName: string) => {
    const categoryIndex = categories.findIndex((c) => c.name === categoryName);
    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: { Authorization: `Bearer ${spotifyToken}` },
      params: {
        q: categoryName,
        type: "track",
        limit: 10,
        offset: categories[categoryIndex].songs.length,
      },
    });
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].songs = [
      ...updatedCategories[categoryIndex].songs,
      ...response.data.tracks.items,
    ];
    setCategories(updatedCategories);
  };

  const [loading, setLoading] = useState(false);
  const fetchMoreSongs = async (categoryName: string | undefined) => {
    if (!categoryName) return;
    const categoryIndex = categories.findIndex((c) => c.name === categoryName);
    if (categoryIndex === -1) return;
    const category = categories[categoryIndex];
    const keywords = category.keywords || categoryName;
    setLoading(true);
    try {
      const response = await axios.get("https://api.spotify.com/v1/search", {
        headers: { Authorization: `Bearer ${spotifyToken}` },
        params: {
          q: keywords,
          type: "track",
          limit: 10,
          offset: category.songs.length || 0,
        },
      });
      const updatedCategories = [...categories];
      updatedCategories[categoryIndex].songs = [
        ...updatedCategories[categoryIndex].songs,
        ...response.data.tracks.items,
      ];
      setCategories(updatedCategories);
      if (selectedCategory && selectedCategory.name === categoryName) {
        setSelectedCategory(updatedCategories[categoryIndex]);
      }
    } catch (error) {
      console.error("Error fetching more songs:", error);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------
  // Render
  // ------------------------------
  return (
    <>
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="modal-content w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg transform transition-transform duration-300"
        overlayClassName="modal-overlay bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center z-50"
      >
        <div
          className="p-6 rounded-lg overflow-y-auto"
          style={{
            maxHeight: "80vh",
            scrollbarWidth: "thin",
            scrollbarColor: "#CBD5E0 #F7FAFC",
          }}
        >
          <style>
            {`
              .modal-content::-webkit-scrollbar {
                width: 6px;
              }
              .modal-content::-webkit-scrollbar-thumb {
                background-color: #cbd5e0;
                border-radius: 10px;
              }
              .modal-content::-webkit-scrollbar-thumb:hover {
                background-color: #a0aec0;
              }
              .modal-content::-webkit-scrollbar-track {
                background-color: #f7fafc;
              }
            `}
          </style>
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-lg font-bold text-gray-800">Gönderi Oluştur</h2>
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
              onClick={() => setModalOpen(false)}
            >
              <FiX className="text-gray-600" size={20} />
            </button>
          </div>
          <CreatePostUpperSide
            content={content}
            setContent={setContent}
            userData={userData}
            visibility={visibility}
            setVisibility={setVisibility}
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
          />
          {previewUrls.length > 0 && (
            <div className="relative mt-6 border border-gray-300 rounded-lg p-6">
              <div className="mb-4 flex items-center justify-between space-x-4">
                <div className="flex space-x-4">
                  {media.some((file) => !file.type.includes("gif")) && (
                    <button
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                      onClick={() => {
                        const nonGifUrls = previewUrls.filter(
                          (_, index) => !media[index].type.includes("gif")
                        );
                        if (nonGifUrls.length === 1) {
                          setCurrentImageToEdit(nonGifUrls[0]);
                          setEditModalOpen(true);
                        } else {
                          setEditAllModalOpen(true);
                        }
                      }}
                    >
                      <FiEdit className="text-gray-600" size={20} />
                      <span className="text-sm text-gray-600">
                        {media.length === 1 && !media[0].type.includes("gif")
                          ? "Düzenle"
                          : "Hepsini Düzenle"}
                      </span>
                    </button>
                  )}
                  {media.some((file) => !file.type.includes("gif")) && (
                    <button
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                      onClick={handleAddMoreContent}
                    >
                      <FiPlusCircle className="text-gray-600" size={20} />
                      <span className="text-sm text-gray-600">Ekle</span>
                    </button>
                  )}
                </div>
                <button
                  className="ml-auto flex items-center space-x-2 px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                  onClick={() => {
                    setMedia([]);
                    setPreviewUrls([]);
                  }}
                >
                  <FiX className="text-gray-600" size={20} />
                  <span className="text-sm text-gray-600">Kapat</span>
                </button>
              </div>
              <div
                className={`grid ${
                  previewUrls.length === 1
                    ? "grid-cols-1 place-items-center"
                    : previewUrls.length === 2
                      ? "grid-cols-2 gap-4"
                      : previewUrls.length === 3
                        ? "grid-rows-2 grid-cols-2 gap-4"
                        : "grid-cols-2 gap-4"
                }`}
              >
                {previewUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-lg"
                  >
                    <img
                      src={url}
                      onClick={() => setFullImageUrl(url)}
                      alt={`Preview ${index}`}
                      style={{
                        transform: `rotate(${rotations[index]}deg)`,
                        transition: "transform 0.3s ease-in-out",
                      }}
                      className={`w-full object-cover ${
                        previewUrls.length === 1 ? "h-60" : "h-36"
                      } transition-transform duration-300 hover:scale-105 hover:brightness-90 cursor-pointer`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          {selectedSongEmbed && (
            <div className="mt-4">
              <iframe
                style={{ borderRadius: "12px" }}
                src={selectedSongEmbed}
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              ></iframe>
            </div>
          )}
          {/* Connected Full-Width Media Options */}
          <div className="mt-6 w-full flex rounded-md overflow-hidden border border-gray-200 shadow-sm">
            {/* Photo/Video Button */}
            <button
              onClick={() =>
                fileInputRef.current && fileInputRef.current.click()
              }
              className="flex-1 flex flex-col items-center justify-center px-3 py-2 bg-white hover:bg-blue-50 focus:outline-none"
            >
              <FiImage size={20} className="mb-1 text-blue-600 " />
              <span className="text-sm text-gray-800">Fotoğraf/Video</span>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaChange}
                className="hidden"
                ref={fileInputRef}
              />
            </button>

            {/* GIF Button */}
            <button
              onClick={() => setGifModalOpen(true)}
              className="flex-1 flex flex-col items-center justify-center px-3 py-2 bg-white hover:bg-blue-50 focus:outline-none border-l border-r border-gray-200"
            >
              <div className="mb-1">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">GIF</span>
                </div>

                {/* Giphy Popup */}
                <GiphyPopup
                  isOpen={gifModalOpen}
                  onClose={() => setGifModalOpen(false)}
                  onSelectGif={(gifUrl: string) => {
                    setGifModalOpen(false); // Close the GIF modal
                    setMedia((prevMedia) => [
                      ...prevMedia,
                      new File([], "selected.gif", { type: "image/gif" }),
                    ]); // Add GIF as a File
                    setPreviewUrls((prevUrls) => [...prevUrls, gifUrl]); // Add GIF URL to preview
                  }}
                />
              </div>
              <span className="text-sm text-gray-800">GIF</span>
            </button>

            {/* Music Button */}
            <button
              onClick={() => setMusicModalOpen(true)}
              className="flex-1 flex flex-col items-center justify-center px-3 py-2 bg-white hover:bg-blue-50 focus:outline-none"
            >
              <FiFlag size={20} className="mb-1 text-blue-600" />
              <span className="text-sm text-gray-800">Müzik</span>
            </button>
          </div>
          <div className="flex justify-end mt-8">
            <button
              onClick={handlePost}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center"
            >
              <FiSend className="mr-2" />
              Paylaş
            </button>
          </div>
        </div>
      </Modal>
      {fullImageUrl && (
        <Modal
          isOpen={!!fullImageUrl}
          onRequestClose={handleCloseFullImage}
          className="w-full max-w-4xl mx-auto bg-black rounded-lg shadow-lg flex justify-center items-center"
          overlayClassName="modal-overlay bg-black bg-opacity-80 fixed inset-0 flex items-center justify-center z-50"
        >
          <div className="relative w-full max-h-screen flex justify-center items-center">
            <button
              className="absolute top-2 right-2 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
              onClick={handleCloseFullImage}
              style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
            >
              <FiX className="text-gray-600" size={20} />
            </button>
            <img
              src={fullImageUrl}
              alt="Full view"
              className="max-w-full max-h-screen object-contain"
            />
          </div>
        </Modal>
      )}
      <Modal
        isOpen={editAllModalOpen}
        onRequestClose={() => setEditAllModalOpen(false)}
        className="modal-content w-full max-w-3xl h-[90vh] mx-auto bg-white rounded-lg shadow-lg transform transition-transform duration-300"
        overlayClassName="modal-overlay bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center z-50"
      >
        <div className="relative p-4 h-full flex flex-col">
          <div className="flex items-center mb-4">
            <button
              onClick={() => setEditAllModalOpen(false)}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
              <FiArrowLeft className="text-gray-700 text-lg" />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 ml-4">
              Fotoğraflar/Videolar
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {previewUrls.map((url, index) => (
              <div
                key={index}
                className="relative bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 flex flex-col"
              >
                <div className="relative overflow-hidden rounded-lg">
                  <div
                    className="absolute inset-0 z-0"
                    style={{
                      backgroundImage: `url(${url})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: "blur(15px)",
                      transform: "scale(1.2)",
                      opacity: "0.7",
                    }}
                  ></div>
                  <img
                    src={url}
                    alt={`Preview ${index}`}
                    className="relative z-10 w-full h-auto max-h-60 object-contain rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setCurrentImageToEdit(url);
                      setEditAllModalOpen(false);
                      setEditModalOpen(true);
                    }}
                    className="absolute top-2 left-2 flex items-center space-x-1 bg-white rounded-full shadow-md px-3 py-1 hover:bg-gray-200 transition z-20"
                  >
                    <FiEdit className="text-gray-700 text-lg" />
                    <span className="text-gray-700 text-sm font-medium">
                      Düzenle
                    </span>
                  </button>
                  <button
                    onClick={() => handleDeleteImage(index)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-red-100 transition z-20"
                  >
                    <FiX className="text-red-600 text-lg" />
                  </button>
                </div>
                <textarea
                  placeholder="Bir açıklama ekle..."
                  className="mt-4 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={descriptions[index] || ""}
                  onChange={(e) =>
                    handleDescriptionChange(index, e.target.value)
                  }
                ></textarea>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setEditAllModalOpen(false)}
              className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              Tamamlandı
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={editModalOpen}
        onRequestClose={() => setEditModalOpen(false)}
        className="modal-content w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg transform transition-transform duration-300"
        overlayClassName="modal-overlay bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center z-50"
      >
        <div className="relative flex h-[70vh]">
          <button
            onClick={() => setEditModalOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
          >
            <FiX className="text-gray-600" size={20} />
          </button>
          <div className="w-1/4 p-4 bg-gray-50 border-r border-gray-300">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Düzenleme Araçları
            </h2>
            <nav className="mt-2">
              <ul className="space-y-2">
                {[
                  {
                    name: "Kırp",
                    icon: <FiCrop />,
                    action: () => setIsCropping(true),
                  },
                  {
                    name: "Döndür",
                    icon: <FiRotateCw />,
                    action: handleRotate,
                  },
                ].map((item) => (
                  <li key={item.name} className="group">
                    <button
                      onClick={item.action}
                      className="flex items-center w-full px-3 py-2 bg-gray-100 rounded-lg text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-gray-50 hover:bg-gray-200 hover:text-gray-800 text-gray-600"
                    >
                      <span className="mr-3 text-lg text-gray-500 group-hover:text-gray-700">
                        {item.icon}
                      </span>
                      <span className="group-hover:font-medium">
                        {item.name}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="w-3/4 flex flex-col items-center justify-center p-4">
            <div
              className="relative flex items-center justify-center"
              style={{
                width: "400px",
                height: "400px",
                overflow: "hidden",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "4px",
              }}
            >
              <img
                src={currentImageToEdit!}
                alt="Düzenlenecek Resim"
                className="absolute"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "cover",
                  transform: `rotate(${rotation}deg)`,
                  transition: "transform 0.3s ease-in-out",
                }}
              />
            </div>
            <div className="mt-4 w-[400px] flex flex-col space-y-4">
              <button
                onClick={() => setEditModalOpen(false)}
                className="w-full px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                İptal
              </button>
              <button
                onClick={handleSaveEditedImage}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      </Modal>
      {isCropping && (
        <Modal
          isOpen={isCropping}
          onRequestClose={() => setIsCropping(false)}
          className="modal-content w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg transform transition-transform duration-300"
          overlayClassName="modal-overlay bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center z-50"
        >
          <div className="p-6 flex flex-col items-center space-y-4">
            <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
              <Cropper
                image={currentImageToEdit!}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(croppedArea, croppedAreaPixels) =>
                  setCroppedAreaPixels(croppedAreaPixels)
                }
                style={{
                  containerStyle: { width: "100%", height: "100%" },
                  mediaStyle: { maxWidth: "100%", maxHeight: "100%" },
                }}
              />
            </div>
            <div className="flex flex-col space-y-4 w-full">
              <button
                onClick={async () => {
                  try {
                    const croppedImage = await getCroppedImg(
                      currentImageToEdit!,
                      croppedAreaPixels
                    );
                    setPreviewUrls((prev) =>
                      prev.map((url) =>
                        url === currentImageToEdit ? croppedImage : url
                      )
                    );
                    setCurrentImageToEdit(croppedImage);
                    setIsCropping(false);
                  } catch (error) {
                    console.error("Error saving cropped image:", error);
                  }
                }}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Kaydet
              </button>
              <button
                onClick={() => setIsCropping(false)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                İptal
              </button>
            </div>
          </div>
        </Modal>
      )}
      <Modal
        isOpen={musicModalOpen}
        onRequestClose={() => setMusicModalOpen(false)}
        ariaHideApp={false}
        className="modal-content w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg transform transition-transform duration-300"
        overlayClassName="modal-overlay bg-black bg-opacity-50 fixed inset-0 flex items-center justify-center z-50"
      >
        <div
          className="p-6 bg-gray-50 rounded-lg overflow-y-auto"
          style={{ maxHeight: "80vh" }}
          onScroll={(e) => {
            const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
            if (scrollHeight - scrollTop === clientHeight && !loading) {
              fetchMoreSongs(selectedCategory?.name);
            }
          }}
        >
          <div className="flex justify-center items-center border-b pb-4">
            <button
              className="absolute left-4 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition"
              onClick={(e) => {
                e.stopPropagation();
                if (selectedCategory) {
                  setSelectedCategory(null);
                } else {
                  setMusicModalOpen(false);
                }
              }}
            >
              <FiArrowLeft className="text-gray-600" size={20} />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedCategory ? selectedCategory.name : "Select Music"}
            </h2>
          </div>
          <div className="mt-6">
            <input
              type="text"
              placeholder="Search Music..."
              className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim()) {
                  searchMusic(e.target.value);
                } else {
                  setSearchResults([]);
                }
              }}
            />
          </div>
          {searchQuery && searchResults.length > 0 ? (
            <div>
              <h3 className="text-lg font-bold text-center mb-4">
                Search Results
              </h3>
              <ul className="space-y-4">
                {searchResults.map((track) => (
                  <li
                    key={track.id}
                    className="flex items-center space-x-4 p-2 border rounded-lg hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      const embedUrl = `https://open.spotify.com/embed/track/${track.id}?utm_source=generator`;
                      setSelectedSongEmbed(embedUrl);
                      setMusicModalOpen(false);
                    }}
                  >
                    <img
                      src={track.album.images[0]?.url}
                      alt={track.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {track.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {track.artists[0]?.name}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : selectedCategory ? (
            <div className="mt-6 space-y-4">
              <ul>
                {selectedCategory.songs.map((song: any) => (
                  <li
                    key={song.id}
                    className="flex items-center space-x-4 p-2 border rounded-lg hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      const embedUrl = `https://open.spotify.com/embed/track/${song.id}?utm_source=generator`;
                      setSelectedSongEmbed(embedUrl);
                      setMusicModalOpen(false);
                    }}
                  >
                    <img
                      src={song.album.images[0]?.url}
                      alt={song.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {song.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {song.artists[0]?.name}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              {loading && (
                <div className="flex justify-center mt-4">
                  <lottie-player
                    src="https://lottie.host/36309ce1-a378-4077-afae-96a73f7db7fa/9k8BIsctE0.json"
                    background="##ffffff"
                    speed={1}
                    style={{ width: "300px", height: "300px" }}
                    loop
                    autoplay
                  ></lottie-player>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              {categories.map((category) => (
                <div key={category.name}>
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-semibold text-gray-400 mb-2 px-4">
                      {category.name}
                    </p>
                    <button
                      className="text-xs text-blue-600 px-4 hover:underline"
                      onClick={() => {
                        setSelectedCategory(category);
                        fetchMoreSongs(category.name);
                      }}
                    >
                      See More
                    </button>
                  </div>
                  <ul className="space-y-4">
                    {category.songs.slice(0, 3).map((song: any) => (
                      <li
                        key={song.id}
                        className="flex items-center space-x-4 p-2 border rounded-lg hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          const embedUrl = `https://open.spotify.com/embed/track/${song.id}?utm_source=generator`;
                          setSelectedSongEmbed(embedUrl);
                          setMusicModalOpen(false);
                        }}
                      >
                        <img
                          src={song.album.images[0]?.url}
                          alt={song.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {song.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {song.artists[0]?.name}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default CreatePost;

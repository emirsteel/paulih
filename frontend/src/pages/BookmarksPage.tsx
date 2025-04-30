// src/pages/BookmarksPage.tsx
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { getBookmarkedPosts } from "../services/api";
import Posts from "../components/Posts";
import SharePopup from "../components/SharePopup";
import MainLayout from "../components/MainLayout";
import { AuthUserContext } from "../context/AuthUserContext";
import MobileNavItems from "../components/MobileNavItems";

// Define interfaces
interface Post {
  _id: string;
  content: string;
  media?: string[];
  likes: string[];
  user: {
    _id: string;
    username: string;
    profileImage?: string;
  };
  visibility: string;
  createdAt: string;
}

interface Bookmark {
  _id: string;
  post: Post | null;
  createdAt: string;
}

const BookmarksPage: React.FC = () => {
  const { user, loading: loadingUser } = useContext(AuthUserContext);
  const loggedInUserId = user?._id || localStorage.getItem("userId") || "";
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [likeStatus, setLikeStatus] = useState<{ [postId: string]: boolean }>(
    {}
  );
  const [likeCounts, setLikeCounts] = useState<{ [postId: string]: number }>(
    {}
  );
  const [commentInputs, setCommentInputs] = useState<{
    [postId: string]: string;
  }>({});
  const [showCommentBox, setShowCommentBox] = useState<{
    [postId: string]: boolean;
  }>({});

  const [isSharePopupOpen, setIsSharePopupOpen] = useState<boolean>(false);
  const [postToShare, setPostToShare] = useState<Post | null>(null);

  useEffect(() => {
    if (!loggedInUserId) {
      setError("Kullanıcı giriş yapmamış.");
      setLoading(false);
      return;
    }

    const fetchBookmarks = async () => {
      try {
        const bookmarks = await getBookmarkedPosts(loggedInUserId);
        const sortedBookmarks = bookmarks.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setBookmarkedPosts(sortedBookmarks);

        const validBookmarks = sortedBookmarks.filter((bm) => bm.post);
        validBookmarks.forEach((bm) => {
          const post = bm.post!;
          setLikeStatus((prev) => ({
            ...prev,
            [post._id]: post.likes.includes(loggedInUserId),
          }));
          setLikeCounts((prev) => ({
            ...prev,
            [post._id]: post.likes.length,
          }));
        });
      } catch (err) {
        console.error("Bookmarkları getirirken hata:", err);
        setError("Kaydedilen gönderiler alınırken hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [loggedInUserId]);

  if (loading || loadingUser)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600 animate-pulse">
          Kaydedilen gönderiler yükleniyor...
        </p>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );

  const validBookmarks = bookmarkedPosts.filter(
    (bookmark) => bookmark.post !== null && bookmark.post !== undefined
  );
  const posts: Post[] = validBookmarks
    .map((bookmark) => bookmark.post!)
    .filter((post) => {
      const visibility = post.visibility.toLowerCase();
      return (
        visibility !== "private" ||
        (visibility === "private" && post.user._id === loggedInUserId)
      );
    });

  const toggleLike = async (postId: string) => {
    if (!user) return;
    try {
      const response = await axios.put(
        `http://localhost:5001/api/posts/${postId}/like`,
        { userId: user._id }
      );
      const updatedLikes = response.data.likes;
      setLikeStatus((prev) => ({
        ...prev,
        [postId]: updatedLikes.includes(user._id),
      }));
      setLikeCounts((prev) => ({
        ...prev,
        [postId]: updatedLikes.length,
      }));
    } catch (error) {
      console.error("Beğenme durumunu değiştirmede hata:", error);
    }
  };

  const toggleCommentBox = (postId: string) => {
    setShowCommentBox((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCommentInputChange = (postId: string, value: string) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const submitComment = async (postId: string) => {
    const content = commentInputs[postId];
    if (!content) return;
    try {
      const response = await axios.post(
        `http://localhost:5001/api/posts/${postId}/comment`,
        {
          userId: user._id,
          content,
        }
      );
      const updatedPost = response.data.post;
      setBookmarkedPosts((prev) =>
        prev.map((bm) =>
          bm.post && bm.post._id === updatedPost._id
            ? { ...bm, post: updatedPost }
            : bm
        )
      );
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      setShowCommentBox((prev) => ({ ...prev, [postId]: false }));
    } catch (error) {
      console.error("Yorum gönderilirken hata:", error);
    }
  };

  const getProfileImageUrl = (imagePath: string) =>
    imagePath ? `http://localhost:5001/${imagePath}` : "/default-profile.png";

  const handleShareClick = (post: Post) => {
    setPostToShare(post);
    setIsSharePopupOpen(true);
  };

  const closeSharePopup = () => {
    setIsSharePopupOpen(false);
    setPostToShare(null);
  };

  const handlePostDelete = (postId: string) => {
    setBookmarkedPosts((prev) =>
      prev.filter((bm) => bm.post && bm.post._id !== postId)
    );
  };

  const commentUser = user;

  return (
    <MainLayout>
      <div className="pt-16 px-4 md:ml-20 lg:mr-80 bg-gray-100 min-h-screen">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-none md:max-w-2xl px-2 md:px-4 mt-8">
            {posts.length === 0 ? (
              <p className="text-center text-gray-600">
                Hiç kaydedilen gönderi bulunamadı.
              </p>
            ) : (
              <Posts
                posts={posts}
                user={user}
                commentUser={commentUser}
                toggleLike={toggleLike}
                toggleCommentBox={toggleCommentBox}
                handleCommentInputChange={handleCommentInputChange}
                submitComment={submitComment}
                commentInputs={commentInputs}
                showCommentBox={showCommentBox}
                likeStatus={likeStatus}
                likeCounts={likeCounts}
                getProfileImageUrl={getProfileImageUrl}
                openSharePopup={handleShareClick}
                onPostDelete={handlePostDelete}
                onPostClick={(postId: string) => {
                  console.log("Gönderiye tıklandı:", postId);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {isSharePopupOpen && postToShare && (
        <SharePopup post={postToShare} onClose={closeSharePopup} />
      )}

      {/* Mobile Navigation for tablets and phones */}
      <MobileNavItems onOpenCreatePost={() => {}} username={user?.username} />
    </MainLayout>
  );
};

export default BookmarksPage;

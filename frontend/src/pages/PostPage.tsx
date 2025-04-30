import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { fetchPostById } from "../services/api";
import Posts from "../components/Posts";
import MainLayout from "../components/MainLayout";
import { AuthUserContext } from "../context/AuthUserContext";
import SharePopup from "../components/SharePopup";

// Helper to safely extract an ID string
function getId(
  id: string | { $oid: string } | { _id: string } | undefined
): string {
  if (!id) return "";
  if (typeof id === "string") return id;
  if ("$oid" in id) return id.$oid;
  if ("_id" in id) return getId(id._id);
  return "";
}

interface Comment {
  _id: string;
  content: string;
  user: string | { _id: string; name: string; profileImage?: string };
  createdAt: string;
}

interface Post {
  _id: string;
  content: string;
  comments: Comment[];
  likes: any[]; // <- just array of userIds or like objects
  visibility: "Everyone" | "Friends" | "Private";
  user:
    | string
    | { _id: string; name: string; profileImage?: string; username?: string };
}

const getProfileImageUrl = (imagePath?: string): string => {
  if (imagePath && imagePath.trim() !== "") {
    return imagePath.startsWith("http")
      ? imagePath
      : `http://localhost:5001/${imagePath}`;
  }
  return "/default-profile.png";
};

const PostPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const authContext = useContext(AuthUserContext);
  if (!authContext)
    throw new Error("AuthUserContext must be used within AuthUserProvider");

  const { user } = authContext;
  const loggedInUser = user
    ? {
        _id: (user as any)._id || (user as any).id || "defaultUserId",
        name: user.name,
        username: user.username,
        profileImage: user.profileImage || "",
      }
    : {
        _id: "defaultUserId",
        name: "Default User",
        username: "defaultuser",
        profileImage: "",
      };

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [likeStatus, setLikeStatus] = useState<{ [postId: string]: boolean }>(
    {}
  );
  const [commentInputs, setCommentInputs] = useState<{
    [postId: string]: string;
  }>({});
  const [showCommentBox, setShowCommentBox] = useState<{
    [postId: string]: boolean;
  }>({});
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const [postToShare, setPostToShare] = useState<any>(null);

  useEffect(() => {
    if (!postId) return;
    const getPost = async () => {
      try {
        const data = await fetchPostById(postId);
        data.comments = data.comments || [];

        // Fetch full user details if needed
        if (typeof data.user === "string" || !("name" in data.user)) {
          try {
            const userResponse = await axios.get(
              `http://localhost:5001/api/users/${getId(data.user)}`
            );
            data.user = userResponse.data;
          } catch (userError) {
            console.error("Error fetching post user:", userError);
          }
        }

        if (typeof data.user === "object") {
          if (!data.user.name || data.user.name.trim() === "") {
            data.user.name =
              typeof data.user.username === "string" &&
              data.user.username.trim() !== ""
                ? data.user.username.charAt(0).toUpperCase() +
                  data.user.username.slice(1)
                : "Unknown";
          }
        }

        const postOwnerId = getId(data.user);
        const currentUserId = getId(loggedInUser._id);
        if (data.visibility === "Private" && postOwnerId !== currentUserId) {
          setError("Bu gönderiye erişim izniniz yok.");
          setPost(null);
        } else {
          setPost(data);
          setCommentInputs({ [data._id]: "" });
          setShowCommentBox({ [data._id]: true });
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Gönderi alınırken hata oluştu.");
      } finally {
        setLoading(false);
      }
    };
    getPost();
  }, [postId, loggedInUser._id]);

  const toggleLike = async (postId: string) => {
    if (!loggedInUser) return;
    try {
      const response = await fetch(
        `http://localhost:5001/api/posts/${postId}/like`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: loggedInUser._id }),
        }
      );
      if (!response.ok) throw new Error("Failed to toggle like");
      const data = await response.json();
      setPost((prevPost) => {
        if (prevPost && prevPost._id === postId) {
          return {
            ...prevPost,
            likes: data.likes,
          };
        }
        return prevPost;
      });
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleCommentInputChange = (postId: string, value: string) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const toggleCommentBox = (postId: string) => {
    // Comment box always open here, so do nothing
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
      setPost(updatedPost);
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      setShowCommentBox((prev) => ({ ...prev, [postId]: true }));
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleShareClick = (post: any) => {
    setPostToShare(post);
    setIsSharePopupOpen(true);
  };

  const closeSharePopup = () => {
    setIsSharePopupOpen(false);
    setPostToShare(null);
  };

  const headerUser =
    post && typeof post.user === "object"
      ? {
          _id: post.user._id,
          name: post.user.name,
          username: post.user.username || "unknown",
          profileImage: post.user.profileImage || getProfileImageUrl(),
        }
      : loggedInUser;

  if (loading) return <div>Gönderi yükleniyor...</div>;
  if (error) return <div>{error}</div>;

  return (
    <MainLayout>
      <div className="pt-16 px-4 md:ml-20 md:mr-80 relative">
        <div className="flex flex-col lg:flex-row">
          <div className="mx-auto w-full max-w-3xl">
            {post ? (
              <Posts
                posts={[post]}
                user={headerUser}
                commentUser={loggedInUser}
                toggleLike={toggleLike}
                toggleCommentBox={toggleCommentBox}
                handleCommentInputChange={handleCommentInputChange}
                submitComment={submitComment}
                commentInputs={{ [post._id]: commentInputs[post._id] || "" }}
                showCommentBox={{ [post._id]: true }}
                likeStatus={likeStatus}
                likeCounts={{ [post._id]: post.likes?.length || 0 }}
                getProfileImageUrl={getProfileImageUrl}
                openSharePopup={handleShareClick}
                onPostDelete={() => setPost(null)}
                onPostClick={(id: string) => navigate(`/post/${id}`)}
              />
            ) : (
              <p>Gönderi bulunamadı.</p>
            )}
            {isSharePopupOpen && postToShare && (
              <SharePopup post={postToShare} onClose={closeSharePopup} />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PostPage;

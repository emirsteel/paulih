import React, { useState, useEffect } from "react";
import { fetchAllPosts } from "../services/api";
import HomePagePost from "./HomePagePost";

const HomePagePosts: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const postsData = await fetchAllPosts();
      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching all posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const toggleLike = (postId: string) => console.log("Toggle like:", postId);
  const toggleCommentBox = (postId: string) =>
    console.log("Toggle comment box:", postId);
  const openSharePopup = (post: any) => console.log("Share post:", post);
  const likeStatus: { [postId: string]: boolean } = {};
  const likeCounts: { [postId: string]: number } = {};

  const loggedInUser = {
    _id: "loggedinuser123",
    name: "Logged In User",
    username: "loggedinuser",
    profileImage: "/path/to/profile.jpg",
  };

  const getProfileImageUrl = (imagePath: string) =>
    imagePath ? `http://localhost:5001/${imagePath}` : "/default-profile.png";

  return (
    <div className="posts-container">
      {loading ? (
        <p>Loading posts...</p>
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <HomePagePost
            key={post._id}
            post={post}
            loggedInUser={loggedInUser}
            getProfileImageUrl={getProfileImageUrl}
            toggleLike={toggleLike}
            toggleCommentBox={toggleCommentBox}
            openSharePopup={openSharePopup}
            likeStatus={likeStatus}
            likeCounts={likeCounts}
          />
        ))
      ) : (
        <p className="text-center text-gray-600">No posts available.</p>
      )}
    </div>
  );
};

export default HomePagePosts;

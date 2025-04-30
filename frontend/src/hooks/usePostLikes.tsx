import { useState } from 'react';
import axios from 'axios';

const usePostLikes = (userId: string | undefined) => {
  const [postLikes, setPostLikes] = useState<{
    [postId: string]: {
      [x: string]: any; userId: string; username: string 
}[];
  }>({}); // Store likes as an array of user objects for each post

  const fetchLikesForPosts = async (posts: any[]) => {
    const likesData: { [postId: string]: { userId: string; username: string }[] } = {};

    for (const post of posts) {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/posts/${post._id}/notificationlikes`
        );
        likesData[post._id] = response.data.likes; // Fetch and store userId and username for each post
      } catch (error) {
        console.error(`Error fetching likes for post ${post._id}:`, error);
      }
    }

    setPostLikes(likesData);
  };

  const toggleLike = async (postId: string) => {
    try {
      const response = await axios.put(`http://localhost:5001/api/posts/${postId}/like`, { userId });
      const updatedLikes = response.data.likes;

      // Update postLikes with the new list of users who liked the post
      setPostLikes((prev) => ({
        ...prev,
        [postId]: updatedLikes.map((like: any) => ({
          userId: like.userId,
          username: like.username,
        })),
      }));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return { postLikes, fetchLikesForPosts, toggleLike };
};

export default usePostLikes;

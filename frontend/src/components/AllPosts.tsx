// src/components/AllPosts.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  fetchAllPosts,
  getAllEvents,
  fetchPageProfile,
  fetchFriendsPosts,
} from "../services/api";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostInteractions from "./PostInteractions";
import SharePopup from "./SharePopup";
import CommentsList from "./CommentsList";
import PostAds from "./PostAds";
import PostContentEvents from "./PostContentEvents";

// Helper to safely extract an ID string.
function getId(id: string | { $oid: string } | undefined): string {
  if (!id) return "";
  return typeof id === "string" ? id : id.$oid || "";
}

interface User {
  _id: string;
  name: string;
  username: string;
  profileImage?: string;
  friends?: Array<string | { $oid: string }>;
  email?: string;
}

interface PageInfo {
  _id: string;
  name: string;
  username: string;
  profileImage?: string;
}

interface EventData {
  _id: string;
  title: string;
  date: string;
  details: string;
  image: string;
  createdAt: string;
  startTime?: string;
  endTime?: string;
  page?: PageInfo;
  comments?: any[];
  locationType?: string;
  locationLink?: string;
}

interface AllPostsProps {
  loggedInUser: User;
  getProfileImageUrl: (imagePath: string) => string;
  sortOption?: string;
  selectedFilter?: string;
}

type TimelineItem =
  | { type: "post"; data: any; createdAt: Date }
  | { type: "event"; data: EventData; createdAt: Date };

const AllPosts: React.FC<AllPostsProps> = ({
  loggedInUser,
  getProfileImageUrl,
  sortOption = "En Yeni",
  selectedFilter = "Tümü",
}) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [likeStatus, setLikeStatus] = useState<{ [postId: string]: boolean }>(
    {}
  );
  const [likeCounts, setLikeCounts] = useState<{ [postId: string]: number }>(
    {}
  );
  const [commentBoxVisible, setCommentBoxVisible] = useState<{
    [postId: string]: boolean;
  }>({});
  const [commentInputs, setCommentInputs] = useState<{
    [postId: string]: string;
  }>({});
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const [postToShare, setPostToShare] = useState<any>(null);

  const handleOpenSharePopup = (post: any) => {
    setPostToShare(post);
    setIsSharePopupOpen(true);
  };
  const handleCloseSharePopup = () => {
    setPostToShare(null);
    setIsSharePopupOpen(false);
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
        { userId: loggedInUser._id, content }
      );
      const updatedPost = response.data.post;
      setPosts((prev) =>
        prev.map((p) =>
          p._id === updatedPost._id
            ? {
                ...updatedPost,
                user:
                  typeof updatedPost.user === "object"
                    ? updatedPost.user
                    : p.user,
              }
            : p
        )
      );
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      setCommentBoxVisible((prev) => ({ ...prev, [postId]: false }));
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const toggleCommentBox = (postId: string) => {
    setCommentBoxVisible((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

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
      setLikeStatus((prev) => ({
        ...prev,
        [postId]: data.likes.some((id: string) => id === loggedInUser._id),
      }));
      setLikeCounts((prev) => ({
        ...prev,
        [postId]: data.likes.length,
      }));
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  useEffect(() => {
    const fetchPostsData = async () => {
      try {
        let allPosts;
        if (selectedFilter.toLowerCase() === "arkadaşlar") {
          allPosts = await fetchFriendsPosts(loggedInUser._id);
        } else {
          allPosts = await fetchAllPosts();
        }
        setPosts(allPosts);
        const initLikeStatus: { [postId: string]: boolean } = {};
        const initLikeCounts: { [postId: string]: number } = {};
        const initCommentBox: { [postId: string]: boolean } = {};
        allPosts.forEach((post: any) => {
          const pid = post._id;
          initLikeStatus[pid] =
            Array.isArray(post.likes) && post.likes.includes(loggedInUser._id);
          initLikeCounts[pid] = Array.isArray(post.likes)
            ? post.likes.length
            : 0;
          initCommentBox[pid] = false;
        });
        setLikeStatus(initLikeStatus);
        setLikeCounts(initLikeCounts);
        setCommentBoxVisible(initCommentBox);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPostsData();
  }, [loggedInUser._id, selectedFilter]);

  const visiblePosts = posts.filter((post) => {
    if (post.visibility === "Private") {
      return (
        (typeof post.user === "object"
          ? post.user._id.toString()
          : post.user.toString()) === loggedInUser._id
      );
    }
    if (post.visibility === "Friends") {
      const postUserId =
        typeof post.user === "object" ? getId(post.user._id) : post.user;
      if (postUserId === loggedInUser._id) return true;
      const myFriendIds =
        loggedInUser.friends?.map((friend) =>
          typeof friend === "object" ? getId(friend) : friend
        ) || [];
      let postOwnerFriends: string[] = [];
      if (typeof post.user === "object" && post.user.friends) {
        postOwnerFriends = post.user.friends.map((friend: any) =>
          typeof friend === "object" ? getId(friend) : friend
        );
      }
      return (
        myFriendIds.includes(postUserId) ||
        postOwnerFriends.includes(loggedInUser._id)
      );
    }
    return true;
  });

  let filteredPosts = visiblePosts;
  if (selectedFilter === "Üniversite") {
    filteredPosts = visiblePosts;
  } else if (selectedFilter === "Arkadaşlar") {
    filteredPosts = posts;
  }

  // Updated useEffect to include location properties when mapping raw events
  useEffect(() => {
    getAllEvents()
      .then(async (rawEvents: any[]) => {
        const eventsWithPages: EventData[] = await Promise.all(
          rawEvents.map(async (ev) => {
            const newEvent: EventData = {
              _id: ev._id.$oid || ev._id,
              title: ev.title,
              date: ev.date,
              details: ev.description,
              image: ev.photo,
              createdAt: ev.createdAt.$date || ev.createdAt,
              startTime: ev.startTime,
              endTime: ev.endTime,
              locationType: ev.locationType, // assign locationType
              locationLink: ev.locationLink, // assign locationLink
              comments: ev.comments || [],
            };
            if (ev.page && ev.page.$oid) {
              try {
                const pageData = await fetchPageProfile(ev.page.$oid);
                newEvent.page = {
                  ...pageData,
                  profileImage: pageData.profileImage
                    ? getProfileImageUrl(pageData.profileImage)
                    : "/default-profile.png",
                };
              } catch (error) {
                console.error("Failed to fetch page info for event:", error);
              }
            }
            return newEvent;
          })
        );
        setEvents(eventsWithPages);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, [getProfileImageUrl]);

  type TimelineItem =
    | { type: "post"; data: any; createdAt: Date }
    | { type: "event"; data: EventData; createdAt: Date };

  let timeline: TimelineItem[] = [];
  if (selectedFilter.toLowerCase() === "etkinlikler") {
    // When filter is "Etkinlikler", only include events
    timeline = events.map((e) => ({
      type: "event" as const,
      data: e,
      createdAt: new Date(e.createdAt),
    }));
  } else {
    // Otherwise, merge posts and events
    timeline = [
      ...filteredPosts.map((p) => ({
        type: "post" as const,
        data: p,
        createdAt: new Date(p.createdAt),
      })),
      ...events.map((e) => ({
        type: "event" as const,
        data: e,
        createdAt: new Date(e.createdAt),
      })),
    ];
  }

  if (sortOption === "En Eski") {
    timeline.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  } else {
    timeline.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  if (loading) {
    return <p className="text-center">Loading posts...</p>;
  }

  const renderedTimeline = timeline.map((item) => {
    if (item.type === "post") {
      const post = item.data;
      return (
        <div
          key={post._id}
          onClick={() => handlePostClick(post._id)}
          className="post-card bg-white text-black p-4 rounded-lg shadow-sm border border-gray-100 max-w-[700px] mx-auto hover:shadow-md transition-shadow cursor-pointer"
        >
          <PostHeader
            user={typeof post.user === "object" ? post.user : loggedInUser}
            post={post}
            getProfileImageUrl={getProfileImageUrl}
            loggedInUserId={loggedInUser._id}
          />
          <PostContent post={post} />
          <PostInteractions
            user={loggedInUser}
            post={post}
            toggleLike={() => toggleLike(post._id)}
            toggleCommentBox={() => toggleCommentBox(post._id)}
            openSharePopup={() => handleOpenSharePopup(post)}
            likeCounts={likeCounts}
            comments={post.comments || []}
          />
          {commentBoxVisible[post._id] && (
            <div className="mt-4 border-t border-gray-200 pt-3">
              <CommentsList
                postId={post._id}
                commentInput={commentInputs[post._id] || ""}
                handleCommentInputChange={handleCommentInputChange} // ✨ direkt doğru fonksiyon
                submitComment={() => submitComment(post._id)}
                user={loggedInUser}
                comments={post.comments || []}
                getProfileImageUrl={getProfileImageUrl}
              />
            </div>
          )}
        </div>
      );
    } else {
      const event = item.data;
      return (
        <div
          key={event._id}
          className="relative post-card bg-white text-black p-4 rounded-lg shadow-sm border border-gray-100 max-w-[700px] mx-auto transition-shadow"
        >
          <PostContentEvents event={event} currentUserId={loggedInUser._id} />
        </div>
      );
    }
  });

  return (
    <div className="posts-container space-y-6 my-6">
      {timeline.length > 0 ? (
        renderedTimeline
      ) : (
        <p className="text-center text-gray-600">
          Gösterilecek gönderi bulunamadı.
        </p>
      )}

      {/* Share Popup render */}
      {postToShare && (
        <SharePopup post={postToShare} onClose={handleCloseSharePopup} />
      )}
    </div>
  );
};

export default AllPosts;

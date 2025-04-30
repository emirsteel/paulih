// src/components/HomePagePost.tsx
import React from "react";
import HomePagePostHeader from "./HomePagePostHeader";
import HomePagePostContent from "./HomePagePostContent";
import HomePagePostInteractions from "./HomePagePostInteractions";
import HomePagePostOptionsMenu from "./HomePagePostOptionsMenu";

interface HomePagePostProps {
  post: any;
  loggedInUser: any;
  getProfileImageUrl: (imagePath: string) => string;
  toggleLike: (postId: string) => void;
  toggleCommentBox: (postId: string) => void;
  openSharePopup: (post: any) => void;
  likeStatus: { [postId: string]: boolean };
  likeCounts: { [postId: string]: number };
}

const HomePagePost: React.FC<HomePagePostProps> = ({
  post,
  loggedInUser,
  getProfileImageUrl,
  toggleLike,
  toggleCommentBox,
  openSharePopup,
  likeStatus,
  likeCounts,
}) => {
  return (
    <div className="post-card bg-white p-4 rounded-lg shadow mb-4">
      <HomePagePostHeader
        user={post.user}
        post={post}
        getProfileImageUrl={getProfileImageUrl}
        loggedInUser={loggedInUser}
      />
      <HomePagePostContent post={post} />
      <HomePagePostInteractions
        post={post}
        loggedInUser={loggedInUser}
        toggleLike={toggleLike}
        toggleCommentBox={toggleCommentBox}
        openSharePopup={openSharePopup}
        likeStatus={likeStatus}
        likeCounts={likeCounts}
      />
      <HomePagePostOptionsMenu />
    </div>
  );
};

export default HomePagePost;

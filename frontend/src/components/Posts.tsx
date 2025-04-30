// src/components/Posts.tsx
import React from "react";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostInteractions from "./PostInteractions";
import PostAds from "./PostAds";
import CommentsList from "./CommentsList";

interface User {
  _id: string;
  name: string;
  username: string;
  profileImage?: string;
  bannerImage?: string;
  bio?: string;
}

interface PostsProps {
  posts: any[];
  user: User; // The profile owner
  commentUser: User; // The logged‑in user (for comments)
  toggleLike: (postId: string) => Promise<void>;
  toggleCommentBox: (postId: string) => void;
  handleCommentInputChange: (postId: string, value: string) => void;
  submitComment: (postId: string) => void;
  commentInputs: { [postId: string]: string };
  showCommentBox: { [postId: string]: boolean };
  likeStatus: { [postId: string]: boolean };
  likeCounts: { [postId: string]: number };
  getProfileImageUrl: (imagePath: string) => string;
  openSharePopup: (post: any) => void;
  onPostClick?: (postId: string) => void;
  onPostDelete?: (postId: string) => void;
}

const Posts: React.FC<PostsProps> = ({
  posts,
  user,
  commentUser,
  toggleLike,
  toggleCommentBox,
  handleCommentInputChange,
  submitComment,
  commentInputs,
  showCommentBox,
  likeStatus,
  likeCounts,
  getProfileImageUrl,
  openSharePopup,
  onPostClick,
  onPostDelete,
}) => {
  // For clarity, assign the logged‑in user (for comments) to a local variable.
  const loggedInUser = commentUser;

  // Filter posts (if a post is private, only show it for its owner)
  const visiblePosts = posts.filter((post) => {
    if (post.visibility.toLowerCase() === "private") {
      if (typeof post.user === "object" && post.user._id) {
        return post.user._id === user._id;
      }
      return post.user === user._id;
    }
    return true;
  });

  const renderedContent = visiblePosts.reduce<React.ReactNode[]>(
    (acc, post, index) => {
      acc.push(
        <div
          key={post._id}
          // Only attach an onClick handler if onPostClick is provided.
          onClick={onPostClick ? () => onPostClick(post._id) : undefined}
          className="post-card bg-white text-black p-4 rounded-lg shadow-sm border border-gray-100 max-w-[700px] mx-auto hover:shadow-md transition-shadow"
        >
          <PostHeader
            user={user}
            post={post}
            getProfileImageUrl={getProfileImageUrl}
            loggedInUserId={user._id}
            onPostDelete={onPostDelete}
          />

          <PostContent post={post} />

          <PostInteractions
            user={user}
            post={post}
            toggleLike={() => toggleLike(post._id)}
            toggleCommentBox={() => toggleCommentBox(post._id)}
            openSharePopup={() => openSharePopup(post)}
            likeCounts={{ [post._id]: likeCounts[post._id] ?? 0 }}
            comments={post.comments}
          />

          {/* Render comments if the comment box is visible */}
          {showCommentBox[post._id] && (
            <div className="mt-4 border-t border-gray-200 pt-3">
              <CommentsList
                postId={post._id}
                commentInput={commentInputs[post._id] || ""}
                handleCommentInputChange={handleCommentInputChange}
                submitComment={submitComment}
                user={commentUser} // ✅ This is the logged-in user for submitting new comment
                comments={post.comments || []} // ✅ These are real comments, each comment.user must be fetched inside CommentsList (and fixed if needed)
                getProfileImageUrl={getProfileImageUrl}
              />
            </div>
          )}
        </div>
      );

      // Insert an ad after every 5 posts.
      if ((index + 1) % 5 === 0) {
        acc.push(
          <div key={`ad-${index}`} className="my-4">
            <PostAds />
          </div>
        );
      }
      return acc;
    },
    []
  );

  return (
    <div className="posts-container space-y-6 my-6">
      {visiblePosts.length > 0 ? (
        renderedContent
      ) : (
        <p className="text-center text-gray-600">
          Gösterilecek gönderi bulunamadı.
        </p>
      )}
    </div>
  );
};

export default Posts;

import React from "react";

interface HomePagePostContentProps {
  post: any;
}

const HomePagePostContent: React.FC<HomePagePostContentProps> = ({ post }) => {
  return (
    <div className="post-content my-4">
      <p>{post.content || "No content available."}</p>
      {post.media && post.media.length > 0 && (
        <div className="media mt-2 grid grid-cols-1 gap-2">
          {post.media.map((mediaUrl: string, index: number) => (
            <img
              key={index}
              src={mediaUrl}
              alt={`media-${index}`}
              className="w-full rounded"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePagePostContent;

import React from 'react';
import Post from './Post';  // Import the Post component

interface FeedProps {
  posts: any[];  // Adjust the type based on your post structure (for example, use Post[] if you have a Post interface)
  loading: boolean;
}

const Feed: React.FC<FeedProps> = ({ posts, loading }) => {
  if (loading) {
    return <p>Loading posts...</p>;
  }

  return (
    <div className="feed">
      {posts.length > 0 ? (
        posts.map((post) => (
          <Post
            key={post._id}
            content={post.content}
            username={post.username}
            time={post.time}
            views={post.views}
          />
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default Feed;

import React, { useState, useEffect } from 'react';
import CreatePost from './CreatePost';

const ParentComponent = () => {
  const [posts, setPosts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/posts');
      const data = await response.json();
      if (response.ok) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <button onClick={() => setModalOpen(true)}>Create Post</button>
      <CreatePost
        fetchPosts={fetchPosts} // Pass fetchPosts to refresh posts after creating a new one
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        userData={{ name: "User Name", profileImage: "https://via.placeholder.com/150" }}
      />
      <div>
        {posts.map((post) => (
          <div key={post._id}>{post.content}</div>
        ))}
      </div>
    </div>
  );
};

export default ParentComponent;

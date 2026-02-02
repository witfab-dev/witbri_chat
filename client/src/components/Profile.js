import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  IoGridOutline, IoBookmarkOutline, IoSettingsOutline, 
  IoShieldCheckmark, IoAddCircle, IoHeart, IoChatbubble 
} from "react-icons/io5";

// Import the child component
import PostDetail from "./PostDetail";
import "./Profile.css";

const Profile = ({ currentUser, setIsCreateOpen }) => {
  const [activeTab, setActiveTab] = useState("posts");
  const [userPosts, setUserPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  const fetchMyPosts = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/posts");
      // Filter posts for the current profile owner
      const filtered = res.data.filter(p => p.username === currentUser.username);
      setUserPosts(filtered);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, [currentUser.username]);

  return (
    <div className="profile-wrapper">
      <header className="profile-header-main">
        <div className="profile-pic-container">
          <div className="profile-pic-gradient">
            <div className="profile-pic-internal">
              {currentUser.username[0].toUpperCase()}
            </div>
          </div>
          <button className="avatar-add-badge" onClick={() => setIsCreateOpen(true)}>
            <IoAddCircle />
          </button>
        </div>

        <section className="profile-details">
          <div className="details-top">
            <h2 className="profile-username">
              {currentUser.username} <IoShieldCheckmark className="verified-icon" />
            </h2>
            <div className="profile-actions">
              <button className="edit-profile-btn">Edit Profile</button>
              <button className="settings-icon-btn"><IoSettingsOutline /></button>
            </div>
          </div>

          <div className="details-stats">
            <span><strong>{userPosts.length}</strong> posts</span>
            <span><strong>254</strong> followers</span>
            <span><strong>180</strong> following</span>
          </div>

          <div className="details-bio">
            <p className="bio-name">{currentUser.username}</p>
            <p className="bio-text">🚀 Building WitbriChat | React Developer</p>
          </div>
        </section>
      </header>

      <div className="profile-tabs-nav">
        <button className={activeTab === "posts" ? "active" : ""} onClick={() => setActiveTab("posts")}>
          <IoGridOutline /> POSTS
        </button>
        <button className={activeTab === "saved" ? "active" : ""} onClick={() => setActiveTab("saved")}>
          <IoBookmarkOutline /> SAVED
        </button>
      </div>

      <div className="profile-posts-grid">
        {userPosts.map((post) => (
          <div key={post.id} className="grid-item" onClick={() => setSelectedPost(post)}>
            <img src={`http://localhost:3001${post.image_url}`} alt="Post" />
            <div className="grid-overlay">
              <div className="overlay-stat"><IoHeart /> {post.likes || 0}</div>
              <div className="overlay-stat"><IoChatbubble /> 0</div>
            </div>
          </div>
        ))}
      </div>

      {/* RENDER MODAL EXTERNALLY */}
      {selectedPost && (
        <PostDetail 
          post={selectedPost} 
          onClose={() => setSelectedPost(null)} 
          currentUser={currentUser} 
          refreshPosts={fetchMyPosts}
        />
      )}
    </div>
  );
};

export default Profile;
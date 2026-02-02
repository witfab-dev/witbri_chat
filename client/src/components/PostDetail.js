import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  IoClose, IoHeartOutline, IoChatbubbleOutline, 
  IoPaperPlaneOutline, IoBookmarkOutline, IoTrashOutline 
} from "react-icons/io5";
import "./PostDetail.css";

const PostDetail = ({ post, onClose, currentUser, refreshPosts }) => {
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(post.likes || 0);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/posts/${post.id}/comments`);
        setComments(res.data);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };
    fetchComments();
  }, [post.id]);

  const handleLike = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("witbriUser")).token;
      await axios.post(`http://localhost:3001/api/posts/${post.id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLikes(prev => prev + 1);
      refreshPosts();
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const token = JSON.parse(localStorage.getItem("witbriUser")).token;
      const res = await axios.post("http://localhost:3001/api/comments", {
        post_id: post.id,
        username: currentUser.username,
        comment_text: newComment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments([...comments, { username: currentUser.username, comment_text: newComment, id: res.data.commentId }]);
      setNewComment("");
    } catch (err) {
      console.error("Comment failed", err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Delete this post?")) {
      try {
        const token = JSON.parse(localStorage.getItem("witbriUser")).token;
        await axios.delete(`http://localhost:3001/api/posts/${post.id}`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { username: currentUser.username }
        });
        refreshPosts();
        onClose();
      } catch (err) {
        alert("Unauthorized");
      }
    }
  };

  return (
    <div className="detail-overlay" onClick={onClose}>
      <button className="detail-close-x" onClick={onClose}><IoClose size={32} /></button>
      <div className="detail-container" onClick={(e) => e.stopPropagation()}>
        <div className="detail-image-side" onDoubleClick={handleLike}>
          <img src={`http://localhost:3001${post.image_url}`} alt="Post" />
        </div>
        <div className="detail-info-side">
          <div className="detail-header">
            <div className="header-left">
              <div className="mini-avatar">{post.username[0].toUpperCase()}</div>
              <span className="bold">{post.username}</span>
            </div>
            {post.username === currentUser.username && (
              <button className="delete-post-btn" onClick={handleDelete}><IoTrashOutline size={20}/></button>
            )}
          </div>
          <div className="detail-body">
            <p className="caption-section"><span className="bold">{post.username}</span> {post.caption}</p>
            <div className="comments-list">
              {comments.map(c => (
                <div key={c.id} className="comment-item">
                  <span className="bold">{c.username}</span> {c.comment_text}
                </div>
              ))}
            </div>
          </div>
          <div className="detail-footer">
            <div className="footer-actions">
              <IoHeartOutline size={26} className="action-icon" onClick={handleLike} />
              <IoChatbubbleOutline size={26} className="action-icon" />
              <IoPaperPlaneOutline size={26} className="action-icon" />
            </div>
            <div className="bold">{likes} likes</div>
            <form className="comment-input-wrapper" onSubmit={handleSendComment}>
              <input 
                type="text" 
                placeholder="Add a comment..." 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button type="submit" disabled={!newComment.trim()}>Post</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
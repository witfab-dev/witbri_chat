import React, { useState } from "react";
import { IoCreateOutline, IoSearchOutline, IoPersonCircleOutline, IoChevronDownOutline } from "react-icons/io5";

function Sidebar({ 
  dbUsers = [], 
  onlineUsers = [], 
  lastMessages = [], 
  activeChat, 
  setActiveChat, 
  currentUser 
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = dbUsers.filter((u) => 
    u?.username && 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) && 
    u.username !== currentUser?.username
  );

  const getLastMsg = (targetUser) => {
    const roomId = [currentUser?.username, targetUser].sort().join("_");
    const msgObj = lastMessages.find(m => m.room_name === roomId);
    
    if (!msgObj) return "Active now"; // IG style default
    
    const prefix = msgObj.sender_name === currentUser?.username ? "You: " : "";
    const text = msgObj.message_text;
    
    // Truncate logic
    const truncated = text.length > 22 ? text.substring(0, 22) + "..." : text;
    return `${prefix}${truncated}`;
  };

  return (
    <div className="sidebar">
      {/* Sidebar Header with IG Dropdown style */}
      <div className="sidebar-header">
        <div className="header-top">
          <div className="username-section">
            <span className="username-display">{currentUser?.username || "Account"}</span>
            <IoChevronDownOutline className="dropdown-arrow" />
          </div>
          <IoCreateOutline className="create-icon" />
        </div>
      </div>

      {/* Search Section */}
      <div className="sidebar-search">
        <div className="search-box">
          <IoSearchOutline className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Search" 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>

      {/* User List Area */}
      <div className="user-list">
        <div className="list-title">
          <span>Messages</span>
          <span className="requests-link">Requests</span>
        </div>
        
        {filteredUsers.length === 0 ? (
          <div className="no-users">No users found.</div>
        ) : (
          filteredUsers.map((userObj) => {
            const isOnline = onlineUsers.includes(userObj.username);

            return (
              <div 
                key={userObj.id} 
                className={`user-item ${activeChat === userObj.username ? "active-item" : ""}`}
                onClick={() => setActiveChat(userObj.username)}
              >
                {/* Avatar with dynamic ring */}
                <div className={isOnline ? "avatar-ring online" : "avatar-ring"}>
                  <div className="avatar-white-border">
                    <div className="avatar-img">
                      {userObj.username ? (
                        userObj.username.charAt(0).toUpperCase()
                      ) : (
                        <IoPersonCircleOutline size={24} />
                      )}
                    </div>
                  </div>
                </div>

                <div className="user-info">
                  <span className="user-name">{userObj.username}</span>
                  <div className="last-msg-row">
                    <span className="last-message-preview">
                      {getLastMsg(userObj.username)}
                    </span>
                    <span className="time-divider">·</span>
                    <span className="msg-time-stamp">1h</span>
                  </div>
                </div>

                {/* Blue Dot for unread/online status */}
                {isOnline && <div className="unread-indicator"></div>}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Sidebar;
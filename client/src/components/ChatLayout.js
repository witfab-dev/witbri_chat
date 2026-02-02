import React, { useState, useEffect } from "react";
import { IoChatbubblesOutline } from "react-icons/io5"; // Ensure this is imported
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";

function ChatLayout({ socket, currentUser, dbUsers, onlineUsers, targetUser, setIsSearchOpen }) {
  const [activeChat, setActiveChat] = useState(targetUser || null);

  useEffect(() => {
    if (targetUser) setActiveChat(targetUser);
  }, [targetUser]);

  // --- THE FIX: Define the missing function ---
  const openSearch = () => {
    if (setIsSearchOpen) {
      setIsSearchOpen(true);
    }
  };

  return (
    <div className={`witbri-layout ${activeChat ? "chatting" : ""}`}>
      <div className="sidebar-container">
        <Sidebar 
          dbUsers={dbUsers}
          onlineUsers={onlineUsers}
          currentUser={currentUser} 
          activeChat={activeChat} 
          setActiveChat={setActiveChat} 
        />
      </div>
      
      <main className="chat-area">
        {activeChat ? (
          <ChatWindow socket={socket} user={currentUser} room={activeChat} />
        ) : (
          <div className="no-chat-selected">
            <div className="empty-state-card">
              <div className="icon-badge">
                <IoChatbubblesOutline />
              </div>
              <h2>Your Messages</h2>
              <p>Send private photos and messages to a friend or group.</p>
              
              {/* This line now has a function to call! */}
              <button className="primary-cta-btn" onClick={openSearch}>
                Send Message
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ChatLayout;
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

// Component Imports
import Navigation from "./components/Navigation";
import HomeFeed from "./components/HomeFeed";
import ChatLayout from "./components/ChatLayout";
import Auth from "./components/Auth";
import Explore from "./components/Explore";
import Search from "./components/Search";
import Notifications from "./components/Notifications";
import Profile from "./components/Profile";
import CreatePost from "./components/CreatePost";

// CSS Import
import "./App.css";

const socket = io.connect("http://localhost:3001");

function App() {
  // --- 1. STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState("home");
  const [isSearchOpen, setIsSearchOpen] = useState(false); 
  const [isNotifOpen, setIsNotifOpen] = useState(false);   
  const [isCreateOpen, setIsCreateOpen] = useState(false); 
  const [unreadNotifs, setUnreadNotifs] = useState(0);    
  
  const [dbUsers, setDbUsers] = useState([]); 
  const [onlineUsers, setOnlineUsers] = useState([]); 
  const [selectedUser, setSelectedUser] = useState(null); 
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("witbriUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // --- 2. DATA FETCHING ---
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3001/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setDbUsers(data);
      } catch (err) {
        console.error("Error fetching database users:", err);
      }
    };
    fetchUsers();
  }, []);

  // --- 3. SESSION TIMEOUT LOGIC ---
  useEffect(() => {
    const checkTokenExpiry = () => {
      if (user?.expiresAt) {
        if (Date.now() > user.expiresAt) {
          handleLogout();
          alert("Your session has expired. Please log in again.");
        }
      }
    };
    const interval = setInterval(checkTokenExpiry, 60000); 
    return () => clearInterval(interval);
  }, [user]);

  // --- 4. SOCKET LOGIC ---
  useEffect(() => {
    if (user) {
      socket.emit("join_app", user.username);
      socket.on("user_list", (users) => setOnlineUsers(users));
      socket.on("new_notification", (data) => setUnreadNotifs((prev) => prev + 1));
    }
    return () => {
      socket.off("user_list");
      socket.off("new_notification");
    };
  }, [user]);

  // --- 5. HANDLERS ---
  const handleLogin = (userData) => {
    localStorage.setItem("witbriUser", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("witbriUser");
    setUser(null);
    setActiveTab("home");
  };

  const startConversation = (targetUsername) => {
    setSelectedUser(targetUsername);
    setActiveTab("messages");
    setIsSearchOpen(false);
    setIsNotifOpen(false); 
  };

  // --- 6. RENDER LOGIC ---
  if (!user) return <Auth onLogin={handleLogin} />;

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeFeed onDirectMessage={startConversation} currentUser={user} />;
      case "messages":
        return (
          <ChatLayout 
            socket={socket} 
            currentUser={user} 
            targetUser={selectedUser} 
            dbUsers={dbUsers} 
            onlineUsers={onlineUsers} 
            setIsSearchOpen={setIsSearchOpen}
          />
        );
      case "explore":
        return <Explore />;
      case "profile":
        return (
          <Profile 
            currentUser={user} 
            onLogout={handleLogout} 
            setIsCreateOpen={setIsCreateOpen} // Fixes the "not a function" error
          />
        );
      default:
        return <HomeFeed onDirectMessage={startConversation} />;
    }
  };

  return (
    <div className="main-structure">
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        isNotifOpen={isNotifOpen}
        setIsNotifOpen={setIsNotifOpen}
        setIsCreateOpen={setIsCreateOpen} 
        unreadCount={unreadNotifs} 
        setUnreadCount={setUnreadNotifs}
        currentUser={user}
      />
      
      {/* Search Overlay */}
      <Search 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onUserClick={startConversation}
      />

      {/* Notifications Overlay */}
      <Notifications 
        isOpen={isNotifOpen} 
        onClose={() => setIsNotifOpen(false)} 
      />

      {/* Create Post Modal */}
      <CreatePost 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        currentUser={user}
      />
      
      <main className={`content-area ${(isSearchOpen || isNotifOpen) ? 'shifted' : ''}`}>
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
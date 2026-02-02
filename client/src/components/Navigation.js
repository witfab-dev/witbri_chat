import React, { useState } from "react";
import { 
  IoHomeOutline, IoHomeSharp, 
  IoPaperPlaneOutline, IoPaperPlaneSharp, 
  IoFilmOutline, IoFilmSharp, 
  IoHeartOutline, IoHeartSharp,
  IoSearchOutline, IoSearchSharp,
  IoCompassOutline, IoCompassSharp,
  IoMenuOutline, IoPersonCircleOutline,
  IoLogOutOutline // Added for Logout icon
} from "react-icons/io5";

function Navigation({ 
  activeTab, 
  setActiveTab, 
  isSearchOpen, 
  setIsSearchOpen, 
  isNotifOpen, 
  setIsNotifOpen, 
  currentUser,
  onLogout // Destructure the logout prop
}) {
  
  const [unreadCount, setUnreadCount] = useState(3);

  const menu = [
    { id: "home", label: "Home", icon: <IoHomeOutline />, active: <IoHomeSharp /> },
    { id: "search", label: "Search", icon: <IoSearchOutline />, active: <IoSearchSharp /> },
    { id: "explore", label: "Explore", icon: <IoCompassOutline />, active: <IoCompassSharp /> },
    { id: "reels", label: "Reels", icon: <IoFilmOutline />, active: <IoFilmSharp /> },
    { id: "messages", label: "Messages", icon: <IoPaperPlaneOutline />, active: <IoPaperPlaneSharp /> },
    { id: "notifications", label: "Notifications", icon: <IoHeartOutline />, active: <IoHeartSharp /> },
    { id: "profile", label: "Profile", icon: <IoPersonCircleOutline />, active: <IoPersonCircleOutline /> },
  ];

  const handleItemClick = (id) => {
    if (id === "search") {
      setIsSearchOpen(!isSearchOpen);
      setIsNotifOpen(false);
    } else if (id === "notifications") {
      setIsNotifOpen(!isNotifOpen);
      setIsSearchOpen(false);
      setUnreadCount(0);
    } else {
      setActiveTab(id);
      setIsSearchOpen(false);
      setIsNotifOpen(false);
    }
  };

  return (
    <nav className={`nav-sidebar ${isSearchOpen || isNotifOpen ? "narrow" : ""}`}>
      <div className="nav-top-section">
        {/* LOGO SECTION */}
        <div className="sidebar-header-top" onClick={() => handleItemClick("home")}>
          <div className="witbri-logo-container">
            {/* ... SVG remains the same ... */}
            <svg width="35" height="35" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
               <rect width="512" height="512" rx="120" fill="url(#bg_grad)"/>
               <g stroke="white" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M150 210L200 320L230 250L265 325L310 215" /><path d="M265 210H335C365 210 375 235 375 255C375 275 365 300 335 300H270" /><path d="M270 300H335C365 300 385 325 385 355C385 385 365 410 335 410H270" />
               </g>
            </svg>
          </div>
          {!(isSearchOpen || isNotifOpen) && <span className="witbri-brand-name">WitbriChat</span>}
        </div>
        
        {/* NAV LINKS */}
        <div className="nav-links">
          {menu.map(item => (
            <div 
              key={item.id} 
              className={`nav-item ${activeTab === item.id ? "active" : ""} 
                ${(isSearchOpen && item.id === "search") || (isNotifOpen && item.id === "notifications") ? "searching" : ""}`} 
              onClick={() => handleItemClick(item.id)}
            >
              <span className="nav-icon">
                {activeTab === item.id || (isSearchOpen && item.id === "search") || (isNotifOpen && item.id === "notifications") 
                  ? item.active 
                  : item.icon}
                {item.id === "notifications" && unreadCount > 0 && (
                  <span className="nav-badge-dot">{unreadCount}</span>
                )}
              </span>
              {!(isSearchOpen || isNotifOpen) && <span className="nav-label">{item.label}</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="nav-bottom-section">
        {/* --- LOGOUT BUTTON --- */}
        <div className="nav-item logout-item" onClick={onLogout}>
          <span className="nav-icon"><IoLogOutOutline /></span>
          {!(isSearchOpen || isNotifOpen) && <span className="nav-label">Logout</span>}
        </div>

        <div className="nav-item">
          <span className="nav-icon"><IoMenuOutline /></span>
          {!(isSearchOpen || isNotifOpen) && <span className="nav-label">More</span>}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
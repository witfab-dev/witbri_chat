import React from 'react';
import { IoHeart, IoPersonAdd, IoChatbubble, IoChevronForward } from 'react-icons/io5';

const Notifications = ({ isOpen, onClose }) => {
  const notifications = [
    { id: 1, type: 'like', user: 'tech_guru', detail: 'liked your photo.', time: '2h', img: 'https://picsum.photos/50/50?random=10', postImg: 'https://picsum.photos/50/50?random=100' },
    { id: 2, type: 'follow', user: 'design_master', detail: 'started following you.', time: '5h', img: 'https://picsum.photos/50/50?random=11', following: false },
    { id: 3, type: 'comment', user: 'react_dev', detail: 'commented: "This looks amazing! 🔥"', time: '1d', img: 'https://picsum.photos/50/50?random=12', postImg: 'https://picsum.photos/50/50?random=101' },
  ];

  return (
    <>
      {isOpen && <div className="search-backdrop" onClick={onClose} />}
      
      <div className={`notification-panel ${isOpen ? 'open' : ''}`}>
        <div className="notif-header">
          <h2>Notifications</h2>
        </div>

        <div className="notif-section">
          <h3>This Week</h3>
          <div className="notif-list">
            {notifications.map((notif) => (
              <div key={notif.id} className="notif-item">
                <img src={notif.img} alt="user" className="notif-avatar" />
                
                <div className="notif-text">
                  <span className="notif-user">{notif.user}</span> {notif.detail}
                  <span className="notif-time">{notif.time}</span>
                </div>

                {notif.type === 'follow' ? (
                  <button className="notif-follow-btn">Follow</button>
                ) : (
                  <img src={notif.postImg} alt="post" className="notif-post-preview" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Notifications;
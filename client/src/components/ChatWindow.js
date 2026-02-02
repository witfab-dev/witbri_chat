import React, { useState, useEffect, useRef } from "react";
import { 
  IoCallOutline, IoVideocamOutline, IoInformationCircleOutline, 
  IoHappyOutline, IoImageOutline, IoHeartOutline, IoHeart 
} from "react-icons/io5";

function ChatWindow({ socket, user, room }) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const bottomRef = useRef();

  const privateRoomId = [user.username, room].sort().join("_");

  // Fetch History
  useEffect(() => {
    const loadHistory = async () => {
      const response = await fetch(`http://localhost:3001/messages/${privateRoomId}`);
      const data = await response.json();
      setChat(data);
    };
    if (room) {
      loadHistory();
      socket.emit("join_room", privateRoomId);
    }
  }, [room, privateRoomId, socket]);

  // Handle Incoming Messages
  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (data.room === privateRoomId) setChat((prev) => [...prev, data]);
    });
    return () => socket.off("receive_message");
  }, [socket, privateRoomId]);

  // Auto Scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMsg = () => {
    if (message.trim() === "") return;
    const msgData = {
      room: privateRoomId,
      user: user.username,
      message: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    socket.emit("send_message", msgData);
    setChat((prev) => [...prev, msgData]);
    setMessage("");
  };

  return (
    <div className="chat-window">
      {/* HEADER */}
      <div className="chat-header">
        <div className="header-info">
          <div className="avatar-small">{room[0].toUpperCase()}</div>
          <div className="header-text">
            <span className="username-title">{room}</span>
            <span className="active-status">Active now</span>
          </div>
        </div>
        <div className="header-actions">
          <IoCallOutline className="action-icon" />
          <IoVideocamOutline className="action-icon" />
          <IoInformationCircleOutline className="action-icon" />
        </div>
      </div>

      {/* MESSAGE LIST */}
      <div className="chat-messages">
        {chat.map((m, i) => (
          <div key={i} className={`msg-wrapper ${m.user === user.username ? "me" : "them"}`}>
            <div className="insta-bubble">
              {m.message}
            </div>
            {i === chat.length - 1 && m.user === user.username && (
              <span className="seen-status">Seen</span>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* FOOTER INPUT */}
      <div className="chat-footer">
        <div className="pill-input">
          <IoHappyOutline className="input-tool" />
          <input 
            placeholder="Message..." 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMsg()}
          />
          {message ? (
            <button className="send-link" onClick={sendMsg}>Send</button>
          ) : (
            <>
              <IoImageOutline className="input-tool" />
              <IoHeartOutline className="input-tool" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
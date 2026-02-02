import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreatePost.css';
import { 
    IoImageOutline, IoClose, IoChevronBack, 
    IoShieldCheckmark 
} from 'react-icons/io5';
import './CreatePost.css';

const CreatePost = ({ isOpen, onClose, currentUser, dbUsers = [] }) => {
    // --- 1. STATE MANAGEMENT ---
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [caption, setCaption] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [progress, setProgress] = useState(0);

    // Mention States
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [cursorPos, setCursorPos] = useState(0);

    if (!isOpen) return null;

    // --- 2. HANDLERS ---
    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
        }
    };

    const handleCaptionChange = (e) => {
        const value = e.target.value;
        const selectionStart = e.target.selectionStart;
        setCaption(value);
        setCursorPos(selectionStart);

        // Detect '@' for mentions
        const textBeforeCursor = value.slice(0, selectionStart);
        const lastWord = textBeforeCursor.split(/\s/).pop();
        
        if (lastWord.startsWith("@")) {
            const query = lastWord.slice(1).toLowerCase();
            const matches = dbUsers.filter(u => 
                u.username.toLowerCase().includes(query) && 
                u.username !== currentUser.username
            );
            setFilteredUsers(matches);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const selectUser = (username) => {
        const textBeforeAt = caption.slice(0, caption.lastIndexOf("@", cursorPos));
        const textAfterAt = caption.slice(cursorPos);
        setCaption(`${textBeforeAt}@${username} ${textAfterAt}`);
        setShowSuggestions(false);
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);
        setProgress(0);

        const formData = new FormData();
        formData.append("image", file);
        formData.append("username", currentUser.username);
        formData.append("caption", caption);

        try {
            const storedData = localStorage.getItem("witbriUser");
            const token = storedData ? JSON.parse(storedData).token : null;

            await axios.post("http://localhost:3001/api/posts", formData, {
                headers: { 
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}` 
                },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percent);
                }
            });

            setIsSuccess(true);

            setTimeout(() => {
                setIsSuccess(false);
                handleReset();
                onClose();
                window.location.reload(); 
            }, 1500);

        } catch (err) {
            console.error("Upload error:", err);
            alert("Upload failed. Please check your connection.");
            setIsUploading(false);
        }
    };

    const handleReset = () => {
        setFile(null);
        setPreview(null);
        setCaption("");
        setProgress(0);
        setShowSuggestions(false);
    };

    return (
        <div className="create-modal-overlay" onClick={onClose}>
            <div className="create-modal-box" onClick={(e) => e.stopPropagation()}>
                
                {isSuccess ? (
                    <div className="success-screen">
                        <div className="success-icon-pop">
                            <IoShieldCheckmark size={100} color="#4bb543" />
                        </div>
                        <h2>Shared successfully!</h2>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="create-modal-header">
                            {preview && !isUploading && (
                                <button className="back-btn" onClick={handleReset}>
                                    <IoChevronBack size={24} />
                                </button>
                            )}
                            <h3>Create new post</h3>
                            {preview && (
                                <button className="share-btn" onClick={handleUpload} disabled={isUploading}>
                                    {isUploading ? "Sharing..." : "Share"}
                                </button>
                            )}
                            {!preview && <button className="close-btn-top" onClick={onClose}><IoClose size={24} /></button>}
                        </div>

                        {/* Progress Bar */}
                        {isUploading && (
                            <div className="progress-container">
                                <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                            </div>
                        )}

                        {/* Body */}
                        <div className={`create-modal-body ${preview ? 'split-view' : ''}`}>
                            {!preview ? (
                                <div className="upload-placeholder">
                                    <IoImageOutline size={90} className="icon-fade" />
                                    <p>Select photos to share</p>
                                    <label htmlFor="file-input" className="select-btn">Select from computer</label>
                                    <input id="file-input" type="file" accept="image/*" hidden onChange={handleFileChange} />
                                </div>
                            ) : (
                                <div className="post-editor">
                                    <div className="editor-preview">
                                        <img src={preview} alt="Preview" />
                                    </div>
                                    <div className="editor-details">
                                        <div className="user-info">
                                            <div className="mini-avatar">{currentUser.username[0].toUpperCase()}</div>
                                            <span className="bold">{currentUser.username}</span>
                                        </div>
                                        
                                        <div className="textarea-wrapper">
                                            <textarea 
                                                placeholder="Write a caption..." 
                                                value={caption}
                                                onChange={handleCaptionChange}
                                                maxLength="2200"
                                            />
                                            {showSuggestions && filteredUsers.length > 0 && (
                                                <ul className="mention-dropdown">
                                                    {filteredUsers.map(u => (
                                                        <li key={u.id} onClick={() => selectUser(u.username)}>
                                                            <div className="mini-avatar">{u.username[0].toUpperCase()}</div>
                                                            <span>{u.username}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                        
                                        <div className="editor-footer">
                                            <span>{caption.length} / 2,200</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CreatePost;
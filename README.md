Markdown
# 📸 WitbriChat | Full-Stack Social Media Platform

WitbriChat is a modern, Instagram-inspired social media application built with the MERN-style stack (MySQL, Express, React, Node.js). It features real-time messaging, image sharing, and a responsive UI.



## ✨ Features

* **🔐 Secure Authentication**: JWT-based login and registration with password hashing (bcrypt).
* **🖼️ Image Sharing**: Upload posts with captions via Multer-powered backend storage.
* **💬 Real-time Chat**: Instant messaging powered by Socket.io with unread notification badges.
* **❤️ Social Interactions**: Like posts and leave comments on the feed.
* **📱 Responsive Design**: Fully optimized for mobile and desktop "Slide-out" navigation.
* **🔍 Search & Explore**: Find other users and discover content through interactive sidebars.

---

## 🚀 Tech Stack

**Frontend:** React.js, Axios, React Icons, Socket.io-client  
**Backend:** Node.js, Express.js  
**Database:** MySQL  
**Real-time:** Socket.io  
**File Handling:** Multer

---

## 🛠️ Getting Started

### 1. Prerequisites
* Node.js (v16+)
* MySQL Server

### 2. Database Setup
Run the following command in your MySQL terminal to create the necessary tables:
```sql
-- Create database
CREATE DATABASE chat_app;
-- Run the provided database schema script found in /docs or provided in previous setup.
3. Installation
Clone the repository and install dependencies for both folders:

Backend:

Bash
cd server
npm install
Frontend:

Bash
cd client
npm install
4. Configuration
Create a .env file in the server directory:

Code snippet
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=chat_app
JWT_SECRET=your_secret_key
PORT=3001
5. Run the App
Start Backend:

Bash
pm2 start server.js # or node server.js
Start Frontend:

Bash
npm start
📂 Project Structure
Plaintext
├── client/                # React application
│   ├── src/components/    # UI Components (Auth, Home, Navigation)
│   └── App.js             # Main routing and state management
├── server/                # Node.js Express server
│   ├── uploads/           # Stored user images
│   └── server.js          # Main entry point & API routes
└── README.md
📝 License
Distributed under the MIT License.


---

### Tips for your README:
* **Add Screenshots**: Once your app is hosted, replace the placeholder text with actual screenshots of your login and home feed.
* **Update the URL**: If you host on Render/Vercel, add a "Live Demo" link at the top.

**Would you like me to help you write a `CONTRIBUTING.md` file in case you want to invite other developers to help you build new features?**

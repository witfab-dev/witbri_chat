require('dotenv').config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require('fs');

const app = express();
const server = http.createServer(app);

// --- 1. MIDDLEWARE ---
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true
}));
app.use(express.json());
// Static serving for images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 2. DATABASE CONNECTION ---
const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "", 
    database: process.env.DB_NAME || "chat_app",
    waitForConnections: true,
    connectionLimit: 10,
});

db.getConnection((err, conn) => {
    if (err) console.error("❌ DB Connection Failed:", err.message);
    else {
        console.log("✅ Database Connected!");
        conn.release();
    }
});

// --- 3. JWT AUTH MIDDLEWARE ---
const SECRET_KEY = process.env.JWT_SECRET || "your_super_secret_key";

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ error: "No token provided." });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: "Session expired." });
        req.user = user;
        next();
    });
};

// --- 4. MULTER STORAGE CONFIG ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `post-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB Limit
});

// --- 5. POST ROUTES ---

app.post("/api/posts", authenticateToken, upload.single('image'), (req, res) => {
    const { username, caption } = req.body;
    if (!req.file) return res.status(400).json({ error: "No image file provided" });

    // Store path WITHOUT leading slash for easier path.join during deletion
    const imageUrl = `uploads/${req.file.filename}`;
    const query = "INSERT INTO posts (username, caption, image_url, likes) VALUES (?, ?, ?, 0)";

    db.query(query, [username, caption, imageUrl], (err, result) => {
        if (err) {
            console.error("DB Error:", err);
            if (req.file) fs.unlinkSync(req.file.path); // Delete file if DB fails
            return res.status(500).json({ error: "Failed to save post to database." });
        }
        res.status(201).json({ message: "Post created!", postId: result.insertId });
    });
});

app.get("/api/posts", (req, res) => {
    const query = `
        SELECT p.*, (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comment_count 
        FROM posts p ORDER BY created_at DESC
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.post("/api/posts/:id/like", authenticateToken, (req, res) => {
    db.query("UPDATE posts SET likes = likes + 1 WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Liked!" });
    });
});

app.delete("/api/posts/:id", authenticateToken, (req, res) => {
    const postId = req.params.id;
    const { username } = req.body;

    db.query("SELECT image_url, username FROM posts WHERE id = ?", [postId], (err, result) => {
        if (err || result.length === 0) return res.status(404).json({ error: "Post not found" });
        if (result[0].username !== username) return res.status(403).json({ error: "Unauthorized" });

        const filePath = path.join(__dirname, result[0].image_url);

        db.query("DELETE FROM posts WHERE id = ?", [postId], (err) => {
            if (err) return res.status(500).json(err);
            if (fs.existsSync(filePath)) fs.unlink(filePath, (err) => { if (err) console.error(err); });
            res.json({ message: "Post deleted" });
        });
    });
});

// --- 6. COMMENT ROUTES ---

app.post("/api/comments", authenticateToken, (req, res) => {
    const { post_id, username, comment_text } = req.body;
    db.query("INSERT INTO comments (post_id, username, comment_text) VALUES (?, ?, ?)", 
    [post_id, username, comment_text], (err) => {
        if (err) return res.status(500).json(err);
        res.status(201).json({ message: "Comment added!" });
    });
});

app.get("/api/posts/:id/comments", (req, res) => {
    db.query("SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC", [req.params.id], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// --- 7. AUTH ROUTES ---

app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], (err) => {
        if (err) return res.status(400).json({ error: "Username taken." });
        res.status(201).json({ message: "Registered!" });
    });
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    db.query("SELECT * FROM users WHERE username = ?", [username], async (err, result) => {
        if (err || result.length === 0) return res.status(404).json({ error: "User not found" });
        const isMatch = await bcrypt.compare(password, result[0].password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
        const token = jwt.sign({ username, id: result[0].id }, SECRET_KEY, { expiresIn: "24h" });
        res.json({ token, username });
    });
});

app.get("/users", (req, res) => {
    db.query("SELECT id, username FROM users", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// --- 8. SOCKET.IO LOGIC ---

const io = new Server(server, { cors: { origin: "http://localhost:3000" } });
let activeUsers = {};

io.on("connection", (socket) => {
    socket.on("join_app", (username) => {
        activeUsers[socket.id] = { username };
        io.emit("user_list", [...new Set(Object.values(activeUsers).map(u => u.username))]);
    });

    socket.on("join_room", (room) => socket.join(room));

    socket.on("send_message", (data) => {
        const { room, user, message } = data;
        db.query("INSERT INTO messages (room_name, sender_name, message_text) VALUES (?, ?, ?)", 
        [room, user, message], (err) => {
            if (!err) socket.to(room).emit("receive_message", data);
        });
    });

    socket.on("disconnect", () => {
        delete activeUsers[socket.id];
        io.emit("user_list", [...new Set(Object.values(activeUsers).map(u => u.username))]);
    });
});

const PORT = 3001;
server.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
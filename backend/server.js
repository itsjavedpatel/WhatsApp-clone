require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/database");

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

// Database
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add io to request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
const apiRoutes = require("./routes/api");
const initRoutes = require("./routes/init");

app.use("/api", apiRoutes);
app.use("/api/init", initRoutes);

// Socket.io connection
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Join  conversation
  socket.on("join_conversation", (wa_id) => {
    socket.join(wa_id);
    console.log(`Client ${socket.id} joined conversation ${wa_id}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });

  // Error handling
  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

// Handle shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await mongoose.connection.close();
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

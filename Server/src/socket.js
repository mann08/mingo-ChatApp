import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

// Maps userId (string) → socketId (string)
// Used to send real-time messages to a specific user
const userSocketMap = {};

/**
 * getReceiverSocketId — returns the socket ID of a connected user.
 * @param {string} userId - MongoDB user _id as string
 * @returns {string|undefined} - socket ID or undefined if offline
 */
export const getReceiverSocketId = (userId) => userSocketMap[userId];

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`🟢 Socket connected — userId: ${userId}, socketId: ${socket.id}`);

    // Broadcast updated online users list to ALL connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
      console.log(`🔴 Socket disconnected — userId: ${userId}`);
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { app, io, server };

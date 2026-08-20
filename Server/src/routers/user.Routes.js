import express from "express";
import protectRoute from "../middleware/auth.Middleware.js";
import { getAllUsers, updateProfile } from "../controllers/user.Controller.js";
import { getMessages, sendMessage } from "../controllers/message.Controller.js";

const router = express.Router();

// ── User Routes ──────────────────────────────────────────────────────────────
// GET /api/users       — all users except current user (for sidebar)
router.get("/", protectRoute, getAllUsers);

// PUT /api/users/profile  — update logged-in user profile
router.put("/profile", protectRoute, updateProfile);

// ── Message Routes (nested under /api/users for clarity) ─────────────────────
// GET /api/users/messages/:userId  — conversation history with a specific user
router.get("/messages/:userId", protectRoute, getMessages);

// POST /api/users/messages/:userId — send a message to a specific user
router.post("/messages/:userId", protectRoute, sendMessage);

export default router;

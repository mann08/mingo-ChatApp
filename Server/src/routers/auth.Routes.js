import express from "express";
import { signup, login, logout, getMe } from "../controllers/auth.Controller.js";
import protectRoute from "../middleware/auth.Middleware.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected routes (need valid JWT cookie)
router.post("/logout", protectRoute, logout);
router.get("/me", protectRoute, getMe);

export default router;

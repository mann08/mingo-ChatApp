import User from "../models/user.model.js";
import { generateToken } from "../config/authToken.config.js";

// ─── SIGNUP ────────────────────────────────────────────────────────────────────
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: name, email, password.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists. Please log in.",
      });
    }

    // Create user (password will be hashed in pre-save hook)
    const user = new User({ name, email, password });
    await user.save();

    // Issue JWT token as HTTP-only cookie
    generateToken(user._id.toString(), res);

    return res.status(201).json({
      success: true,
      message: "Account created successfully! Welcome to Mingo 🚀",
      user,
    });
  } catch (error) {
    console.error("Signup Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during signup. Please try again.",
    });
  }
};

// ─── LOGIN ─────────────────────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials. Please check your email and password.",
      });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials. Please check your email and password.",
      });
    }

    // Mark user as online
    user.online = true;
    user.lastSeen = new Date();
    await user.save();

    // Issue JWT token
    generateToken(user._id.toString(), res);

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}! 👋`,
      user,
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during login. Please try again.",
    });
  }
};

// ─── LOGOUT ────────────────────────────────────────────────────────────────────
export const logout = async (req, res) => {
  try {
    // Mark user as offline (if authenticated)
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        online: false,
        lastSeen: new Date(),
      });
    }

    // Clear the cookie
    res.clearCookie("mingo_token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully. See you soon! 👋",
    });
  } catch (error) {
    console.error("Logout Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error during logout.",
    });
  }
};

// ─── GET ME (current logged-in user) ──────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    // req.user is already set by protectRoute middleware
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error("GetMe Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error fetching user data.",
    });
  }
};

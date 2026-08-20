import { verifyToken } from "../config/authToken.config.js";
import User from "../models/user.model.js";

/**
 * protectRoute — middleware to verify JWT from cookie and attach req.user.
 * Protects any route that requires authentication.
 */
const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.mingo_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized — No token provided. Please log in.",
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized — Invalid or expired token. Please log in again.",
      });
    }

    // Fetch user (exclude password)
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized — User not found.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error in authentication.",
    });
  }
};

export default protectRoute;

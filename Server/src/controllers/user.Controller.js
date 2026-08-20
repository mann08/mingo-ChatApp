import User from "../models/user.model.js";

// ─── GET ALL USERS (for chat sidebar) ─────────────────────────────────────────
/**
 * Returns all users except the currently logged-in user.
 * Also includes real-time online status from DB.
 */
export const getAllUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const users = await User.find({ _id: { $ne: loggedInUserId } })
      .select("-password")
      .sort({ online: -1, name: 1 }); // Online users first, then alphabetical

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("GetAllUsers Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error fetching users.",
    });
  }
};

// ─── UPDATE PROFILE ───────────────────────────────────────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user._id;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 2 characters.",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name: name.trim() },
      { new: true, runValidators: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("UpdateProfile Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error updating profile.",
    });
  }
};

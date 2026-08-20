import Message from "../models/messageModel.js";
import User from "../models/user.model.js";
import { getReceiverSocketId, io } from "../socket.js";

// ─── GET MESSAGES (conversation between two users) ────────────────────────────
export const getMessages = async (req, res) => {
  try {
    const { userId: otherUserId } = req.params; // The other user's ID
    const myId = req.user._id;

    // Fetch all messages in both directions between the two users
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 }); // Oldest first

    // Mark incoming messages as "read" now that the conversation is opened
    await Message.updateMany(
      { senderId: otherUserId, receiverId: myId, status: { $ne: "read" } },
      { $set: { status: "read" } }
    );

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("GetMessages Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error fetching messages.",
    });
  }
};

// ─── SEND MESSAGE ─────────────────────────────────────────────────────────────
export const sendMessage = async (req, res) => {
  try {
    const { userId: receiverId } = req.params;
    const { text } = req.body;
    const senderId = req.user._id;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message text cannot be empty.",
      });
    }

    // Check receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "Recipient user not found.",
      });
    }

    // Determine initial status: if receiver is online → "delivered" else "sent"
    const receiverSocketId = getReceiverSocketId(receiverId.toString());
    const initialStatus = receiverSocketId ? "delivered" : "sent";

    // Save message to MongoDB
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text: text.trim(),
      status: initialStatus,
    });

    // ── Real-time delivery via Socket.IO ──
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json({
      success: true,
      message: newMessage,
    });
  } catch (error) {
    console.error("SendMessage Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error sending message.",
    });
  }
};

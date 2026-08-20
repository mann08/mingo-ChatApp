import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import axios from "axios";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);          // All other users for sidebar
  const [selectedUser, setSelectedUser] = useState(null); // Active chat partner
  const [messages, setMessages] = useState([]);    // Messages in active conversation
  const [onlineUsers, setOnlineUsers] = useState([]); // Socket online user IDs
  const [usersLoading, setUsersLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const socketRef = useRef(null);

  // ── Connect Socket.IO when user is logged in ──────────────────────────────
  useEffect(() => {
    if (!user) {
      // Disconnect if logged out
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const socket = io(window.location.origin, {
      query: { userId: user._id },
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);
    });

    // Track who is online
    socket.on("getOnlineUsers", (onlineUserIds) => {
      setOnlineUsers(onlineUserIds);
    });

    // Receive real-time message
    socket.on("newMessage", (newMessage) => {
      // Only add to state if it's from the currently open conversation
      setMessages((prev) => {
        if (
          selectedUser &&
          newMessage.senderId === selectedUser._id
        ) {
          return [...prev, newMessage];
        }
        return prev;
      });

      // Show toast notification if chat isn't open
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === newMessage.senderId
            ? { ...u, lastMsg: newMessage.text, unread: (u.unread || 0) + 1 }
            : u
        )
      );
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Keep the message listener up to date with the latest selectedUser
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    socket.off("newMessage");
    socket.on("newMessage", (newMessage) => {
      setMessages((prev) => {
        if (selectedUser && newMessage.senderId === selectedUser._id) {
          return [...prev, newMessage];
        }
        return prev;
      });

      // Update last message in sidebar
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === newMessage.senderId
            ? { ...u, lastMsg: newMessage.text }
            : u
        )
      );
    });
  }, [selectedUser]);

  // ── Fetch all users for the sidebar ──────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    if (!user) return;
    setUsersLoading(true);
    try {
      const { data } = await axios.get("/users");
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error("fetchUsers error:", err);
      toast.error("Could not load contacts.");
    } finally {
      setUsersLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ── Fetch messages for selected conversation ──────────────────────────────
  const fetchMessages = useCallback(async (otherUserId) => {
    setMessagesLoading(true);
    try {
      const { data } = await axios.get(`/users/messages/${otherUserId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("fetchMessages error:", err);
      toast.error("Could not load messages.");
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  // When selected user changes, load their conversation
  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id);
    } else {
      setMessages([]);
    }
  }, [selectedUser, fetchMessages]);

  // ── Send message ──────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (text) => {
      if (!selectedUser || !text.trim()) return;

      try {
        const { data } = await axios.post(
          `/users/messages/${selectedUser._id}`,
          { text: text.trim() }
        );
        if (data.success) {
          setMessages((prev) => [...prev, data.message]);
          // Update last message in sidebar
          setUsers((prevUsers) =>
            prevUsers.map((u) =>
              u._id === selectedUser._id
                ? { ...u, lastMsg: text.trim() }
                : u
            )
          );
        }
      } catch (err) {
        console.error("sendMessage error:", err);
        toast.error("Failed to send message. Try again.");
      }
    },
    [selectedUser]
  );

  // ── Compute users with online status merged ───────────────────────────────
  const usersWithOnlineStatus = users.map((u) => ({
    ...u,
    online: onlineUsers.includes(u._id),
  }));

  return (
    <ChatContext.Provider
      value={{
        users: usersWithOnlineStatus,
        usersLoading,
        selectedUser,
        setSelectedUser,
        messages,
        messagesLoading,
        sendMessage,
        onlineUsers,
        fetchUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
};

import { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import api from "../services/api";

const socket = io(import.meta.env.VITE_API_URL);

export default function useChat() {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/conversations");
      setConversations(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load conversations");
      // console.error("Error fetching conversations:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async (wa_id) => {
    try {
      setLoading(true);
      const response = await api.get(`/messages/${wa_id}`);
      setMessages(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load messages");
      // console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(
    async (text) => {
      if (!selectedChat || !text.trim()) return;

      try {
        await api.post("/send", {
          wa_id: selectedChat._id,
          text,
        });
      } catch (err) {
        setError("Failed to send message");
        // console.error("Error sending message:", err);
      }
    },
    [selectedChat]
  );

  const selectChat = useCallback(
    async (wa_id) => {
      socket.emit("join_conversation", wa_id);
      setConversations((prev) =>
        prev.map((c) => (c._id === wa_id ? { ...c, unreadCount: 0 } : c))
      );
      const chat = conversations.find((c) => c._id === wa_id);
      setSelectedChat(chat);
      await fetchMessages(wa_id);
    },
    [conversations, fetchMessages]
  );

  const updateConversationList = useCallback((message) => {
    setConversations((prev) => {
      const updated = [...prev];
      const convIndex = updated.findIndex((c) => c._id === message.wa_id);

      if (convIndex >= 0) {
        updated[convIndex].lastMessage = message.timestamp;
        if (message.direction === "inbound") {
          updated[convIndex].unreadCount =
            (updated[convIndex].unreadCount || 0) + 1;
        }
      } else {
        updated.push({
          _id: message.wa_id,
          lastMessage: message.timestamp,
          unreadCount: message.direction === "inbound" ? 1 : 0,
          contact_name: message.contact_name,
        });
      }

      return updated.sort(
        (a, b) => new Date(b.lastMessage) - new Date(a.lastMessage)
      );
    });
  }, []);

  useEffect(() => {
    socket.on("new_message", (message) => {
      if (selectedChat && message.wa_id === selectedChat._id) {
        setMessages((prev) => [...prev, message]);
      }
      updateConversationList(message);
    });

    socket.on("status_update", ({ message_id, status }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.meta_msg_id === message_id ? { ...msg, status } : msg
        )
      );
    });

    return () => {
      socket.off("new_message");
      socket.off("status_update");
    };
  }, [selectedChat, updateConversationList]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Initialize data from payloads
  const initializeData = useCallback(async () => {
    try {
      setLoading(true);
      await api.post("/init/initialize");
      await fetchConversations();
      setInitialized(true);
    } catch (err) {
      setError("Initialization failed");
      // console.error("Initialization error at frontend");
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    conversations,
    selectedChat,
    messages,
    loading,
    error,
    selectChat,
    sendMessage,
    fetchConversations,
    initialized,
    initializeData,
  };
}

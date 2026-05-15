/** @format */

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  MessageCircle,
  Send,
  Search,
  Loader2,
  ChevronLeft,
  Users,
  Eye,
} from "lucide-react";
import { socketService } from "../../../services/socketService";

const API_URL = "http://localhost:8080/api";

const getAuthHeader = () => {
  const token = sessionStorage.getItem("token");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export default function AdminMessages() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const messagesEndRef = useRef(null);

  // Kết nối Socket
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      socketService.connect(token);
    }

    return () => {
      socketService.off("new-message");
      socketService.off("message-sent");
    };
  }, []);

  // Lắng nghe tin nhắn mới
  useEffect(() => {
    socketService.onNewMessage((message) => {
      // Cập nhật messages nếu đang chat với người gửi
      if (
        selectedConversation &&
        message.senderId === selectedConversation.userId
      ) {
        setMessages((prev) => [...prev, message]);
      }
      // Luôn cập nhật conversations khi có tin nhắn mới
      fetchConversations();
    });
  }, [selectedConversation]);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.userId);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}/messages/conversations`,
        getAuthHeader(),
      );
      setConversations(response.data?.data || []);
    } catch (err) {
      console.error("Error fetching conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId) => {
    try {
      const response = await axios.get(
        `${API_URL}/messages/conversation/${otherUserId}`,
        getAuthHeader(),
      );
      setMessages(response.data?.data || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    try {
      const response = await axios.post(
        `${API_URL}/messages`,
        {
          receiverId: selectedConversation.userId,
          receiverType: selectedConversation.userType,
          content: newMessage.trim(),
        },
        getAuthHeader(),
      );

      setMessages([...messages, response.data.data]);
      setNewMessage("");
      fetchConversations();
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Gửi tin nhắn thất bại");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return "Hôm nay";
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "Hôm qua";
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
  };

  const getUserName = (user) => {
    if (!user) return "Unknown";
    return (
      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      user.email ||
      "User"
    );
  };

  const getUserAvatar = (user) => {
    return getUserName(user).charAt(0).toUpperCase();
  };

  const getAvatarColor = (userType) => {
    switch (userType) {
      case "patient":
        return "bg-blue-500";
      case "doctor":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const name = getUserName(conv.user);
    const matchesSearch = name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || conv.userType === activeTab;
    return matchesSearch && matchesTab;
  });

  const totalUnread = conversations.reduce(
    (sum, conv) => sum + (conv.unreadCount || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <MessageCircle className="w-7 h-7" />
                  Message Management
                </h1>
                <p className="text-purple-100 text-sm mt-1">
                  {totalUnread > 0
                    ? `${totalUnread} unread messages`
                    : "All messages read"}
                </p>
              </div>
              <button
                onClick={fetchConversations}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
              >
                <Loader2
                  className={`w-5 h-5 text-white ${loading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>

          <div className="flex h-[650px]">
            {/* Conversations List */}
            <div
              className={`${selectedConversation ? "hidden lg:block" : "block"} w-full lg:w-96 border-r border-gray-200 bg-gray-50`}
            >
              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                {[
                  { key: "all", label: "All" },
                  { key: "patient", label: "Patient" },
                  { key: "doctor", label: "Doctor" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition ${
                      activeTab === tab.key
                        ? "text-purple-600 border-b-2 border-purple-600 bg-white"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="p-3 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="overflow-y-auto h-[calc(100%-120px)]">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No conversation found</p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <div
                      key={conv.userId}
                      onClick={() => setSelectedConversation(conv)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-purple-50 transition ${
                        selectedConversation?.userId === conv.userId
                          ? "bg-purple-100"
                          : ""
                      } ${conv.unreadCount > 0 ? "bg-amber-50" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 ${getAvatarColor(conv.userType)} rounded-full flex items-center justify-center text-white font-semibold`}
                        >
                          {getUserAvatar(conv.user)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-800 truncate">
                              {getUserName(conv.user)}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatDate(conv.lastMessage?.createdAt)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500 truncate">
                              {conv.lastMessage?.senderId === conv.userId
                                ? conv.lastMessage?.content
                                : "Bạn: " + conv.lastMessage?.content}
                            </p>
                            {conv.unreadCount > 0 && (
                              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-xs ${getAvatarColor(conv.userType).replace("bg-", "text-").replace("-500", "-600")}`}
                          >
                            {conv.userType === "patient"
                              ? "Bệnh nhân"
                              : conv.userType === "doctor"
                                ? "Bác sĩ"
                                : conv.userType}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div
              className={`${selectedConversation ? "block" : "hidden lg:block"} flex-1 flex flex-col`}
            >
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center gap-3">
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div
                      className={`w-10 h-10 ${getAvatarColor(selectedConversation.userType)} rounded-full flex items-center justify-center text-white font-semibold`}
                    >
                      {getUserAvatar(selectedConversation.user)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {getUserName(selectedConversation.user)}
                      </h3>
                      <span
                        className={`text-xs ${getAvatarColor(selectedConversation.userType).replace("bg-", "text-").replace("-500", "-600")}`}
                      >
                        {selectedConversation.userType === "patient"
                          ? "Bệnh nhân"
                          : selectedConversation.userType === "doctor"
                            ? "Bác sĩ"
                            : selectedConversation.userType}
                      </span>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                    {messages.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Chưa có tin nhắn nào với người này</p>
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isOwn = msg.senderType === "admin";
                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                isOwn
                                  ? "bg-purple-600 text-white"
                                  : "bg-white border border-gray-200 text-gray-800"
                              }`}
                            >
                              <p className="text-sm">{msg.content}</p>
                              <p
                                className={`text-xs mt-1 ${isOwn ? "text-purple-100" : "text-gray-400"}`}
                              >
                                {formatTime(msg.createdAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <form
                    onSubmit={sendMessage}
                    className="p-4 border-t border-gray-200 bg-white"
                  >
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Nhập tin nhắn..."
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                        disabled={sending}
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {sending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        Gửi
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Chọn một cuộc trò chuyện để xem</p>
                    <p className="text-sm mt-2">
                      Có thể lọc theo bệnh nhân hoặc bác sĩ
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

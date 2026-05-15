import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageCircle, Send, Search, Loader2, ChevronLeft, Plus, Users } from 'lucide-react';
import { socketService } from '../../../../services/socketService';

const API_URL = 'http://localhost:8080/api';

const getAuthHeader = () => {
  const token = sessionStorage.getItem('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export default function DoctorMessages() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);

  // Kết nối Socket
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      socketService.connect(token);
    }

    return () => {
      socketService.off('new-message');
      socketService.off('user-typing');
    };
  }, []);

  // Lắng nghe tin nhắn mới - tách riêng để không bị reset khi chuyển conversation
  useEffect(() => {
    socketService.onNewMessage((message) => {
      // Cập nhật messages nếu đang chat với người gửi
      if (selectedConversation && message.senderId === selectedConversation.userId) {
        setMessages((prev) => [...prev, message]);
      }
      // Luôn cập nhật conversations khi có tin nhắn mới
      fetchConversations();
    });

    socketService.onTyping((data) => {
      if (selectedConversation && data.userId === selectedConversation.userId) {
        setTypingUser(data.typing ? data.userId : null);
      }
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
  }, [messages, typingUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/messages/conversations`, getAuthHeader());
      setConversations(response.data?.data || []);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId) => {
    try {
      const response = await axios.get(`${API_URL}/messages/conversation/${otherUserId}`, getAuthHeader());
      setMessages(response.data?.data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const searchPatients = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await axios.get(`${API_URL}/patients?search=${query}`, getAuthHeader());
      setSearchResults(response.data?.data || []);
    } catch (err) {
      console.error('Error searching patients:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  const startNewChat = async (patient) => {
    try {
      const userId = patient.userId || patient.user?.id || patient.id;
      const user = patient.user || patient;

      await axios.post(
        `${API_URL}/messages`,
        {
          receiverId: userId,
          receiverType: 'patient',
          content: 'Xin chào! Bác sĩ muốn liên hệ với bạn.',
        },
        getAuthHeader()
      );

      setShowNewChat(false);
      setSearchQuery('');
      setSearchResults([]);
      fetchConversations();

      setTimeout(() => {
        const newConv = {
          userId: userId,
          userType: 'patient',
          user: user,
        };
        setSelectedConversation(newConv);
      }, 500);
    } catch (err) {
      console.error('Error starting chat:', err);
      alert('Không thể bắt đầu cuộc trò chuyện');
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
        getAuthHeader()
      );

      setMessages([...messages, response.data.data]);
      setNewMessage('');
      fetchConversations();
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Gửi tin nhắn thất bại');
    } finally {
      setSending(false);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (selectedConversation) {
      socketService.sendTyping(selectedConversation.userId);
    }
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'Hôm nay';
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return 'Hôm qua';
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  const getUserName = (user) => {
    if (!user) return 'Unknown';
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'User';
  };

  const getUserAvatar = (user) => {
    return getUserName(user).charAt(0).toUpperCase();
  };

  const filteredConversations = conversations.filter((conv) => {
    const name = getUserName(conv.user);
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <MessageCircle className="w-7 h-7" />
                  Tin nhắn
                </h1>
                <p className="text-green-100 text-sm mt-1">Liên hệ với bệnh nhân</p>
              </div>
              <button
                onClick={() => setShowNewChat(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition font-medium"
              >
                <Plus className="w-5 h-5" />
                Tin nhắn mới
              </button>
            </div>
          </div>

          <div className="flex h-[600px]">
            <div className={`${selectedConversation ? 'hidden md:block' : 'block'} w-full md:w-80 border-r border-gray-200 bg-gray-50`}>
              <div className="p-3 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="overflow-y-auto h-[calc(100%-60px)]">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Chưa có tin nhắn nào</p>
                    <button onClick={() => setShowNewChat(true)} className="mt-3 text-green-600 hover:underline">
                      Bắt đầu cuộc trò chuyện mới
                    </button>
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <div
                      key={conv.userId}
                      onClick={() => setSelectedConversation(conv)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-green-50 transition ${selectedConversation?.userId === conv.userId ? 'bg-green-100' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {getUserAvatar(conv.user)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-800 truncate">{getUserName(conv.user)}</span>
                            <span className="text-xs text-gray-400">{formatDate(conv.lastMessage?.createdAt)}</span>
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {conv.lastMessage?.senderId === conv.userId ? conv.lastMessage?.content : 'Bạn: ' + conv.lastMessage?.content}
                          </p>
                        </div>
                        {conv.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className={`${selectedConversation ? 'block' : 'hidden md:block'} flex-1 flex flex-col`}>
              {selectedConversation ? (
                <>
                  <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center gap-3">
                    <button onClick={() => setSelectedConversation(null)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {getUserAvatar(selectedConversation.user)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{getUserName(selectedConversation.user)}</h3>
                      <span className="text-xs text-gray-500">Bệnh nhân</span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                    {messages.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Chưa có tin nhắn nào với người này</p>
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isOwn = msg.senderId !== selectedConversation.userId;
                        return (
                          <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${isOwn ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
                              <p className="text-sm">{msg.content}</p>
                              <p className={`text-xs mt-1 ${isOwn ? 'text-green-100' : 'text-gray-400'}`}>
                                {formatTime(msg.createdAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                    
                    {typingUser && (
                      <div className="flex justify-start">
                        <div className="bg-gray-200 rounded-full px-4 py-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>

                  <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={handleTyping}
                        placeholder="Nhập tin nhắn..."
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500"
                        disabled={sending}
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Gửi
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Chọn một cuộc trò chuyện để bắt đầu</p>
                    <button onClick={() => setShowNewChat(true)} className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                      Tin nhắn mới
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Tin nhắn mới với bệnh nhân</h2>
                <button onClick={() => setShowNewChat(false)} className="text-white/80 hover:text-white text-2xl">&times;</button>
              </div>
            </div>

            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bệnh nhân..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchPatients(e.target.value);
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
                  autoFocus
                />
              </div>

              {searchLoading && (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                </div>
              )}

              <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
                {searchResults.map((patient) => {
                  const user = patient.user || patient;
                  return (
                    <div
                      key={patient.id}
                      onClick={() => startNewChat(patient)}
                      className="flex items-center gap-3 p-3 hover:bg-green-50 cursor-pointer rounded-lg transition"
                    >
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.firstName?.charAt(0) || 'B'}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <MessageCircle className="w-5 h-5 text-gray-400" />
                    </div>
                  );
                })}

                {!searchLoading && searchQuery && searchResults.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Không tìm thấy bệnh nhân</p>
                  </div>
                )}

                {!searchQuery && (
                  <div className="text-center py-8 text-gray-400">
                    <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nhập tên để tìm kiếm bệnh nhân</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageCircle, Send, X, User, Users, Search, Loader2, ChevronLeft, Plus } from 'lucide-react';
import { socketService } from '../../../../services/socketService';

const API_URL = 'http://localhost:8080/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export default function PatientMessages() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [myDoctors, setMyDoctors] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);

  // Kết nối Socket
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
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

  const fetchContacts = async () => {
    setLoadingContacts(true);
    try {
      const appointmentsRes = await axios.get(`${API_URL}/appointments/my-appointments`, getAuthHeader());
      const appointments = appointmentsRes.data?.data || [];
      
      const completedAppointments = appointments.filter(a => 
        ['completed', 'confirmed', 'checked_in'].includes(a.status)
      );
      
      const doctorsMap = new Map();
      completedAppointments.forEach(apt => {
        if (apt.doctor && !doctorsMap.has(apt.doctor.id)) {
          doctorsMap.set(apt.doctor.id, apt.doctor);
        }
      });
      setMyDoctors(Array.from(doctorsMap.values()));

      const adminsRes = await axios.get(`${API_URL}/users/admins`, getAuthHeader());
      const adminList = adminsRes.data?.data || [];
      const activeAdmins = Array.isArray(adminList) ? adminList.filter(a => a.status === 'active' || !a.status) : [];
      setAdmins(activeAdmins);

    } catch (err) {
      console.error('Error fetching contacts:', err);
    } finally {
      setLoadingContacts(false);
    }
  };

  const startNewChat = async (contact, userType) => {
    try {
      const userId = contact.userId || contact.user?.id || contact.id;
      const user = contact.user || { id: userId, firstName: contact.user?.firstName, lastName: contact.user?.lastName, email: contact.user?.email } || contact;

      await axios.post(
        `${API_URL}/messages`,
        {
          receiverId: userId,
          receiverType: userType,
          content: 'Xin chào! Tôi muốn liên hệ với bạn.',
        },
        getAuthHeader()
      );

      setShowNewChat(false);
      fetchConversations();

      setTimeout(() => {
        const newConv = {
          userId: userId,
          userType: userType,
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

  const handleNewChatClick = () => {
    setShowNewChat(true);
    fetchContacts();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <MessageCircle className="w-7 h-7" />
                  Tin nhắn
                </h1>
                <p className="text-blue-100 text-sm mt-1">Liên hệ với bác sĩ hoặc admin</p>
              </div>
              <button
                onClick={handleNewChatClick}
                className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
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
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="overflow-y-auto h-[calc(100%-60px)]">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Chưa có cuộc trò chuyện nào</p>
                    <button onClick={handleNewChatClick} className="mt-3 text-blue-600 hover:underline">
                      Bắt đầu cuộc trò chuyện mới
                    </button>
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <div
                      key={conv.userId}
                      onClick={() => setSelectedConversation(conv)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition ${selectedConversation?.userId === conv.userId ? 'bg-blue-100' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {getUserAvatar(conv.user)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-800 truncate">{getUserName(conv.user)}</span>
                            <span className="text-xs text-gray-400">{formatDate(conv.lastMessage?.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${conv.userType === 'doctor' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                              {conv.userType === 'doctor' ? 'Bác sĩ' : 'Admin'}
                            </span>
                            <p className="text-sm text-gray-500 truncate">
                              {conv.lastMessage?.senderId === conv.userId ? conv.lastMessage?.content : 'Bạn: ' + conv.lastMessage?.content}
                            </p>
                          </div>
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
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {getUserAvatar(selectedConversation.user)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{getUserName(selectedConversation.user)}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${selectedConversation.userType === 'doctor' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                        {selectedConversation.userType === 'doctor' ? 'Bác sĩ' : 'Admin'}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                    {messages.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Bắt đầu cuộc trò chuyện</p>
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isOwn = msg.senderId !== selectedConversation.userId;
                        return (
                          <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${isOwn ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
                              <p className="text-sm">{msg.content}</p>
                              <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-400'}`}>
                                {formatTime(msg.createdAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                    
                    {/* Typing indicator */}
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
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        disabled={sending}
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                    <button onClick={handleNewChatClick} className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
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
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Tin nhắn mới</h2>
                <button onClick={() => setShowNewChat(false)} className="text-white/80 hover:text-white text-2xl">&times;</button>
              </div>
            </div>

            <div className="p-4">
              {loadingContacts ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : (
                <div className="space-y-6 max-h-[60vh] overflow-y-auto">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Liên hệ Admin
                    </h3>
                    {admins.length > 0 ? (
                      <div className="space-y-2">
                        {admins.map((admin) => {
                          const user = admin.user || admin;
                          return (
                            <div
                              key={admin.id}
                              onClick={() => startNewChat(admin, 'admin')}
                              className="flex items-center gap-3 p-3 hover:bg-purple-50 cursor-pointer rounded-xl transition border border-gray-100"
                            >
                              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {user.firstName?.charAt(0) || 'A'}
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-800">{user.firstName} {user.lastName}</p>
                                <p className="text-sm text-gray-500">Quản trị viên</p>
                              </div>
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <MessageCircle className="w-5 h-5 text-purple-400" />
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">Không có admin trực tuyến</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Bác sĩ đã khám
                    </h3>
                    {myDoctors.length > 0 ? (
                      <div className="space-y-2">
                        {myDoctors.map((doctor) => {
                          const user = doctor.user || doctor;
                          return (
                            <div
                              key={doctor.id}
                              onClick={() => startNewChat(doctor, 'doctor')}
                              className="flex items-center gap-3 p-3 hover:bg-green-50 cursor-pointer rounded-xl transition border border-gray-100"
                            >
                              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {user.firstName?.charAt(0) || 'B'}
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-800">BS. {user.firstName} {user.lastName}</p>
                                <p className="text-sm text-gray-500">{doctor.specialty?.name || 'Bác sĩ'}</p>
                              </div>
                              <MessageCircle className="w-5 h-5 text-green-400" />
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-4 bg-gray-50 rounded-xl">
                        <p className="text-gray-400 text-sm">Bạn chưa có lịch khám nào</p>
                        <a href="/" className="text-blue-600 text-sm hover:underline mt-1 inline-block">
                          Đặt lịch khám ngay
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

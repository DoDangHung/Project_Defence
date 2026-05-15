import React, { useState } from 'react';
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info,
  Image as ImageIcon,
  File,
  Clock,
  Check,
  CheckCheck,
} from 'lucide-react';

// Mock Data - Danh sách bệnh nhân đã nhắn tin
const mockConversations = [
  {
    id: 1,
    patientId: 101,
    patientName: 'Alex',
    patientAvatar: null,
    lastMessage: 'Cảm ơn bác sĩ nhiều ạ!',
    lastMessageTime: '2026-01-20T14:30:00',
    unreadCount: 0,
    online: true,
  },
  {
    id: 2,
    patientId: 102,
    patientName: 'John',
    patientAvatar: null,
    lastMessage: 'Bác sĩ cho em hỏi về đơn thuốc...',
    lastMessageTime: '2026-01-20T10:15:00',
    unreadCount: 3,
    online: false,
  },
];

// Mock Data - Tin nhắn trong cuộc trò chuyện
const mockMessages = {
  101: [
    {
      id: 1,
      senderId: 101,
      senderType: 'patient',
      content: 'Chào bác sĩ, em muốn hỏi về kết quả khám hôm trước ạ',
      timestamp: '2026-01-20T14:10:00',
      status: 'read',
    },
    {
      id: 2,
      senderId: 1,
      senderType: 'doctor',
      content:
        'Chào bạn! Kết quả xét nghiệm của bạn đã có. Các chỉ số đều bình thường, bạn không cần lo lắng',
      timestamp: '2026-01-20T14:12:00',
      status: 'read',
    },
    {
      id: 3,
      senderId: 101,
      senderType: 'patient',
      content: 'Vậy em có cần uống thuốc gì thêm không ạ?',
      timestamp: '2026-01-20T14:15:00',
      status: 'read',
    },
    {
      id: 4,
      senderId: 1,
      senderType: 'doctor',
      content:
        'Bạn tiếp tục uống thuốc theo đơn đã kê. Sau 1 tuần nếu thấy tốt hơn thì có thể giảm liều xuống. Nhớ uống đầy đủ nhé!',
      timestamp: '2026-01-20T14:18:00',
      status: 'read',
    },
    {
      id: 5,
      senderId: 101,
      senderType: 'patient',
      content: 'Cảm ơn bác sĩ nhiều ạ!',
      timestamp: '2026-01-20T14:30:00',
      status: 'read',
    },
  ],
  102: [
    {
      id: 1,
      senderId: 102,
      senderType: 'patient',
      content: 'Bác sĩ ơi, em nhìn đơn thuốc không rõ tên thuốc lắm',
      timestamp: '2026-01-20T10:00:00',
      status: 'read',
    },
    {
      id: 2,
      senderId: 102,
      senderType: 'patient',
      content: 'Bác sĩ cho em hỏi về đơn thuốc...',
      timestamp: '2026-01-20T10:15:00',
      status: 'delivered',
    },
  ],
  103: [
    {
      id: 1,
      senderId: 103,
      senderType: 'patient',
      content: 'Em cần tư vấn thêm về kết quả xét nghiệm',
      timestamp: '2026-01-19T16:45:00',
      status: 'delivered',
    },
  ],
};

const Notifications = () => {
  const [selectedConversation, setSelectedConversation] = useState(
    mockConversations[0],
  );
  const [messages, setMessages] = useState(
    mockMessages[selectedConversation.patientId] || [],
  );
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = mockConversations.filter((conv) =>
    conv.patientName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setMessages(mockMessages[conversation.patientId] || []);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const newMsg = {
      id: messages.length + 1,
      senderId: 1,
      senderType: 'doctor',
      content: newMessage,
      timestamp: new Date().toISOString(),
      status: 'sent',
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diffInDays === 1) {
      return 'Hôm qua';
    } else if (diffInDays < 7) {
      return `${diffInDays} ngày trước`;
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  const getMessageStatusIcon = (status) => {
    if (status === 'sent') return <Check className="w-4 h-4 text-gray-400" />;
    if (status === 'delivered')
      return <CheckCheck className="w-4 h-4 text-gray-400" />;
    if (status === 'read')
      return <CheckCheck className="w-4 h-4 text-blue-500" />;
    return null;
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Left Sidebar - Conversations List */}
      <div className="w-full md:w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Tin nhắn</h2>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm bệnh nhân..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => handleSelectConversation(conversation)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition hover:bg-gray-50 ${
                selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {conversation.patientName.charAt(0)}
                  </div>
                  {conversation.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-800 truncate">
                      {conversation.patientName}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {formatTime(conversation.lastMessageTime)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.lastMessage}
                  </p>
                </div>

                {/* Unread Badge */}
                {conversation.unreadCount > 0 && (
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {conversation.unreadCount}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {selectedConversation.patientName.charAt(0)}
                  </div>
                  {selectedConversation.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>

                {/* Name & Status */}
                <div>
                  <h3 className="font-bold text-gray-800">
                    {selectedConversation.patientName}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {selectedConversation.online ? 'Đang hoạt động' : 'Offline'}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <Phone className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <Video className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <Info className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderType === 'doctor'
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-md px-4 py-3 rounded-2xl ${
                        message.senderType === 'doctor'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="leading-relaxed">{message.content}</p>
                      <div
                        className={`flex items-center gap-1 mt-1 text-xs ${
                          message.senderType === 'doctor'
                            ? 'text-blue-100 justify-end'
                            : 'text-gray-500'
                        }`}
                      >
                        <span>{formatTime(message.timestamp)}</span>
                        {message.senderType === 'doctor' &&
                          getMessageStatusIcon(message.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <ImageIcon className="w-5 h-5 text-gray-600" />
                </button>

                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                />

                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <Smile className="w-5 h-5 text-gray-600" />
                </button>

                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-semibold">
                Chọn một cuộc trò chuyện để bắt đầu
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;

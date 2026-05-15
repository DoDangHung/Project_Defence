import React from 'react';
import { useState } from 'react';

// ─── MOCK DATA ───────────────────────────────────────────────────────────────
const messages = [
  {
    id: 1,
    sender: 'Alex',
    avatar: 'NA',
    content: 'Cho em hỏi lịch khám ngày mai có còn không ạ?',
    sentAt: '2025-01-28 14:52',
    unread: true,
    conversation: [
      {
        from: 'them',
        text: 'Chào anh, em muốn hỏi về lịch khám ngày mai ạ.',
        time: '14:48',
      },
      {
        from: 'me',
        text: 'Chào bạn, bạn cần hỏi về lịch hẹn nào ạ?',
        time: '14:49',
      },
      {
        from: 'them',
        text: 'Cho em hỏi lịch khám ngày mai có còn không ạ?',
        time: '14:52',
      },
    ],
  },
  {
    id: 2,
    sender: 'John',
    avatar: 'LT',
    content: 'Bệnh nhân #1014 cần xét nghiệm bổ sung, cần lên lịch lại.',
    sentAt: '2025-01-28 13:40',
    unread: true,
    conversation: [
      {
        from: 'me',
        text: 'Dr. Lê, tình hình bệnh nhân #1014 thế nào ạ?',
        time: '13:30',
      },
      {
        from: 'them',
        text: 'Bệnh nhân cần xét nghiệm bổ sung, cần lên lịch lại buổi khám.',
        time: '13:40',
      },
    ],
  },
  {
    id: 3,
    sender: 'Anna',
    avatar: 'TB',
    content: 'Cảm ơn bệnh viện đã hỗ trợ! Em sẽ đến khám đúng giờ.',
    sentAt: '2025-01-28 12:15',
    unread: false,
    conversation: [
      {
        from: 'me',
        text: 'Chào Ms. Trần, lịch hẹn của bạn đã được xác nhận cho ngày mai lúc 10:00.',
        time: '12:10',
      },
      {
        from: 'them',
        text: 'Cảm ơn bệnh viện đã hỗ trợ! Em sẽ đến khám đúng giờ.',
        time: '12:15',
      },
    ],
  },
  {
    id: 4,
    sender: 'Alexadra',
    avatar: 'HV',
    content: 'Lịch phòng khám tầng 2 buổi chiều cần thay đổi phòng.',
    sentAt: '2025-01-28 11:08',
    unread: false,
    conversation: [
      {
        from: 'them',
        text: 'Chào admin, phòng 201 đang bảo trì buổi chiều hôm nay.',
        time: '11:05',
      },
      {
        from: 'them',
        text: 'Lịch phòng khám tầng 2 buổi chiều cần thay đổi phòng.',
        time: '11:08',
      },
      {
        from: 'me',
        text: 'Được, tôi sẽ chuyển sang phòng 203. Đã báo cho các bác sĩ rồi.',
        time: '11:12',
      },
    ],
  },
  {
    id: 5,
    sender: 'Jack',
    avatar: 'PD',
    content: 'Em muốn hủy lịch hẹn ngày 30, anh ơi.',
    sentAt: '2025-01-28 09:33',
    unread: false,
    conversation: [
      {
        from: 'them',
        text: 'Chào anh, em muốn hủy lịch hẹn ngày 30 được không ạ?',
        time: '09:30',
      },
      {
        from: 'them',
        text: 'Em muốn hủy lịch hẹn ngày 30, anh ơi.',
        time: '09:33',
      },
      {
        from: 'me',
        text: 'Được, em có thể cho biết lý do hủy không ạ? Để bộ phận hoàn tiền xử lý cho em.',
        time: '09:35',
      },
    ],
  },
];

const notifications = [
  {
    id: 1,
    title: 'Thanh toán hoàn thành',
    message:
      'Giao dịch #1013 của Trần Thị B đã hoàn thành thành công. Tổng số tiền: 500,000 VND.',
    isRead: false,
    createdAt: '2025-01-28 10:01',
    type: 'payment',
  },
  {
    id: 2,
    title: 'Hoàn tiền được yêu cầu',
    message:
      'Bệnh nhân Huynh Văn E yêu cầu hoàn tiền đặt cọc cho lịch hẹn #1016. Số tiền: 250,000 VND. Cần phê duyệt.',
    isRead: false,
    createdAt: '2025-01-28 13:01',
    type: 'refund',
  },
  {
    id: 3,
    title: 'Lịch hẹn mới',
    message:
      'Bệnh nhân Đinh Thị F đã đặt hẹn khám với Dr. Lê Minh Tú vào ngày 29/01 lúc 09:00 tại Phòng khám Hoa Mai.',
    isRead: true,
    createdAt: '2025-01-28 08:45',
    type: 'appointment',
  },
  {
    id: 4,
    title: 'Cảnh báo: Deposit chưa thanh toán',
    message:
      'Lịch hẹn #1015 của Phạm Thị D chưa đặt cọc trong 24h. Lịch hẹn sẽ tự hủy nếu không thanh toán trong 12h tới.',
    isRead: true,
    createdAt: '2025-01-27 15:30',
    type: 'warning',
  },
  {
    id: 5,
    title: 'Báo cáo tài chính hàng ngày',
    message:
      'Tổng doanh thu ngày 28/01: 1,830,000 VND. Số giao dịch: 7. Hoàn thành: 2, Chờ xử lý: 3, Đã hoàn: 1.',
    isRead: true,
    createdAt: '2025-01-28 06:00',
    type: 'report',
  },
];

// ─── NOTIFICATION ICON BY TYPE ──────────────────────────────────────────────
const notifType = {
  payment: { icon: '💳', bg: 'bg-emerald-100', text: 'text-emerald-600' },
  refund: { icon: '↩️', bg: 'bg-purple-100', text: 'text-purple-600' },
  appointment: { icon: '📅', bg: 'bg-blue-100', text: 'text-blue-600' },
  warning: { icon: '⚠️', bg: 'bg-amber-100', text: 'text-amber-600' },
  report: { icon: '📊', bg: 'bg-indigo-100', text: 'text-indigo-600' },
};

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
function ManageNotifications() {
  const [activeTab, setActiveTab] = useState('messages'); // "messages" | "notifications"
  const [selectedId, setSelectedId] = useState(1);

  const unreadMsgCount = messages.filter((m) => m.unread).length;
  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  const list = activeTab === 'messages' ? messages : notifications;
  const selected =
    activeTab === 'messages'
      ? messages.find((m) => m.id === selectedId)
      : notifications.find((n) => n.id === selectedId);

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-bold text-slate-800">
            Tin nhắn & Thông báo
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Giao tiếp với bệnh nhân và theo dõi thông báo hệ thống
          </p>
        </div>
        <button className="bg-indigo-600 text-white text-xs font-semibold px-4 py-1.5 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors">
          + Tin nhắn mới
        </button>
      </div>

      {/* Main panel */}
      <div
        className="flex bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden"
        style={{ height: 560 }}
      >
        {/* ── LEFT: Tabs + List ── */}
        <div className="w-80 flex flex-col border-r border-slate-200 flex-shrink-0">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50">
            {[
              { key: 'messages', label: 'Tin nhắn', count: unreadMsgCount },
              {
                key: 'notifications',
                label: 'Thông báo',
                count: unreadNotifCount,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setSelectedId(
                    activeTab === tab.key
                      ? selectedId
                      : tab.key === 'messages'
                        ? messages[0].id
                        : notifications[0].id,
                  );
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold transition-all border-b-2 ${
                  activeTab === tab.key
                    ? 'text-indigo-600 border-indigo-600 bg-white'
                    : 'text-slate-400 border-transparent hover:text-slate-600'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="bg-indigo-600 text-white text-[9px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {list.map((item) => {
              const isMsg = activeTab === 'messages';
              const isUnread = isMsg ? item.unread : !item.isRead;
              const isSelected = item.id === selectedId;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`flex gap-3 items-start px-3.5 py-3 cursor-pointer border-b border-slate-100 transition-colors ${
                    isSelected
                      ? 'bg-indigo-50'
                      : isUnread
                        ? 'bg-slate-50 hover:bg-slate-100'
                        : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  {/* Avatar */}
                  {isMsg ? (
                    <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {item.avatar}
                    </div>
                  ) : (
                    <div
                      className={`w-9 h-9 rounded-lg ${notifType[item.type]?.bg || 'bg-slate-100'} flex items-center justify-center text-base flex-shrink-0`}
                    >
                      {notifType[item.type]?.icon || '🔔'}
                    </div>
                  )}

                  {/* Content preview */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-xs truncate ${isUnread ? 'font-semibold text-slate-800' : 'font-medium text-slate-600'}`}
                      >
                        {isMsg ? item.sender : item.title}
                      </span>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap flex-shrink-0">
                        {(isMsg ? item.sentAt : item.createdAt).split(' ')[1]}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {isMsg ? item.content : item.message}
                    </p>
                  </div>

                  {/* Unread dot */}
                  {isUnread && (
                    <div className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0 mt-1.5" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT: Detail View ── */}
        <div className="flex-1 flex flex-col min-w-0">
          {selected && activeTab === 'messages' ? (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-200 bg-slate-50 flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                  {selected.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {selected.sender}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Tin nhắn trực tiếp
                  </p>
                </div>
              </div>

              {/* Conversation */}
              <div className="flex-1 overflow-y-auto px-5 py-4 bg-slate-50 flex flex-col gap-3">
                {selected.conversation.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.from === 'me' ? 'justify-end' : 'gap-2'}`}
                  >
                    {msg.from !== 'me' && (
                      <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[9px] font-bold flex-shrink-0 self-end">
                        {selected.avatar}
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] ${msg.from === 'me' ? 'items-end' : 'items-start'} flex flex-col`}
                    >
                      <div
                        className={`px-3.5 py-2 rounded-2xl text-xs ${
                          msg.from === 'me'
                            ? 'bg-indigo-600 text-white rounded-br-sm'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-slate-400 mt-0.5 px-1">
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-slate-200 bg-white flex-shrink-0">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                  <input
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 bg-transparent border-none outline-none text-xs text-slate-700 placeholder-slate-400"
                  />
                  <button className="bg-indigo-600 text-white text-xs font-semibold px-3.5 py-1 rounded-md hover:bg-indigo-700 transition-colors">
                    Gửi
                  </button>
                </div>
              </div>
            </>
          ) : selected && activeTab === 'notifications' ? (
            <div className="flex-1 p-6 overflow-y-auto">
              {/* Notification detail */}
              <div className="flex items-start gap-4 mb-5">
                <div
                  className={`w-11 h-11 rounded-xl ${notifType[selected.type]?.bg || 'bg-slate-100'} flex items-center justify-center text-xl flex-shrink-0`}
                >
                  {notifType[selected.type]?.icon || '🔔'}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-800">
                    {selected.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {selected.createdAt}
                  </p>
                </div>
                {!selected.isRead && (
                  <span className="bg-indigo-100 text-indigo-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    Mới
                  </span>
                )}
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-5">
                <p className="text-xs text-slate-600 leading-relaxed">
                  {selected.message}
                </p>
              </div>

              <div className="flex gap-2">
                <button className="bg-indigo-600 text-white text-xs font-semibold px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors">
                  Xem chi tiết
                </button>
                <button className="bg-slate-100 text-slate-500 text-xs font-medium px-4 py-1.5 rounded-lg hover:bg-slate-200 transition-colors">
                  Đánh dấu đã đọc
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-300 text-sm">
              Chọn một mục để xem chi tiết
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageNotifications;

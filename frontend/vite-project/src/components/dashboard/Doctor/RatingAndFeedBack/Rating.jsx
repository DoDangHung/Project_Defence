import React, { useState } from 'react';
import {
  Star,
  MessageSquare,
  Search,
  Award,
  TrendingUp,
  Users,
  ThumbsUp,
  Filter,
} from 'lucide-react';

// Mock Data - Đánh giá từ bệnh nhân
const mockFeedbacks = [
  {
    id: 1,
    patientName: 'Alex',
    patientAvatar: null,
    rating: 5,
    comment:
      'Bác sĩ rất tận tâm, nhiệt tình. Khám bệnh kỹ càng và giải thích rõ ràng cho bệnh nhân. Phòng khám sạch sẽ, thời gian chờ không lâu. Rất hài lòng!',
    date: '2026-01-15T10:30:00',
    appointmentDate: '2026-01-14',
  },
  {
    id: 2,
    patientName: 'Anna',
    patientAvatar: null,
    rating: 4,
    comment:
      'Bác sĩ khám tốt, tuy nhiên thời gian chờ hơi lâu. Nhân viên thân thiện, phòng khám sạch sẽ.',
    date: '2026-01-12T14:20:00',
    appointmentDate: '2026-01-11',
  },
  {
    id: 3,
    patientName: 'John',
    patientAvatar: null,
    rating: 5,
    comment:
      'Bác sĩ rất chuyên nghiệp, giải thích cặn kẽ về bệnh tình. Đội ngũ y tá hỗ trợ tốt. Sẽ giới thiệu cho người thân.',
    date: '2026-01-10T09:15:00',
    appointmentDate: '2026-01-09',
  },
  {
    id: 4,
    patientName: 'David',
    patientAvatar: null,
    rating: 3,
    comment:
      'Bác sĩ khám ổn nhưng hơi nhanh, chưa hỏi kỹ về triệu chứng. Giá khám hơi cao.',
    date: '2026-01-08T16:45:00',
    appointmentDate: '2026-01-07',
  },
  {
    id: 5,
    patientName: 'Alexandra',
    patientAvatar: null,
    rating: 5,
    comment:
      'Excellent service! Bác sĩ rất giỏi, phòng khám hiện đại. Highly recommended!',
    date: '2026-01-05T11:00:00',
    appointmentDate: '2026-01-04',
  },
];

const mockStats = {
  averageRating: 4.4,
  totalReviews: 247,
  ratingDistribution: {
    5: 150,
    4: 60,
    3: 25,
    2: 8,
    1: 4,
  },
  recentIncrease: '+12%',
  topPercentile: 'Top 5%',
};

const Rating = () => {
  const [filters, setFilters] = useState({
    rating: 'all',
    searchQuery: '',
    sortBy: 'newest', // newest, oldest, highest, lowest
  });

  const filteredFeedbacks = mockFeedbacks
    .filter((fb) => {
      if (filters.rating !== 'all' && fb.rating !== parseInt(filters.rating)) {
        return false;
      }
      if (
        filters.searchQuery &&
        !fb.comment
          ?.toLowerCase()
          .includes(filters.searchQuery.toLowerCase()) &&
        !fb.patientName
          ?.toLowerCase()
          .includes(filters.searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (filters.sortBy === 'newest')
        return new Date(b.date) - new Date(a.date);
      if (filters.sortBy === 'oldest')
        return new Date(a.date) - new Date(b.date);
      if (filters.sortBy === 'highest') return b.rating - a.rating;
      if (filters.sortBy === 'lowest') return a.rating - b.rating;
      return 0;
    });

  const renderStars = (rating, size = 'w-5 h-5') => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getTimeAgo = (isoString) => {
    const now = new Date();
    const date = new Date(isoString);
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Hôm nay';
    if (diffInDays === 1) return 'Hôm qua';
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} tuần trước`;
    return `${Math.floor(diffInDays / 30)} tháng trước`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Đánh giá từ bệnh nhân
          </h1>
          <p className="text-gray-600 mt-1">
            Xem và theo dõi đánh giá từ bệnh nhân đã khám
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Rating Overview Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4 shadow-lg">
                  <span className="text-4xl font-bold text-white">
                    {mockStats.averageRating.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-center mb-2">
                  {renderStars(Math.round(mockStats.averageRating), 'w-6 h-6')}
                </div>
                <p className="text-gray-600 text-sm">
                  Dựa trên <strong>{mockStats.totalReviews}</strong> đánh giá
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Phân bổ đánh giá
                </h3>
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = mockStats.ratingDistribution[star];
                  const percentage = (count / mockStats.totalReviews) * 100;

                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-700 w-8">
                        {star}★
                      </span>
                      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right font-semibold">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
                <TrendingUp className="w-8 h-8 mb-3" />
                <h3 className="text-3xl font-bold mb-1">
                  {mockStats.recentIncrease}
                </h3>
                <p className="text-blue-100 text-sm">Tăng so với tháng trước</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                <Award className="w-8 h-8 mb-3" />
                <h3 className="text-3xl font-bold mb-1">
                  {mockStats.topPercentile}
                </h3>
                <p className="text-purple-100 text-sm">Bác sĩ xuất sắc nhất</p>
              </div>
            </div>
          </div>

          {/* Main Content - Feedbacks List */}
          <div className="lg:col-span-2">
            {/* Filters Bar */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo tên hoặc nội dung..."
                      value={filters.searchQuery}
                      onChange={(e) =>
                        setFilters({ ...filters, searchQuery: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <select
                    value={filters.rating}
                    onChange={(e) =>
                      setFilters({ ...filters, rating: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                  >
                    <option value="all">Tất cả sao</option>
                    <option value="5">⭐⭐⭐⭐⭐ (5 sao)</option>
                    <option value="4">⭐⭐⭐⭐ (4 sao)</option>
                    <option value="3">⭐⭐⭐ (3 sao)</option>
                    <option value="2">⭐⭐ (2 sao)</option>
                    <option value="1">⭐ (1 sao)</option>
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters({ ...filters, sortBy: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition"
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="oldest">Cũ nhất</option>
                    <option value="highest">Điểm cao nhất</option>
                    <option value="lowest">Điểm thấp nhất</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Hiển thị <strong>{filteredFeedbacks.length}</strong> đánh giá
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Filter className="w-4 h-4" />
                  <span>Đã lọc</span>
                </div>
              </div>
            </div>

            {/* Feedbacks List */}
            <div className="space-y-4">
              {filteredFeedbacks.length > 0 ? (
                filteredFeedbacks.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        {/* Patient Avatar */}
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          {feedback.patientName.charAt(0)}
                        </div>

                        {/* Patient Info */}
                        <div>
                          <h4 className="font-bold text-gray-800 text-lg">
                            {feedback.patientName}
                          </h4>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-sm text-gray-500">
                              Khám ngày {formatDate(feedback.appointmentDate)}
                            </p>
                            <span className="text-gray-300">•</span>
                            <p className="text-sm text-gray-500">
                              {getTimeAgo(feedback.date)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Rating Stars */}
                      <div className="flex flex-col items-end gap-1">
                        {renderStars(feedback.rating)}
                        <span className="text-sm font-semibold text-gray-600">
                          {feedback.rating}.0/5.0
                        </span>
                      </div>
                    </div>

                    {/* Comment */}
                    <p className="text-gray-700 leading-relaxed pl-[72px]">
                      {feedback.comment}
                    </p>

                    {/* Actions (Optional) */}
                    <div className="flex items-center gap-4 mt-4 pl-[72px]">
                      <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-semibold transition">
                        <ThumbsUp className="w-4 h-4" />
                        Hữu ích
                      </button>
                      <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-700 font-semibold transition">
                        <MessageSquare className="w-4 h-4" />
                        Trả lời
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg font-semibold mb-2">
                    Không tìm thấy đánh giá
                  </p>
                  <p className="text-gray-400">
                    Thử thay đổi bộ lọc hoặc tìm kiếm
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rating;

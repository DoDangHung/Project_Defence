import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, Send, Loader2, CheckCircle, ThumbsUp } from 'lucide-react';

const API_URL = 'http://localhost:8080/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export default function FeedbackForm({ appointment, onSuccess, onClose }) {
  const [rating, setRating] = useState(0);
  const [professionalism, setProfessionalism] = useState(0);
  const [punctuality, setPunctuality] = useState(0);
  const [communication, setCommunication] = useState(0);
  const [facilities, setFacilities] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Vui lòng chọn số sao đánh giá');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/feedback`,
        {
          doctorId: appointment?.doctorId || appointment?.doctor?.id,
          appointmentId: appointment?.id,
          rating,
          comment,
          professionalism: professionalism || null,
          punctuality: punctuality || null,
          communication: communication || null,
          facilities: facilities || null,
        },
        getAuthHeader()
      );

      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Error submitting feedback:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const StarRating = ({ value, onChange, onHover, hoverValue }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => onHover && onHover(star)}
          onMouseLeave={() => onHover && onHover(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-8 h-8 ${
              star <= (hoverValue || value)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Cảm ơn bạn!</h2>
          <p className="text-gray-600 mb-6">
            Cảm ơn bạn đã đánh giá. Đánh giá của bạn giúp chúng tôi cải thiện chất lượng dịch vụ.
          </p>
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className={`w-6 h-6 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
            ))}
          </div>
          <button
            onClick={onClose}
            className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Đánh giá dịch vụ</h2>
              <p className="text-blue-100 text-sm mt-1">Đánh giá của bạn giúp chúng tôi cải thiện</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white text-2xl">&times;</button>
          </div>
        </div>

        {/* Doctor Info */}
        {appointment?.doctor && (
          <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                {appointment.doctor.user?.firstName?.charAt(0) || 'B'}
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  BS. {appointment.doctor.user?.firstName} {appointment.doctor.user?.lastName}
                </p>
                <p className="text-sm text-gray-500">
                  {appointment.doctor.specialty?.name || 'Bác sĩ'}
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Overall Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Đánh giá tổng quan <span className="text-red-500">*</span>
            </label>
            <StarRating value={rating} onChange={setRating} onHover={setHoverRating} hoverValue={hoverRating} />
            <p className="text-sm text-gray-500 mt-2">
              {rating === 0 ? 'Chọn số sao đánh giá' :
               rating === 1 ? 'Rất không hài lòng' :
               rating === 2 ? 'Không hài lòng' :
               rating === 3 ? 'Bình thường' :
               rating === 4 ? 'Hài lòng' : 'Rất hài lòng'}
            </p>
          </div>

          {/* Detailed Ratings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Chuyên môn</label>
              <StarRating value={professionalism} onChange={setProfessionalism} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Đúng giờ</label>
              <StarRating value={punctuality} onChange={setPunctuality} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Giao tiếp</label>
              <StarRating value={communication} onChange={setCommunication} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Cơ sở vật chất</label>
              <StarRating value={facilities} onChange={setFacilities} />
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nhận xét thêm <span className="text-gray-400 font-normal">(không bắt buộc)</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Tips */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex gap-2">
              <ThumbsUp className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold mb-1">Mẹo đánh giá tốt hơn:</p>
                <ul className="list-disc list-inside space-y-1 text-amber-700">
                  <li>Mô tả cụ thể trải nghiệm của bạn</li>
                  <li>Chia sẻ điều bạn thích và chưa hài lòng</li>
                  <li>Đánh giá trung thực để giúp người khác</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={rating === 0 || loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Gửi đánh giá
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

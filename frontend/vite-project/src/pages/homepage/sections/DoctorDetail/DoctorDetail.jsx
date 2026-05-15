import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  Award,
  Globe,
  Stethoscope,
  Calendar,
  MessageSquare,
  CheckCircle,
} from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export default function DoctorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/doctors/profile/${id}`);
        if (res.data.success) {
          setDoctor(res.data.data);
        }
      } catch (err) {
        setError('Không thể tải thông tin bác sĩ');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-gray-600 mb-4">{error || 'Không tìm thấy bác sĩ'}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Quay lại
        </button>
      </div>
    );
  }

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-5 h-5 ${i < fullStars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Doctor Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden mx-auto md:mx-0">
                  {doctor.user?.avatar ? (
                    <img
                      src={doctor.user.avatar}
                      alt={`${doctor.user.firstName} ${doctor.user.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-blue-600">
                      {doctor.user?.firstName?.charAt(0)}
                    </span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  BS. {doctor.user?.firstName} {doctor.user?.lastName}
                </h1>
                <p className="text-blue-600 font-medium mb-2">
                  {doctor.specialization}
                </p>

                {/* Rating */}
                <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                  <div className="flex">{renderStars(doctor.rating)}</div>
                  <span className="text-gray-600">
                    {doctor.rating?.toFixed(1) || '0.0'} ({doctor.stats?.totalFeedbacks || 0} đánh giá)
                  </span>
                </div>

                {/* Experience */}
                {doctor.experience && (
                  <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2">
                    <Award className="w-4 h-4" />
                    {doctor.experience} năm kinh nghiệm
                  </p>
                )}

                {/* Bio */}
                {doctor.bio && (
                  <p className="text-gray-600 mt-3 break-words">{doctor.bio}</p>
                )}
              </div>

              {/* Book Button */}
              <div className="flex-shrink-0 flex items-start justify-center md:justify-end">
                <button
                  onClick={() => navigate(`/booking/${doctor.id}`)}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-md"
                >
                  Đặt lịch khám
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Sections */}
        <div className="space-y-6">
          {/* About */}
          {doctor.about && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                Giới thiệu
              </h2>
              <div
                className="prose prose-sm max-w-none text-gray-700 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                dangerouslySetInnerHTML={{ __html: doctor.about }}
              />
            </div>
          )}

          {/* Education */}
          {doctor.education && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                Học vấn & Bằng cấp
              </h2>
              <div
                className="prose prose-sm max-w-none text-gray-700 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                dangerouslySetInnerHTML={{ __html: doctor.education }}
              />
            </div>
          )}

          {/* Training */}
          {doctor.training && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                Đào tạo chuyên môn
              </h2>
              <div
                className="prose prose-sm max-w-none text-gray-700 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                dangerouslySetInnerHTML={{ __html: doctor.training }}
              />
            </div>
          )}

          {/* Achievements */}
          {doctor.achievements && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-blue-600" />
                Thành tích & Giải thưởng
              </h2>
              <div
                className="prose prose-sm max-w-none text-gray-700 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                dangerouslySetInnerHTML={{ __html: doctor.achievements }}
              />
            </div>
          )}

          {/* Services */}
          {doctor.services && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                Dịch vụ khám
              </h2>
              <div
                className="prose prose-sm max-w-none text-gray-700 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                dangerouslySetInnerHTML={{ __html: doctor.services }}
              />
            </div>
          )}

          {/* Languages */}
          {doctor.languages && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                Ngôn ngữ
              </h2>
              <div
                className="prose prose-sm max-w-none text-gray-700 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                dangerouslySetInnerHTML={{ __html: doctor.languages }}
              />
            </div>
          )}

          {/* Clinics */}
          {doctor.clinics && doctor.clinics.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Phòng khám
              </h2>
              <div className="space-y-4">
                {doctor.clinics.map((clinic) => (
                  <div
                    key={clinic.id}
                    className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900">{clinic.name}</h3>
                    <p className="text-gray-600 text-sm mt-1 flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      {clinic.address}
                    </p>
                    {clinic.phone && (
                      <p className="text-gray-600 text-sm mt-1 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {clinic.phone}
                      </p>
                    )}
                    {clinic.room && (
                      <p className="text-blue-600 text-sm mt-1">
                        Phòng: {clinic.room.roomNumber}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feedbacks */}
          {doctor.feedbacks && doctor.feedbacks.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Đánh giá từ bệnh nhân
              </h2>
              <div className="space-y-4">
                {doctor.feedbacks.map((fb, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">{renderStars(fb.rating)}</div>
                      <span className="text-sm text-gray-500">
                        {new Date(fb.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    {fb.comment && (
                      <p className="text-gray-600">{fb.comment}</p>
                    )}
                    {fb.patient?.user?.firstName && (
                      <p className="text-sm text-gray-500 mt-1">
                        - {fb.patient.user.firstName}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

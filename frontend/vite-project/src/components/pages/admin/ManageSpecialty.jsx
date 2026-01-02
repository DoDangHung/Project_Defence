import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Image,
  Upload,
  X,
} from 'lucide-react';

const ManageSpecialty = () => {
  const [specialties, setSpecialties] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState(null);
  const [viewDetail, setViewDetail] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    image: '',
    isActive: true,
    priority: 0,
  });
  const [iconPreview, setIconPreview] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/specialty');
        setSpecialties(res.data.data); // 👈 QUAN TRỌNG
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialties();
  }, []);

  const handleOpenModal = (specialty = null) => {
    if (specialty) {
      setViewDetail(specialty);
      setEditingSpecialty(specialty);
      setFormData(specialty);
      setIconPreview(specialty.icon);
      setImagePreview(specialty.image);
    } else {
      setEditingSpecialty(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        icon: '',
        image: '',
        isActive: true,
        priority: 0,
      });
      setIconPreview('');
      setImagePreview('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSpecialty(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'icon') {
          setIconPreview(reader.result);
          setFormData((prev) => ({ ...prev, icon: reader.result }));
        } else {
          setImagePreview(reader.result);
          setFormData((prev) => ({ ...prev, image: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingSpecialty) {
      setSpecialties((prev) =>
        prev.map((s) =>
          s.id === editingSpecialty.id ? { ...formData, id: s.id } : s
        )
      );
    } else {
      const newSpecialty = {
        ...formData,
        id: Math.max(...specialties.map((s) => s.id), 0) + 1,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setSpecialties((prev) => [...prev, newSpecialty]);
    }

    handleCloseModal();
  };

  const handleViewDetail = (id) => {
    console.log('handleViewDetail', id);
  };
  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa chuyên khoa này?')) {
      setSpecialties((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleToggleActive = (id) => {
    setSpecialties((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  const filteredSpecialties = specialties.filter((s) => {
    const keyword = searchTerm.toLowerCase();
    return (
      s.name.toLowerCase().includes(keyword) ||
      (s.description ?? '').toLowerCase().includes(keyword)
    );
  });
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản Lý Chuyên Khoa
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý danh sách các chuyên khoa y tế
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Thêm Chuyên Khoa
          </button>
        </div>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Tìm kiếm chuyên khoa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                Icon
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                Tên Chuyên Khoa
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                Mô Tả
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                Ưu Tiên
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                Trạng Thái
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">
                Thao Tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredSpecialties.map((specialty) => (
              <tr key={specialty.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <img
                    src={specialty.icon || '/default-specialty.png'}
                    alt={specialty.name}
                    className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                  />
                </td>

                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">
                    {specialty.name}
                  </div>
                  <div className="text-sm text-gray-500">{specialty.slug}</div>
                </td>

                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600 max-w-xs truncate">
                    {specialty.description || '—'}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                    {specialty.priority}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleActive(specialty.id)}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                      specialty.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {specialty.isActive ? (
                      <Eye size={14} />
                    ) : (
                      <EyeOff size={14} />
                    )}
                    {specialty.isActive ? 'Hoạt động' : 'Ẩn'}
                  </button>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenModal(specialty)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Chỉnh sửa"
                    >
                      <Edit2 size={18} />
                    </button>

                    <button
                      onClick={() => handleViewDetail(specialty.id)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      title="Xem chi tiết"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(specialty.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Xóa"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredSpecialties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Không tìm thấy chuyên khoa nào</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0   flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingSpecialty
                  ? 'Chỉnh Sửa Chuyên Khoa'
                  : 'Thêm Chuyên Khoa Mới'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên Chuyên Khoa <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="VD: Khoa Tim Mạch"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    placeholder="khoa-tim-mach"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô Tả
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Mô tả về chuyên khoa..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icon (200x200px)
                  </label>
                  <div className="flex items-center gap-4">
                    {iconPreview && (
                      <img
                        src={iconPreview}
                        alt="Icon preview"
                        className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200"
                      />
                    )}
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition text-center">
                        <Upload
                          className="mx-auto mb-2 text-gray-400"
                          size={24}
                        />
                        <span className="text-sm text-gray-600">
                          Upload Icon
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, 'icon')}
                          className="hidden"
                        />
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banner (1200x600px)
                  </label>
                  <div className="flex items-center gap-4">
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Image preview"
                        className="w-32 h-16 rounded-lg object-cover border-2 border-gray-200"
                      />
                    )}
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition text-center">
                        <Image
                          className="mx-auto mb-2 text-gray-400"
                          size={24}
                        />
                        <span className="text-sm text-gray-600">
                          Upload Banner
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, 'image')}
                          className="hidden"
                        />
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Độ Ưu Tiên
                  </label>
                  <input
                    type="number"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Hiển thị chuyên khoa
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {editingSpecialty ? 'Cập Nhật' : 'Thêm Mới'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSpecialty;

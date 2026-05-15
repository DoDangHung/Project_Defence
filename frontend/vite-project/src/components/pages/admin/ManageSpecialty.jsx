import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
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
  Loader2,
  AlertCircle,
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api';
const ASSETS_BASE_URL = 'http://localhost:8080';

// Get current timestamp for cache busting
const getCacheBust = () => Date.now();

// Strip data:image/...;base64, prefix if present
const stripBase64 = (url) => {
  if (!url) return null;
  if (url.startsWith('data:')) return null; // Don't send base64 strings
  return url;
};

// Normalize image URL: Cloudinary URLs stay as-is, local paths get prefixed
// Add cache-busting query param for local files to ensure fresh images after upload
const normalizeImageUrl = (url, addCacheBust = false) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // For Cloudinary/external URLs, add timestamp to bust cache
    const separator = url.includes('?') ? '&' : '?';
    return addCacheBust ? `${url}${separator}_t=${getCacheBust()}` : url;
  }
  const baseUrl = `${ASSETS_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  // For local files, add timestamp to bust cache
  const separator = baseUrl.includes('?') ? '&' : '?';
  return addCacheBust ? `${baseUrl}${separator}_t=${getCacheBust()}` : baseUrl;
};

const ManageSpecialty = () => {
  const { t } = useTranslation();
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastRefresh, setLastRefresh] = useState(Date.now()); // Track last refresh for cache busting

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    image: '',
    isActive: true,
    priority: 0,
    categoryId: '',
  });

  const [iconPreview, setIconPreview] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [iconFile, setIconFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const iconInputRef = useRef(null);
  const imageInputRef = useRef(null);

  // --- Fetch specialties ---
  const fetchSpecialties = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/specialties`);
      setSpecialties(res.data.data || res.data.data?.data || []);
      setError(null);
      setLastRefresh(Date.now()); // Update refresh timestamp for cache busting
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load specialties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialties();
  }, []);

  // --- Open modal ---
  const handleOpenModal = (specialty = null) => {
    if (specialty) {
      setEditingSpecialty(specialty);
      setFormData({
        name: specialty.name || '',
        slug: specialty.slug || '',
        description: specialty.description || '',
        icon: specialty.icon || '',
        image: specialty.image || '',
        isActive: specialty.isActive !== false,
        priority: specialty.priority || 0,
        categoryId: specialty.categoryId || '',
      });
      setIconPreview(specialty.icon || '');
      setImagePreview(specialty.image || '');
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
        categoryId: '',
      });
      setIconPreview('');
      setImagePreview('');
    }
    setIconFile(null);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSpecialty(null);
    setIconFile(null);
    setImageFile(null);
  };

  // --- Input change ---
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (name === 'name' && !editingSpecialty) {
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

  // --- File change ---
  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'icon') {
        setIconPreview(reader.result);
        setIconFile(file);
      } else {
        setImagePreview(reader.result);
        setImageFile(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (type) => {
    if (type === 'icon') {
      setIconPreview('');
      setIconFile(null);
      if (iconInputRef.current) iconInputRef.current.value = '';
    } else {
      setImagePreview('');
      setImageFile(null);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert(t('validation.required'));
      return;
    }

    setSaving(true);

    try {
      let iconUrl = editingSpecialty?.icon || '';
      let imageUrl = editingSpecialty?.image || '';

      // 1. Upload icon if changed
      if (iconFile) {
        const iconForm = new FormData();
        iconForm.append('icon', iconFile);
        console.log('Uploading icon:', iconFile.name, iconFile.size, iconFile.type);
        try {
          const iconRes = await axios.post(`${API_BASE_URL}/specialties/upload-icon`, iconForm, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 30000, // 30 second timeout
          });
          console.log('Icon upload response:', iconRes.data);
          if (iconRes.data.icon) iconUrl = iconRes.data.icon;
        } catch (uploadErr) {
          console.error('Icon upload failed:', uploadErr);
          throw uploadErr; // Re-throw to show error to user
        }
      }

      // 2. Upload image if changed
      if (imageFile) {
        const imgForm = new FormData();
        imgForm.append('image', imageFile);
        console.log('Uploading image:', imageFile.name, imageFile.size, imageFile.type);
        try {
          const imgRes = await axios.post(`${API_BASE_URL}/specialties/upload-image`, imgForm, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 30000, // 30 second timeout
          });
          console.log('Image upload response:', imgRes.data);
          if (imgRes.data.image) imageUrl = imgRes.data.image;
        } catch (uploadErr) {
          console.error('Image upload failed:', uploadErr);
          throw uploadErr; // Re-throw to show error to user
        }
      }

      // 3. Submit specialty data with Cloudinary URLs
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim(),
        isActive: formData.isActive,
        priority: formData.priority || 0,
        ...(formData.categoryId && { categoryId: parseInt(formData.categoryId) }),
        icon: iconUrl || null,
        image: imageUrl || null,
      };

      if (editingSpecialty) {
        await axios.put(`${API_BASE_URL}/specialties/${editingSpecialty.id}`, payload);
      } else {
        await axios.post(`${API_BASE_URL}/specialties`, payload);
      }

      await fetchSpecialties();
      handleCloseModal();
    } catch (err) {
      console.error('Upload/save error:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Có lỗi xảy ra. Vui lòng thử lại.';
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // --- Toggle active ---
  const handleToggleActive = async (id) => {
    try {
      await axios.patch(`${API_BASE_URL}/specialties/${id}/toggle-active`);
      await fetchSpecialties();
    } catch (err) {
      alert('Có lỗi xảy ra');
    }
  };

  // --- Delete ---
  const handleDelete = async (id) => {
    if (!window.confirm(t('messages.confirmDelete'))) return;
    try {
      await axios.delete(`${API_BASE_URL}/specialties/${id}`);
      await fetchSpecialties();
    } catch (err) {
      alert(err.response?.data?.message || t('messages.error'));
    }
  };

  // --- Filter ---
  const filteredSpecialties = specialties.filter((s) => {
    const keyword = searchTerm.toLowerCase();
    return (
      (s.name || '').toLowerCase().includes(keyword) ||
      (s.description || '').toLowerCase().includes(keyword) ||
      (s.slug || '').toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('specialty.title')}</h1>
            <p className="text-gray-600 mt-1">{t('specialty.description')}</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            {t('specialty.addSpecialty')}
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={t('common.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span className="ml-3 text-gray-500">{t('common.loading')}</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20 text-red-500 gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">{t('specialty.icon')}</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">{t('specialty.specialtyName')}</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">{t('common.description')}</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">{t('specialty.priority')}</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">{t('common.status')}</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">{t('common.action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSpecialties.map((specialty) => (
                <tr key={specialty.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    {specialty.icon ? (
                      <img
                        src={normalizeImageUrl(specialty.icon, true) + `&_refresh=${lastRefresh}`}
                        alt={specialty.name}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling && (e.target.nextSibling.style.display = 'flex'); }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
                        <Image size={20} />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{specialty.name}</div>
                    <div className="text-sm text-gray-500">{specialty.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 max-w-xs truncate">
                      {specialty.description || '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                      {specialty.priority ?? 0}
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
                      {specialty.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                      {specialty.isActive ? t('common.active') : t('common.inactive')}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(specialty)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title={t('common.edit')}
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(specialty.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title={t('common.delete')}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {filteredSpecialties.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">{t('common.noData')}</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingSpecialty ? t('specialty.editSpecialty') : t('specialty.addSpecialty')}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-5">
                {/* Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('specialty.specialtyName')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={t('specialty.specialtyPlaceholder')}
                      required
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
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('common.description')}</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Mô tả về chuyên khoa..."
                  />
                </div>

                {/* Icon Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Icon (200x200px)</label>
                  <div className="flex items-center gap-4">
                    {iconPreview && (
                      <div className="relative flex-shrink-0">
                        <img
                          src={iconPreview}
                          alt="Icon preview"
                          className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage('icon')}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition text-center">
                        <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                        <span className="text-sm text-gray-600">
                          {iconPreview ? 'Thay đổi icon' : 'Upload Icon'}
                        </span>
                        <input
                          ref={iconInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, 'icon')}
                          className="hidden"
                        />
                      </div>
                    </label>
                  </div>
                </div>

                {/* Banner Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Banner (1200x600px)</label>
                  <div className="flex items-center gap-4">
                    {imagePreview && (
                      <div className="relative flex-shrink-0">
                        <img
                          src={imagePreview}
                          alt="Image preview"
                          className="w-32 h-16 rounded-lg object-cover border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage('image')}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition text-center">
                        <Image className="mx-auto mb-2 text-gray-400" size={24} />
                        <span className="text-sm text-gray-600">
                          {imagePreview ? 'Thay đổi banner' : 'Upload Banner'}
                        </span>
                        <input
                          ref={imageInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, 'image')}
                          className="hidden"
                        />
                      </div>
                    </label>
                  </div>
                </div>

                {/* Priority & Active */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Độ Ưu Tiên</label>
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
                    <label className="flex items-center gap-2 cursor-pointer mt-6">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Hiển thị chuyên khoa</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                  disabled={saving}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-60"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingSpecialty ? 'Cập Nhật' : 'Thêm Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSpecialty;

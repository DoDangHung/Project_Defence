/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Building2,
  User,
  Link2,
  Unlink,
  Stethoscope,
} from "lucide-react";

const API_URL = "http://localhost:8080/api";
const SPECIALTIES_API = `${API_URL}/specialties`;
const SERVICE_API = `${API_URL}/service-categories`;
const CLINICS_API = `${API_URL}/clinics`;
const DOCTORS_API = `${API_URL}/users/doctors`;

const getAuthHeader = () => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const getIconEmoji = (iconName) => {
  const icons = {
    Stethoscope: "🩺",
    Smile: "😊",
    TestTube: "🧪",
    Brain: "🧠",
    Heart: "❤️",
    Eye: "👁️",
    Pill: "💊",
    Bone: "🦴",
    Syringe: "💉",
    Baby: "👶",
    Virus: "🦠",
  };
  return icons[iconName] || "📋";
};

export default function ManageServiceCategories() {
  const [categories, setCategories] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Modal states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSpecialtyModalOpen, setIsSpecialtyModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Editing states
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSpecialty, setEditingSpecialty] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);

  // Expanded states
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedSpecialties, setExpandedSpecialties] = useState({});

  // Form data
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    icon: "",
    color: "#3B82F6",
    priority: 0,
    isActive: true,
  });

  const [specialtyForm, setSpecialtyForm] = useState({
    name: "",
    description: "",
    icon: "",
    categoryId: "",
    isActive: true,
  });

  const [assignForm, setAssignForm] = useState({
    clinicId: "",
    specialtyId: "",
    specialtyIds: [],
  });

  // Assign specialty to category modal
  const [
    isAssignSpecialtyToCategoryModalOpen,
    setIsAssignSpecialtyToCategoryModalOpen,
  ] = useState(false);
  const [allSpecialties, setAllSpecialties] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, clinicsRes, doctorsRes, specialtiesRes] =
        await Promise.all([
          axios.get(`${SERVICE_API}?withSpecialties=true`),
          axios.get(`${CLINICS_API}`, getAuthHeader()),
          axios.get(`${DOCTORS_API}?limit=100`, getAuthHeader()),
          axios.get(`${SPECIALTIES_API}?isActive=true`),
        ]);
      setCategories(categoriesRes.data.data || []);
      setClinics(clinicsRes.data.data || []);
      setDoctors(doctorsRes.data.data || []);
      setAllSpecialties(specialtiesRes.data?.data || []);
      setError(null);
    } catch (err) {
      setError("Không thể tải dữ liệu");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // Toggle expand/collapse
  const toggleCategoryExpand = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const toggleSpecialtyExpand = (specialtyId) => {
    setExpandedSpecialties((prev) => ({
      ...prev,
      [specialtyId]: !prev[specialtyId],
    }));
  };

  // Category handlers
  const handleOpenCategoryModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name,
        description: category.description || "",
        icon: category.icon || "",
        color: category.color || "#3B82F6",
        priority: category.priority || 0,
        isActive: category.isActive,
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({
        name: "",
        description: "",
        icon: "",
        color: "#3B82F6",
        priority: categories.length + 1,
        isActive: true,
      });
    }
    setIsCategoryModalOpen(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await axios.put(
          `${SERVICE_API}/${editingCategory.id}`,
          categoryForm,
          getAuthHeader(),
        );
        showMessage("Cập nhật danh mục thành công!");
      } else {
        await axios.post(SERVICE_API, categoryForm, getAuthHeader());
        showMessage("Tạo danh mục thành công!");
      }
      fetchData();
      setIsCategoryModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    try {
      await axios.delete(`${SERVICE_API}/${id}`, getAuthHeader());
      showMessage("Xóa danh mục thành công!");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Không thể xóa danh mục");
    }
  };

  const handleToggleCategoryStatus = async (category) => {
    try {
      await axios.patch(
        `${SERVICE_API}/${category.id}/toggle-status`,
        {},
        getAuthHeader(),
      );
      showMessage("Cập nhật trạng thái thành công!");
      fetchData();
    } catch (err) {
      alert("Có lỗi xảy ra");
    }
  };

  // Specialty handlers
  const handleOpenSpecialtyModal = (category, specialty = null) => {
    setSelectedCategory(category);
    if (specialty) {
      setEditingSpecialty(specialty);
      setSpecialtyForm({
        name: specialty.name,
        description: specialty.description || "",
        icon: specialty.icon || "",
        categoryId: category.id,
        isActive: specialty.isActive,
      });
    } else {
      setEditingSpecialty(null);
      setSpecialtyForm({
        name: "",
        description: "",
        icon: "",
        categoryId: category.id,
        isActive: true,
      });
    }
    setIsSpecialtyModalOpen(true);
  };

  const handleSpecialtySubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...specialtyForm,
        categoryId: selectedCategory.id,
      };

      if (editingSpecialty) {
        await axios.put(
          `${SPECIALTIES_API}/${editingSpecialty.id}`,
          data,
          getAuthHeader(),
        );
        showMessage("Cập nhật chuyên khoa thành công!");
      } else {
        await axios.post(SPECIALTIES_API, data, getAuthHeader());
        showMessage("Tạo chuyên khoa thành công!");
      }
      fetchData();
      setIsSpecialtyModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const handleDeleteSpecialty = async (specialtyId) => {
    if (!window.confirm("Bạn có chắc muốn xóa chuyên khoa này?")) return;
    try {
      await axios.delete(`${SPECIALTIES_API}/${specialtyId}`, getAuthHeader());
      showMessage("Xóa chuyên khoa thành công!");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Không thể xóa chuyên khoa");
    }
  };

  // Assign specialty to clinic
  const handleOpenAssignModal = (specialty = null) => {
    if (specialty) {
      setSelectedSpecialty(specialty);
      setAssignForm({
        clinicId: "",
        specialtyId: specialty.id,
        specialtyIds: [],
      });
    } else {
      setSelectedSpecialty(null);
      setAssignForm({
        clinicId: "",
        specialtyId: "",
        specialtyIds: [],
      });
    }
    setIsAssignModalOpen(true);
  };

  const handleAssignSpecialtyToClinic = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${CLINICS_API}/${assignForm.clinicId}/specialties`,
        {
          specialtyIds:
            assignForm.specialtyIds.length > 0
              ? assignForm.specialtyIds
              : [parseInt(assignForm.specialtyId)],
        },
        getAuthHeader(),
      );
      showMessage("Gán chuyên khoa vào phòng khám thành công!");
      fetchData();
      setIsAssignModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  // Assign existing specialty to category
  const [selectedCategoryForAssign, setSelectedCategoryForAssign] =
    useState(null);
  const [assignSpecialtyForm, setAssignSpecialtyForm] = useState({
    specialtyIds: [],
  });

  const handleOpenAssignSpecialtyToCategoryModal = (category) => {
    setSelectedCategoryForAssign(category);
    // Pre-select specialties already in this category
    setAssignSpecialtyForm({
      specialtyIds: category.specialties?.map((s) => s.id) || [],
    });
    setIsAssignSpecialtyToCategoryModalOpen(true);
  };

  const handleAssignSpecialtyToCategory = async (e) => {
    e.preventDefault();
    try {
      // Update each specialty's categoryId
      for (const specialtyId of assignSpecialtyForm.specialtyIds) {
        await axios.put(
          `${SPECIALTIES_API}/${specialtyId}`,
          { categoryId: selectedCategoryForAssign.id },
          getAuthHeader(),
        );
      }
      showMessage("Gán chuyên khoa vào danh mục thành công!");
      fetchData();
      setIsAssignSpecialtyToCategoryModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  // Get clinics that have this specialty
  const getClinicsForSpecialty = (specialtyId) => {
    const clinicsWithSpecialty = [];
    categories.forEach((cat) => {
      cat.specialties?.forEach((spec) => {
        if (spec.id === specialtyId) {
          // Find clinics that have this specialty from the category's clinics
          clinicsWithSpecialty.push(...(cat._count?.clinics ? [] : []));
        }
      });
    });
    return clinicsWithSpecialty;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Manage Services & Specialties
          </h1>
          <p className="text-gray-500 mt-1">
            Create service categories, assign specialties to clinics
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleOpenAssignModal()}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Link2 size={20} />
            Assign Specialty-Clinic
          </button>
          <button
            onClick={() => handleOpenCategoryModal()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add Category
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <Check size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          {message.text}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Categories & Specialties List */}
      <div className="space-y-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 ${
              category.isActive ? "" : "opacity-60"
            }`}
            style={{ borderLeftColor: category.color || "#3B82F6" }}
          >
            {/* Category Header */}
            <div
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleCategoryExpand(category.id)}
            >
              <div className="flex items-center gap-4">
                <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                  {expandedCategories[category.id] ? (
                    <ChevronDown size={20} className="text-gray-500" />
                  ) : (
                    <ChevronRight size={20} className="text-gray-500" />
                  )}
                </button>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{
                    backgroundColor: `${category.color || "#3B82F6"}20`,
                  }}
                >
                  {getIconEmoji(category.icon)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800">
                      {category.name}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        category.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {category.specialties?.length || 0} specialties
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenAssignSpecialtyToCategoryModal(category);
                  }}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Assign existing specialties"
                >
                  <Link2 size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenSpecialtyModal(category);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Add specialty"
                >
                  <Plus size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenCategoryModal(category);
                  }}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit category"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleCategoryStatus(category);
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    category.isActive
                      ? "text-gray-500 hover:bg-gray-100"
                      : "text-green-600 hover:bg-green-50"
                  }`}
                  title={category.isActive ? "Inactive" : "Active"}
                >
                  {category.isActive ? <X size={18} /> : <Check size={18} />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategory(category.id);
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete category"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Specialties List */}
            {expandedCategories[category.id] && (
              <div className="border-t bg-gray-50 p-4">
                {category.specialties && category.specialties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {category.specialties.map((specialty) => (
                      <div
                        key={specialty.id}
                        className={`bg-white rounded-lg p-3 border hover:shadow-md transition-all ${
                          specialty.isActive
                            ? "border-gray-200"
                            : "border-gray-300 opacity-60"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-xl">
                              {getIconEmoji(specialty.icon) || "⚕️"}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800">
                                {specialty.name}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {specialty._count?.doctors || 0} BS •{" "}
                                {specialty._count?.clinics || 0} PK
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleOpenAssignModal(specialty)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Gán vào phòng khám"
                            >
                              <Building2 size={16} />
                            </button>
                            <button
                              onClick={() =>
                                handleOpenSpecialtyModal(category, specialty)
                              }
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Sửa"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteSpecialty(specialty.id)
                              }
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Xóa"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        {specialty.description && (
                          <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                            {specialty.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Stethoscope
                      size={40}
                      className="mx-auto mb-2 text-gray-300"
                    />
                    <p>No specialties in this category</p>
                    <button
                      onClick={() => handleOpenSpecialtyModal(category)}
                      className="mt-2 text-blue-600 hover:underline"
                    >
                      + Add new specialty
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {categories.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Stethoscope size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No service categories yet
            </h3>
            <p className="text-gray-500 mb-4">
              Create the first category to start
            </p>
            <button
              onClick={() => handleOpenCategoryModal()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Add category
            </button>
          </div>
        )}
      </div>

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingCategory ? "Edit category" : "Add new category"}
              </h2>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCategorySubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="VD: General check-up, Other services..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon
                  </label>
                  <select
                    value={categoryForm.icon}
                    onChange={(e) =>
                      setCategoryForm({ ...categoryForm, icon: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select icon</option>
                    <option value="Stethoscope">🩺 General check-up</option>
                    <option value="Smile">😊 Dentistry</option>
                    <option value="TestTube">🧪 Tests</option>
                    <option value="Brain">🧠 Psychology</option>
                    <option value="Heart">❤️ Cardiology</option>
                    <option value="Syringe">💉 Vaccinations</option>
                    <option value="Baby">👶 Pediatrics</option>
                    <option value="Bone">🦴 Orthopedics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={categoryForm.priority}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        priority: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={categoryForm.color}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        color: e.target.value,
                      })
                    }
                    className="w-12 h-10 rounded cursor-pointer border border-gray-300"
                  />
                  <input
                    type="text"
                    value={categoryForm.color}
                    onChange={(e) =>
                      setCategoryForm({
                        ...categoryForm,
                        color: e.target.value,
                      })
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="catActive"
                  checked={categoryForm.isActive}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      isActive: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="catActive" className="text-sm text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingCategory ? "Save changes" : "Add new"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Specialty Modal */}
      {isSpecialtyModalOpen && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {editingSpecialty ? "Edit specialty" : "Add new specialty"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Category: {selectedCategory.name}
                </p>
              </div>
              <button
                onClick={() => setIsSpecialtyModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSpecialtySubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialty name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={specialtyForm.name}
                  onChange={(e) =>
                    setSpecialtyForm({ ...specialtyForm, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="VD: Dentistry, Blood tests..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={specialtyForm.description}
                  onChange={(e) =>
                    setSpecialtyForm({
                      ...specialtyForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  rows={2}
                  placeholder="Short description of the specialty..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon
                </label>
                <select
                  value={specialtyForm.icon}
                  onChange={(e) =>
                    setSpecialtyForm({ ...specialtyForm, icon: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select icon</option>
                  <option value="Stethoscope">🩺 General check-up</option>
                  <option value="Smile">😊 Dentistry</option>
                  <option value="TestTube">🧪 Tests</option>
                  <option value="Brain">🧠 Psychology</option>
                  <option value="Heart">❤️ Cardiology</option>
                  <option value="Eye">👁️ Eyes</option>
                  <option value="Syringe">💉 Vaccinations</option>
                  <option value="Baby">👶 Pediatrics</option>
                  <option value="Bone">🦴 Orthopedics</option>
                  <option value="Pill">💊 Pharmacy</option>
                  <option value="Virus">🦠 Virus</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="specActive"
                  checked={specialtyForm.isActive}
                  onChange={(e) =>
                    setSpecialtyForm({
                      ...specialtyForm,
                      isActive: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="specActive" className="text-sm text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsSpecialtyModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingSpecialty ? "Save changes" : "Add new"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Specialty to Clinic Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Assign Specialty to Clinic
              </h2>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleAssignSpecialtyToClinic}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Clinic <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={assignForm.clinicId}
                  onChange={(e) =>
                    setAssignForm({ ...assignForm, clinicId: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
                >
                  <option value="">-- Select clinic --</option>
                  {clinics.map((clinic) => (
                    <option key={clinic.id} value={clinic.id}>
                      {clinic.name} - {clinic.district}, {clinic.city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Specialty to assign
                </label>
                {selectedSpecialty ? (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        {getIconEmoji(selectedSpecialty.icon) || "⚕️"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {selectedSpecialty.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {selectedCategory?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">
                      Select from list or select multiple:
                    </p>
                    <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
                      {categories.flatMap((cat) =>
                        cat.specialties?.map((spec) => (
                          <label
                            key={spec.id}
                            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              value={spec.id}
                              checked={assignForm.specialtyIds.includes(
                                spec.id,
                              )}
                              onChange={(e) => {
                                const newIds = e.target.checked
                                  ? [
                                      ...assignForm.specialtyIds,
                                      parseInt(spec.id),
                                    ]
                                  : assignForm.specialtyIds.filter(
                                      (id) => id !== spec.id,
                                    );
                                setAssignForm({
                                  ...assignForm,
                                  specialtyIds: newIds,
                                });
                              }}
                              className="w-4 h-4 text-green-600 rounded"
                            />
                            <span className="text-sm">
                              {getIconEmoji(spec.icon)} {spec.name}
                            </span>
                            <span className="text-xs text-gray-400">
                              ({cat.name})
                            </span>
                          </label>
                        )),
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Assign specialty to clinic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Gán chuyên khoa có sẵn vào category */}
      {isAssignSpecialtyToCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  Assign specialty to category
                </h3>
                <p className="text-sm text-gray-500">
                  Category:{" "}
                  <span className="font-medium text-blue-600">
                    {selectedCategoryForAssign?.name}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setIsAssignSpecialtyToCategoryModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleAssignSpecialtyToCategory}
              className="flex-1 overflow-y-auto p-6"
            >
              <p className="text-sm text-gray-600 mb-4">
                Select the specialties you want to assign to this category:
              </p>

              <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
                {allSpecialties.map((spec) => (
                  <label
                    key={spec.id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer border border-gray-100"
                  >
                    <input
                      type="checkbox"
                      value={spec.id}
                      checked={assignSpecialtyForm.specialtyIds.includes(
                        spec.id,
                      )}
                      onChange={(e) => {
                        const newIds = e.target.checked
                          ? [...assignSpecialtyForm.specialtyIds, spec.id]
                          : assignSpecialtyForm.specialtyIds.filter(
                              (id) => id !== spec.id,
                            );
                        setAssignSpecialtyForm({ specialtyIds: newIds });
                      }}
                      className="w-5 h-5 text-green-600 rounded"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-xl">
                        {getIconEmoji(spec.icon) || "⚕️"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{spec.name}</p>
                        <p className="text-xs text-gray-400">
                          {spec.categoryId
                            ? `Currently: ${categories.find((c) => c.id === spec.categoryId)?.name || "N/A"}`
                            : "Not assigned to any category"}
                        </p>
                      </div>
                    </div>
                    {assignSpecialtyForm.specialtyIds.includes(spec.id) && (
                      <Check size={18} className="text-green-600" />
                    )}
                  </label>
                ))}
                {allSpecialties.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No specialties available
                  </div>
                )}
              </div>

              <div className="mt-4 text-sm text-gray-500">
                Selected:{" "}
                <span className="font-medium text-blue-600">
                  {assignSpecialtyForm.specialtyIds.length}
                </span>{" "}
                Specialties
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                <button
                  type="button"
                  onClick={() => setIsAssignSpecialtyToCategoryModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={assignSpecialtyForm.specialtyIds.length === 0}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

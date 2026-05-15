/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  X,
  Loader2,
  Link2,
  ChevronDown,
  Check,
  Building2,
  User,
  Trash2,
  Edit2,
  Search,
} from "lucide-react";

const API_URL = "http://localhost:8080/api";

const getAuthHeader = () => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

export default function ManageClinicSpecialties() {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Data lists
  const [clinics, setClinics] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [categories, setCategories] = useState([]);

  // Modal states
  const [showClinicModal, setShowClinicModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showSpecialtyModal, setShowSpecialtyModal] = useState(false);

  // Selected items
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [clinicSpecialties, setClinicSpecialties] = useState([]);

  // Clinic form
  const [clinicForm, setClinicForm] = useState({
    name: "",
    categoryId: "",
    address: "",
    ward: "",
    district: "",
    city: "",
    phone: "",
    email: "",
    description: "",
    logo: "",
    openingTime: "",
    closingTime: "",
    isActive: true,
  });

  // Assign specialty form
  const [assignForm, setAssignForm] = useState({
    clinicId: "",
    specialtyId: "",
    specialtyIds: [],
    categoryId: "",
  });

  // Specialty form
  const [specialtyForm, setSpecialtyForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    icon: "",
    isActive: true,
  });

  // Load data
  const loadData = async () => {
    const token = sessionStorage.getItem("token");
    setLoading(true);
    try {
      const [clinicsRes, specialtiesRes, categoriesRes] = await Promise.all([
        axios.get(`${API_URL}/clinics`, getAuthHeader()),
        axios.get(`${API_URL}/specialties?isActive=true`),
        axios.get(
          `${API_URL}/service-categories?withSpecialties=true&isActive=true`,
        ),
      ]);
      setClinics(clinicsRes.data.data || []);
      setSpecialties(specialtiesRes.data.data || []);
      setCategories(categoriesRes.data.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Load clinic specialties when clinic selected
  useEffect(() => {
    if (selectedClinic) {
      loadClinicSpecialties(selectedClinic.id);
    }
  }, [selectedClinic]);

  const loadClinicSpecialties = async (clinicId) => {
    try {
      const res = await axios.get(
        `${API_URL}/clinics/${clinicId}`,
        getAuthHeader(),
      );
      setClinicSpecialties(res.data.data?.specialties || []);
    } catch (error) {
      console.error("Error loading clinic specialties:", error);
    }
  };

  const showMessage = (text, type = "success") => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  // Clinic CRUD handlers
  const handleClinicSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await axios.post(`${API_URL}/clinics`, clinicForm, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      showMessage("Thêm phòng khám thành công!");
      setShowClinicModal(false);
      resetClinicForm();
      loadData();
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Lỗi khi tạo phòng khám",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const resetClinicForm = () => {
    setClinicForm({
      name: "",
      categoryId: "",
      address: "",
      ward: "",
      district: "",
      city: "",
      phone: "",
      email: "",
      description: "",
      logo: "",
      openingTime: "",
      closingTime: "",
      isActive: true,
    });
  };

  const handleSelectClinic = (clinic) => {
    setSelectedClinic(clinic);
    setSelectedCategory(null);
    loadClinicSpecialties(clinic.id);
  };

  // Category filter for specialties
  const filteredSpecialties = selectedCategory
    ? specialties.filter((s) => s.categoryId === selectedCategory)
    : specialties;

  // Create specialty
  const handleCreateSpecialty = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");
    setSaving(true);

    try {
      await axios.post(`${API_URL}/specialties`, specialtyForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showMessage("Tạo chuyên khoa thành công!");
      setShowSpecialtyModal(false);
      setSpecialtyForm({
        name: "",
        description: "",
        categoryId: "",
        icon: "",
        isActive: true,
      });
      loadData();
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Lỗi khi tạo chuyên khoa",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  // Assign specialties to clinic
  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");
    setSaving(true);
    setMessage(null);

    try {
      const idsToAssign =
        assignForm.specialtyIds.length > 0
          ? assignForm.specialtyIds
          : assignForm.specialtyId
            ? [parseInt(assignForm.specialtyId)]
            : [];

      if (idsToAssign.length === 0) {
        showMessage("Vui lòng chọn ít nhất một chuyên khoa", "error");
        setSaving(false);
        return;
      }

      await axios.post(
        `${API_URL}/clinics/${assignForm.clinicId}/specialties`,
        { specialtyIds: idsToAssign },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      showMessage("Gán chuyên khoa thành công!");
      setShowAssignModal(false);
      setAssignForm({
        clinicId: "",
        specialtyId: "",
        specialtyIds: [],
        categoryId: "",
      });

      if (selectedClinic?.id === parseInt(assignForm.clinicId)) {
        loadClinicSpecialties(assignForm.clinicId);
      }
      loadData();
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Lỗi khi gán chuyên khoa",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  // Remove specialty from clinic
  const handleRemoveSpecialty = async (clinicId, specialtyId) => {
    if (!confirm("Bạn có chắc muốn xóa chuyên khoa này khỏi phòng khám?"))
      return;

    const token = sessionStorage.getItem("token");
    try {
      await axios.delete(
        `${API_URL}/clinic-specialties/${clinicId}/${specialtyId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      showMessage("Đã xóa chuyên khoa khỏi phòng khám!");
      loadClinicSpecialties(clinicId);
      loadData();
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Lỗi khi xóa chuyên khoa",
        "error",
      );
    }
  };

  // Open assign modal for a specific clinic
  const openAssignModal = (clinic) => {
    setAssignForm({
      clinicId: clinic.id,
      specialtyId: "",
      specialtyIds: clinic.specialties?.map((s) => s.id) || [],
      categoryId: "",
    });
    setShowAssignModal(true);
  };

  // Get specialty name by ID
  const getSpecialtyName = (id) => {
    const spec = specialties.find((s) => s.id === id);
    return spec?.name || "Unknown";
  };

  // Get category name by ID
  const getCategoryName = (id) => {
    const cat = categories.find((c) => c.id === id);
    return cat?.name || "Unknown";
  };

  // Group specialties by category
  const groupedSpecialties = specialties.reduce((acc, spec) => {
    const catId = spec.categoryId || "uncategorized";
    if (!acc[catId]) {
      acc[catId] = [];
    }
    acc[catId].push(spec);
    return acc;
  }, {});

  // Filter clinics by search
  const filteredClinics = searchTerm
    ? clinics.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.city?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : clinics;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Manage Clinic & Specialty
        </h1>
        <p className="text-gray-500 mt-1">
          Assign specialty to clinic and manage doctors
        </p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {message.text}
        </div>
      )}

      {/* Main Content - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Clinics List */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Building2 size={20} />
              Clinic ({clinics.length})
            </h2>
            <button
              onClick={() => {
                resetClinicForm();
                setShowClinicModal(true);
              }}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              title="Add clinic"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search clinic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Clinics List */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filteredClinics.map((clinic) => (
              <div
                key={clinic.id}
                onClick={() => handleSelectClinic(clinic)}
                className={`p-3 rounded-lg cursor-pointer transition-all border-2 ${
                  selectedClinic?.id === clinic.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-semibold">
                    {clinic.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 truncate">
                      {clinic.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {clinic.district}, {clinic.city}
                    </div>
                  </div>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {clinic.specialties?.length || 0} Specialty
                  </span>
                </div>
              </div>
            ))}
            {filteredClinics.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                No clinic found
              </div>
            )}
          </div>
        </div>

        {/* Middle: Specialties Assignment */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          {selectedClinic ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">
                    {selectedClinic.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedClinic.address}, {selectedClinic.ward},{" "}
                    {selectedClinic.district}, {selectedClinic.city}
                  </p>
                </div>
                <button
                  onClick={() => openAssignModal(selectedClinic)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Link2 size={18} />
                  Assign specialty
                </button>
              </div>

              {/* Category tabs */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    !selectedCategory
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All ({specialties.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === cat.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {cat.name} ({cat.specialties?.length || 0})
                  </button>
                ))}
              </div>

              {/* Specialties Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto">
                {filteredSpecialties.map((spec) => {
                  const isAssigned = clinicSpecialties.some(
                    (cs) =>
                      cs.specialty?.id === spec.id ||
                      cs.specialtyId === spec.id,
                  );
                  return (
                    <div
                      key={spec.id}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        isAssigned
                          ? "border-green-300 bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-800 text-sm">
                            {spec.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {getCategoryName(spec.categoryId)}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {spec._count?.doctors || 0} bác sĩ
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {isAssigned && (
                            <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center">
                              <Check size={12} />
                            </span>
                          )}
                          {isAssigned && (
                            <button
                              onClick={() =>
                                handleRemoveSpecialty(
                                  selectedClinic.id,
                                  spec.id,
                                )
                              }
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                              title="Xóa khỏi phòng khám"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredSpecialties.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No specialty found in this category
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
              <Building2 size={48} className="mb-4 text-gray-300" />
              <p className="text-lg font-medium">Select a clinic</p>
              <p className="text-sm">to view and assign specialty</p>
            </div>
          )}
        </div>
      </div>

      {/* Clinic Modal */}
      {showClinicModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">Add New Clinic</h2>
              <button
                onClick={() => setShowClinicModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleClinicSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Clinic Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={clinicForm.name}
                    onChange={(e) =>
                      setClinicForm({ ...clinicForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={clinicForm.categoryId}
                    onChange={(e) =>
                      setClinicForm({
                        ...clinicForm,
                        categoryId: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">-- Select category --</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  required
                  value={clinicForm.address}
                  onChange={(e) =>
                    setClinicForm({ ...clinicForm, address: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ward/Xã
                  </label>
                  <input
                    type="text"
                    value={clinicForm.ward}
                    onChange={(e) =>
                      setClinicForm({ ...clinicForm, ward: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    District/Huyện
                  </label>
                  <input
                    type="text"
                    value={clinicForm.district}
                    onChange={(e) =>
                      setClinicForm({ ...clinicForm, district: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={clinicForm.city}
                    onChange={(e) =>
                      setClinicForm({ ...clinicForm, city: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={clinicForm.phone}
                    onChange={(e) =>
                      setClinicForm({ ...clinicForm, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={clinicForm.email}
                    onChange={(e) =>
                      setClinicForm({ ...clinicForm, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Opening Time
                  </label>
                  <input
                    type="time"
                    value={clinicForm.openingTime}
                    onChange={(e) =>
                      setClinicForm({
                        ...clinicForm,
                        openingTime: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Closing Time
                  </label>
                  <input
                    type="time"
                    value={clinicForm.closingTime}
                    onChange={(e) =>
                      setClinicForm({
                        ...clinicForm,
                        closingTime: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={clinicForm.description}
                  onChange={(e) =>
                    setClinicForm({
                      ...clinicForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={clinicForm.isActive}
                  onChange={(e) =>
                    setClinicForm({ ...clinicForm, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="isActive"
                  className="ml-2 text-sm text-gray-700"
                >
                  Active
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowClinicModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 size={18} className="animate-spin" />}
                  Create Clinic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Specialty Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Link2 size={20} />
                  Assign Specialty
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {
                    clinics.find((c) => c.id === parseInt(assignForm.clinicId))
                      ?.name
                  }
                </p>
              </div>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="p-6 space-y-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by category
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setAssignForm({ ...assignForm, categoryId: "" })
                    }
                    className={`px-3 py-1.5 rounded-lg text-sm ${
                      !assignForm.categoryId
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() =>
                        setAssignForm({ ...assignForm, categoryId: cat.id })
                      }
                      className={`px-3 py-1.5 rounded-lg text-sm ${
                        assignForm.categoryId === cat.id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specialties Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select specialty ({assignForm.specialtyIds.length} selected)
                </label>
                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-2">
                  {Object.entries(groupedSpecialties)
                    .filter(
                      ([catId]) =>
                        !assignForm.categoryId ||
                        catId === assignForm.categoryId,
                    )
                    .map(([catId, specs]) => (
                      <div key={catId}>
                        <div className="text-xs font-semibold text-gray-500 uppercase mb-2 px-1">
                          {getCategoryName(parseInt(catId) || null)}
                        </div>
                        {specs.map((spec) => (
                          <label
                            key={spec.id}
                            className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={assignForm.specialtyIds.includes(
                                spec.id,
                              )}
                              onChange={(e) => {
                                const newIds = e.target.checked
                                  ? [...assignForm.specialtyIds, spec.id]
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
                            <span className="flex-1">{spec.name}</span>
                            <span className="text-xs text-gray-400">
                              {spec._count?.doctors || 0} BS
                            </span>
                          </label>
                        ))}
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 size={18} className="animate-spin" />}
                  Save ({assignForm.specialtyIds.length} specialty)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

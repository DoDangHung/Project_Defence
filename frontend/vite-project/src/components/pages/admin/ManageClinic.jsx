/** @format */

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Edit,
  Trash2,
  Plus,
  X,
  Search,
  Filter,
  Eye,
  Image as ImageIcon,
  Check,
  XCircle,
  Upload,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  BadgeDollarSign,
} from "lucide-react";
import TabSpecialty from "../../dashboard/Clinics/TabSpecialty.jsx";
import { toast } from "react-hot-toast";
import TabDoctor from "../../dashboard/Clinics/TabDoctor.jsx";
const API_BASE_URL = "http://localhost:8080/api";
const ASSETS_BASE_URL = "http://localhost:8080";

// Normalize image URL with cache busting
const normalizeImageUrl = (url, addCacheBust = false) => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) {
    const separator = url.includes("?") ? "&" : "?";
    return addCacheBust ? `${url}${separator}_t=${Date.now()}` : url;
  }
  const baseUrl = `${ASSETS_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  const separator = baseUrl.includes("?") ? "&" : "?";
  return addCacheBust ? `${baseUrl}${separator}_t=${Date.now()}` : baseUrl;
};

const tabs = [
  { key: "overview", label: "Overview" },
  { key: "specialty", label: "Specialty" },
  { key: "doctor", label: "Doctor" },
  { key: "schedule", label: "Schedule" },
];

const ManageClinic = () => {
  const [view, setView] = useState("list");
  const [clinics, setClinics] = useState([]);
  const [uploadedPictures, setUploadedPictures] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clinicToDelete, setClinicToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [allSpecialties, setAllSpecialties] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState("");
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    phone: "",
    email: "",
    address: "",
    ward: "",
    district: "",
    city: "",
    latitude: "",
    longitude: "",
    images: "",
    openingTime: "08:00",
    closingTime: "17:00",
    isActive: true,
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagesPreviews, setImagesPreviews] = useState([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  // Fetch clinics
  const fetchClinics = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: 9,
      };
      if (searchTerm) params.search = searchTerm;
      if (filterCity) params.city = filterCity;
      if (filterStatus) params.isActive = filterStatus === "active";

      const response = await axios.get(`${API_BASE_URL}/clinics`, { params });
      console.log("data from clinics 1: ", response.data);
      if (response.data.success) {
        setClinics(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (err) {
      setError("Không thể tải danh sách phòng khám");
      console.error("Error fetching clinics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinics();
  }, [currentPage, filterCity, filterStatus]);

  // Fetch clinic detail
  const fetchClinicDetail = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/clinics/${id}`);
      console.log("data from clinics: ", response.data.specialties);
      if (response.data.success) {
        setSelectedClinic(response.data.data);
        setView("detail");
      }
    } catch (err) {
      setError("Không thể tải chi tiết phòng khám");
      console.error("Error fetching clinic detail:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedClinic || !selectedClinic.id) return;
    async function fetchData() {
      try {
        const [allRes, assignedRes] = await Promise.all([
          axios.get("http://localhost:8080/api/specialties"),
          axios.get(
            `http://localhost:8080/api/clinics/${selectedClinic.id}/specialties`,
          ),
        ]);

        setAllSpecialties(allRes.data?.data || []);
        setSelectedIds(assignedRes.data?.data?.map((s) => s.id) || []);
      } catch (err) {
        console.error("Error loading specialties:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedClinic]);

  const filtered = allSpecialties.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Create clinic
  const handleCreateClinic = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataToSend = {
        ...formData,
        logo: logoUrl || null,
        images:
          uploadedImageUrls.length > 0
            ? JSON.stringify(uploadedImageUrls)
            : null,
      };

      const response = await axios.post(`${API_BASE_URL}/clinics`, dataToSend);

      if (response.data.success) {
        toast.success("Tạo phòng khám thành công!");
        resetForm();
        setView("list");
        fetchClinics();
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Không thể tạo phòng khám",
      );
      console.error("Error creating clinic:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update clinic
  const handleUpdateClinic = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataToSend = {
        ...formData,
        logo: logoUrl || selectedClinic?.logo || null,
        images:
          uploadedImageUrls.length > 0
            ? JSON.stringify(uploadedImageUrls)
            : formData.images,
      };

      const response = await axios.put(
        `${API_BASE_URL}/clinics/${selectedClinic.id}`,
        dataToSend,
      );

      if (response.data.success) {
        toast.success("Cập nhật phòng khám thành công!");
        setView("list");
        fetchClinics();
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Không thể cập nhật phòng khám",
      );
      console.error("Error updating clinic:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete clinic
  const handleDeleteClinic = async () => {
    if (!clinicToDelete) return;

    setLoading(true);
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/clinics/${clinicToDelete.id}`,
      );

      if (response.data.success) {
        alert("Xóa phòng khám thành công!");
        setShowDeleteModal(false);
        setClinicToDelete(null);
        fetchClinics();
      }
    } catch (err) {
      setError(err.response?.data?.error || "Không thể xóa phòng khám");
      console.error("Error deleting clinic:", err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle status
  const handleToggleStatus = async (clinic) => {
    setLoading(true);
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/clinics/${clinic.id}/toggle-status`,
      );

      if (response.data.success) {
        alert("Cập nhật trạng thái thành công!");
        fetchClinics();
      }
    } catch (err) {
      setError("Không thể cập nhật trạng thái");
      console.error("Error toggling status:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Logo file selected:", file.name, file.size);
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload logo to backend
      const formData = new FormData();
      formData.append("logo", file);
      console.log(
        "Sending logo upload to:",
        `${API_BASE_URL}/clinics/upload-logo`,
      );

      axios
        .post(`${API_BASE_URL}/clinics/upload-logo`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000,
        })
        .then((res) => {
          console.log("Logo upload FULL response:", res);
          console.log("Logo upload response.data:", res.data);
          console.log("Logo URL from response:", res.data?.logo);
          if (res.data.success && res.data.logo) {
            setLogoUrl(res.data.logo);
            console.log("Logo URL set to:", res.data.logo);
          } else {
            console.log(
              "Logo upload failed - success:",
              res.data.success,
              "logo:",
              res.data.logo,
            );
          }
        })
        .catch((err) => {
          console.error("Logo upload error:", err);
          console.error("Error response:", err.response?.data);
        });
    }
  };

  const handleImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagesPreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    // Upload images to backend
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    axios
      .post(`${API_BASE_URL}/clinics/upload-images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      })
      .then((res) => {
        console.log("Images upload response:", res.data);
        if (res.data.success && res.data.images) {
          console.log("Setting image URLs:", res.data.images);
          setUploadedImageUrls((prev) => [...prev, ...res.data.images]);
        }
      })
      .catch((err) => {
        console.error("Images upload error:", err);
      });
  };

  const handleImagesEditUpload = async (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagesPreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    // Upload images to backend
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await axios.post(
        `${API_BASE_URL}/clinics/upload-images`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 60000,
        },
      );
      if (res.data.success && res.data.images) {
        setUploadedImageUrls((prev) => [...prev, ...res.data.images]);
      }
    } catch (err) {
      console.error("Images upload error:", err);
    }
  };
  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagesPreviews((prev) => prev.filter((_, i) => i !== index));
    // Also remove from uploaded URLs if index is within uploadedImageUrls range
    if (uploadedImageUrls.length > index) {
      setUploadedImageUrls((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      phone: "",
      email: "",
      address: "",
      ward: "",
      district: "",
      city: "",
      openingTime: "08:00",
      closingTime: "17:00",
      isActive: true,
    });
    setLogoFile(null);
    setLogoPreview(null);
    setLogoUrl(null);
    setImageFiles([]);
    setImagesPreviews([]);
    setUploadedImageUrls([]);
    setError(null);
  };

  const openEditMode = (clinic) => {
    setSelectedClinic(clinic);
    setFormData({
      name: clinic.name || "",
      description: clinic.description || "",
      phone: clinic.phone || "",
      email: clinic.email || "",
      address: clinic.address || "",
      ward: clinic.ward || "",
      district: clinic.district || "",
      city: clinic.city || "",
      images: clinic.images || "",
      openingTime: clinic.openingTime || "08:00",
      closingTime: clinic.closingTime || "17:00",
      isActive: clinic.isActive,
    });
    // Set logo preview from existing clinic logo
    setLogoPreview(clinic.logo ? normalizeImageUrl(clinic.logo) : null);
    setLogoUrl(clinic.logo || null);
    // Parse existing images
    let existingImages = [];
    if (clinic.images) {
      try {
        existingImages =
          typeof clinic.images === "string"
            ? JSON.parse(clinic.images)
            : clinic.images;
      } catch (e) {
        existingImages = clinic.images ? [clinic.images] : [];
      }
    }
    setUploadedImageUrls(existingImages);
    setImageFiles([]);
    setImagesPreviews([]);
    setView("edit");
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchClinics();
  };

  // List View
  if (view === "list") {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <nav className="flex gap-6"></nav>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Manage Clinics
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage the information of the clinics in the system
                </p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setView("create");
                }}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Plus size={20} />
                Add New Clinic
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {/* Filters */}

          {/* Tabs header */}
          <div className="border-b border-gray-200">
            <nav className="flex gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-3 text-sm font-medium border-b-2 transition-colors
                    ${
                      activeTab === tab.key
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }
                    `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-6">
            {activeTab === "overview" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="text"
                        placeholder="Search by name, address..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <select
                    value={filterCity}
                    onChange={(e) => setFilterCity(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All cities</option>
                    <option value="Hà Nội">Ha Noi</option>
                    <option value="TP.HCM">TP.HCM</option>
                    <option value="Đà Nẵng">Da Nang</option>
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                {/* Clinics Grid */}
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Clinic Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Address
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Phone
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Time
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {clinics.map((clinic) => (
                              <tr
                                key={clinic.id}
                                className="hover:bg-gray-50 transition"
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">
                                    {clinic.name}
                                    <Edit
                                      onClick={() => {
                                        setSelectedClinic(clinic);
                                        setActiveTab("specialty");
                                      }}
                                    />
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm text-gray-600">
                                    {clinic.address}, {clinic.district},{" "}
                                    {clinic.city}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-600">
                                    {clinic.phone}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-600">
                                    {clinic.email || "-"}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-600">
                                    {clinic.openingTime} - {clinic.closingTime}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-600">
                                    {clinic.latitude} - {clinic.longitude}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <button
                                    onClick={() => handleToggleStatus(clinic)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      clinic.isActive
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    {clinic.isActive
                                      ? "Hoạt động"
                                      : "Tạm ngưng"}
                                  </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={() =>
                                        fetchClinicDetail(clinic.id)
                                      }
                                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                      title="Xem chi tiết"
                                    >
                                      <Eye size={18} />
                                    </button>
                                    <button
                                      onClick={() => openEditMode(clinic)}
                                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                      title="Chỉnh sửa"
                                    >
                                      <Edit size={18} />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setClinicToDelete(clinic);
                                        setShowDeleteModal(true);
                                      }}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
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
                      </div>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-8 flex justify-center items-center gap-2">
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(1, prev - 1))
                          }
                          disabled={currentPage === 1}
                          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft size={20} />
                        </button>

                        {[...Array(totalPages)].map((_, idx) => (
                          <button
                            key={idx + 1}
                            onClick={() => setCurrentPage(idx + 1)}
                            className={`px-4 py-2 rounded-lg ${
                              currentPage === idx + 1
                                ? "bg-blue-600 text-white"
                                : "border border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {idx + 1}
                          </button>
                        ))}

                        <button
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(totalPages, prev + 1),
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="mt-6">
            {activeTab === "specialty" && selectedClinic && (
              <TabSpecialty
                selectedClinic={selectedClinic}
                setActiveTab={setActiveTab}
              />
            )}
          </div>

          <div className="mt-6">
            {activeTab === "doctor" && selectedClinic && (
              <TabDoctor selectedClinic={selectedClinic} />
            )}
          </div>
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-4">Xác nhận xóa</h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa phòng khám{" "}
                <strong>{clinicToDelete?.name}</strong>? Hành động này không thể
                hoàn tác.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setClinicToDelete(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={loading}
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeleteClinic}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Detail View
  if (view === "detail" && selectedClinic) {
    // Parse images
    let images = [];
    if (selectedClinic.images) {
      try {
        images =
          typeof selectedClinic.images === "string"
            ? JSON.parse(selectedClinic.images)
            : selectedClinic.images;
      } catch (e) {
        images = selectedClinic.images ? [selectedClinic.images] : [];
      }
    }

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => setView("list")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ChevronLeft size={20} />
            Quay lại
          </button>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Header with Logo */}
            <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 relative">
              {selectedClinic.logo ? (
                <img
                  src={normalizeImageUrl(selectedClinic.logo, true)}
                  alt={selectedClinic.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Building2 size={96} className="text-blue-400" />
                </div>
              )}
              <div className="absolute top-4 right-4">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    selectedClinic.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {selectedClinic.isActive ? "Đang hoạt động" : "Tạm ngưng"}
                </span>
              </div>
            </div>

            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {selectedClinic.name}
                  </h1>
                  <p className="text-gray-600">{selectedClinic.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditMode(selectedClinic)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Edit size={18} />
                    Chỉnh sửa
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Thông tin liên hệ
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin size={20} className="text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium">Địa chỉ</p>
                        <p className="text-gray-600">
                          {selectedClinic.address}
                          {selectedClinic.ward && `, ${selectedClinic.ward}`}
                          {selectedClinic.district &&
                            `, ${selectedClinic.district}`}
                          {selectedClinic.city && `, ${selectedClinic.city}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={20} className="text-gray-400" />
                      <div>
                        <p className="font-medium">Số điện thoại</p>
                        <p className="text-gray-600">{selectedClinic.phone}</p>
                      </div>
                    </div>
                    {selectedClinic.email && (
                      <div className="flex items-center gap-3">
                        <Mail size={20} className="text-gray-400" />
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-gray-600">
                            {selectedClinic.email}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Clock size={20} className="text-gray-400" />
                      <div>
                        <p className="font-medium">Giờ làm việc</p>
                        <p className="text-gray-600">
                          {selectedClinic.openingTime} -{" "}
                          {selectedClinic.closingTime}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Thống kê</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Bác sĩ</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedClinic._count?.doctors || 0}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Lịch hẹn</p>
                      <p className="text-2xl font-bold text-green-600">
                        {selectedClinic._count?.appointments || 0}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">Chuyên khoa</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {selectedClinic._count?.specialties || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gallery */}
              {images.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Hình ảnh</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((img, idx) => (
                      <img
                        key={idx}
                        src={normalizeImageUrl(img, true)}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Create/Edit Form
  if (view === "create" || view === "edit") {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setView("list")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ChevronLeft size={20} />
            Quay lại
          </button>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold mb-6">
              {view === "create"
                ? "Thêm Phòng Khám Mới"
                : "Chỉnh Sửa Phòng Khám"}
            </h2>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            <form
              onSubmit={
                view === "create" ? handleCreateClinic : handleUpdateClinic
              }
            >
              {/* Logo Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo phòng khám
                </label>
                <div className="flex items-center gap-4">
                  {logoPreview && (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <Upload size={20} />
                    <span>
                      {view === "create" ? "Chọn logo" : "Thay đổi logo"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Images Upload */}
              {view === "create" && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hình ảnh phòng khám
                  </label>
                  <div className="mb-4">
                    <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 inline-flex">
                      <ImageIcon size={20} />
                      <span>Thêm hình ảnh</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImagesUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {(imagesPreviews.length > 0 ||
                    uploadedImageUrls.length > 0) && (
                    <div className="grid grid-cols-4 gap-4">
                      {uploadedImageUrls.map((url, idx) => (
                        <div key={`uploaded-${idx}`} className="relative">
                          <img
                            src={normalizeImageUrl(url, true)}
                            alt={`Uploaded ${idx}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setUploadedImageUrls((prev) =>
                                prev.filter((_, i) => i !== idx),
                              );
                            }}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                      {imagesPreviews.map((preview, idx) => (
                        <div key={`preview-${idx}`} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${idx}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên phòng khám <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thành phố <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phường/Xã
                  </label>
                  <input
                    type="text"
                    name="ward"
                    value={formData.ward}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quận/Huyện
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Min
                  </label>
                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Max
                  </label>
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giờ mở cửa
                  </label>
                  <input
                    type="time"
                    name="openingTime"
                    value={formData.openingTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giờ đóng cửa
                  </label>
                  <input
                    type="time"
                    name="closingTime"
                    value={formData.closingTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-full">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm/6 font-medium text-gray-900"
                  >
                    Cover photo
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        data-slot="icon"
                        aria-hidden="true"
                        className="mx-auto size-12 text-gray-300"
                      >
                        <path
                          d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
                          clipRule="evenodd"
                          fillRule="evenodd"
                        />
                      </svg>
                      <div className="mt-4 flex text-sm/6 text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-600 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-600 hover:text-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="images"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImagesEditUpload}
                            className="hidden"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs/5 text-gray-600">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                  {/* Show existing and new images */}
                  {(uploadedImageUrls.length > 0 ||
                    imagesPreviews.length > 0) && (
                    <div className="mt-4 grid grid-cols-4 gap-4">
                      {uploadedImageUrls.map((url, idx) => (
                        <div key={`existing-${idx}`} className="relative">
                          <img
                            src={normalizeImageUrl(url, true)}
                            alt={`Existing ${idx}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setUploadedImageUrls((prev) =>
                                prev.filter((_, i) => i !== idx),
                              )
                            }
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                      {imagesPreviews.map((preview, idx) => (
                        <div key={`new-${idx}`} className="relative">
                          <img
                            src={preview}
                            alt={`New ${idx}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Phòng khám đang hoạt động
                    </span>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={loading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading
                    ? "Đang xử lý..."
                    : view === "create"
                      ? "Tạo phòng khám"
                      : "Cập nhật"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
};

export default ManageClinic;

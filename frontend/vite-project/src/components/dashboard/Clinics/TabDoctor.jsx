/** @format */

import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

// ===== TAB DOCTOR =====
export default function TabDoctor({ selectedClinic }) {
  const [allDoctors, setAllDoctors] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch all doctors + clinic doctors
  useEffect(() => {
    if (!selectedClinic || !selectedClinic.id) return;

    async function fetchData() {
      try {
        setLoading(true);

        const [allRes, assignedRes] = await Promise.all([
          axios.get("http://localhost:8080/api/doctors"),
          axios.get(
            `http://localhost:8080/api/clinics/${selectedClinic.id}/doctors`,
          ),
        ]);
        console.log("data from tab doctor", allRes.data);
        // Danh sách tất cả bác sĩ
        setAllDoctors(allRes.data?.data?.items || []);

        // Những doctor đã gán vào clinic
        setSelectedIds((assignedRes.data?.data?.items || []).map((d) => d.id));
      } catch (err) {
        console.error("Lỗi load bác sĩ:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedClinic]);

  // Toggle chọn doctor
  const toggleDoctor = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  // Lưu doctor vào clinic
  const handleSave = async () => {
    if (!selectedClinic || !selectedClinic.id) return;

    try {
      setSaving(true);

      await axios.post(
        `http://localhost:8080/api/clinics/${selectedClinic.id}/doctors`,
        { doctorIds: selectedIds },
      );

      toast.success("Cập nhật bác sĩ thành công 🎉");
    } catch (err) {
      toast.error("Lưu thất bại!");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold text-lg">
        Doctors of clinic: {selectedClinic?.name}
      </h3>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {allDoctors.map((d) => (
            <label
              key={d.id}
              className="flex items-center space-x-2 border p-2 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(d.id)}
                onChange={() => toggleDoctor(d.id)}
              />
              <span>
                {d.user?.firstName} {d.user?.lastName}
              </span>
            </label>
          ))}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        {saving ? "Saving..." : "Save changes"}
      </button>
    </div>
  );
}

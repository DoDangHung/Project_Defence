/** @format */

import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function TabSpecialty({ selectedClinic, setActiveTab }) {
  const [allSpecialties, setAllSpecialties] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!selectedClinic || !selectedClinic.id) return;

    async function fetchData() {
      try {
        setLoading(true);
        const [allRes, assignedRes] = await Promise.all([
          axios.get("http://localhost:8080/api/specialties"),
          axios.get(
            `http://localhost:8080/api/clinics/${selectedClinic.id}/specialties`,
          ),
        ]);

        // Tất cả specialties
        setAllSpecialties(allRes.data?.data || []);

        // Những specialty thuộc clinic
        setSelectedIds((assignedRes.data?.data || []).map((s) => s.id));
      } catch (err) {
        console.error("Specialist loading error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedClinic]);

  // Toggle chọn
  const toggleSpecialty = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  async function handleNext() {
    if (!selectedClinic || !selectedClinic.id) return;

    try {
      setSaving(true);
      await axios.post(
        `http://localhost:8080/api/clinics/${selectedClinic.id}/specialties`,
        { specialtyIds: selectedIds },
      );

      toast.success(
        "Specialist saved successfully. Continue to select doctor 👉",
      );

      // Chuyển sang tab doctor
      setActiveTab("doctor");
    } catch (err) {
      toast.error("Save failed!");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  // Save
  const handleSave = async () => {
    if (!selectedClinic || !selectedClinic.id) return;

    try {
      setSaving(true);

      await axios.post(
        `http://localhost:8080/api/clinics/${selectedClinic.id}/specialties`,
        { specialtyIds: selectedIds },
      );

      toast.success("Save specialist list successfully 🎉");
    } catch (err) {
      toast.error("Save failed!");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold text-lg">
        Specialist of clinic: {selectedClinic?.name}
      </h3>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {allSpecialties.map((s) => (
            <label
              key={s.id}
              className="flex items-center space-x-2 border p-2 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(s.id)}
                onChange={() => toggleSpecialty(s.id)}
              />
              <span>{s.name}</span>
            </label>
          ))}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {saving ? "Saving..." : "Save changes"}
      </button>

      <button
        onClick={handleNext}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Continue
      </button>
    </div>
  );
}

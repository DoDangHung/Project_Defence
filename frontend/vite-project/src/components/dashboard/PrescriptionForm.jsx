import React from 'react';
import { useState } from 'react';

export default function PrescriptionForm() {
  const [medicines, setMedicines] = useState([
    { name: '', dosage: '', frequency: '', duration: '' },
  ]);

  const addMedicine = () => {
    setMedicines([
      ...medicines,
      { name: '', dosage: '', frequency: '', duration: '' },
    ]);
  };

  const removeMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className=" mx-auto bg-white rounded-xl shadow p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Create Prescription
          </h1>
          <p className="text-sm text-gray-500">
            Patient: John Doe • Visit: Cardiology - 12/10/2025
          </p>
        </div>

        {/* Diagnosis */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Diagnosis
          </label>
          <textarea
            className="mt-2 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Enter diagnosis"
          />
        </div>

        {/* Medicines */}
        <div>
          <h2 className="text-lg font-medium text-gray-800 mb-2">Medicines</h2>

          <div className="space-y-3">
            {medicines.map((_, index) => (
              <div key={index} className="grid grid-cols-5 gap-3 items-center">
                <input
                  className="border rounded-lg p-2"
                  placeholder="Medicine name"
                />
                <input className="border rounded-lg p-2" placeholder="Dosage" />
                <input
                  className="border rounded-lg p-2"
                  placeholder="Frequency"
                />
                <input
                  className="border rounded-lg p-2"
                  placeholder="Duration"
                />
                <button
                  onClick={() => removeMedicine(index)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addMedicine}
            className="mt-3 px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
          >
            + Add Medicine
          </button>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            className="mt-2 w-full rounded-lg border border-gray-300 p-3"
            rows={3}
            placeholder="Additional instructions"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button className="px-4 py-2 border rounded-lg text-sm">
            Save Draft
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            Sign & Complete
          </button>
        </div>
      </div>
    </div>
  );
}

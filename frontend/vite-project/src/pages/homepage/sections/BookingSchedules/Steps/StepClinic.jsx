import React from 'react';
import { MapPin, Building2, Navigation } from 'lucide-react';
const StepClinic = ({
  step,
  setStep,
  selectedSpecialty,
  filteredClinics,
  handleInputChange,
  bookingData,
}) => {
  return (
    <>
      {step === 2 && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Chọn phòng khám
            </h2>
            <p className="text-gray-600 mt-1">
              Chuyên khoa:{' '}
              <span className="font-semibold text-blue-600">
                {selectedSpecialty?.name}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {filteredClinics.map((clinic) => (
              <button
                key={clinic.id}
                onClick={() => handleInputChange('clinic', clinic.id)}
                className={`w-full p-5 rounded-xl border-2 text-left transition-all hover:shadow-lg ${
                  bookingData.clinic === clinic.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {clinic.name}
                        </h3>
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          {clinic.address}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="flex items-center text-yellow-500 text-sm">
                          <span className="font-semibold">
                            ★ {clinic.rating}
                          </span>
                        </div>
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <Navigation className="w-4 h-4 mr-1" />
                          {clinic.distance}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Quay lại
            </button>
            <button
              onClick={() => bookingData.clinic && setStep(3)}
              disabled={!bookingData.clinic}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
            >
              Tiếp tục
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default StepClinic;

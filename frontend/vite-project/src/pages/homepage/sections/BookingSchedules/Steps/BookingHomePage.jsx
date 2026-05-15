/** @format */

import React from "react";
import { CheckCircle } from "lucide-react";

const steps = [
  "Select clinic",
  "Select specialty",
  "Select doctor",
  "Login",
  "Patient information",
  "Payment",
  "Complete",
];

export default function BookingHomePage({ step = 1 }) {
  return (
    <div className="mb-8">
      {/* Desktop Progress */}
      <div className="hidden md:flex items-center justify-center">
        {steps.map((label, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < step;
          const isCurrent = stepNum === step;

          return (
            <React.Fragment key={index}>
              {/* Step */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    isCompleted
                      ? "bg-blue-600 text-white"
                      : isCurrent
                        ? "bg-blue-600 text-white ring-4 ring-blue-100"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {isCompleted ? <CheckCircle className="w-6 h-6" /> : stepNum}
                </div>
                <span
                  className={`text-xs mt-2 text-center max-w-[80px] ${
                    isCurrent ? "font-semibold text-blue-600" : "text-gray-500"
                  }`}
                >
                  {label}
                </span>
              </div>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div
                  className={`h-1 w-12 md:w-20 mx-2 rounded ${
                    isCompleted ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile Progress */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-blue-600">
            Bước {step} / {steps.length}
          </span>
          <span className="text-sm text-gray-500">{steps[step - 1]}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

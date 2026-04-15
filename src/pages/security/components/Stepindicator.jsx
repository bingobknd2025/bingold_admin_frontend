import { CheckCircle } from "lucide-react";

const STEPS = [
  { id: 1, label: "Verify" },
  { id: 2, label: "OTP & Password" },
];

export default function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, i) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
              style={{
                background:
                  currentStep > step.id
                    ? "#10b981"
                    : currentStep === step.id
                      ? "#2563eb"
                      : "#e2e8f0",
                color: currentStep >= step.id ? "#fff" : "#94a3b8",
              }}
            >
              {currentStep > step.id ? <CheckCircle size={14} /> : step.id}
            </div>
            <span
              className="text-xs mt-1 font-medium transition-colors duration-300"
              style={{
                color:
                  currentStep === step.id
                    ? "#2563eb"
                    : currentStep > step.id
                      ? "#10b981"
                      : "#94a3b8",
              }}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className="w-16 h-0.5 mb-4 mx-1 transition-all duration-500"
              style={{
                background: currentStep > step.id ? "#10b981" : "#e2e8f0",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

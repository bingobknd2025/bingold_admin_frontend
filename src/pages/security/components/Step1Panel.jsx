import { ArrowRight } from "lucide-react";
import PasswordInput from "./PasswordInput";

export default function Step1Panel({ currentPassword, onChange, onSubmit, isPending }) {
  return (
    <div className="space-y-4 max-w-md">
      <div>
        <label
          htmlFor="current-password"
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          Current Password
        </label>
        <PasswordInput
          id="current-password"
          value={currentPassword}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your current password"
          testId="current-password-input"
        />
      </div>

      <button
        onClick={onSubmit}
        disabled={!currentPassword || isPending}
        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-lg transition-all flex items-center gap-2"
        data-testid="get-otp-btn"
      >
        {isPending ? "Sending…" : "Get OTP"} <ArrowRight size={16} />
      </button>
    </div>
  );
}
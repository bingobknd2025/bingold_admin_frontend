import { CheckCircle, RotateCcw } from "lucide-react";

export default function SuccessView({ onReset }) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1
          className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight"
          data-testid="security-title"
        >
          Security Settings
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Manage your account security and authentication
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-12 flex flex-col items-center text-center gap-4">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
          <CheckCircle className="text-emerald-600" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Password Updated!</h2>
        <p className="text-slate-500 max-w-sm">
          Your password has been changed successfully. Please use your new
          password on your next login.
        </p>
        <button
          onClick={onReset}
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-all flex items-center gap-2"
        >
          <RotateCcw size={16} /> Back to Security Settings
        </button>
      </div>
    </div>
  );
}
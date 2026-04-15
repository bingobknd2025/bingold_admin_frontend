import { Image, Hash, Calendar } from "lucide-react";
import ExpiryBadge from "../common/ExpiryBadge";

const DocRow = ({ label, number, expiry, fileUrl, onView }) => {
  return (
    <div className="border border-gray-100 rounded-lg p-3 sm:p-4 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs sm:text-sm font-semibold text-gray-800">
          {label}
        </p>

        {fileUrl && (
          <button
            type="button"
            onClick={() => onView(fileUrl, label)}
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Image className="w-3.5 h-3.5" />
            View
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Hash className="w-3 h-3 text-gray-400 shrink-0" />
          <span className="font-mono">
            {number || <span className="italic text-gray-300">No number</span>}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Calendar className="w-3 h-3 text-gray-400 shrink-0" />
          <ExpiryBadge date={expiry} />
        </div>
      </div>
    </div>
  );
};

export default DocRow;

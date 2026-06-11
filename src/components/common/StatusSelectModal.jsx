import { useState } from "react";
import { X } from "lucide-react";

// Generic modal to pick a status (and optionally enter notes) and confirm.
// options: [{ value, label }]
const StatusSelectModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Change Status",
  label = "Status",
  options = [],
  initialValue = "",
  isLoading = false,
  noteLabel,
  noteRequired = false,
  extraFields = null,
}) => {
  const [value, setValue] = useState(initialValue);
  const [note, setNote] = useState("");

  // Reset fields each time the modal transitions to open (render-phase reset,
  // the React-recommended alternative to a setState-in-effect).
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      setValue(initialValue || options[0]?.value || "");
      setNote("");
    }
  }

  if (!isOpen) return null;

  const canSubmit =
    !!value && (!noteRequired || note.trim().length > 0) && !isLoading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <select
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm"
            >
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {extraFields}

          {noteLabel && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {noteLabel}
                {noteRequired && " *"}
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm({ value, note })}
            disabled={!canSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusSelectModal;

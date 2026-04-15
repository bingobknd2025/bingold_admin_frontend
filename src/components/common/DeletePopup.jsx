import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

const DeletePopup = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
}) => {
  const [input, setInput] = useState("");

  if (!isOpen) return null;

  const isMatch = input === message;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {title || "Delete Confirmation"}
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-gray-600">
            This action is permanent. To confirm deletion, type{" "}
            <span className="font-semibold text-gray-900">{message}</span>{" "}
            below.
          </p>

          {/* GitHub-style input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Type "${message}" to confirm`}
            disabled={isLoading}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-500
                       disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          {!isMatch && input.length > 0 && (
            <p className="text-sm text-red-600">
              Text does not match. Please type exactly.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center rounded-xl justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={!isMatch || isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg 
                       hover:bg-red-700 transition-colors 
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;

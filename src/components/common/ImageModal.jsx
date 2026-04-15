import { X, ZoomIn, ExternalLink } from "lucide-react";
import { useEffect } from "react";

const ImageModal = ({ isOpen, onClose, url, label }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !url) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 w-full sm:max-w-3xl sm:mx-4 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate max-w-[160px] sm:max-w-xs">
                  {label}
                </p>
                <p className="text-xs text-gray-400">Document Preview</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xs:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Open Original</span>
                <span className="sm:hidden">Open</span>
              </a>
              {/* Mobile-only external link icon */}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="xs:hidden w-7 h-7 flex items-center justify-center rounded-lg text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={onClose}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="bg-gray-50 flex items-center justify-center p-3 sm:p-4 min-h-48 sm:min-h-64 max-h-[60vh] sm:max-h-[75vh] overflow-auto">
            <img
              src={url}
              alt={label}
              className="max-w-full max-h-[55vh] sm:max-h-[70vh] object-contain rounded-lg shadow-md"
            />
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-5 py-2.5 sm:py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
            <p className="text-xs text-gray-400 truncate flex-1 min-w-0">
              {url}
            </p>
            <button
              onClick={onClose}
              className="shrink-0 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;

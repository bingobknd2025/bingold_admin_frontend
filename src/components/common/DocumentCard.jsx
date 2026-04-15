import { Download } from "lucide-react";

const DocumentCard = ({ title, number, expiry, file, fileName }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isExpiringSoon = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  const getExpiryBadge = (expiryDate) => {
    if (isExpired(expiryDate)) {
      return (
        <span className="text-xs text-center bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium whitespace-nowrap">
          Expired
        </span>
      );
    }
    if (isExpiringSoon(expiryDate)) {
      return (
        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium whitespace-nowrap">
          Expiring Soon
        </span>
      );
    }
    return (
      <span className="text-xs text-center bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium whitespace-nowrap">
        Valid
      </span>
    );
  };

  const handleDownload = (fileUrl, fileName) => {
    const baseUrl = import.meta.env.VITE_BASE_IMAGE_URL;
    window.open(`${baseUrl}${fileUrl}`, "_blank");
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg gap-3">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 text-sm sm:text-base">
          {title}
        </p>
        <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">
          Number: {number}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <div className="flex flex-col sm:text-right w-full sm:w-auto">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">
            Expires: {formatDate(expiry)}
          </p>
          {getExpiryBadge(expiry)}
        </div>
        {file && (
          <button
            onClick={() => handleDownload(file, fileName)}
            className="p-2 hover:bg-blue-100 rounded-lg transition-colors self-start sm:self-auto"
            title={`Download ${title}`}
          >
            <Download size={18} className="text-blue-600" />
          </button>
        )}
      </div>
    </div>
  );
};

export default DocumentCard;

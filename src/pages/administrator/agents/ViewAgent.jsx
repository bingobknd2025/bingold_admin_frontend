import { useLocation, useNavigate } from "react-router-dom";

const ViewAgent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.item;

  if (!item) return <div className="p-6">No Data available.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Agent Details</h2>
        <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Back</button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">

        <div className="flex flex-col md:flex-row gap-6 border-b pb-6">
          <div className="flex flex-col items-center gap-2">
            {item.photo ? (
              <img
                src={item.photo}
                alt={item.name}
                className="w-32 h-32 object-cover rounded-full border border-gray-200"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-100 border flex items-center justify-center text-3xl text-gray-400">
                {item.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
            )}
            <p className="text-xs text-gray-500">Photo</p>
          </div>

          {item.qr_code && (
            <div className="flex flex-col items-center gap-2">
              <a href={item.qr_code} target="_blank" rel="noreferrer">
                <img
                  src={item.qr_code}
                  alt="QR"
                  className="w-32 h-32 object-cover rounded border border-gray-200"
                />
              </a>
              <p className="text-xs text-gray-500">QR Code</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
          <div><p className="text-sm text-gray-500">Name</p><p className="font-medium">{item.name}</p></div>
          <div><p className="text-sm text-gray-500">Unique Code</p><p className="font-medium font-mono">{item.unique_code}</p></div>
          <div><p className="text-sm text-gray-500">Role</p><p className="font-medium">{item.role || '-'}</p></div>
          <div><p className="text-sm text-gray-500">Region</p><p className="font-medium">{item.region || '-'}</p></div>
          <div>
            <p className="text-sm text-gray-500">Expiry Date</p>
            <p className="font-medium">{item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
              item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {item.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><p className="text-sm text-gray-500">Creator</p><p className="font-medium">{item.creator?.name || '-'}</p></div>
          <div><p className="text-sm text-gray-500">Updater</p><p className="font-medium">{item.updater?.name || '-'}</p></div>
          <div><p className="text-sm text-gray-500">Created At</p><p className="font-medium">{item.created_at ? new Date(item.created_at).toLocaleString() : '-'}</p></div>
          <div><p className="text-sm text-gray-500">Updated At</p><p className="font-medium">{item.updated_at ? new Date(item.updated_at).toLocaleString() : '-'}</p></div>
        </div>
      </div>
    </div>
  );
};

export default ViewAgent;

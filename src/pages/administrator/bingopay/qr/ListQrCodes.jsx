import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, Plus, Power, X } from "lucide-react";
import {
  useListQrCodes,
  useChangeQrStatus,
} from "../../../../api/administrator/bingopay/qr";
import Pagination from "../../../../components/common/Pagination";
import StatusBadge from "../../../../components/common/StatusBadge";

const ListQrCodes = () => {
  const navigate = useNavigate();
  const limit = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const [vendorId, setVendorId] = useState("");
  const [qrType, setQrType] = useState("");

  const filters = {
    page: currentPage,
    limit,
    ...(vendorId && { vendor_id: Number(vendorId) }),
    ...(qrType && { qr_type: qrType }),
  };

  const { data, isLoading, isError, refetch } = useListQrCodes(filters);
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const { mutate: changeStatus, isPending } = useChangeQrStatus();

  const handleToggle = (item) => {
    changeStatus(
      { id: item.id, status: !item.status },
      {
        onSuccess: () => {
          toast.success("QR status updated!");
          refetch();
        },
        onError: (err) =>
          toast.error(err?.response?.data?.message || "Error updating status"),
      },
    );
  };

  if (isLoading) return <div className="p-6">Loading QR codes...</div>;
  if (isError) return <div className="p-6">Error loading QR codes.</div>;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Payment QR Codes</h2>
        <button
          onClick={() => navigate("/admin/bingopay/qr/create")}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create QR
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative max-w-[180px]">
          <input
            type="number"
            value={vendorId}
            onChange={(e) => {
              setVendorId(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Vendor ID"
            className="w-full pr-9 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {vendorId && (
            <button
              onClick={() => setVendorId("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <select
          value={qrType}
          onChange={(e) => {
            setQrType(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Types</option>
          <option value="static">Static</option>
          <option value="dynamic">Dynamic</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QR</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Label</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.data?.length > 0 ? (
                data.data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.qr_image || item.qr_code ? (
                        <a href={item.qr_image || item.qr_code} target="_blank" rel="noreferrer">
                          <img src={item.qr_image || item.qr_code} alt="QR" className="w-12 h-12 object-cover rounded border border-gray-200" />
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.vendor?.business_name || item.vendor_id || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{item.qr_type || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.amount ?? "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.coin || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.label || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge isActive={!!item.status} /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-3 items-center">
                        <button
                          className="text-green-600 hover:text-green-900"
                          onClick={() => navigate("/admin/bingopay/qr/view", { state: { item } })}
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className={`${item.status ? "text-red-600 hover:text-red-900" : "text-emerald-600 hover:text-emerald-900"} disabled:opacity-50`}
                          onClick={() => handleToggle(item)}
                          disabled={isPending}
                          title={item.status ? "Disable" : "Enable"}
                        >
                          <Power size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-10 text-center text-sm text-gray-500">
                    No QR codes found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        itemsPerPage={limit}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ListQrCodes;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, Search, ShieldCheck, UserPlus, X } from "lucide-react";
import {
  useListBingopayUsers,
  useChangeBingopayUserStatus,
  useCheckBingold,
} from "../../../../api/administrator/bingopay/users";
import Pagination from "../../../../components/common/Pagination";
import StatusBadge from "../../../../components/common/StatusBadge";
import StatusSelectModal from "../../../../components/common/StatusSelectModal";

const ACCOUNT_TYPES = [
  { value: "", label: "All Account Types" },
  { value: "customer", label: "Customer" },
  { value: "vendor", label: "Vendor" },
  { value: "merchant_staff", label: "Merchant Staff" },
];

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
  { value: "suspended", label: "Suspended" },
];

const ListBingopayUsers = () => {
  const navigate = useNavigate();
  const limit = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [accountType, setAccountType] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 800);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const filters = {
    page: currentPage,
    limit,
    ...(search && { search }),
    ...(accountType && { account_type: accountType }),
    ...(statusFilter && { status: statusFilter }),
  };

  const { data, isLoading, isError, refetch } = useListBingopayUsers(filters);
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  // Change status modal
  const [statusModal, setStatusModal] = useState({ isOpen: false, user: null });
  const { mutate: changeStatus, isPending: isChanging } =
    useChangeBingopayUserStatus();

  const handleChangeStatus = ({ value }) => {
    changeStatus(
      { id: statusModal.user.id, status: value },
      {
        onSuccess: () => {
          toast.success("User status updated!");
          setStatusModal({ isOpen: false, user: null });
          refetch();
        },
        onError: (err) =>
          toast.error(err?.response?.data?.message || "Error updating status"),
      },
    );
  };

  // Check BinGold modal
  const [checkModal, setCheckModal] = useState(false);
  const [checkEmail, setCheckEmail] = useState("");
  const { mutate: checkBingold, isPending: isChecking } = useCheckBingold();

  const handleCheckBingold = () => {
    if (!checkEmail.trim()) {
      toast.error("Email is required");
      return;
    }
    checkBingold(checkEmail.trim(), {
      onSuccess: (res) => {
        toast.success(res?.message || "Checked against BinGold");
        setCheckModal(false);
        setCheckEmail("");
        refetch();
      },
      onError: (err) =>
        toast.error(err?.response?.data?.message || "Error checking email"),
    });
  };

  if (isLoading) return <div className="p-6">Loading users...</div>;
  if (isError) return <div className="p-6">Error loading users.</div>;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">BingoPay Users</h2>
        <button
          onClick={() => setCheckModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Check BinGold Email
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative max-w-sm flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <select
          value={accountType}
          onChange={(e) => {
            setAccountType(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          {ACCOUNT_TYPES.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Status</option>
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KYC</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.data?.length > 0 ? (
                data.data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name || item.full_name || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.email || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.phone || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{(item.account_type || "-").replace("_", " ")}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <StatusBadge status={item.kyc_status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-3 items-center">
                        <button
                          className="text-green-600 hover:text-green-900"
                          onClick={() =>
                            navigate("/admin/bingopay/users/view", {
                              state: { item },
                            })
                          }
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => setStatusModal({ isOpen: true, user: item })}
                          title="Change Status"
                        >
                          <ShieldCheck size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-sm text-gray-500">
                    No users found
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

      <StatusSelectModal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ isOpen: false, user: null })}
        onConfirm={handleChangeStatus}
        title="Change User Status"
        options={STATUS_OPTIONS}
        initialValue={statusModal.user?.status}
        isLoading={isChanging}
      />

      {/* Check BinGold modal */}
      {checkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setCheckModal(false)}
          />
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Check BinGold Email</h3>
              <button onClick={() => setCheckModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <p className="text-sm text-gray-600">
                Check an email against BinGold and persist the mapping if the user exists.
              </p>
              <input
                type="email"
                value={checkEmail}
                onChange={(e) => setCheckEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
            <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => setCheckModal(false)}
                disabled={isChecking}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckBingold}
                disabled={isChecking}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isChecking ? "Checking..." : "Check"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListBingopayUsers;

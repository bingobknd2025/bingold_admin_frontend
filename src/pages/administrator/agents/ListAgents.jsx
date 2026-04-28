import { Eye, Pencil, Plus, RefreshCw, Search, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useListAllAgents } from "../../../api/administrator/agents/getAllAgents";
import { useDeleteAgent } from "../../../api/administrator/agents/deleteAgent";
import { useRegenerateQr } from "../../../api/administrator/agents/regenerateQr";
import Pagination from "../../../components/common/Pagination";
import DeletePopup from "../../../components/common/DeletePopup";
import { useDeleteModal } from "../../../hooks/useDeleteModal";
import { useDeleteHandler } from "../../../hooks/useDeleteHandler";

const ListAgents = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const limit = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError, refetch } = useListAllAgents(
    currentPage,
    limit,
    search,
  );

  const permissionModule = useSelector((state) => state.permission.permissions);

  const hasModule = (slugName) => {
    return permissionModule?.some(
      (permission) => permission.slug?.toLowerCase() === slugName.toLowerCase(),
    );
  };

  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  const { mutate: deleteItem, isPending } = useDeleteAgent();
  const { deleteModal, openDeleteModal, closeDeleteModal } = useDeleteModal();
  const { handleDelete } = useDeleteHandler(
    deleteItem,
    refetch,
    closeDeleteModal,
    "Agent deleted successfully!",
  );

  const { mutate: regenerateQr, isPending: isRegenerating } = useRegenerateQr();
  const [regeneratingId, setRegeneratingId] = useState(null);

  const handleRegenerateQr = (id) => {
    setRegeneratingId(id);
    regenerateQr(id, {
      onSuccess: () => {
        toast.success("QR code regenerated successfully!");
        refetch();
        setRegeneratingId(null);
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Error regenerating QR");
        setRegeneratingId(null);
      },
    });
  };

  if (isLoading) return <div className="p-6">Loading agents...</div>;
  if (isError) return <div className="p-6">Error loading agents.</div>;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Agents</h2>
        {hasModule("agent.create") && (
          <button
            onClick={() => navigate("/admin/agents/create")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Agent
          </button>
        )}
      </div>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, code, role..."
            className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput("");
                setSearch("");
                setCurrentPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unique Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QR</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creator</th>
                {(hasModule("agent.view") || hasModule("agent.update") || hasModule("agent.delete")) && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {data?.data?.length > 0 ? (
                data.data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.photo ? (
                        <img
                          src={item.photo}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-full border border-gray-200"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-full border border-gray-200 flex items-center justify-center text-xs text-gray-400">
                          {item.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{item.unique_code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.role || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.region || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.qr_code ? (
                        <a href={item.qr_code} target="_blank" rel="noreferrer">
                          <img
                            src={item.qr_code}
                            alt="QR"
                            className="w-12 h-12 object-cover rounded border border-gray-200"
                          />
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                        item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.creator?.name ?? "-"}
                    </td>
                    {(hasModule("agent.view") || hasModule("agent.update") || hasModule("agent.delete")) && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-3 items-center">
                          {hasModule("agent.view") && (
                            <button
                              className="text-green-600 hover:text-green-900"
                              onClick={() => navigate(`/admin/agents/view`, { state: { item } })}
                              title="View"
                            >
                              <Eye size={18} />
                            </button>
                          )}
                          {hasModule("agent.update") && (
                            <button
                              className="text-blue-600 hover:text-blue-900"
                              onClick={() => navigate(`/admin/agents/edit`, { state: { item } })}
                              title="Edit"
                            >
                              <Pencil size={18} />
                            </button>
                          )}
                          {hasModule("agent.update") && (
                            <button
                              className="text-purple-600 hover:text-purple-900 disabled:opacity-50"
                              onClick={() => handleRegenerateQr(item.id)}
                              disabled={isRegenerating && regeneratingId === item.id}
                              title="Regenerate QR"
                            >
                              <RefreshCw
                                size={18}
                                className={isRegenerating && regeneratingId === item.id ? "animate-spin" : ""}
                              />
                            </button>
                          )}
                          {hasModule("agent.delete") && (
                            <button
                              className="text-red-600 hover:text-red-900"
                              onClick={() => openDeleteModal(item.id)}
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="px-6 py-10 text-center text-sm text-gray-500">
                    {search ? `No agents found for "${search}"` : "No agents found"}
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

      <DeletePopup
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() => handleDelete(deleteModal.id)}
        title="Delete Agent"
        message="Are you sure you want to delete this agent?"
        isLoading={isPending}
      />
    </div>
  );
};

export default ListAgents;

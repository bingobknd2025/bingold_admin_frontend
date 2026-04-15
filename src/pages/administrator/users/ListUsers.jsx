import { Eye, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useListAllUsers } from "../../../api/administrator/user/getAllUsers";
import Pagination from "../../../components/common/Pagination";
import { useDeleteUser } from "../../../api/administrator/user/deleteUser";
import DeletePopup from "../../../components/common/DeletePopup";
import { useDeleteModal } from "../../../hooks/useDeleteModal";
import { useDeleteHandler } from "../../../hooks/useDeleteHandler";
import { useSelector } from "react-redux";

const ListUsers = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const limit = 10;

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError, refetch } = useListAllUsers(
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

  const { mutate: deleteUser, isPending } = useDeleteUser();
  const { deleteModal, openDeleteModal, closeDeleteModal } = useDeleteModal();
  const { handleDelete } = useDeleteHandler(
    deleteUser,
    refetch,
    closeDeleteModal,
    "User deleted successfully!",
  );

  if (isLoading) return <div className="p-6">Loading users...</div>;
  if (isError) return <div className="p-6">Error loading users.</div>;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Users</h2>
        {hasModule("user.create") && (
          <button
            onClick={() => navigate("/admin/users/create")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create User
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or email..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Role Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Creator Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updater Name
                </th>
                {(hasModule("user.view") ||
                  hasModule("user.update") ||
                  hasModule("user.delete")) && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {data?.users?.length > 0 ? (
                data.users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.user_role?.name ?? "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.creator?.name ?? "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.updater?.name ?? "-"}
                    </td>
                    {(hasModule("user.view") ||
                      hasModule("user.update") ||
                      hasModule("user.delete")) && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-3">
                        {hasModule("user.view") && (
                          <button
                            className="text-green-600 hover:text-green-900"
                            onClick={() =>
                              navigate(`/admin/users/view`, { state: { user } })
                            }
                          >
                            <Eye size={18} />
                          </button>
                        )}
                        {hasModule("user.update") && (
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() =>
                              navigate(`/admin/users/edit`, { state: { user } })
                            }
                          >
                            <Pencil size={18} />
                          </button>
                        )}
                        {hasModule("user.delete") && (
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => openDeleteModal(user.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-10 text-center text-sm text-gray-500"
                  >
                    {search
                      ? `No users found for "${search}"`
                      : "No users found"}
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
        title="Delete User"
        message="Delete"
        isLoading={isPending}
      />
    </div>
  );
};

export default ListUsers;

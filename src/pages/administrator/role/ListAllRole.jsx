import { useEffect, useState } from "react";
import { useListAllRoles } from "../../../api/administrator/role/listAllRoles";
import Pagination from "../../../components/common/Pagination";
import { Eye, Pencil, Plus, Trash2, Shield, X, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PermissionModal from "./PermissionModal";
import { useSelector } from "react-redux";
import { useDeleteModal } from "../../../hooks/useDeleteModal";
import { useDeleteHandler } from "../../../hooks/useDeleteHandler";
import DeletePopup from "../../../components/common/DeletePopup";
import { useDeleteRole } from "../../../api/administrator/role/deleteRole";

const ListAllRole = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError, refetch } = useListAllRoles({
    page: currentPage,
    limit: 10,
    search,
  });

  const permissionModule = useSelector((state) => state.permission.permissions);

  const hasModule = (slugName) => {
    return permissionModule?.some(
      (permission) => permission.slug?.toLowerCase() === slugName.toLowerCase(),
    );
  };

  const { mutate: deletePermission, isPending } = useDeleteRole();
  const { deleteModal, openDeleteModal, closeDeleteModal } = useDeleteModal();
  const { handleDelete } = useDeleteHandler(
    deletePermission,
    refetch,
    closeDeleteModal,
    "Role deleted successfully!",
  );

  const handleOpenPermissions = (role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  if (isLoading) return <div className="p-6">Loading roles...</div>;
  if (isError) return <div className="p-6">Error loading roles.</div>;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Roles</h2>
        {hasModule("role.create") && (
          <button
            onClick={() => navigate("/admin/roles/create")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Roles
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
            placeholder="Search by role name..."
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
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                {hasModule("role.assign-permissions") && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permissions
                  </th>
                )}
                {(hasModule("role.view") ||
                  hasModule("role.update") ||
                  hasModule("role.delete")) && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {data?.roles?.length > 0 ? (
                data.roles.map((role) => (
                  <tr
                    key={role.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {role.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {role.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <code className="px-2 py-1 bg-gray-100 rounded text-xs">
                        {role.slug}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {role.description}
                    </td>
                    {hasModule("role.assign-permissions") && (
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleOpenPermissions(role)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                        >
                          <Shield className="w-4 h-4" />
                          View Permissions
                        </button>
                      </td>
                    )}
                    {(hasModule("role.view") ||
                      hasModule("role.update") ||
                      hasModule("role.delete")) && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-3">
                        {hasModule("role.view") && (
                          <button
                            className="text-green-600 hover:text-green-900 cursor-pointer"
                            onClick={() =>
                              navigate(`/admin/roles/view`, { state: { role } })
                            }
                          >
                            <Eye size={18} />
                          </button>
                        )}
                        {hasModule("role.update") && (
                          <button
                            className="text-blue-600 hover:text-blue-900 cursor-pointer"
                            onClick={() =>
                              navigate(`/admin/roles/edit`, { state: { role } })
                            }
                          >
                            <Pencil size={18} />
                          </button>
                        )}
                        {hasModule("role.delete") && (
                          <button
                            className="text-red-600 hover:text-red-900 cursor-pointer"
                            onClick={() => openDeleteModal(role.id, role.name)}
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
                    colSpan="6"
                    className="px-6 py-10 text-center text-sm text-gray-500"
                  >
                    {search
                      ? `No roles found for "${search}"`
                      : "No roles found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={data?.totalPages || 1}
        itemsPerPage={10}
        total={data?.total || 0}
        onPageChange={setCurrentPage}
      />

      <PermissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        role={selectedRole}
      />

      <DeletePopup
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() => handleDelete(deleteModal.id)}
        title="Delete Role"
        message="Delete"
        isLoading={isPending}
      />
    </div>
  );
};

export default ListAllRole;

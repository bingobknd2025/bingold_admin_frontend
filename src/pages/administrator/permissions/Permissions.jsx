import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllPermission } from "../../../api/administrator/permission/getAllPermission";
import Pagination from "../../../components/common/Pagination";
import { Eye, Pencil, Plus, Trash2, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDeletePermission } from "../../../api/administrator/permission/deletePermission";
import DeletePopup from "../../../components/common/DeletePopup";
import { useDeleteModal } from "../../../hooks/useDeleteModal";
import { useDeleteHandler } from "../../../hooks/useDeleteHandler";
import { useSelector } from "react-redux";
import TextStatusBadge from "../../../components/common/TextStatusBadge";

const Permissions = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["permissions", currentPage, search],
    queryFn: () => getAllPermission(currentPage, 10, search),
    keepPreviousData: true,
  });

  const permissionModule = useSelector((state) => state.permission.permissions);

  const hasModule = (slugName) => {
    return permissionModule?.some(
      (permission) => permission.slug?.toLowerCase() === slugName.toLowerCase(),
    );
  };

  const { mutate: deletePermission, isPending } = useDeletePermission();
  const { deleteModal, openDeleteModal, closeDeleteModal } = useDeleteModal();
  const { handleDelete } = useDeleteHandler(
    deletePermission,
    refetch,
    closeDeleteModal,
    "Permission deleted successfully!",
  );

  const permissions = data?.permissions || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading permissions...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">
          Error loading permissions: {error?.message || "Unknown error"}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Permissions</h2>
        {hasModule("permission.create") && (
          <button
            onClick={() => navigate("/admin/permissions/create")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Permission
          </button>
        )}
      </div>

      {/* ✅ Search */}
      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or slug..."
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

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Module
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {(hasModule("permission.view") ||
                  hasModule("permission.update") ||
                  hasModule("permission.delete")) && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {permissions.length > 0 ? (
                permissions.map((permission) => (
                  <tr key={permission.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {permission.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {permission.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {permission.module}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {permission.slug}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {permission.description || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          permission.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {permission.is_active ? "Active" : "Inactive"}
                      </span>
                      <TextStatusBadge isActive={permission.is_active} />
                    </td>
                    {(hasModule("permission.view") ||
                      hasModule("permission.update") ||
                      hasModule("permission.delete")) && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-3">
                        {hasModule("permission.view") && (
                          <button
                            className="text-green-600 hover:text-green-900 cursor-pointer"
                            onClick={() =>
                              navigate(`/admin/permissions/view`, {
                                state: { permission },
                              })
                            }
                          >
                            <Eye size={18} />
                          </button>
                        )}
                        {hasModule("permission.update") && (
                          <button
                            className="text-blue-600 hover:text-blue-900 cursor-pointer"
                            onClick={() =>
                              navigate(`/admin/permissions/edit`, {
                                state: { permission },
                              })
                            }
                          >
                            <Pencil size={18} />
                          </button>
                        )}
                        {hasModule("permission.delete") && (
                          <button
                            className="text-red-600 hover:text-red-900 cursor-pointer"
                            onClick={() =>
                              openDeleteModal(permission.id, permission.name)
                            }
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
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    {search
                      ? `No permissions found for "${search}"`
                      : "No permissions found"}
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
        itemsPerPage={10}
        onPageChange={setCurrentPage}
      />

      <DeletePopup
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() => handleDelete(deleteModal.id)}
        title="Delete Permission"
        message="Delete"
        isLoading={isPending}
      />
    </div>
  );
};

export default Permissions;

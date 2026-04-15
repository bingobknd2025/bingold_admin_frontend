import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import React from "react";

const ListUsers = () => {
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Roles</h2>
        <button
          onClick={() => navigate("")}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create User
        </button>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  1
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Admin
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  admin
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Administrator user
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  All permissions
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      className="text-green-600 hover:text-green-900 cursor-pointer mr-3"
                      title="View"
                      onClick={() =>
                        navigate(`/admin/roles/view`, {
                          state: { role },
                        })
                      }
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      className="text-blue-600 hover:text-blue-900 cursor-pointer mr-3"
                      title="Edit"
                      onClick={() =>
                        navigate(`/admin/roles/edit`, {
                          state: { role },
                        })
                      }
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      className="text-red-600 hover:text-red-900 cursor-pointer"
                      title="Delete"
                      // onClick={() => handleDeleteClick(role.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListUsers;

import { Shield, X, Layers, Check, CheckSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { usePermissionGroupList } from "../../../api/administrator/permission/permissionGroupList";
import { useAssignRolePermissions } from "../../../api/administrator/role/assignRolePermission";
import toast from "react-hot-toast";
import { useViewRole } from "../../../api/administrator/role/viewRole";

const PermissionModal = ({ isOpen, onClose, role }) => {
  const {
    data: permissionGroupsData,
    isLoading,
    isError,
  } = usePermissionGroupList();
  const {
    mutate: assignRolePermissions,
    isPending: isAssigning,
    isError: isAssignError,
  } = useAssignRolePermissions();

  const { data: roleData, isLoading: isRoleLoading } = useViewRole(role?.id);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    if (roleData?.permissions) {
      setSelectedPermissions(roleData.permissions.map((p) => p.id));
    }
  }, [roleData]);

  const togglePermission = (permissionId) => {
    const isSelected = selectedPermissions.includes(permissionId);
    if (isSelected) {
      setSelectedPermissions(
        selectedPermissions.filter((id) => id !== permissionId),
      );
    } else {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    }
  };

  const toggleGroup = (permissions) => {
    const groupIds = permissions.map((p) => p.id);
    const allSelected = groupIds.every((id) =>
      selectedPermissions.includes(id),
    );

    let newPermissions = [...selectedPermissions];
    if (allSelected) {
      newPermissions = newPermissions.filter((id) => !groupIds.includes(id));
    } else {
      groupIds.forEach((id) => {
        if (!newPermissions.includes(id)) {
          newPermissions.push(id);
        }
      });
    }
    setSelectedPermissions(newPermissions);
  };

  const handleSelectAll = () => {
    const permissionGroups = permissionGroupsData?.permissions || {};
    const allPermissionIds = Object.values(permissionGroups)
      .flat()
      .map((p) => p.id);
    setSelectedPermissions(allPermissionIds);
  };

  const handleDeselectAll = () => {
    setSelectedPermissions([]);
  };

  const isGroupSelected = (permissions) => {
    return permissions.every((p) => selectedPermissions.includes(p.id));
  };

  const isGroupPartiallySelected = (permissions) => {
    const selected = permissions.filter((p) =>
      selectedPermissions.includes(p.id),
    );
    return selected.length > 0 && selected.length < permissions.length;
  };

  if (!isOpen) return null;

  if (isLoading || isRoleLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center text-gray-500">
            Loading permissions...
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center text-red-500">
            Error loading permissions
          </div>
        </div>
      </div>
    );
  }

  const permissionGroups = permissionGroupsData?.permissions || {};
  const totalPermissions = Object.values(permissionGroups).flat().length;
  const allSelected = selectedPermissions.length === totalPermissions;

  const handleSave = () => {
    const payload = {
      roleId: role?.id,
    };

    if (allSelected) {
      payload.assignAll = true;
    } else {
      payload.permission_ids = selectedPermissions;
    }

    // Correct way: Pass payload as first argument, callbacks object as second
    assignRolePermissions(payload, {
      onSuccess: () => {
        toast.success("Permissions assigned successfully");
        onClose();
      },
      onError: (error) => {
        toast.error("Failed to assign permissions");
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Permissions for {role?.name}
              </h2>
              <p className="text-sm text-gray-500">
                {selectedPermissions.length} permissions selected
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Layers className="w-4 h-4 mr-2" />
                Permissions ({selectedPermissions.length} selected)
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handleSelectAll}
                  disabled={allSelected}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    allSelected
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                  }`}
                >
                  <CheckSquare className="w-4 h-4" />
                  Select All
                </button>
                <button
                  onClick={handleDeselectAll}
                  disabled={selectedPermissions.length === 0}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    selectedPermissions.length === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Deselect All
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {Object.entries(permissionGroups).map(
                ([groupName, permissions]) => (
                  <div
                    key={groupName}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div
                      onClick={() => toggleGroup(permissions)}
                      className="bg-gray-50 p-3 cursor-pointer hover:bg-gray-100 transition-colors flex items-center gap-3"
                    >
                      <div
                        className={`w-5 h-5 border-2 rounded flex items-center justify-center ${
                          isGroupSelected(permissions)
                            ? "bg-blue-600 border-blue-600"
                            : isGroupPartiallySelected(permissions)
                              ? "bg-blue-300 border-blue-300"
                              : "bg-white border-gray-300"
                        }`}
                      >
                        {(isGroupSelected(permissions) ||
                          isGroupPartiallySelected(permissions)) && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900">
                        {groupName}
                      </h3>
                      <span className="text-sm text-gray-600 ml-auto">
                        {
                          permissions.filter((p) =>
                            selectedPermissions.includes(p.id),
                          ).length
                        }{" "}
                        / {permissions.length}
                      </span>
                    </div>

                    <div className="p-3 bg-white">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {permissions.map((permission) => (
                          <label
                            key={permission.id}
                            className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <div
                              className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                                selectedPermissions.includes(permission.id)
                                  ? "bg-blue-600 border-blue-600"
                                  : "bg-white border-gray-300"
                              }`}
                            >
                              {selectedPermissions.includes(permission.id) && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <input
                              type="checkbox"
                              checked={selectedPermissions.includes(
                                permission.id,
                              )}
                              onChange={() => togglePermission(permission.id)}
                              className="sr-only"
                            />
                            <div className="ml-2 flex-1">
                              <span className="text-sm font-medium text-gray-900">
                                {permission.name}
                              </span>
                              <p className="text-xs text-gray-500">
                                {permission.slug}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isAssigning}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            disabled={isAssigning}
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAssigning ? "Assigning..." : "Assign Permissions"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionModal;

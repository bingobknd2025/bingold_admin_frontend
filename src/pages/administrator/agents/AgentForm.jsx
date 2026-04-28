import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { ImageIcon } from "lucide-react";
import { useCreateAgent } from "../../../api/administrator/agents/createAgent";
import { useUpdateAgent } from "../../../api/administrator/agents/updateAgent";
import ImageUpload from "../../../components/common/ImageUpload";

const AgentForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state?.item;
  const isEditing = !!item;

  const [formData, setFormData] = useState(() => ({
    name: item?.name || "",
    role: item?.role || "",
    region: item?.region || "",
    photo: item?.photo || "",
    expiry_date: item?.expiry_date ? item.expiry_date.split("T")[0] : "",
    status: item?.status || "active",
  }));

  const { mutate: createItem, isPending: isCreating } = useCreateAgent();
  const { mutate: updateItem, isPending: isUpdating } = useUpdateAgent();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (name, data) => {
    setFormData((prev) => ({ ...prev, [name]: data?.url || "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: formData.name,
      role: formData.role || null,
      region: formData.region || null,
      photo: formData.photo || null,
      expiry_date: formData.expiry_date || null,
      status: formData.status,
    };

    if (isEditing) {
      updateItem({ id: item.id, data: payload }, {
        onSuccess: () => {
          toast.success("Agent updated successfully!");
          navigate("/admin/agents/list");
        },
        onError: (error) => toast.error(error?.response?.data?.message || "Error updating"),
      });
    } else {
      createItem(payload, {
        onSuccess: () => {
          toast.success("Agent created successfully!");
          navigate("/admin/agents/list");
        },
        onError: (error) => toast.error(error?.response?.data?.message || "Error creating"),
      });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">{isEditing ? "Edit" : "Create"} Agent</h2>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border rounded-lg p-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <input type="text" name="role" value={formData.role} onChange={handleChange} className="w-full border rounded-lg p-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
            <input type="text" name="region" value={formData.region} onChange={handleChange} className="w-full border rounded-lg p-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
            <input type="date" name="expiry_date" value={formData.expiry_date} onChange={handleChange} className="w-full border rounded-lg p-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full border rounded-lg p-2">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unique Code</label>
              <input type="text" value={item?.unique_code || ""} disabled className="w-full border rounded-lg p-2 bg-gray-50 font-mono" />
            </div>
          )}
        </div>

        <div className="border-t pt-6">
          <ImageUpload
            label="Photo"
            name="photo"
            icon={ImageIcon}
            onChange={handleImageChange}
            initialUrl={formData.photo}
          />
          {formData.photo && (
            <p className="mt-2 text-xs text-green-600">Current: {formData.photo.split('/').pop()}</p>
          )}
        </div>

        {isEditing && item?.qr_code && (
          <div className="border-t pt-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Current QR Code</p>
            <a href={item.qr_code} target="_blank" rel="noreferrer">
              <img src={item.qr_code} alt="QR" className="w-32 h-32 border rounded" />
            </a>
            <p className="mt-2 text-xs text-gray-500">Use the regenerate QR action on the list page to refresh.</p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={isCreating || isUpdating} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {isCreating || isUpdating ? "Saving..." : "Save Agent"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgentForm;

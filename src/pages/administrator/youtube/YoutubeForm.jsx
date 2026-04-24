import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCreateYoutube } from "../../../api/administrator/youtube/createYoutube";
import { useUpdateYoutube } from "../../../api/administrator/youtube/updateYoutube";
import toast from "react-hot-toast";
import { getYoutubeThumbnail } from "./youtubeUtils";

const YoutubeForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state?.item;
  const isEditing = !!item;

  const [formData, setFormData] = useState({
    title: "",
    video_url: "",
    platform: "all",
    status: "active",
  });

  useEffect(() => {
    if (isEditing) {
      setFormData({
        title: item.title || "",
        video_url: item.video_url || "",
        platform: item.platform || "all",
        status: item.status || "active",
      });
    }
  }, [item, isEditing]);

  const { mutate: createItem, isPending: isCreating } = useCreateYoutube();
  const { mutate: updateItem, isPending: isUpdating } = useUpdateYoutube();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateItem({ id: item.id, data: formData }, {
        onSuccess: () => {
          toast.success("Youtube video updated successfully!");
          navigate("/admin/youtube/list");
        },
        onError: (error) => toast.error(error?.response?.data?.message || "Error updating"),
      });
    } else {
      createItem(formData, {
        onSuccess: () => {
          toast.success("Youtube video created successfully!");
          navigate("/admin/youtube/list");
        },
        onError: (error) => toast.error(error?.response?.data?.message || "Error creating"),
      });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">{isEditing ? "Edit" : "Create"} Youtube Video</h2>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full border rounded-lg p-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Video URL *</label>
            <input type="text" name="video_url" value={formData.video_url} onChange={handleChange} required className="w-full border rounded-lg p-2" />
            {getYoutubeThumbnail(formData.video_url) && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-1">Thumbnail preview</p>
                <img
                  src={getYoutubeThumbnail(formData.video_url)}
                  alt="Youtube thumbnail"
                  className="w-48 rounded border border-gray-200"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
            <select name="platform" value={formData.platform} onChange={handleChange} className="w-full border rounded-lg p-2">
              <option value="all">All</option>
              <option value="web">Web</option>
              <option value="mobile">Mobile</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full border rounded-lg p-2">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={isCreating || isUpdating} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {isCreating || isUpdating ? "Saving..." : "Save Video"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default YoutubeForm;

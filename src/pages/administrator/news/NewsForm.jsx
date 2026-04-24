import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCreateNews } from "../../../api/administrator/news/createNews";
import { useUpdateNews } from "../../../api/administrator/news/updateNews";
import toast from "react-hot-toast";
import ImageUpload from "../../../components/common/ImageUpload";
import { ImageIcon } from "lucide-react";
import Editor from "../../../components/common/Editor";

const NewsForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state?.item;
  const isEditing = !!item;

  const [formData, setFormData] = useState(() => ({
    title: item?.title || "",
    slug: item?.slug || "",
    category: item?.category || "",
    status: item?.status || "active",
    meta_title: item?.meta_title || "",
    meta_description: item?.meta_description || "",
    meta_keyword: item?.meta_keyword || "",
    description: item?.description || "",
    image: item?.image || "",
    cover_image: item?.cover_image || "",
  }));

  const { mutate: createItem, isPending: isCreating } = useCreateNews();
  const { mutate: updateItem, isPending: isUpdating } = useUpdateNews();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-0\s]/g, "") // remove special chars
        .replace(/\s+/g, "-"); // replace spaces with -
      setFormData((prev) => ({ ...prev, title: value, slug: slug }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (name, data) => {
    setFormData((prev) => ({ ...prev, [name]: data?.url || "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      updateItem({ id: item.id, data: formData }, {
        onSuccess: () => {
          toast.success("News updated successfully!");
          navigate("/admin/news/list");
        },
        onError: (error) => toast.error(error?.response?.data?.message || "Error updating"),
      });
    } else {
      createItem(formData, {
        onSuccess: () => {
          toast.success("News created successfully!");
          navigate("/admin/news/list");
        },
        onError: (error) => toast.error(error?.response?.data?.message || "Error creating"),
      });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">{isEditing ? "Edit" : "Create"} News</h2>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full border rounded-lg p-2" />
            </div>
            
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="w-full border rounded-lg p-2" />
            </div>
            
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full border rounded-lg p-2" />
            </div>
            
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full border rounded-lg p-2">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
            </select>
            </div>
            
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
            <input type="text" name="meta_title" value={formData.meta_title} onChange={handleChange} className="w-full border rounded-lg p-2" />
            </div>
            
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keyword</label>
            <input type="text" name="meta_keyword" value={formData.meta_keyword} onChange={handleChange} className="w-full border rounded-lg p-2" />
            </div>
            
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
          <textarea name="meta_description" value={formData.meta_description} onChange={handleChange} rows="2" className="w-full border rounded-lg p-2"></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description / Content</label>
          <Editor 
            value={formData.description} 
            onChange={(data) => setFormData(prev => ({ ...prev, description: data }))} 
            placeholder="Write your content here..." 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
          <div>
            <ImageUpload
              label="Cover Image"
              name="cover_image"
              icon={ImageIcon}
              onChange={handleImageChange}
            />
            {formData.cover_image && (
              <p className="mt-2 text-xs text-green-600">Current: {formData.cover_image.split('/').pop()}</p>
            )}
          </div>
          <div>
            <ImageUpload
              label="Image / Attachment"
              name="image"
              icon={ImageIcon}
              onChange={handleImageChange}
            />
            {formData.image && (
              <p className="mt-2 text-xs text-green-600">Current: {formData.image.split('/').pop()}</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={isCreating || isUpdating} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {isCreating || isUpdating ? "Saving..." : "Save News"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsForm;

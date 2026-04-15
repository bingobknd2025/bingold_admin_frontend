import os

entities = ['blogs', 'news']
capitalized_entities = ['Blog', 'News']
single_entities = ['blog', 'news']
slugs = ['blog', 'news']

page_path = "src/pages/administrator"

for i in range(len(entities)):
    entity = entities[i]
    cap = capitalized_entities[i]
    slug = slugs[i]

    list_str = f"""import {{ Eye, Pencil, Plus, Search, Trash2, X }} from "lucide-react";
import {{ useEffect, useState }} from "react";
import {{ useNavigate }} from "react-router-dom";
import {{ useListAll{cap}s }} from "../../../api/administrator/{entity}/getAll{cap}s";
import Pagination from "../../../components/common/Pagination";
import {{ useDelete{cap} }} from "../../../api/administrator/{entity}/delete{cap}";
import DeletePopup from "../../../components/common/DeletePopup";
import {{ useDeleteModal }} from "../../../hooks/useDeleteModal";
import {{ useDeleteHandler }} from "../../../hooks/useDeleteHandler";
import {{ useSelector }} from "react-redux";

const List{cap}s = () => {{
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const limit = 10;

  useEffect(() => {{
    const timer = setTimeout(() => {{
      setSearch(searchInput);
      setCurrentPage(1);
    }}, 1000);
    return () => clearTimeout(timer);
  }}, [searchInput]);

  const {{ data, isLoading, isError, refetch }} = useListAll{cap}s(
    currentPage,
    limit,
    search,
  );

  const permissionModule = useSelector((state) => state.permission.permissions);

  const hasModule = (slugName) => {{
    return permissionModule?.some(
      (permission) => permission.slug?.toLowerCase() === slugName.toLowerCase(),
    );
  }};

  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  const {{ mutate: deleteItem, isPending }} = useDelete{cap}();
  const {{ deleteModal, openDeleteModal, closeDeleteModal }} = useDeleteModal();
  const {{ handleDelete }} = useDeleteHandler(
    deleteItem,
    refetch,
    closeDeleteModal,
    "{cap} deleted successfully!",
  );

  if (isLoading) return <div className="p-6">Loading {entity}...</div>;
  if (isError) return <div className="p-6">Error loading {entity}.</div>;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">{cap}</h2>
        {{hasModule("{slug}.create") && (
          <button
            onClick={{() => navigate("/admin/{entity}/create")}}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create {cap}
          </button>
        )}}
      </div>

      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={{searchInput}}
            onChange={{(e) => setSearchInput(e.target.value)}}
            placeholder="Search by title..."
            className="w-full pl-9 pr-9 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {{searchInput && (
            <button
              onClick={{() => {{
                setSearchInput("");
                setSearch("");
                setCurrentPage(1);
              }}}}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                {{(hasModule("{slug}.view") || hasModule("{slug}.update") || hasModule("{slug}.delete")) && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                )}}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {{data?.{entity}?.length > 0 ? (
                data.{entity}.map((item) => (
                  <tr key={{item.id}} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{item.title}}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{item.category || '-'}}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{item.status}}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{item.author?.name ?? "-"}}
                    </td>
                    {{(hasModule("{slug}.view") || hasModule("{slug}.update") || hasModule("{slug}.delete")) && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-3">
                        {{hasModule("{slug}.view") && (
                          <button
                            className="text-green-600 hover:text-green-900"
                            onClick={{() => navigate(`/admin/{entity}/view`, {{ state: {{ item }} }})}}
                          >
                            <Eye size={{18}} />
                          </button>
                        )}}
                        {{hasModule("{slug}.update") && (
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={{() => navigate(`/admin/{entity}/edit`, {{ state: {{ item }} }})}}
                          >
                            <Pencil size={{18}} />
                          </button>
                        )}}
                        {{hasModule("{slug}.delete") && (
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={{() => openDeleteModal(item.id)}}
                          >
                            <Trash2 size={{18}} />
                          </button>
                        )}}
                      </td>
                    )}}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-500">
                    {{search ? `No {entity} found for "${{search}}"` : "No {entity} found"}}
                  </td>
                </tr>
              )}}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={{currentPage}}
        totalPages={{totalPages}}
        total={{total}}
        itemsPerPage={{limit}}
        onPageChange={{setCurrentPage}}
      />

      <DeletePopup
        isOpen={{deleteModal.isOpen}}
        onClose={{closeDeleteModal}}
        onConfirm={{() => handleDelete(deleteModal.id)}}
        title="Delete {cap}"
        message="Are you sure you want to delete this?"
        isLoading={{isPending}}
      />
    </div>
  );
}};

export default List{cap}s;
"""

    form_str = f"""import React, {{ useState, useEffect }} from "react";
import {{ useNavigate, useLocation }} from "react-router-dom";
import {{ useCreate{cap} }} from "../../../api/administrator/{entity}/create{cap}";
import {{ useUpdate{cap} }} from "../../../api/administrator/{entity}/update{cap}";
import {{ toast }} from "react-toastify";

const {cap}Form = () => {{
  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state?.item;
  const isEditing = !!item;

  const [formData, setFormData] = useState({{
    title: "",
    slug: "",
    category: "",
    status: "draft",
    meta_title: "",
    meta_description: "",
    meta_keyword: "",
    note: "",
    attch: "",
    cover_image: "",
  }});

  useEffect(() => {{
    if (isEditing) {{
      setFormData({{
        title: item.title || "",
        slug: item.slug || "",
        category: item.category || "",
        status: item.status || "draft",
        meta_title: item.meta_title || "",
        meta_description: item.meta_description || "",
        meta_keyword: item.meta_keyword || "",
        note: item.note || "",
        attch: item.attch || "",
        cover_image: item.cover_image || "",
      }});
    }}
  }}, [item, isEditing]);

  const {{ mutate: createItem, isPending: isCreating }} = useCreate{cap}();
  const {{ mutate: updateItem, isPending: isUpdating }} = useUpdate{cap}();

  const handleChange = (e) => {{
    const {{ name, value }} = e.target;
    setFormData(prev => ({{ ...prev, [name]: value }}));
  }};

  const handleSubmit = (e) => {{
    e.preventDefault();
    if (isEditing) {{
      updateItem({{ id: item.id, data: formData }}, {{
        onSuccess: () => {{
          toast.success("{cap} updated successfully!");
          navigate("/admin/{entity}/list");
        }},
        onError: (error) => toast.error(error?.response?.data?.message || "Error updating"),
      }});
    }} else {{
      createItem(formData, {{
        onSuccess: () => {{
          toast.success("{cap} created successfully!");
          navigate("/admin/{entity}/list");
        }},
        onError: (error) => toast.error(error?.response?.data?.message || "Error creating"),
      }});
    }}
  }};

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">{{isEditing ? "Edit" : "Create"}} {cap}</h2>
      <form onSubmit={{handleSubmit}} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input type="text" name="title" value={{formData.title}} onChange={{handleChange}} required className="w-full border rounded-lg p-2" />
            </div>
            
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input type="text" name="slug" value={{formData.slug}} onChange={{handleChange}} className="w-full border rounded-lg p-2" />
            </div>
            
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input type="text" name="category" value={{formData.category}} onChange={{handleChange}} className="w-full border rounded-lg p-2" />
            </div>
            
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select name="status" value={{formData.status}} onChange={{handleChange}} className="w-full border rounded-lg p-2">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
            </select>
            </div>
            
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
            <input type="text" name="meta_title" value={{formData.meta_title}} onChange={{handleChange}} className="w-full border rounded-lg p-2" />
            </div>
            
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Keyword</label>
            <input type="text" name="meta_keyword" value={{formData.meta_keyword}} onChange={{handleChange}} className="w-full border rounded-lg p-2" />
            </div>
            
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
          <textarea name="meta_description" value={{formData.meta_description}} onChange={{handleChange}} rows="2" className="w-full border rounded-lg p-2"></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Note / Content</label>
          <textarea name="note" value={{formData.note}} onChange={{handleChange}} rows="4" className="w-full border rounded-lg p-2"></textarea>
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button type="button" onClick={{() => navigate(-1)}} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={{isCreating || isUpdating}} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            {{isCreating || isUpdating ? "Saving..." : "Save {cap}"}}
          </button>
        </div>
      </form>
    </div>
  );
}};

export default {cap}Form;
"""

    view_str = f"""import React from "react";
import {{ useLocation, useNavigate }} from "react-router-dom";

const View{cap} = () => {{
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.item;

  if (!item) return <div className="p-6">No Data available.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">{cap} Details</h2>
        <button onClick={{() => navigate(-1)}} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Back</button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6 border-b pb-6">
          <div><p className="text-sm text-gray-500">Title</p><p className="font-medium">{{item.title}}</p></div>
          <div><p className="text-sm text-gray-500">Slug</p><p className="font-medium">{{item.slug}}</p></div>
          <div><p className="text-sm text-gray-500">Category</p><p className="font-medium">{{item.category || '-'}}</p></div>
          <div><p className="text-sm text-gray-500">Status</p>
            <span className={{`inline-flex px-2 py-1 rounded text-xs font-medium ${{
              item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }}`}}>
              {{item.status}}
            </span>
          </div>
          <div><p className="text-sm text-gray-500">Author</p><p className="font-medium">{{item.author?.name || '-'}}</p></div>
          <div><p className="text-sm text-gray-500">Created At</p><p className="font-medium">{{new Date(item.created_at).toLocaleString()}}</p></div>
        </div>
        
        <div><p className="text-sm text-gray-500 mb-2">Content / Note</p>
          <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">{{item.note || '-'}}</div>
        </div>
      </div>
    </div>
  );
}};

export default View{cap};
"""

    with open(f"{page_path}/{entity}/List{cap}s.jsx", "w") as f: f.write(list_str)
    with open(f"{page_path}/{entity}/{cap}Form.jsx", "w") as f: f.write(form_str)
    with open(f"{page_path}/{entity}/View{cap}.jsx", "w") as f: f.write(view_str)

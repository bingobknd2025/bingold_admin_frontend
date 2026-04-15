import { Eye, Pencil, Plus, Search, Trash2, X, Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useListAllNewss } from "../../../api/administrator/news/getAllNewss";
import Pagination from "../../../components/common/Pagination";
import { useDeleteNews } from "../../../api/administrator/news/deleteNews";
import DeletePopup from "../../../components/common/DeletePopup";
import { useDeleteModal } from "../../../hooks/useDeleteModal";
import { useDeleteHandler } from "../../../hooks/useDeleteHandler";
import { useSelector } from "react-redux";

const ListNewss = () => {
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

  const { data, isLoading, isError, refetch } = useListAllNewss(
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

  const { mutate: deleteItem, isPending } = useDeleteNews();
  const { deleteModal, openDeleteModal, closeDeleteModal } = useDeleteModal();
  const { handleDelete } = useDeleteHandler(
    deleteItem,
    refetch,
    closeDeleteModal,
    "News deleted successfully!",
  );

  if (isLoading) return <div className="p-6">Loading news...</div>;
  if (isError) return <div className="p-6">Error loading news.</div>;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">News</h2>
        {hasModule("news.create") && (
          <button
            onClick={() => navigate("/admin/news/create")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create News
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
            placeholder="Search by title..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                {(hasModule("news.view") || hasModule("news.update") || hasModule("news.delete")) && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {data?.data?.length > 0 ? (
                data.data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.cover_image ? (
                        <img src={item.cover_image} alt="" className="w-12 h-12 object-cover rounded-md" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.category || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.author?.name ?? "-"}
                    </td>
                    {(hasModule("news.view") || hasModule("news.update") || hasModule("news.delete")) && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-3">
                        {hasModule("news.view") && (
                          <button
                            className="text-green-600 hover:text-green-900"
                            onClick={() => navigate(`/admin/news/view`, { state: { item } })}
                          >
                            <Eye size={18} />
                          </button>
                        )}
                        {hasModule("news.update") && (
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => navigate(`/admin/news/edit`, { state: { item } })}
                          >
                            <Pencil size={18} />
                          </button>
                        )}
                        {hasModule("news.delete") && (
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => openDeleteModal(item.id)}
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
                  <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-500">
                    {search ? `No news found for "${search}"` : "No news found"}
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
        title="Delete News"
        message="Are you sure you want to delete this?"
        isLoading={isPending}
      />
    </div>
  );
};

export default ListNewss;

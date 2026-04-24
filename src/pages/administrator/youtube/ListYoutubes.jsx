import { Eye, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useListAllYoutubes } from "../../../api/administrator/youtube/getAllYoutubes";
import Pagination from "../../../components/common/Pagination";
import { useDeleteYoutube } from "../../../api/administrator/youtube/deleteYoutube";
import DeletePopup from "../../../components/common/DeletePopup";
import { useDeleteModal } from "../../../hooks/useDeleteModal";
import { useDeleteHandler } from "../../../hooks/useDeleteHandler";
import { useSelector } from "react-redux";
import { getYoutubeThumbnail } from "./youtubeUtils";

const ListYoutubes = () => {
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

  const { data, isLoading, isError, refetch } = useListAllYoutubes(
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

  const { mutate: deleteItem, isPending } = useDeleteYoutube();
  const { deleteModal, openDeleteModal, closeDeleteModal } = useDeleteModal();
  const { handleDelete } = useDeleteHandler(
    deleteItem,
    refetch,
    closeDeleteModal,
    "Youtube video deleted successfully!",
  );

  if (isLoading) return <div className="p-6">Loading youtube videos...</div>;
  if (isError) return <div className="p-6">Error loading youtube videos.</div>;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Youtube Videos</h2>
        {hasModule("youtube_video.create") && (
          <button
            onClick={() => navigate("/admin/youtube/create")}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Youtube Video
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thumbnail</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Video URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creator</th>
                {(hasModule("youtube_video.view") || hasModule("youtube_video.update") || hasModule("youtube_video.delete")) && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {data?.data?.length > 0 ? (
                data.data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getYoutubeThumbnail(item.video_url) ? (
                        <a href={item.video_url} target="_blank" rel="noreferrer">
                          <img
                            src={getYoutubeThumbnail(item.video_url)}
                            alt={item.title}
                            className="w-24 h-14 object-cover rounded border border-gray-200"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        </a>
                      ) : (
                        <div className="w-24 h-14 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-xs text-gray-400">N/A</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <a href={item.video_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate inline-block max-w-xs">{item.video_url}</a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{item.platform}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                        item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.creator?.name ?? "-"}
                    </td>
                    {(hasModule("youtube_video.view") || hasModule("youtube_video.update") || hasModule("youtube_video.delete")) && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-3">
                        {hasModule("youtube_video.view") && (
                          <button
                            className="text-green-600 hover:text-green-900"
                            onClick={() => navigate(`/admin/youtube/view`, { state: { item } })}
                          >
                            <Eye size={18} />
                          </button>
                        )}
                        {hasModule("youtube_video.update") && (
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => navigate(`/admin/youtube/edit`, { state: { item } })}
                          >
                            <Pencil size={18} />
                          </button>
                        )}
                        {hasModule("youtube_video.delete") && (
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
                  <td colSpan="7" className="px-6 py-10 text-center text-sm text-gray-500">
                    {search ? `No youtube videos found for "${search}"` : "No youtube videos found"}
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
        title="Delete Youtube Video"
        message="Are you sure you want to delete this?"
        isLoading={isPending}
      />
    </div>
  );
};

export default ListYoutubes;

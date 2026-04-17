import { useLocation, useNavigate } from "react-router-dom";
import 'ckeditor5/ckeditor5.css';

const ViewBlog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.item;

  if (!item) return <div className="p-6">No Data available.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Blog Details</h2>
        <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Back</button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-2 gap-6 border-b pb-6">
          <div><p className="text-sm text-gray-500">Title</p><p className="font-medium">{item.title}</p></div>
          <div><p className="text-sm text-gray-500">Slug</p><p className="font-medium">{item.slug}</p></div>
          <div><p className="text-sm text-gray-500">Category</p><p className="font-medium">{item.category || '-'}</p></div>
          <div><p className="text-sm text-gray-500">Status</p>
            <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
              {item.status}
            </span>
          </div>
          <div><p className="text-sm text-gray-500">Author</p><p className="font-medium">{item.author?.name || '-'}</p></div>
          <div><p className="text-sm text-gray-500">Created At</p><p className="font-medium">{new Date(item.created_at).toLocaleString()}</p></div>
        </div>

        {item.cover_image && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Cover Image</p>
            <img src={item.cover_image} alt="Cover" className="max-w-md rounded-lg shadow-sm" />
          </div>
        )}

        {item.image && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Image / Attachment</p>
            {item.image.match(/\.(jpeg|jpg|gif|png|webp)$/) ? (
              <img src={item.image} alt="Attachment" className="max-w-md rounded-lg shadow-sm" />
            ) : (
              <a href={item.image} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">View Attachment</a>
            )}
          </div>
        )}

        <div><p className="text-sm text-gray-500 mb-2">Description / Content</p>
          <div
            className="bg-gray-50 p-4 rounded-lg ck-content"
            dangerouslySetInnerHTML={{ __html: item.description || '-' }}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewBlog;

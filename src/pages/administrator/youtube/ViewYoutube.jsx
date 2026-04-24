import { useLocation, useNavigate } from "react-router-dom";
import { getYoutubeThumbnail } from "./youtubeUtils";

const ViewYoutube = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.item;

  if (!item) return <div className="p-6">No Data available.</div>;

  const thumbnail = getYoutubeThumbnail(item.video_url);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Youtube Video Details</h2>
        <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Back</button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        {thumbnail && (
          <div className="flex justify-center border-b pb-6">
            <a href={item.video_url} target="_blank" rel="noreferrer">
              <img
                src={thumbnail}
                alt={item.title}
                className="max-w-md w-full rounded-lg border border-gray-200"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </a>
          </div>
        )}
        <div className="grid grid-cols-2 gap-6 border-b pb-6">
          <div><p className="text-sm text-gray-500">Title</p><p className="font-medium">{item.title}</p></div>
          <div>
            <p className="text-sm text-gray-500">Video URL</p>
            <a href={item.video_url} target="_blank" rel="noreferrer" className="font-medium text-blue-600 hover:underline break-all">{item.video_url}</a>
          </div>
          <div><p className="text-sm text-gray-500">Platform</p><p className="font-medium capitalize">{item.platform}</p></div>
          <div><p className="text-sm text-gray-500">Status</p>
            <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
              item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {item.status}
            </span>
          </div>
          <div><p className="text-sm text-gray-500">Creator</p><p className="font-medium">{item.creator?.name || '-'}</p></div>
          <div><p className="text-sm text-gray-500">Updater</p><p className="font-medium">{item.updater?.name || '-'}</p></div>
          <div><p className="text-sm text-gray-500">Created At</p><p className="font-medium">{item.created_at ? new Date(item.created_at).toLocaleString() : '-'}</p></div>
          <div><p className="text-sm text-gray-500">Updated At</p><p className="font-medium">{item.updated_at ? new Date(item.updated_at).toLocaleString() : '-'}</p></div>
        </div>
      </div>
    </div>
  );
};

export default ViewYoutube;

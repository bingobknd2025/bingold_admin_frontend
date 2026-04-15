import React from "react";
import { Image } from "lucide-react";

const ImageThumb = ({ url, label, onClick }) => {
  return (
    <button
      type="button"
      onClick={() => onClick(url, label)}
      className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-blue-400 transition-colors bg-gray-50"
    >
      <img src={url} alt={label} className="w-full h-full object-cover" />

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
        <Image className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {label && (
        <div className="absolute bottom-0 inset-x-0 bg-black/50 py-1 px-1.5">
          <p className="text-white text-[10px] font-medium text-center truncate">
            {label}
          </p>
        </div>
      )}
    </button>
  );
};

export default ImageThumb;

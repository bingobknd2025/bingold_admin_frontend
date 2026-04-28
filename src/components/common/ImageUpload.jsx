import React, { useState } from "react";
import { Upload, X, CheckCircle, Loader2 } from "lucide-react";
import { useUploadPhoto } from "../../api/common/uploadPhoto";
import { useDeleteImage } from "../../api/common/deletePhoto";

const ImageUpload = ({
  label,
  name,
  onChange,
  accept = "image/*",
  hint,
  required = false,
  icon: Icon,
  initialUrl = "",
}) => {
  const [preview, setPreview] = useState(initialUrl || null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState(initialUrl ? initialUrl.split("/").pop() : null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadedPublicId, setUploadedPublicId] = useState(null);

  const { mutateAsync: uploadPhoto } = useUploadPhoto();
  const { mutateAsync: deleteImage } = useDeleteImage();

  const handleUpload = async (file) => {
    setIsUploading(true);
    setUploadError(null);
    try {
      const res = await uploadPhoto(file);
      const { url, public_id } = res;

      if (url && public_id) {
        setUploadedPublicId(public_id);
        // ✅ Pass full object { url, public_id } — matches Zod schema
        onChange(name, { url, public_id });
      } else {
        throw new Error("Invalid response from upload");
      }
    } catch (err) {
      setUploadError("Upload failed. Please try again.");
      setPreview(null);
      setFileName(null);
      onChange(name, undefined);
    } finally {
      setIsUploading(false);
    }
  };

  const processFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
    handleUpload(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  // ✅ Call Cloudinary delete API, then clear local state
  const handleDeleteImage = async () => {
    if (uploadedPublicId) {
      setIsDeleting(true);
      try {
        await deleteImage(uploadedPublicId);
      } catch (err) {
        // Even if delete fails on Cloudinary, clear the form
        console.error("Failed to delete image from Cloudinary:", err);
      } finally {
        setIsDeleting(false);
      }
    }

    // Always clear local state regardless
    setPreview(null);
    setFileName(null);
    setUploadError(null);
    setUploadedPublicId(null);
    const input = document.getElementById(name);
    if (input) input.value = "";
    onChange(name, undefined);
  };

  const isBusy = isUploading || isDeleting;

  return (
    <div className="space-y-2">
      {label && (
        <label className="flex items-center text-sm font-medium text-gray-700">
          {Icon && <Icon className="w-4 h-4 mr-2" />}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {hint && <span className="ml-2 text-xs text-gray-500">({hint})</span>}
        </label>
      )}

      <div
        className={`relative border-2 border-dashed rounded-lg transition-all ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : preview || fileName
              ? "border-green-300 bg-green-50"
              : uploadError
                ? "border-red-300 bg-red-50"
                : "border-gray-300 bg-gray-50 hover:border-gray-400"
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
      >
        <input
          type="file"
          id={name}
          name={name}
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Preview State */}
        {(preview || fileName) && (
          <div className="relative p-4">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-40 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-40 flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center">
                  <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                  <p className="text-sm text-gray-600 font-medium">
                    {fileName}
                  </p>
                </div>
              </div>
            )}

            {/* ✅ Delete Button — calls Cloudinary delete */}
            {!isBusy && (
              <button
                type="button"
                onClick={handleDeleteImage}
                className="absolute top-6 right-6 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X size={14} />
              </button>
            )}

            {/* Status Badge */}
            <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-white/95 px-2.5 py-1 rounded-md shadow-sm">
              {isUploading && (
                <>
                  <Loader2 size={14} className="text-blue-600 animate-spin" />
                  <span className="text-xs font-medium text-gray-700">
                    Uploading...
                  </span>
                </>
              )}
              {isDeleting && (
                <>
                  <Loader2 size={14} className="text-red-500 animate-spin" />
                  <span className="text-xs font-medium text-gray-700">
                    Deleting...
                  </span>
                </>
              )}
              {!isBusy && (
                <>
                  <CheckCircle size={14} className="text-green-600" />
                  <span className="text-xs font-medium text-gray-700">
                    Uploaded
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Upload Error State */}
        {uploadError && !fileName && (
          <label
            htmlFor={name}
            className="flex flex-col items-center justify-center p-6 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mb-2">
              <X className="text-red-500" size={20} />
            </div>
            <p className="text-sm font-medium text-red-600 mb-1">
              {uploadError}
            </p>
            <p className="text-xs text-gray-500">Click to try again</p>
          </label>
        )}

        {/* Empty / Default State */}
        {!preview && !fileName && !uploadError && (
          <label
            htmlFor={name}
            className="flex flex-col items-center justify-center p-6 cursor-pointer"
          >
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-2">
              <Upload className="text-gray-500" size={20} />
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
          </label>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;

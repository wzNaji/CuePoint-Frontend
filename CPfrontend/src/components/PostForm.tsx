import { useState } from "react";
import { uploadImage } from "../api/post"; // Import your uploadImage function

interface PostFormProps {
  initialContent?: string;
  initialImageUrl?: string;
  uploading?: boolean;
  setUploading?: (value: boolean) => void;
  onSubmit: (content: string, imageUrl: string) => void;
  onCancel?: () => void;
}

export default function PostForm({
  initialContent = "",
  initialImageUrl = "",
  uploading,
  setUploading,
  onSubmit,
  onCancel,
}: PostFormProps) {
  const [content, setContent] = useState(initialContent);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setSelectedFile(file);
    setImageUrl(URL.createObjectURL(file)); // Preview image
  };

  const handleSave = async () => {
    if (!content.trim() && !selectedFile && !imageUrl) return;

    let finalImageUrl = imageUrl;

    if (selectedFile) {
      if (setUploading) setUploading(true);
      try {
        // Upload image to the server
        finalImageUrl = await uploadImage(selectedFile);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        if (setUploading) setUploading(false);
      }
    }

    // Submit the content and the image URL
    onSubmit(content, finalImageUrl);

    // Reset fields
    setContent("");
    setSelectedFile(null);
    setImageUrl("");
  };

  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm p-4">
      {/* TEXTAREA */}
      <textarea
        className="w-full resize-none rounded-lg border border-gray-300
                   px-4 py-3 text-sm
                   focus:outline-none focus:ring-2 focus:ring-indigo-400"
        placeholder="Write something..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
      />

      {/* IMAGE PREVIEW */}
      {imageUrl && (
        <div className="mt-3 overflow-hidden rounded-lg border">
          <img
            src={imageUrl}
            alt="Preview"
            className="max-h-60 w-full object-cover"
          />
        </div>
      )}

      {/* ACTION BAR */}
      <div className="mt-3 flex items-center justify-between">
        {/* LEFT ACTIONS */}
        <div>
          <input
            id="file-upload-post"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file-upload-post"
            className="inline-flex items-center gap-2
                       rounded-lg px-3 py-2 text-sm
                       border border-gray-300
                       cursor-pointer hover:bg-gray-100 transition"
          >
            🖼 Upload image
          </label>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              onClick={onCancel}
              className="rounded-lg px-4 py-2 text-sm font-medium
                         text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={uploading}
            className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500
                       px-5 py-2 text-sm font-medium text-white
                       shadow-sm hover:opacity-90 transition
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {onCancel ? "Save" : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}

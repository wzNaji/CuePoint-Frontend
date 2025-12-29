// src/components/PostForm.tsx
import { useState } from "react";

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
    setImageUrl(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!content.trim() && !selectedFile && !imageUrl) return;

    let finalImageUrl = imageUrl;

    if (selectedFile && setUploading) {
      setUploading(true);
      try {
        // if you have a separate upload function, call it here
        // const uploadedUrl = await uploadImage(selectedFile);
        // finalImageUrl = uploadedUrl;
      } finally {
        setUploading(false);
      }
    }

    onSubmit(content, finalImageUrl);

    // Reset form
    setContent("");
    setSelectedFile(null);
    setImageUrl("");
  };

  return (
    <div className="mb-4">
      <textarea
        className="w-full p-2 border rounded mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="Write something..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
      />

      <input
        id="file-upload-post"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <label
        htmlFor="file-upload-post"
        className="inline-block px-4 py-2 bg-green-200 text-gray-700 rounded cursor-pointer hover:bg-gray-300"
      >
        Upload Image
      </label>

      {imageUrl && (
        <div className="mb-2 mt-2">
          <p className="text-sm text-gray-600">Preview:</p>
          <img src={imageUrl} alt="Preview" className="rounded max-h-48 w-full object-cover" />
        </div>
      )}

      <div className="flex space-x-2 mt-2">
        <button
          onClick={handleSave}
          disabled={uploading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {onCancel ? "Save" : "Post"}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

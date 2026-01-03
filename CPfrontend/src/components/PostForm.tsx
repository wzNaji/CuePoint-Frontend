import { useState, useId } from "react";
import { uploadImage } from "../api/post";
import Card from "./Card";
import Button from "./button";

interface PostFormProps {
  initialContent?: string;
  initialImageUrl?: string;
  uploading?: boolean;
  setUploading?: (value: boolean) => void;
  onSubmit: (content: string, imageUrl: string) => void;
  onCancel?: () => void;
}

export default function PostForm({ initialContent = "", initialImageUrl = "", uploading, setUploading, onSubmit, onCancel }: PostFormProps) {
  const fileInputId = useId();
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

    if (selectedFile) {
      setUploading?.(true);
      try {
        finalImageUrl = await uploadImage(selectedFile);
      } catch (err) {
        console.error("Image upload failed", err);
        return;
      } finally {
        setUploading?.(false);
      }
    }

    onSubmit(content, finalImageUrl);

    if (!onCancel) {
      setContent("");
      setSelectedFile(null);
      setImageUrl("");
    }
  };

  return (
    <Card className="mb-6 p-4">
      <textarea
        className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        placeholder="Write something..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
      />

      {imageUrl && (
        <div className="mt-3 overflow-hidden rounded-lg border">
          <img src={imageUrl} alt="Preview" className="max-h-60 w-full object-cover" />
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div>
          <input id={fileInputId} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <label htmlFor={fileInputId} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm border border-gray-300 cursor-pointer hover:bg-gray-100 transition">
            🖼 Upload image
          </label>
        </div>

        <div className="flex items-center gap-2">
          {onCancel && <Button variant="secondary" size="md" onClick={onCancel}>Cancel</Button>}
          <Button variant="primary" size="md" onClick={handleSave} disabled={uploading}>
            {onCancel ? "Save" : "Post"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

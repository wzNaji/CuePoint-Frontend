/**
 * PostForm component
 *
 * Controlled form used for creating a new post or editing an existing post.
 *
 * Responsibilities:
 * - Manage post text content and optional image selection/preview
 * - Upload a newly selected image via the backend (`uploadImage`)
 * - Call `onSubmit` with the final content + resolved image URL
 *
 * Behavior notes:
 * - If `onCancel` is provided, the form acts like an "edit" form (Save/Cancel).
 * - If `onCancel` is not provided, the form acts like a "create" form and resets
 *   its local state after submission.
 * - `uploading` / `setUploading` are optional so the parent can control a global
 *   loading state if desired.
 */

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
  // Stable id for linking the hidden <input type="file"> to its <label>.
  const fileInputId = useId();

  // Controlled form state.
  const [content, setContent] = useState(initialContent);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // `imageUrl` is used both for existing images (edit mode) and for local previews.
  const [imageUrl, setImageUrl] = useState(initialImageUrl);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Guard: ignore if the user cancels the file picker.
    if (!e.target.files?.[0]) return;

    // Store file for upload on save, and set a local preview URL immediately.
    const file = e.target.files[0];
    setSelectedFile(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    // Guard: do nothing if there's no text and no image to submit.
    if (!content.trim() && !selectedFile && !imageUrl) return;

    // Start with the current `imageUrl` (may already be an existing remote URL).
    let finalImageUrl = imageUrl;

    // If a new file was selected, upload it and replace `finalImageUrl` with the returned public URL.
    if (selectedFile) {
      setUploading?.(true);
      try {
        finalImageUrl = await uploadImage(selectedFile);
      } catch (err) {
        // Keep the form open if upload fails so the user can try again.
        console.error("Image upload failed", err);
        return;
      } finally {
        setUploading?.(false);
      }
    }

    // Delegate persistence to the parent (create/update API call).
    onSubmit(content, finalImageUrl);

    // In "create" mode (no onCancel), reset the form after submit.
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

      {/* Image preview (either existing remote URL or local object URL preview). */}
      {imageUrl && (
        <div className="mt-3 overflow-hidden rounded-lg border">
          <img src={imageUrl} alt="Preview" className="max-h-60 w-full object-cover" />
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div>
          {/* Hidden file input triggered by the label for nicer styling. */}
          <input id={fileInputId} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <label htmlFor={fileInputId} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm border border-gray-300 cursor-pointer hover:bg-gray-100 transition">
            🖼 Upload image
          </label>
        </div>

        <div className="flex items-center gap-2">
          {/* Cancel button only shown in edit mode. */}
          {onCancel && <Button variant="secondary" size="md" onClick={onCancel}>Cancel</Button>}

          {/* Disable while uploading to prevent duplicate submissions. */}
          <Button variant="primary" size="md" onClick={handleSave} disabled={uploading}>
            {onCancel ? "Save" : "Post"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

// types used for LayoutRenderer and widgets

import type { Post } from "../types/post";
import type { User } from "../types/user";

export type WidgetKey = "profile" | "posts" | "featured_tracks" | "events";

export interface WidgetDefinition<TProps = any> {
  key: WidgetKey;
  title: string;
  public: boolean;
  component: (props: TProps) => JSX.Element;
}

// All props passed to widgets
export interface WidgetProps {
  user: User;
  posts: Post[];
  postsLoading: boolean;
  editingPost: Post | null;
  setEditingPost: (post: Post | null) => void;
  handleCreatePost: (content: string, imageUrl?: string) => void;
  handleEditPost: (content: string, imageUrl?: string) => void;
  handleDeletePost: (postId: number) => void;
  uploading: boolean;
  setUploading: (value: boolean) => void;
}

// User layout definition
export interface UserLayout {
  items: {
    widget: WidgetKey;
    order: number;
    column?: "main" | "side";
  }[];
}

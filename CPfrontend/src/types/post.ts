export interface Post {
  id: number;
  content: string;
  image_url?: string | null;
  created_at: string; // ISO date string from backend
  user_id: number;
}

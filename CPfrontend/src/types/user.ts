export interface User {
  id: number;
  email: string;
  display_name: string;
  bio?: string | null;
  profile_image_url?: string | null;
  is_verified: boolean;
}

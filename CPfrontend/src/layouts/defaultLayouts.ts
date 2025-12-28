import type { UserLayout } from "./types";

export const DEFAULT_PUBLIC_LAYOUT: UserLayout = {
  items: [
    { widget: "profile", order: 1 },
    { widget: "featured_tracks", order: 2 },
    { widget: "posts", order: 3 },
  ],
};

export const DEFAULT_DASHBOARD_LAYOUT: UserLayout = {
  items: [
    { widget: "profile", order: 1 },
    { widget: "posts", order: 2 },
    { widget: "featured_tracks", order: 3 },
    { widget: "events", order: 4 },
  ],
};

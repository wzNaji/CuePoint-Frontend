// src/layouts/widgets.tsx
import ProfileCard from "../components/ProfileCard";
import PostsSection from "../components/PostsSection";
import FeaturedTracks from "../components/FeaturedTracks";
import EventsSidebar from "../components/EventsSidebar";

import type { WidgetDefinition, WidgetKey, WidgetProps } from "./types";

// Record of all widgets
export const WIDGETS: Record<WidgetKey, WidgetDefinition> = {
  profile: {
    key: "profile",
    title: "Profile",
    public: true,
    component: (props: WidgetProps) => <ProfileCard {...props} />,
  },
  posts: {
    key: "posts",
    title: "Posts",
    public: true,
    component: (props: WidgetProps) => <PostsSection {...props} />,
  },
  featured_tracks: {
    key: "featured_tracks",
    title: "Featured Tracks",
    public: true,
    component: (props: WidgetProps) => <FeaturedTracks {...props} />,
  },
  events: {
    key: "events",
    title: "Events",
    public: false, // dashboard only
    component: (props: WidgetProps) => <EventsSidebar {...props} />,
  },
};

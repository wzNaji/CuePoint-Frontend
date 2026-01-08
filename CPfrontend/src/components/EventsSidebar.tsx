/**
 * EventsSidebar component
 *
 * Displays a list of upcoming events for a given user, with optional owner controls.
 *
 * Responsibilities:
 * - Fetch events for `userId` (public endpoint)
 * - Show upcoming events (date >= today)
 * - If `isOwner` is true: allow adding and deleting events
 * - Link each event to either its explicit URL or a fallback search (Resident Advisor)
 *
 * Data caching:
 * - Uses React Query with the cache key: ["events", userId]
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../api/axios";
import Button from "./button";
import Card from "./Card";
import Message from "./Message";

interface Event {
  /** Database id for the event. */
  id: number;
  /** Human-readable event title. */
  title: string;
  /** ISO date string (YYYY-MM-DD). */
  date: string;
  /** Optional location (not always displayed in UI here). */
  location?: string;
  /** Optional external URL for the event (tickets/event page). */
  url?: string;
}

/**
 * Format a YYYY-MM-DD date string into a user-friendly label.
 */
function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Split a YYYY-MM-DD date string into display-friendly pieces for the UI badge.
 */
function getDateParts(date: string) {
  const d = new Date(date);
  return {
    day: d.getDate(),
    month: d.toLocaleString("en", { month: "short" }).toUpperCase(),
  };
}

interface EventsSidebarProps {
  /** User id whose events should be shown. */
  userId: number;
  /** Whether the current viewer is the owner (enables add/delete controls). */
  isOwner: boolean;
  /** Max number of upcoming events to display (default: 5). */
  maxEvents?: number;
}

export default function EventsSidebar({
  userId,
  isOwner,
  maxEvents = 5,
}: EventsSidebarProps) {
  const queryClient = useQueryClient();

  /**
   * Fetch events for the given user.
   * The backend endpoint expects `user_id` as a query parameter.
   */
  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["events", userId],
    queryFn: async () => {
      const res = await api.get(`/events/?user_id=${userId}`);
      return res.data;
    },
  });

  // Local UI state for the "add event" form.
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [url, setUrl] = useState("");

  // Feedback banner state for success/error messages.
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  /**
   * Mutation for adding a new event (owner-only).
   * On success, invalidate the events query so the list refreshes.
   */
  const addEventMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/events", { title, date, location: "", url });
      return res.data;
    },
    onSuccess: () => {
      // Refresh the cached events list.
      queryClient.invalidateQueries({ queryKey: ["events", userId] });

      // Reset form fields and close the form.
      setTitle("");
      setDate("");
      setUrl("");
      setShowAdd(false);

      // Show success feedback briefly.
      setMessage("Event added successfully!");
      setSuccess(true);
      setTimeout(() => setMessage(null), 3000);
    },
    onError: () => {
      // Show error feedback briefly.
      setMessage("Failed to add event.");
      setSuccess(false);
      setTimeout(() => setMessage(null), 3000);
    },
  });

  /**
   * Validates and submits the add-event form.
   * - Requires title and date
   * - Disallows dates in the past
   */
  const handleAddEvent = () => {
    if (!title || !date) {
      setMessage("Please provide a title and date.");
      setSuccess(false);
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Prevent adding events in the past.
    if (new Date(date) < new Date()) {
      setMessage("Events need to be in the future");
      setSuccess(false);
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    addEventMutation.mutate();
  };

  /**
   * Delete an event by id (owner-only) and refresh the list.
   */
  const deleteEvent = async (id: number) => {
    await api.delete(`/events/${id}`);
    queryClient.invalidateQueries({ queryKey: ["events", userId] });
  };

  // Only show events that are today or later.
  const upcomingEvents = events.filter(
    (event) => new Date(event.date) >= new Date()
  );

  // Limit how many we show in the sidebar.
  const displayedEvents = upcomingEvents.slice(0, maxEvents);

  return (
    <Card className="w-80 shrink-0 space-y-4 bg-neutral-900 border-neutral-800 text-neutral-100 p-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          🎟 <span>Upcoming Events</span>
        </h3>

        <div className="h-7 flex items-center">
          {isOwner ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowAdd(!showAdd)}
            >
              {showAdd ? "Cancel" : "+ Add"}
            </Button>
          ) : (
            <span className="invisible text-sm">+ Add</span>
          )}
        </div>
      </div>

      {/* ADD EVENT */}
      {showAdd && isOwner && (
        <div className="space-y-2 rounded-lg border border-neutral-700 bg-neutral-800 p-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event title"
            className="w-full rounded-md border border-neutral-700 px-3 py-2 text-sm bg-neutral-800 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-md border border-neutral-700 px-3 py-2 text-sm bg-neutral-800 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Event URL (optional)"
            className="w-full rounded-md border border-neutral-700 px-3 py-2 text-sm bg-neutral-800 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-600"
          />

          <Button
            variant="primary"
            size="sm"
            className="w-full bg-red-600 hover:bg-red-700"
            onClick={handleAddEvent}
          >
            Add Event
          </Button>

          {message && <Message text={message} success={success} />}
        </div>
      )}

      {/* EMPTY STATE */}
      {displayedEvents.length === 0 && (
        <p className="text-sm text-neutral-400">No upcoming events</p>
      )}

      {/* EVENTS */}
      <div className="flex flex-col gap-3">
        {displayedEvents.map((event) => {
          const { day, month } = getDateParts(event.date);

          const content = (
            <div className="flex gap-3 rounded-lg border border-neutral-700 bg-neutral-800 p-3 hover:bg-neutral-700 transition">
              {/* DATE */}
              <div className="flex w-12 flex-col items-center justify-center rounded-md bg-neutral-700 text-white">
                <div className="text-[10px] font-medium">{month}</div>
                <div className="text-lg font-bold leading-none">{day}</div>
              </div>

              {/* INFO */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-100 truncate">
                  {event.title}
                </p>
                <p className="text-xs text-neutral-400">{formatDate(event.date)}</p>

                {/* ACTION ROW */}
                <div className="mt-1 h-7 flex items-center">
                  {isOwner ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="text-red-500 hover:text-red-600"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteEvent(event.id);
                      }}
                    >
                      Delete
                    </Button>

                  ) : (
                    <span className="invisible text-xs">Delete</span>
                  )}
                </div>
              </div>
            </div>
          );

          /**
           * Link behavior:
           * - If the event has an explicit URL, use it.
           * - Otherwise, fall back to a Resident Advisor search for the event title.
           */          const linkUrl = event.url
            ? event.url
            : `https://www.residentadvisor.net/events.aspx?search=${encodeURIComponent(
                event.title
              )}`;

          return (
            <a
              key={event.id}
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {content}
            </a>
          );
        })}
      </div>

      {/* MORE */}
      {upcomingEvents.length > maxEvents && (
        <p className="text-xs text-neutral-400">
          +{upcomingEvents.length - maxEvents} more events
        </p>
      )}
    </Card>
  );
}

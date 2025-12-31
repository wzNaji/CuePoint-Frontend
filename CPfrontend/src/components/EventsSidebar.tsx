import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../api/axios";

interface Event {
  id: number;
  title: string;
  date: string;
  location?: string;
  url?: string; // new
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getDateParts(date: string) {
  const d = new Date(date);
  return {
    day: d.getDate(),
    month: d.toLocaleString("en", { month: "short" }).toUpperCase(),
  };
}

interface EventsSidebarProps {
  userId: number;
  isOwner: boolean;
  maxEvents?: number;
}

export default function EventsSidebar({
  userId,
  isOwner,
  maxEvents = 5,
}: EventsSidebarProps) {
  const queryClient = useQueryClient();

  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["events", userId],
    queryFn: async () => {
      const res = await api.get(`/events?user_id=${userId}`);
      return res.data;
    },
  });

  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [url, setUrl] = useState(""); // new

  const addEventMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/events", { title, date, location: "", url });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events", userId] });
      setTitle("");
      setDate("");
      setUrl("");
      setShowAdd(false);
    },
  });

  const deleteEvent = async (id: number) => {
    await api.delete(`/events/${id}`);
    queryClient.invalidateQueries({ queryKey: ["events", userId] });
  };

  const upcomingEvents = events.filter(
    (event) => new Date(event.date) >= new Date()
  );
  const displayedEvents = upcomingEvents.slice(0, maxEvents);

  return (
    <aside className="w-72 rounded-xl bg-white shadow-sm border border-gray-200 p-4">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          🎟 <span>Upcoming Events</span>
        </h3>

        {isOwner && (
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition"
          >
            {showAdd ? "Cancel" : "+ Add"}
          </button>
        )}
      </div>

      {/* ADD EVENT */}
      {showAdd && isOwner && (
        <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3 flex flex-col gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event title"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Event link (e.g., Resident Advisor)"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={() => addEventMutation.mutate()}
            className="mt-1 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500
                       text-white text-sm font-medium px-3 py-2
                       hover:opacity-90 transition"
          >
            Add Event
          </button>
        </div>
      )}

      {/* EMPTY STATE */}
      {displayedEvents.length === 0 && (
        <p className="text-sm text-gray-500">No upcoming events</p>
      )}

      {/* EVENTS */}
      <div className="flex flex-col gap-3">
        {displayedEvents.map((event) => {
          const { day, month } = getDateParts(event.date);

          const content = (
            <div className="flex gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50 transition">
              {/* DATE */}
              <div className="flex w-12 flex-col items-center justify-center rounded-md
                              bg-gradient-to-b from-indigo-500 to-purple-500
                              text-white">
                <div className="text-[10px] font-medium">{month}</div>
                <div className="text-lg font-bold leading-none">{day}</div>
              </div>

              {/* INFO */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                <p className="text-xs text-gray-500">{formatDate(event.date)}</p>

                {isOwner && (
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="mt-1 text-xs text-red-500 hover:text-red-700 transition"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          );

          // If URL exists, wrap content in a link
          return event.url ? (
            <a
              key={event.id}
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {content}
            </a>
          ) : (
            <div key={event.id}>{content}</div>
          );
        })}
      </div>

      {/* MORE */}
      {upcomingEvents.length > maxEvents && (
        <p className="mt-3 text-xs text-gray-500">
          +{upcomingEvents.length - maxEvents} more events
        </p>
      )}
    </aside>
  );
}

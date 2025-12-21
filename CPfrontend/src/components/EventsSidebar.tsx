import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../api/axios";

interface Event {
  id: number;
  title: string;
  date: string;
  location?: string;
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
  userId: number;      // ID of the profile being viewed
  isOwner: boolean;    // true if viewing your own profile
  maxEvents?: number;
}

export default function EventsSidebar({ userId, isOwner, maxEvents = 5 }: EventsSidebarProps) {
  const queryClient = useQueryClient();

  // Fetch events for the specific user
  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["events", userId],
    queryFn: async () => {
      const res = await api.get(`/events?user_id=${userId}`);
      console.log("Fetched events for user:", userId, events);

      return res.data;
    },
  });

  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  // Mutation for adding an event (owner only)
  const addEventMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/events", { title, date, location: "" });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events", userId] });
      setTitle("");
      setDate("");
      setShowAdd(false);
    },
  });

  // Delete an event (owner only)
  const deleteEvent = async (id: number) => {
    await api.delete(`/events/${id}`);
    queryClient.invalidateQueries({ queryKey: ["events", userId] });
  };

  const upcomingEvents = events.filter((event) => new Date(event.date) >= new Date());
  const displayedEvents = upcomingEvents.slice(0, maxEvents);

  return (
    <aside className="w-72 bg-black text-white p-4 rounded max-h-[400px] overflow-y-auto relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">🎟 Events</h3>

        {isOwner && (
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="text-green-400 text-sm font-bold px-2 py-1 rounded hover:bg-green-700 hover:text-white"
            title="Add Event"
          >
            + Add
          </button>
        )}
      </div>

      {showAdd && isOwner && (
        <div className="mb-4 flex flex-col gap-1 bg-gray-800 p-2 rounded">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="p-1 text-black text-sm rounded w-full"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-1 text-black text-sm rounded w-full"
          />
          <button
            onClick={() => addEventMutation.mutate()}
            className="bg-green-600 text-white text-sm px-2 py-1 rounded hover:bg-green-700"
          >
            Add
          </button>
        </div>
      )}

      {displayedEvents.length === 0 && (
        <p className="text-gray-400 text-sm">No upcoming events</p>
      )}

      {displayedEvents.map((event) => {
        const { day, month } = getDateParts(event.date);
        return (
          <div key={event.id} className="flex gap-3 mb-4">
            <div className="bg-gray-700 text-center rounded w-12 py-1 flex flex-col items-center justify-center">
              <div className="text-xs">{month}</div>
              <div className="text-lg font-bold">{day}</div>
            </div>
            <div>
              <div className="font-medium">{event.title}</div>
              <div className="text-sm text-gray-400">{formatDate(event.date)}</div>
              {isOwner && (
                <button
                  onClick={() => deleteEvent(event.id)}
                  className="text-xs text-red-400 mt-1"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        );
      })}

      {upcomingEvents.length > maxEvents && (
        <p className="text-gray-400 text-xs mt-2">
          +{upcomingEvents.length - maxEvents} more events
        </p>
      )}
    </aside>
  );
}

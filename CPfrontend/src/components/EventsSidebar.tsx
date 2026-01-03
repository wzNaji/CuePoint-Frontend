import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../api/axios";
import Button from "./button";
import Card from "./Card";

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
import Message from "./Message"; // make sure to import your Message component

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
  const [url, setUrl] = useState(""); 
  const [message, setMessage] = useState<string | null>(null); // <-- new
  const [success, setSuccess] = useState(false); // for Message component styling

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
      setMessage("Event added successfully!");
      setSuccess(true);
      setTimeout(() => setMessage(null), 3000); // hide after 3s
    },
    onError: () => {
      setMessage("Failed to add event.");
      setSuccess(false);
      setTimeout(() => setMessage(null), 3000);
    },
  });

  const handleAddEvent = () => {
    if (!title || !date) {
      setMessage("Please provide a title and date.");
      setSuccess(false);
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    if (new Date(date) < new Date()) {
      setMessage("Events need to be in the future");
      setSuccess(false);
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    addEventMutation.mutate();
  };

  const deleteEvent = async (id: number) => {
    await api.delete(`/events/${id}`);
    queryClient.invalidateQueries({ queryKey: ["events", userId] });
  };

  const upcomingEvents = events.filter(
    (event) => new Date(event.date) >= new Date()
  );

  const displayedEvents = upcomingEvents.slice(0, maxEvents);

  return (
    <Card
      className="
        w-80 shrink-0
        space-y-4
        bg-neutral-900
        border-neutral-800
        text-neutral-100
        p-4
      "
    >
      {/* HEADER */}
      {/* HEADER */}
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        🎟 <span>Upcoming Events</span>
      </h3>

      {/* ACTION SLOT (height reserved) */}
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
            className="
              w-full rounded-md
              border border-neutral-700
              px-3 py-2 text-sm
              bg-neutral-800 text-neutral-100
              focus:outline-none focus:ring-2 focus:ring-red-600
            "
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="
              w-full rounded-md
              border border-neutral-700
              px-3 py-2 text-sm
              bg-neutral-800 text-neutral-100
              focus:outline-none focus:ring-2 focus:ring-red-600
            "
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
            onClick={handleAddEvent} // <-- changed from direct mutate
            className="mt-1 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500
                       text-white text-sm font-medium px-3 py-2
                       hover:opacity-90 transition"
          >
            Add Event
          </button>

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
            <div className="flex gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50 transition">
              {/* DATE */}
              <div className="flex w-12 flex-col items-center justify-center rounded-md bg-neutral-700 text-white">
                <div className="text-[10px] font-medium">{month}</div>
                <div className="text-lg font-bold leading-none">{day}</div>
              </div>

              {/* INFO */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                <p className="text-xs text-gray-500">{formatDate(event.date)}</p>

                {/* ACTION ROW (height reserved) */}
                <div className="mt-1 h-7 flex items-center">
                  {isOwner ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => deleteEvent(event.id)}
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

          // If URL exists, wrap content in a link
          const linkUrl = event.url
            ? event.url
            : `https://www.residentadvisor.net/events.aspx?search=${encodeURIComponent(
                event.title
              )}`;

          return (
            <a key={event.id} href={linkUrl} target="_blank" rel="noopener noreferrer">
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

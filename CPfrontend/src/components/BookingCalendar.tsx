import { Calendar, dateFnsLocalizer, type SlotInfo, type View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import type { Booking } from "../types/booking";
import { useState } from "react";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface BookingEvent {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  booking: Booking;
}

interface BookingCalendarProps {
  bookings: Booking[];
  onSelectDate: (date: string) => void;
  onSelectBooking: (booking: Booking) => void;
}

export default function BookingCalendar({
  bookings,
  onSelectDate,
  onSelectBooking,
}: BookingCalendarProps) {
  const [view, setView] = useState<View>("month");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const events: BookingEvent[] = bookings.map((b) => ({
    title: b.location ?? "Booking request",
    start: new Date(`${b.date}T${b.start_time ?? "00:00"}`),
    end: new Date(`${b.date}T${b.end_time ?? "23:59"}`),
    allDay: b.start_time === null,
    booking: b,
  }));

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    const date = format(slotInfo.start, "yyyy-MM-dd");
    onSelectDate(date);
  };

  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm p-6">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-semibold text-gray-900">
          <span className="text-indigo-500">Bookings Calendar</span>
        </div>
        <div className="flex items-center gap-4">
          {/* VIEW SELECTOR */}
          <button
            onClick={() => setView("month")}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 transition"
          >
            Month View
          </button>
          <button
            onClick={() => setView("week")}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 transition"
          >
            Week View
          </button>
        </div>
      </div>

      {/* Calendar */}
      <Calendar<BookingEvent>
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={(event) => onSelectBooking(event.booking)}
        view={view}
        onView={(v) => setView(v)}
        date={currentDate}
        onNavigate={(newDate) => setCurrentDate(newDate)}
        dayLayoutAlgorithm="no-overlap"
        popup
        style={{ height: 600 }}
        eventPropGetter={(event) => {
          let backgroundColor = "#ccc"; // default
          if (event.booking.status === "requested") backgroundColor = "#facc15"; // yellow
          if (event.booking.status === "accepted") backgroundColor = "#22c55e"; // green
          if (event.booking.status === "rejected") backgroundColor = "#ef4444"; // red
          if (event.booking.status === "cancelled") backgroundColor = "#6b7280"; // gray

          return {
            style: { backgroundColor, color: "white", borderRadius: "4px", padding: "2px" },
          };
        }}
      />

      
    </div>
  );
}

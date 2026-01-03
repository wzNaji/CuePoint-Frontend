import { Calendar, dateFnsLocalizer, type SlotInfo, type View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, isToday } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import type { Booking } from "../types/booking";
import { useState } from "react";
import Button from "./button";
import Card from "./Card";

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

  const getEventColor = (status: string) => {
    switch (status) {
      case "requested":
        return "#f97316"; // orange-ish for requested
      case "accepted":
        return "#22c55e"; // green
      case "rejected":
        return "#b91c1c"; // red
      case "cancelled":
        return "#4b5563"; // gray
      default:
        return "#374151"; // gray default
    }
  };

  return (
    <Card className="mb-6 p-6">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-neutral-100">Bookings Calendar</h2>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={view === "month" ? "primary" : "secondary"}
            onClick={() => setView("month")}
          >
            Month
          </Button>
          <Button
            size="sm"
            variant={view === "week" ? "primary" : "secondary"}
            onClick={() => setView("week")}
          >
            Week
          </Button>
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
        style={{ height: 600, backgroundColor: "#1f1f1f", borderRadius: 12, padding: 4 }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: getEventColor(event.booking.status),
            color: "white",
            borderRadius: 8,
            padding: "2px 4px",
            fontSize: "0.75rem",
            fontWeight: 500,
          },
        })}
        dayPropGetter={(date) => {
          // All day cells dark, highlight today in red border
          const todayHighlight = isToday(date)
            ? { border: "2px solid #ef4444", borderRadius: 8 }
            : {};
          return {
            style: {
              backgroundColor: "#1f1f1f",
              ...todayHighlight,
            },
          };
        }}
      />
    </Card>
  );
}

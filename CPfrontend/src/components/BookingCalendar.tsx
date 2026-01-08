/**
 * BookingCalendar component
 *
 * Renders bookings in a calendar UI using react-big-calendar + date-fns localizer.
 *
 * Responsibilities:
 * - Convert backend booking objects into calendar "events"
 * - Allow selecting an empty date slot (to create/request a booking for that day)
 * - Allow selecting an existing booking event (to view/update details)
 *
 * Notes:
 * - `react-big-calendar` expects event `start`/`end` values as JavaScript `Date` objects.
 * - This component derives those `Date` objects from the booking's `date`, `start_time`,
 *   and `end_time` fields.
 */
import { Calendar, dateFnsLocalizer, type SlotInfo, type View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, isToday } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import type { Booking } from "../types/booking";
import { useState } from "react";
import Button from "./button";
import Card from "./Card";

/**
 * Localizer configuration for react-big-calendar.
 * This wires up date-fns formatting/parsing so the calendar can render dates
 * using the chosen locale and week rules.
 */
const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

/**
 * Internal event shape used by react-big-calendar.
 * We keep a reference to the original Booking so we can pass it back on selection.
 */
interface BookingEvent {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  booking: Booking;
}

/**
 * Props for BookingCalendar.
 *
 * - bookings: list of bookings to show as events
 * - onSelectDate: called when a user clicks an empty slot/day (YYYY-MM-DD)
 * - onSelectBooking: called when a user clicks an existing booking event
 */
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
  /**
   * Current calendar view mode ("month", "week", etc).
   * Defaults to month view.
   */
  const [view, setView] = useState<View>("month");

  /**
   * Current focused date in the calendar (used for navigation).
   */
  const [currentDate, setCurrentDate] = useState<Date>(new Date());


  /**
   * Map backend bookings into calendar events.
   *
   * - title: uses the booking location if available
   * - start/end: derived from booking date and optional time fields
   * - allDay: treated as all-day if there is no start_time
   *
   * Note:
   * - Constructing Date from a string like "YYYY-MM-DDTHH:mm" is interpreted in the
   *   user's local timezone by most browsers.
   */
  const events: BookingEvent[] = bookings.map((b) => ({
    title: b.location ?? "Booking request",
    start: new Date(`${b.date}T${b.start_time ?? "00:00"}`),
    end: new Date(`${b.date}T${b.end_time ?? "23:59"}`),
    allDay: b.start_time === null,
    booking: b,
  }));

  /**
   * Called when the user selects an empty date slot/day in the calendar.
   * Converts the slot's start date into an ISO-like "YYYY-MM-DD" string.
   */
  const handleSelectSlot = (slotInfo: SlotInfo) => {
    const date = format(slotInfo.start, "yyyy-MM-dd");
    onSelectDate(date);
  };

  /**
   * Returns a background color based on booking status.
   * Keeps visual semantics consistent across views.
   */
  const getEventColor = (status: string) => {
    switch (status) {
      case "requested":
        return "#f97316"; // orange-ish for requested
      case "accepted":
        return "#22c55e"; // green for accepted
      case "rejected":
        return "#b91c1c"; // red for rejected
      case "cancelled":
        return "#4b5563"; // gray for cancelled
      default:
        return "#374151"; // fallback
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

      {/* Calendar component*/}
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
        /**
         * Customize event styling based on booking status.
         * This controls the appearance of each event "pill" in the calendar.
         */
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
        /**
         * Customize day cell styling.
         * - All day cells share a dark background
         * - Today's date gets a highlighted border
         */
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

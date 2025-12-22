import {
  Calendar,
  dateFnsLocalizer,
  type SlotInfo,
} from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import type { Booking } from "../types/booking";

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
  const events: BookingEvent[] = bookings.map((b) => ({
    title: b.location ?? "Booking request",
    start: new Date(`${b.date}T${b.start_time ?? "00:00"}`),
    end: new Date(`${b.date}T${b.end_time ?? "23:59"}`),
    allDay: b.start_time === null,
    booking: b,
  }));

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    const date = slotInfo.start.toISOString().split("T")[0];
    onSelectDate(date);
  };

  return (
    <Calendar<BookingEvent>
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      selectable
      onSelectSlot={handleSelectSlot}
      onSelectEvent={(event) => onSelectBooking(event.booking)}
      defaultView="month"
      style={{ height: 600 }}
    />
  );
}

import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BookingCalendar from "../components/BookingCalendar";
import BookingRequestModal from "../components/BookingRequestModal";
import BookingDetailsModal from "../components/BookingDetailsModal";
import { api } from "../api/axios";
import type { Booking } from "../types/booking";

export default function BookingsPage() {
  const { userId } = useParams();
  const calendarOwnerId = Number(userId);
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Multi-toggle state
  const [showReceived, setShowReceived] = useState(true);  // bookings requested of me
  const [showRequested, setShowRequested] = useState(true); // bookings I requested

  // Fetch bookings
  const { data: bookings = [], isLoading, isError } = useQuery<Booking[]>({
    queryKey: ["bookings", calendarOwnerId],
    queryFn: () =>
      api
        .get("/bookings", { params: { user_id: calendarOwnerId } })
        .then((res) => res.data),
  });

  const { data: calendarOwner } = useQuery({
  queryKey: ["user", calendarOwnerId],
  queryFn: () => api.get(`/users/${calendarOwnerId}`).then(res => res.data),
  });


  // Filter based on toggles
  const filteredBookings = bookings.filter(
    (b) =>
      (showReceived && b.recipient_id === calendarOwnerId) ||
      (showRequested && b.requester_id === calendarOwnerId)
  );

  const createBookingMutation = useMutation({
    mutationFn: (data: {
      date: string;
      start_time: string | null;
      end_time: string | null;
      location: string | null;
      note: string | null;
      recipient_id: number;
    }) => api.post("/bookings", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings", calendarOwnerId] });
      setSelectedDate(null);
    },
  });

  const handleSelectDate = (date: string) => {
    setSelectedBooking(null);
    setSelectedDate(date);
  };

  const handleSubmitRequest = (data: {
    date: string;
    start_time?: string;
    end_time?: string;
    location?: string;
    note?: string;
  }) => {
    createBookingMutation.mutate({
      date: data.date,
      start_time: data.start_time ?? null,
      end_time: data.end_time ?? null,
      location: data.location ?? null,
      note: data.note ?? null,
      recipient_id: calendarOwnerId,
    });
  };

  if (isLoading) return <div>Loading bookings...</div>;
  if (isError) return <div>Failed to load bookings.</div>;

  return (
    <div>
      <h1>Bookings</h1>

      {/* Multi-toggle buttons */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setShowReceived((prev) => !prev)}
          className={`px-3 py-1 rounded ${
            showReceived ? "bg-blue-600 text-white" : "border"
          }`}
        >
          Bookings I am requesting of {calendarOwner?.display_name}
        </button>
        <button
          onClick={() => setShowRequested((prev) => !prev)}
          className={`px-3 py-1 rounded ${
            showRequested ? "bg-blue-600 text-white" : "border"
          }`}
        >
          Bookings I been requested to
        </button>
      </div>

      <BookingCalendar
        bookings={filteredBookings}
        onSelectDate={handleSelectDate}
        onSelectBooking={(booking) => setSelectedBooking(booking)}
      />

      {selectedDate && (
        <BookingRequestModal
          date={selectedDate}
          onClose={() => setSelectedDate(null)}
          onSubmit={handleSubmitRequest}
        />
      )}

      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}

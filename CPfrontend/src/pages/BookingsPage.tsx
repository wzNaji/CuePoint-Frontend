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
  const calendarOwnerId = Number(userId); // 🔴 SOURCE OF TRUTH
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Fetch bookings for THIS calendar owner
  const { data: bookings = [], isLoading, isError } = useQuery<Booking[]>({
    queryKey: ["my-bookings"],
    queryFn: () =>
      api
        .get("/bookings")
        .then((res) => res.data),
  });

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
      queryClient.invalidateQueries({
        queryKey: ["bookings", calendarOwnerId],
      });
      setSelectedDate(null);
    },
  });

  const handleSelectDate = (date: string) => {
    setSelectedBooking(null); // ⛔ prevent conflict
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

      <BookingCalendar
        bookings={bookings}
        onSelectDate={handleSelectDate}
        onSelectBooking={(booking) => {
          setSelectedDate(null); // ⛔ prevent conflict
          setSelectedBooking(booking);
        }}
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

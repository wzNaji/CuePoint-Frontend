import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BookingCalendar from "../components/BookingCalendar";
import BookingRequestModal from "../components/BookingRequestModal";
import BookingDetailsModal from "../components/BookingDetailsModal";
import { api } from "../api/axios";
import type { Booking } from "../types/booking";

export default function BookingsPage() {
  const { userId } = useParams<{ userId: string }>();
  const calendarOwnerId = Number(userId);
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Toggle state for showing requested or all bookings
  const [showReceived, setShowReceived] = useState(true);
  const [showRequested, setShowRequested] = useState(true);

  // 🔐 Current logged-in user
  const { data: currentUser } = useQuery({
    queryKey: ["me"],
    queryFn: () => api.get("/me").then((res) => res.data),
  });

  const currentUserId = currentUser?.id;
  const isOwnCalendar = currentUserId === calendarOwnerId;

  // 📅 Fetch bookings (only bookings involving current user)
  const {
    data: bookings = [],
    isLoading,
    isError,
  } = useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: () => api.get("/bookings").then((res) => res.data),
    enabled: !!currentUserId,
  });

  // 👤 Fetch calendar owner (profile being viewed)
  const { data: calendarOwner } = useQuery({
    queryKey: ["user", calendarOwnerId],
    queryFn: () =>
      api.get(`/me/users/${calendarOwnerId}`).then((res) => res.data),
    enabled: !isNaN(calendarOwnerId),
  });

  // 🎯 Set correct default toggle behavior
  useEffect(() => {
    if (!currentUserId || isNaN(calendarOwnerId)) return;

    if (isOwnCalendar) {
      // Show all requests when viewing your own calendar (sent + received)
      setShowRequested(true);
      setShowReceived(true);
    } else {
      // Show only requests to the calendar owner when viewing someone else's calendar
      setShowRequested(false);
      setShowReceived(true);
    }
  }, [isOwnCalendar, currentUserId, calendarOwnerId]);

  // 🔎 Filter bookings based on context
  const filteredBookings = bookings.filter((b) => {
    if (!currentUserId) return false;

    if (isOwnCalendar) {
      return (
        showRequested &&
        (b.requester_id === currentUserId || b.recipient_id === currentUserId)
      );
    }

    // Viewing someone else's calendar (only show received requests)
    return showReceived && b.recipient_id === calendarOwnerId;
  });

  // ➕ Create booking
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
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setSelectedDate(null);
    },
  });

  const handleSelectDate = (date: string) => {
    setSelectedBooking(null); // Ensure no selected booking
    setSelectedDate(date); // Show modal for selected date
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

  if (isLoading) return <p>Loading bookings...</p>;
  if (isError) return <p>Failed to load bookings.</p>;

  return (
    <div className="space-y-6">
      {/* Single button based on calendar view */}
      <div className="flex flex-wrap gap-2">
        {isOwnCalendar ? (
          <button
            onClick={() => setShowRequested((prev) => !prev)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
              showRequested ? "bg-indigo-600 text-white" : "bg-white text-gray-900"
            }`}
          >
            Show All Requests (Sent & Received)
          </button>
        ) : (
          <button
            onClick={() => setShowReceived((prev) => !prev)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
              showReceived ? "bg-indigo-600 text-white" : "bg-white text-gray-900"
            }`}
          >
            My Requests to: {calendarOwner?.display_name}
          </button>
        )}
      </div>

      {/* Calendar */}
      <BookingCalendar
        bookings={filteredBookings}
        onSelectDate={handleSelectDate}
        onSelectBooking={(booking) => setSelectedBooking(booking)}
      />

      {/* Modals */}
      {selectedDate && (
        <BookingRequestModal
          date={selectedDate}
          onClose={() => setSelectedDate(null)} // Close modal when date is null
          onSubmit={handleSubmitRequest}
        />
      )}

      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)} // Close modal when booking is null
        />
      )}
    </div>
  );
}

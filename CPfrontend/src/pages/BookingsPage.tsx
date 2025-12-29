import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import BookingCalendar from "../components/BookingCalendar";
import BookingRequestModal from "../components/BookingRequestModal";
import BookingDetailsModal from "../components/BookingDetailsModal";
import { api } from "../api/axios";
import { fetchCurrentUser } from "../api/auth";
import type { Booking } from "../types/booking";

export default function BookingsPage() {
  const { userId } = useParams<{ userId: string }>();
  const calendarOwnerId = Number(userId);
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Toggle state
  const [showMyRequestsToUser, setShowMyRequestsToUser] = useState(false);
  const [showAllMyRequests, setShowAllMyRequests] = useState(false);

  // 🔐 Current logged-in user
  const { data: currentUser } = useQuery({
    queryKey: ["me"],
    queryFn: fetchCurrentUser,
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
      setShowAllMyRequests(true);
      setShowMyRequestsToUser(false);
    } else {
      setShowAllMyRequests(false);
      setShowMyRequestsToUser(true);
    }
  }, [isOwnCalendar, currentUserId, calendarOwnerId]);

  // 🔎 Filter bookings based on context
  const filteredBookings = bookings.filter((b) => {
    if (!currentUserId) return false;

    if (isOwnCalendar) {
      return (
        showAllMyRequests &&
        (b.requester_id === currentUserId ||
          b.recipient_id === currentUserId)
      );
    }

    // Viewing someone else's calendar
    return (
      showMyRequestsToUser &&
      b.requester_id === currentUserId &&
      b.recipient_id === calendarOwnerId
    );
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

  if (isLoading) return <p>Loading bookings...</p>;
  if (isError) return <p>Failed to load bookings.</p>;

  return (
    <div className="space-y-6">
      {/* Toggle buttons */}
      <div className="flex flex-wrap gap-2">
        {!isOwnCalendar && (
          <button
            onClick={() =>
              setShowMyRequestsToUser((prev) => !prev)
            }
            className={`px-3 py-1 rounded ${
              showMyRequestsToUser
                ? "bg-blue-600 text-white"
                : "border"
            }`}
          >
            My Requests to: {calendarOwner?.display_name}
          </button>
        )}

        {isOwnCalendar && (
          <button
            onClick={() =>
              setShowAllMyRequests((prev) => !prev)
            }
            className={`px-3 py-1 rounded ${
              showAllMyRequests
                ? "bg-blue-600 text-white"
                : "border"
            }`}
          >
            All My Requests (Sent & Received)
          </button>
        )}
      </div>

      {/* Calendar */}
      <BookingCalendar
        bookings={filteredBookings}
        onSelectDate={handleSelectDate}
        onSelectBooking={(booking) =>
          setSelectedBooking(booking)
        }
      />

      {/* Modals */}
      {selectedDate && !isOwnCalendar && (
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

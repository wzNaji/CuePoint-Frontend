import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import BookingCalendar from "../components/BookingCalendar";
import BookingRequestModal from "../components/BookingRequestModal";
import BookingDetailsModal from "../components/BookingDetailsModal";
import Button from "../components/button";
import Card from "../components/Card";

import { api } from "../api/axios";
import type { Booking } from "../types/booking";

export default function BookingsPage() {
  const { userId } = useParams<{ userId: string }>();
  const calendarOwnerId = Number(userId);
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const [showReceived, setShowReceived] = useState(true);
  const [showRequested, setShowRequested] = useState(true);

  const { data: currentUser } = useQuery({
    queryKey: ["me"],
    queryFn: () => api.get("/me").then((res) => res.data),
  });

  const currentUserId = currentUser?.id;
  const isOwnCalendar = currentUserId === calendarOwnerId;

  const { data: calendarOwner } = useQuery({
    queryKey: ["user", calendarOwnerId],
    queryFn: () => api.get(`/users/${calendarOwnerId}`).then((res) => res.data),
    enabled: !isNaN(calendarOwnerId),
  });

  const { data: bookings = [], isLoading, isError } = useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: () => api.get("/bookings").then((res) => res.data),
    enabled: !!currentUserId,
  });

  useEffect(() => {
    if (!currentUserId || isNaN(calendarOwnerId)) return;
    if (isOwnCalendar) {
      setShowRequested(true);
      setShowReceived(true);
    } else {
      setShowRequested(false);
      setShowReceived(true);
    }
  }, [isOwnCalendar, currentUserId, calendarOwnerId]);

  const filteredBookings = bookings.filter((b) => {
    if (!currentUserId) return false;
    if (isOwnCalendar) {
      return showRequested && (b.requester_id === currentUserId || b.recipient_id === currentUserId);
    }
    return showReceived && b.recipient_id === calendarOwnerId;
  });

  const createBookingMutation = useMutation({
    mutationFn: (data: {
      date: string;
      start_time?: string | null;
      end_time?: string | null;
      location?: string | null;
      note?: string | null;
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

  if (isLoading) return <p className="p-6 text-white">Loading bookings...</p>;
  if (isError) return <p className="p-6 text-white">Failed to load bookings.</p>;

  return (
    <div className="space-y-6">
      {/* TOGGLE BUTTON */}
      <div className="flex flex-wrap gap-2">
  {isOwnCalendar ? (
    <Button
      size="md"
      onClick={() => setShowRequested((prev) => !prev)}
      className={`px-4 py-2 rounded-lg text-md font-medium border transition
        ${showRequested
          ? "bg-red-700 text-white border-red-700" // highlighted state
          : "bg-gray-800 text-red-600 border-gray-700 hover:bg-gray-700" // off state
        }`}
    >
      Show All Requests (Sent & Received)
    </Button>
  ) : (
    <Button
      size="md"
      onClick={() => setShowReceived((prev) => !prev)}
      className={`px-4 py-2 rounded-lg text-md font-medium border transition
        ${showReceived
          ? "bg-red-700 text-white border-red-700" // highlighted
          : "bg-gray-800 text-red-600 border-gray-700 hover:bg-gray-700" // off
        }`}
    >
      Requests to: {calendarOwner?.display_name || "User"}
    </Button>
  )}
</div>



      {/* CALENDAR */}
      <Card className="p-4 bg-gray-900 border-gray-800">
        <BookingCalendar
          bookings={filteredBookings}
          onSelectDate={handleSelectDate}
          onSelectBooking={(booking) => setSelectedBooking(booking)}
        />
      </Card>

      {/* BOOKING MODALS */}
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

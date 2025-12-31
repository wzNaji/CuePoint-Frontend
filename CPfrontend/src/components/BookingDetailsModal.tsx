import type { Booking } from "../types/booking";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/axios";
import { useCurrentUser } from "../hooks/useCurrentUser";

interface BookingDetailsModalProps {
  booking: Booking;
  onClose: () => void;
}

export default function BookingDetailsModal({
  booking,
  onClose,
}: BookingDetailsModalProps) {
  const queryClient = useQueryClient();

  const { data: currentUser, isLoading } = useCurrentUser();

  const updateStatusMutation = useMutation({
    mutationFn: (status: "accepted" | "rejected" | "cancelled") =>
      api.patch(`/bookings/${booking.id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      onClose();
    },
  });

  const updateStatus = (status: "accepted" | "rejected" | "cancelled") => {
    updateStatusMutation.mutate(status);
  };

  if (isLoading || !currentUser) return null;

  const isRequester = booking.requester_id === currentUser.id;
  const isRecipient = booking.recipient_id === currentUser.id;
  const isPending = booking.status === "requested";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {booking.location || "Booking details"}
        </h2>

        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <strong>Date:</strong> {booking.date}
          </p>
          <p><strong>Requester:</strong> {booking.requester_displayname}</p>
          <p><strong>Recipient:</strong> {booking.recipient_displayname}</p>
          <p>
            <strong>Time:</strong>{" "}
            {booking.start_time ?? "All day"}
            {booking.end_time ? ` – ${booking.end_time}` : ""}
          </p>
          <p><strong>Fee:</strong> {booking.fee ?? "Not specified"}</p>
          <p><strong>Status:</strong> {booking.status}</p>
          {booking.note && <p><strong>Note:</strong> {booking.note}</p>}
        </div>

        {/* ACTION BUTTONS */}
        {isPending && isRecipient && (
          <div className="mt-6 flex gap-2">
            <button
              onClick={() => updateStatus("accepted")}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-2 rounded-lg shadow-sm hover:opacity-90 transition"
            >
              Accept
            </button>
            <button
              onClick={() => updateStatus("rejected")}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg shadow-sm hover:opacity-90 transition"
            >
              Decline
            </button>
          </div>
        )}

        {isPending && isRequester && (
          <button
            onClick={() => updateStatus("cancelled")}
            className="mt-6 w-full border border-gray-300 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel request
          </button>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full border border-gray-300 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

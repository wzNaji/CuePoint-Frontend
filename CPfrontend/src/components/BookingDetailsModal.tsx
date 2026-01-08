import type { Booking } from "../types/booking";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/axios";
import { useCurrentUser } from "../hooks/useCurrentUser";
import Button from "./button";
import Card from "./Card";

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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full p-6 bg-neutral-900 border-neutral-800 text-neutral-100">
        <h2 className="text-xl font-semibold mb-4">{booking.location || "Booking details"}</h2>

        <div className="space-y-3 text-sm text-neutral-200">
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
            <Button
              className="flex-1"
              variant="secondary"
              onClick={() => updateStatus("accepted")}
            >
              Accept
            </Button>
            <Button
              className="flex-1"
              variant="secondary"
              onClick={() => updateStatus("rejected")}
            >
              Decline
            </Button>
          </div>
        )}

        {isPending && isRequester && (
          <Button
            className="mt-6 w-full"
            variant="secondary"
            onClick={() => updateStatus("cancelled")}
          >
            Cancel request
          </Button>
        )}

        <Button
          className="mt-4 w-full"
          variant="secondary"
          onClick={onClose}
        >
          Close
        </Button>
      </Card>
    </div>
  );
}

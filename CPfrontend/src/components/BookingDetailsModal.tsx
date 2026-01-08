/**
 * BookingDetailsModal component
 *
 * Displays detailed information about a single booking and provides status
 * actions (accept/reject/cancel) depending on:
 * - whether the current user is the requester or recipient
 * - whether the booking is still in the "requested" state
 *
 * Data flow:
 * - Receives `booking` from parent (selected calendar event/list item)
 * - Fetches the current user via `useCurrentUser` (react-query hook)
 * - Uses a mutation to PATCH booking status and then invalidates the "bookings" query
 */


import type { Booking } from "../types/booking";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/axios";
import { useCurrentUser } from "../hooks/useCurrentUser";
import Button from "./button";
import Card from "./Card";

interface BookingDetailsModalProps {
    /** Booking object to display in the modal. */
  booking: Booking;
    /** Called when the modal should be dismissed. */
  onClose: () => void;
}

export default function BookingDetailsModal({
  booking,
  onClose,
}: BookingDetailsModalProps) {
  /**
   * React Query client used to invalidate cached queries after a mutation,
   * so the UI refreshes with the latest booking status.
   */
  const queryClient = useQueryClient();

  /**
   * Current authenticated user (used to determine what actions are permitted).
   */
  const { data: currentUser, isLoading } = useCurrentUser();

  /**
   * Mutation to update booking status.
   *
   * Backend rules enforced server-side:
   * - Only recipient can accept/reject while status is "requested"
   * - Only requester can cancel while status is "requested"
   *
   * UI mirrors those rules by conditionally rendering the action buttons.
   */
  const updateStatusMutation = useMutation({
    mutationFn: (status: "accepted" | "rejected" | "cancelled") =>
      api.patch(`/bookings/${booking.id}/status`, { status }),
    onSuccess: () => {
            // Ensure any booking lists/calendars reflect the latest state.
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      onClose();
    },
  });

  /**
   * Convenience wrapper around the mutation.
   */
  const updateStatus = (status: "accepted" | "rejected" | "cancelled") => {
    updateStatusMutation.mutate(status);
  };

  /**
   * Avoid rendering until we know who the current user is. This prevents
   * briefly showing action buttons before permissions can be determined.
   */
  if (isLoading || !currentUser) return null;

  // Permission flags for conditional actions.
  const isRequester = booking.requester_id === currentUser.id;
  const isRecipient = booking.recipient_id === currentUser.id;

  // Only pending bookings can be acted on.
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

        {/* ACTION BUTTONS
            Only render actions when the booking is pending ("requested") and
            the current user is authorized for that action. */}

        {/* Recipient actions: accept / reject */}
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

        {/* Requester action: cancel */}
        {isPending && isRequester && (
          <Button
            className="mt-6 w-full"
            variant="secondary"
            onClick={() => updateStatus("cancelled")}
          >
            Cancel request
          </Button>
        )}

        {/* Always-available close button */}
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

import type { Booking } from "../types/booking";

interface BookingDetailsModalProps {
  booking: Booking;
  onClose: () => void;
}

export default function BookingDetailsModal({
  booking,
  onClose,
}: BookingDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {booking.location || "Booking details"}
        </h2>

        <div className="space-y-2 text-sm">
          <p><strong>Date:</strong> {booking.date}</p>
          <p><strong>Time:</strong> {booking.start_time ?? "All day"} – {booking.end_time ?? ""}</p>
          <p><strong>Fee:</strong> {booking.fee ?? "Not specified"}</p>
          <p><strong>Status:</strong> {booking.status}</p>
          {booking.note && <p><strong>Note:</strong> {booking.note}</p>}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full border py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
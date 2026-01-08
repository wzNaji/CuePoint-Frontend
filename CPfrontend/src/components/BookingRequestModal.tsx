/**
 * BookingRequestModal component
 *
 * Modal wrapper for creating a booking request for a specific date.
 *
 * Responsibilities:
 * - Provide a centered overlay/modal layout
 * - Display the selected date in the header
 * - Render `BookingRequestForm` and forward submitted form data to the parent
 *
 * Data flow:
 * - Parent provides the selected `date`
 * - `BookingRequestForm` handles input + validation
 * - On submit, this modal forwards the payload upward via `onSubmit`
 * - On cancel, the modal closes via `onClose`
 */

import BookingRequestForm from "./BookingRequestForm";
import Card from "./Card";

interface BookingRequestModalProps {
  /** Selected date (YYYY-MM-DD) for the booking request. */
  date: string;
  /** Called when the modal should be dismissed. */
  onClose: () => void;
  /**
   * Called with booking request payload when the form is submitted.
   * Parent is responsible for sending the request to the backend.
   */
  onSubmit: (data: {
    date: string;
    start_time?: string;
    end_time?: string;
    fee?: number;
    location?: string;
    note?: string;
  }) => void;
}

export default function BookingRequestModal({
  date,
  onClose,
  onSubmit,
}: BookingRequestModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6 space-y-6 bg-neutral-900 border-neutral-800 text-neutral-100">
        <h2 className="text-xl font-semibold text-neutral-100">
          Booking request for {date}
        </h2>

        {/* Booking Request Form */}
        <BookingRequestForm
          date={date}
          onSubmit={(formData) =>
            onSubmit({
              date,
              ...formData,
            })
          }
          onCancel={onClose}
        />
      </Card>
    </div>
  );
}

import BookingRequestForm from "./BookingRequestForm";

interface BookingRequestModalProps {
  date: string;
  onClose: () => void;
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
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          Booking request for {date}
        </h2>

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
      </div>
    </div>
  );
}

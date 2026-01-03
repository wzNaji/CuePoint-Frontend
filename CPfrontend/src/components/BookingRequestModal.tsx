import BookingRequestForm from "./BookingRequestForm";
import Card from "./Card";
import Button from "./button";

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

        {/* Close Button */}
        <Button
          onClick={onClose}
          variant="secondary"
          size="md"
          className="w-full"
        >
          Close
        </Button>
      </Card>
    </div>
  );
}

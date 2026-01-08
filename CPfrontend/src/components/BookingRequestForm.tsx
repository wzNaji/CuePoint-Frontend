import { useState } from "react";
import Button from "./button";
import Card from "./Card";
import Message from "./Message";

interface BookingRequestFormProps {
  date: string; // YYYY-MM-DD
  onSubmit: (data: {
    date: string;
    start_time?: string;
    end_time?: string;
    fee?: number;
    location?: string;
    note?: string;
  }) => void;
  onCancel: () => void;
}

export default function BookingRequestForm({
  date,
  onSubmit,
  onCancel,
}: BookingRequestFormProps) {
  const [startTime, setStartTime] = useState("18:00");
  const [endTime, setEndTime] = useState("21:00");
  const [fee, setFee] = useState<number | undefined>();
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // validate date on submit
    const selected = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selected < today) {
      setError("You cannot request a booking for a past date.");
      return;
    }

    setError(null);

    onSubmit({
      date,
      start_time: startTime,
      end_time: endTime,
      fee,
      location: location.trim() || "Unknown Location",
      note,
    });
  };

  return (
    <Card className="space-y-4 bg-neutral-900 border-neutral-800 text-neutral-100">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error message */}
        {error && <Message text={error} />}

        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full border border-neutral-700 p-3 rounded-lg bg-neutral-950 text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-full border border-neutral-700 p-3 rounded-lg bg-neutral-950 text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <input
          type="number"
          placeholder="Fee"
          min={0}
          value={fee ?? ""}
          onChange={(e) =>
            setFee(e.target.value ? Number(e.target.value) : undefined)
          }
          className="w-full border border-neutral-700 p-3 rounded-lg bg-neutral-950 text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border border-neutral-700 p-3 rounded-lg bg-neutral-950 text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <textarea
          placeholder="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border border-neutral-700 p-3 rounded-lg bg-neutral-950 text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <div className="space-y-2">
          <Button type="submit" variant="secondary" size="md" className="w-full">
            Send booking request
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="md"
            className="w-full text-red-600"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}

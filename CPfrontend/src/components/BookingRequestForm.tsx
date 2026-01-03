import { useState } from "react";
import Button from "./button";
import Card from "./Card";

interface BookingRequestFormProps {
  date: string;
  onSubmit: (data: {
    start_time?: string;
    end_time?: string;
    fee?: number;
    location?: string;
    note?: string;
  }) => void;
  onCancel: () => void;
}

export default function BookingRequestForm({
  onSubmit,
  onCancel,
}: BookingRequestFormProps) {
  const [startTime, setStartTime] = useState("18:00");
  const [endTime, setEndTime] = useState("21:00");
  const [fee, setFee] = useState<number | undefined>();
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");

  return (
    <Card className="space-y-4 bg-neutral-900 border-neutral-800 text-neutral-100">
      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            start_time: startTime,
            end_time: endTime,
            fee,
            location: location.trim() || "Unknown Location",
            note,
          });
        }}
        className="space-y-4"
      >
        {/* Start Time */}
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full border border-neutral-700 p-3 rounded-lg bg-neutral-950 text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {/* End Time */}
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-full border border-neutral-700 p-3 rounded-lg bg-neutral-950 text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {/* Fee */}
        <input
          type="number"
          placeholder="Fee"
          value={fee ?? ""}
          onChange={(e) => setFee(Number(e.target.value))}
          className="w-full border border-neutral-700 p-3 rounded-lg bg-neutral-950 text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {/* Location */}
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border border-neutral-700 p-3 rounded-lg bg-neutral-950 text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {/* Note */}
        <textarea
          placeholder="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border border-neutral-700 p-3 rounded-lg bg-neutral-950 text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {/* Buttons */}
        <div className="space-y-2">
          <Button type="submit" variant="primary" size="md" className="w-full">
            Send booking request
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="md"
            className="w-full"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}

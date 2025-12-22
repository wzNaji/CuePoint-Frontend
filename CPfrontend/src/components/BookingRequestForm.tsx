import { useState } from "react";

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
  const [fee, setFee] = useState<number | undefined>(100);
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          start_time: startTime,
          end_time: endTime,
          fee,
          location,
          note,
        });
      }}
      className="space-y-3"
    >
      <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full border p-2 rounded" />
      <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full border p-2 rounded" />
      <input type="number" placeholder="Fee" value={fee ?? ""} onChange={(e) => setFee(Number(e.target.value))} className="w-full border p-2 rounded" />
      <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full border p-2 rounded" />
      <textarea placeholder="Note" value={note} onChange={(e) => setNote(e.target.value)} className="w-full border p-2 rounded" />

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
        Send booking request
      </button>

      <button type="button" onClick={onCancel} className="w-full border py-2 rounded">
        Cancel
      </button>
    </form>
  );
}

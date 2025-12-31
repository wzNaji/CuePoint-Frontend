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
  const [fee, setFee] = useState<number | undefined>();
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
          location: location.trim() || "Unknown Location",
          note,
        });
      }}
      className="space-y-4 rounded-xl border border-gray-200 bg-white shadow-sm p-6"
    >
      {/* Start Time */}
      <input
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      
      {/* End Time */}
      <input
        type="time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      
      {/* Fee */}
      <input
        type="number"
        placeholder="Fee"
        value={fee ?? ""}
        onChange={(e) => setFee(Number(e.target.value))}
        className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      
      {/* Location */}
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      
      {/* Note */}
      <textarea
        placeholder="Note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full border border-gray-300 p-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg shadow-sm hover:opacity-90 transition"
      >
        Send booking request
      </button>

      {/* Cancel Button */}
      <button
        type="button"
        onClick={onCancel}
        className="w-full border border-gray-300 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition"
      >
        Cancel
      </button>
    </form>
  );
}

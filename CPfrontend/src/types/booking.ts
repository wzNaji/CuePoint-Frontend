export interface Booking {
  id: number;
  requester_id: number;
  recipient_id: number;
  requester_displayname?: string;
  recipient_displayname?: string;
  date: string;
  start_time?: string | null;
  end_time?: string | null;
  fee?: number | null;
  location?: string | null;
  status: "requested" | "accepted" | "rejected" | "cancelled";
  note?: string | null;
  created_at: string;
}

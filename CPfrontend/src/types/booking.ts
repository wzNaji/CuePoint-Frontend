export interface Booking {
  id: number;
  requester_id: number;
  recipient_id: number;
  date: string;
  start_time: string | null;
  end_time: string | null;
  fee: number | null;
  location: string | null;
  status: string;
  note: string | null;
  created_at: string;
}
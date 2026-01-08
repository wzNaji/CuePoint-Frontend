/**
 * Message component
 *
 * Small, reusable status banner for inline feedback (success/error).
 *
 * Responsibilities:
 * - Display a short message string
 * - Apply success vs. error styling based on the `success` prop
 *
 * Usage:
 * - Use `success={true}` for confirmation messages
 * - Omit `success` (defaults to false) for error messages
 */

// src/components/Message.tsx
interface MessageProps {
  /** Text content to display inside the message banner. */
  text: string;

  /** When true, render as a success message; otherwise render as an error message. */
  success?: boolean;
}

export default function Message({ text, success = false }: MessageProps) {
  return (
    <div
      className={`mt-4 w-full max-w-md mx-auto px-4 py-2 text-center rounded-lg text-sm font-medium
      ${success ? "bg-green-500/10 text-green-500" : "bg-red-900/20 text-red-500"} shadow-sm`}
    >
      {text}
    </div>
  );
}

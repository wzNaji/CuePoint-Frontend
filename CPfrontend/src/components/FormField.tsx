/**
 * FormField component
 *
 * Reusable controlled input field with optional inline error display.
 *
 * Responsibilities:
 * - Render a styled <input> with consistent spacing and focus states
 * - Forward value changes to the parent via `onChange`
 * - Show an error message and error styling when `error` is provided
 *
 * Notes:
 * - `required` is always set, so use this component only for required fields
 *   unless you change that behavior.
 */

interface FormFieldProps {
  /** Input type (e.g., "text", "email", "password"). */
  type: string;

  /** Placeholder text shown when the input is empty. */
  placeholder: string;

  /** Current input value (controlled component). */
  value: string;

  /** Called with the next value whenever the user edits the input. */
  onChange: (value: string) => void;

  /** Optional validation error message to display below the input. */
  error?: string;
}

export default function FormField({
  type,
  placeholder,
  value,
  onChange,
  error,
}: FormFieldProps) {
  return (
    <div className="mb-4">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        // When `error` exists, apply red border and red focus ring; otherwise default styling.
        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 transition
          ${
            error
              ? "border-red-400 focus:ring-red-400"
              : "border-neutral-700 focus:ring-primary"
          }
          bg-neutral-950 text-neutral-100`}
      />

      {/* Inline validation feedback */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

interface FormFieldProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
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
        className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 transition
          ${error ? "border-red-400 focus:ring-red-400" : "border-neutral-700 focus:ring-primary"}
          bg-neutral-950 text-neutral-100`}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}

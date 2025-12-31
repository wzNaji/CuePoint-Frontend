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
          ${error ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-blue-400"}
          bg-white text-gray-900`}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}

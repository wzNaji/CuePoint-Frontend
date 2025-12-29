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
    <div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="border p-2 rounded w-full"
      />
      {error && <p className="text-red-500 mt-1">{error}</p>}
    </div>
  );
}

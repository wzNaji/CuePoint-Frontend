// src/components/Message.tsx
interface MessageProps {
  text: string;
  success?: boolean; // optional, default = false
}

export default function Message({ text, success = false }: MessageProps) {
  return (
    <p
      className={`mt-4 text-sm text-center ${
        success ? "text-green-500" : "text-red-500"
      }`}
    >
      {text}
    </p>
  );
}

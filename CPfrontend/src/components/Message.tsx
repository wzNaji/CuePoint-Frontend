// src/components/Message.tsx
interface MessageProps {
  text: string;
  success?: boolean;
}

export default function Message({ text, success = false }: MessageProps) {
  return (
    <div
      className={`mt-4 w-full max-w-md mx-auto px-4 py-2 text-center rounded-md 
                  text-sm font-medium
                  ${success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
    >
      {text}
    </div>
  );
}

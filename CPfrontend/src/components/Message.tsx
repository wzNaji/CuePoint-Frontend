// src/components/Message.tsx
interface MessageProps {
  text: string;
  success?: boolean;
}

export default function Message({ text, success = false }: MessageProps) {
  return (
  <div
    className={`mt-4 w-full max-w-md mx-auto px-4 py-2 text-center rounded-lg text-sm font-medium
      ${success 
        ? "bg-green-500/10 text-green-500" 
        : "bg-red-900/20 text-red-500"} shadow-sm`}
  >
    {text}
  </div>

  );
}

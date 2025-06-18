// src/components/Message.tsx
import { type MessageType } from "../types/index";

interface MessageProps {
  message: MessageType;
}

export default function Message({ message }: MessageProps) {
  if (!message) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
        message.type === "success" ? "bg-green-500" : "bg-red-500"
      } text-white max-w-md transition-all duration-300`}
    >
      {message.content}
    </div>
  );
}

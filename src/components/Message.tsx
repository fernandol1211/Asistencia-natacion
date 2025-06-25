"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export type MessageType = {
  type: "success" | "error";
  content: string;
} | null;

interface MessageProps {
  message: MessageType;
}

export default function Message({ message }: MessageProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [message]);

  const handleClose = () => {
    setVisible(false);
  };

  if (!visible || !message) return null;

  const isSuccess = message.type === "success";
  const Icon = isSuccess ? CheckCircle2 : XCircle;
  const title = isSuccess ? "¡Éxito!" : "Error";

  return (
    <div className="fixed top-6 right-6 z-50 w-[min(90vw,24rem)] animate-in slide-in-from-top-2 duration-300">
      <Alert
        className={`shadow-xl border-0 rounded-lg ${
          isSuccess ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}
      >
        <div className="flex items-start justify-between gap-4 p-5">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Icon className="h-5 w-5 mt-0.5 flex-shrink-0 text-white" />
            <div className="flex-1 min-w-0">
              <AlertTitle className="font-semibold text-base text-white mb-1">
                {title}
              </AlertTitle>
              <AlertDescription className="text-sm text-white/95 leading-relaxed whitespace-normal">
                {message.content}
              </AlertDescription>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0 flex-shrink-0 text-white/80 hover:text-white hover:bg-white/20 rounded-full ml-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Alert>
    </div>
  );
}

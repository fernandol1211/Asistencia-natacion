// src/components/NoSessionView.tsx
import { Button } from "@/components/ui/button";
import { Users, LogIn } from "lucide-react";

interface NoSessionViewProps {
  onLoginClick: () => void;
}

export default function NoSessionView({ onLoginClick }: NoSessionViewProps) {
  return (
    <div className="text-center py-20">
      <div className="max-w-md mx-auto">
        <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Control de Asistencias
        </h2>
        <p className="text-gray-600 mb-6">
          Inicia sesión como profesor para registrar las asistencias diarias
        </p>
        <Button
          size="lg"
          className="flex items-center gap-2 mx-auto"
          onClick={onLoginClick}
        >
          <LogIn className="h-5 w-5" />
          Iniciar sesión
        </Button>
      </div>
    </div>
  );
}

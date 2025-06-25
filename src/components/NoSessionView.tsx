"use client";

import { Button } from "@/components/ui/button";
import { Users, LogIn } from "lucide-react";

interface NoSessionViewProps {
  onLoginClick: () => void;
}

export default function NoSessionView({ onLoginClick }: NoSessionViewProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-md mx-auto space-y-6 sm:space-y-8">
        <div className="space-y-4">
          <Users className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 mx-auto text-gray-400" />

          <div className="space-y-2 sm:space-y-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Control de Asistencias
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed">
              Inicia sesión como profesor para registrar las asistencias diarias
              de los atletas
            </p>
          </div>
        </div>

        <Button
          size="lg"
          className="flex items-center gap-2 sm:gap-3 px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base lg:text-lg font-medium"
          onClick={onLoginClick}
        >
          <LogIn className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
          Iniciar sesión
        </Button>

        <div className="text-xs sm:text-sm text-gray-500 space-y-1">
          <p>¿Necesitas ayuda?</p>
          <p>Contacta al administrador del sistema</p>
        </div>
      </div>
    </div>
  );
}

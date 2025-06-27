"use client";

import { Users } from "lucide-react";

export default function NoSessionView() {
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

        <div className="text-xs sm:text-sm text-gray-500 space-y-1">
          <p>Para iniciar sesión, usa el menú en la esquina superior derecha</p>
          <p>¿Necesitas ayuda? Contacta al administrador del sistema</p>
        </div>
      </div>
    </div>
  );
}

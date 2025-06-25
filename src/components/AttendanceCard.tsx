"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DateSchedulePicker from "./DateSchedulePicker";
import AthleteList from "./AthleteList";
import type { HorarioUI, AtletaUI } from "@/types";

interface AttendanceCardProps {
  profesorId: number | null;
  onLogout: () => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  horarios: HorarioUI[];
  selectedHorario: HorarioUI | null;
  onHorarioChange: (horario: HorarioUI | null) => void;
  atletas: AtletaUI[];
  toggleAsistencia: (id: number) => void;
  toggleAllAsistencias: () => void;
  atletasPresentes: number;
  totalAtletas: number;
  loading: boolean;
  saving: boolean;
  onSave: () => void;
}

export default function AttendanceCard({
  profesorId,
  selectedDate,
  onDateChange,
  horarios,
  selectedHorario,
  onHorarioChange,
  atletas,
  toggleAsistencia,
  toggleAllAsistencias,
  atletasPresentes,
  totalAtletas,
  loading,
  saving,
  onSave,
}: AttendanceCardProps) {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="pb-4 sm:pb-6">
        <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-start lg:space-y-0">
          {/* Título y descripción */}
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl lg:text-3xl">
              <Users className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 flex-shrink-0" />
              <span>Club de Natación</span>
            </CardTitle>
            <CardDescription className="text-sm sm:text-base lg:text-lg">
              Registra la asistencia diaria de los atletas
            </CardDescription>
          </div>

          {/* Información del profesor */}
          <div className="flex items-center">
            <Badge
              variant="secondary"
              className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5"
            >
              Profesor ID: {profesorId || "Cargando..."}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 sm:space-y-8 px-4 sm:px-6">
        {/* Selector de fecha y horario */}
        <DateSchedulePicker
          selectedDate={selectedDate}
          onDateChange={onDateChange}
          horarios={horarios}
          selectedHorario={selectedHorario}
          onHorarioChange={onHorarioChange}
        />

        {/* Contenido principal */}
        {selectedHorario ? (
          <div className="space-y-6">
            {/* Información del horario seleccionado */}
            <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                    {selectedHorario.grupos
                      .map((g) => `${g.nombre} (${g.nivel})`)
                      .join(", ")}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {selectedHorario.hora_inicio} - {selectedHorario.hora_fin}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedHorario.profesores.map((profesor) => (
                    <Badge
                      key={profesor.id}
                      variant="outline"
                      className="text-xs sm:text-sm"
                    >
                      {profesor.nombre}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Lista de atletas */}
            <AthleteList
              atletas={atletas}
              toggleAsistencia={toggleAsistencia}
              toggleAllAsistencias={toggleAllAsistencias}
              atletasPresentes={atletasPresentes}
              totalAtletas={totalAtletas}
              loading={loading}
              saving={saving}
              onSave={onSave}
            />
          </div>
        ) : horarios.length === 0 && !loading ? (
          <div className="text-center py-12 sm:py-16 space-y-4">
            <Users className="h-16 w-16 sm:h-20 sm:w-20 mx-auto text-gray-400" />
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-medium text-gray-900">
                No hay horarios programados
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                No se encontraron horarios para la fecha seleccionada
              </p>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

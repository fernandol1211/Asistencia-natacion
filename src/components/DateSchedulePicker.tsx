"use client";

import { Calendar, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { HorarioUI } from "@/types";

interface DateSchedulePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  horarios: HorarioUI[];
  selectedHorario: HorarioUI | null;
  onHorarioChange: (horario: HorarioUI | null) => void;
}

export default function DateSchedulePicker({
  selectedDate,
  onDateChange,
  horarios,
  selectedHorario,
  onHorarioChange,
}: DateSchedulePickerProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Selector de fecha */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm sm:text-base font-medium text-gray-700">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          Fecha
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base transition-colors"
        />
      </div>

      {/* Selector de horario */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm sm:text-base font-medium text-gray-700">
          <Clock className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          Horario
        </label>

        {horarios.length > 0 ? (
          <Select
            value={selectedHorario?.id.toString() || ""}
            onValueChange={(value) => {
              const horario = horarios.find((h) => h.id.toString() === value);
              onHorarioChange(horario || null);
            }}
          >
            <SelectTrigger className="text-sm sm:text-base py-2 sm:py-6">
              <SelectValue placeholder="Selecciona un horario">
                {selectedHorario && (
                  <span className="text-sm sm:text-base">
                    {selectedHorario.grupos.map((g) => g.nombre).join(", ")}
                  </span>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {horarios.map((horario) => (
                <SelectItem
                  key={horario.id}
                  value={horario.id.toString()}
                  className="py-3 px-3"
                >
                  <div className="w-full min-w-0">
                    {/* Horario - siempre en una línea */}
                    <div className="font-semibold text-gray-900 text-base mb-3 whitespace-nowrap">
                      {horario.hora_inicio} - {horario.hora_fin}
                    </div>

                    {/* Grupos y profesores en líneas separadas */}
                    <div className="space-y-2">
                      {/* Grupos */}
                      {horario.grupos.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {horario.grupos.map((grupo) => (
                            <Badge
                              key={grupo.id}
                              variant="secondary"
                              className="text-xs font-medium px-2 py-1"
                            >
                              {grupo.nombre} ({grupo.nivel})
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Profesores */}
                      {horario.profesores.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {horario.profesores.map((profesor) => (
                            <Badge
                              key={profesor.id}
                              variant="outline"
                              className="text-xs px-2 py-1"
                            >
                              {profesor.nombre}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Select disabled value="">
            <SelectTrigger className="text-sm sm:text-base py-2 sm:py-3">
              <SelectValue placeholder="No hay horarios disponibles" />
            </SelectTrigger>
          </Select>
        )}
      </div>
    </div>
  );
}

import { Calendar, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { type HorarioUI } from "@/types";

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex items-center gap-3">
        <Calendar className="h-5 w-5 flex-shrink-0" />
        <div className="w-full">
          <label className="block text-sm font-medium mb-1">Fecha</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {horarios.length > 0 ? (
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 flex-shrink-0" />
          <div className="w-full">
            <label className="block text-sm font-medium mb-1">Horario</label>
            <Select
              value={selectedHorario?.id.toString() || ""}
              onValueChange={(value) => {
                const horario = horarios.find((h) => h.id.toString() === value);
                onHorarioChange(horario || null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un horario" />
              </SelectTrigger>
              <SelectContent>
                {horarios.map((horario) => (
                  <SelectItem key={horario.id} value={horario.id.toString()}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">
                        {horario.hora_inicio} - {horario.hora_fin}
                      </span>
                      <Badge variant="secondary">
                        {horario.grupos
                          .filter((g) => g !== null)
                          .map((g) => g.nombre)
                          .join(", ")}
                      </Badge>
                      <Badge variant="outline">
                        {horario.profesores
                          .map((p) => p?.nombre || "Sin profesor")
                          .join(", ")}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 flex-shrink-0" />
          <div className="w-full">
            <label className="block text-sm font-medium mb-1">Horario</label>
            <Select disabled value="">
              <SelectTrigger>
                <SelectValue placeholder="Cargando horarios..." />
              </SelectTrigger>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}

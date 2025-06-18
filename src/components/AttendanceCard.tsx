import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DateSchedulePicker from "@/components/DateSchedulePicker";
import AthleteList from "@/components/AthleteList";
import type { HorarioUI, AtletaUI } from "@/types"; // Quitamos Session de los imports

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
  onLogout,
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
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              Club de Natación
            </CardTitle>
            <CardDescription>
              Registra la asistencia diaria de los atletas
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              Profesor ID: {profesorId || "Cargando..."}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar sesión</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <DateSchedulePicker
          selectedDate={selectedDate}
          onDateChange={onDateChange}
          horarios={horarios}
          selectedHorario={selectedHorario}
          onHorarioChange={onHorarioChange}
        />

        {selectedHorario ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-lg font-semibold">
                {selectedHorario.grupos
                  .map((g) => `${g.nombre} (${g.nivel})`)
                  .join(", ")}
              </h3>
            </div>
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
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No hay horarios programados para esta fecha</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

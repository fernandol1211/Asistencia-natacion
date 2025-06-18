// src/components/AthleteList.tsx
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Save, CheckCircle, Users } from "lucide-react";
import { type AtletaUI } from "@/types";

interface AthleteListProps {
  atletas: AtletaUI[];
  toggleAsistencia: (id: number) => void;
  toggleAllAsistencias: () => void;
  atletasPresentes: number;
  totalAtletas: number;
  loading: boolean;
  saving: boolean;
  onSave: () => void;
}

export default function AthleteList({
  atletas,
  toggleAsistencia,
  toggleAllAsistencias,
  atletasPresentes,
  totalAtletas,
  loading,
  saving,
  onSave,
}: AthleteListProps) {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Cargando atletas...</p>
      </div>
    );
  }

  if (atletas.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <Users className="h-10 w-10 mx-auto mb-3 opacity-50" />
        <p>No hay atletas registrados en este grupo</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleAllAsistencias}
          className="flex items-center gap-2"
        >
          <CheckCircle className="h-4 w-4" />
          {atletas.every((a) => a.presente)
            ? "Desmarcar todos"
            : "Marcar todos"}
        </Button>

        <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-md">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm">
            {atletasPresentes}/{totalAtletas} presentes
          </span>
        </div>
      </div>

      <div className="grid gap-2">
        {atletas.map((atleta) => (
          <div
            key={atleta.id}
            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
              atleta.presente
                ? "bg-green-50 border-green-200"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Checkbox
                id={`atleta-${atleta.id}`}
                checked={atleta.presente}
                onCheckedChange={() => toggleAsistencia(atleta.id)}
              />
              <label
                htmlFor={`atleta-${atleta.id}`}
                className="text-sm font-medium cursor-pointer"
              >
                {atleta.nombre} {atleta.apellido}
              </label>
            </div>
            <Badge
              variant={atleta.presente ? "default" : "secondary"}
              className="px-2 py-0.5"
            >
              {atleta.presente ? "Presente" : "Ausente"}
            </Badge>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <Button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {saving ? "Guardando..." : "Guardar Asistencias"}
        </Button>
      </div>
    </div>
  );
}

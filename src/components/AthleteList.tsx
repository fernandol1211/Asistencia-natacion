"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Users, Save, Loader2, CheckSquare, Square } from "lucide-react";
import type { AtletaUI } from "@/types";

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
      <div className="flex flex-col items-center justify-center py-8 sm:py-12 space-y-4">
        <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-blue-500" />
        <p className="text-sm sm:text-base text-gray-600">
          Cargando atletas...
        </p>
      </div>
    );
  }

  if (atletas.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 space-y-4">
        <Users className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400" />
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-medium text-gray-900">
            No hay atletas registrados
          </h3>
          <p className="text-sm sm:text-base text-gray-600">
            No se encontraron atletas para este horario
          </p>
        </div>
      </div>
    );
  }

  const allPresent = atletas.every((a) => a.presente);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header con estadísticas y controles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm sm:text-base px-3 py-1">
            {atletasPresentes} / {totalAtletas} presentes
          </Badge>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleAllAsistencias}
            className="flex items-center gap-2 text-xs sm:text-sm"
          >
            {allPresent ? (
              <>
                <Square className="h-4 w-4" />
                <span className="hidden sm:inline">Desmarcar todos</span>
                <span className="sm:hidden">Desmarcar</span>
              </>
            ) : (
              <>
                <CheckSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Marcar todos</span>
                <span className="sm:hidden">Marcar</span>
              </>
            )}
          </Button>
        </div>

        <Button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Guardar asistencias</span>
            </>
          )}
        </Button>
      </div>

      {/* Lista de atletas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {atletas.map((atleta) => (
          <div
            key={atleta.id}
            className={`p-3 sm:p-4 border rounded-lg transition-all duration-200 cursor-pointer hover:shadow-md ${
              atleta.presente
                ? "border-green-300 bg-green-50 hover:bg-green-100"
                : "border-gray-200 bg-white hover:bg-gray-50"
            }`}
            onClick={() => toggleAsistencia(atleta.id)}
          >
            <div className="flex items-center space-x-3">
              <Checkbox
                checked={atleta.presente}
                onChange={() => toggleAsistencia(atleta.id)}
                className="flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-medium text-gray-900 truncate">
                  {atleta.nombre} {atleta.apellido}
                </p>
              </div>

              {atleta.presente && (
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer con resumen */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-sm sm:text-base text-blue-800">
          <strong>Resumen:</strong> {atletasPresentes} atletas presentes de{" "}
          {totalAtletas} total
        </div>

        <div className="text-xs sm:text-sm text-blue-600">
          {totalAtletas > 0 && (
            <span>
              {Math.round((atletasPresentes / totalAtletas) * 100)}% de
              asistencia
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

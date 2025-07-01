import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  useHorarios,
  useProfesores,
  useAtletasConAsistencia,
} from "../hooks/useSupabaseData";

export default function HorariosPage() {
  const { horarios } = useHorarios();
  const { profesores } = useProfesores();
  const { atletas } = useAtletasConAsistencia();

  const getGrupoColor = (grupoNombre: string) => {
    const colores: Record<string, string> = {
      Delfines: "bg-blue-100 text-blue-800",
      Tiburones: "bg-green-100 text-green-800",
      Orcas: "bg-purple-100 text-purple-800",
      Ballenas: "bg-orange-100 text-orange-800",
      Focas: "bg-pink-100 text-pink-800",
    };
    return colores[grupoNombre] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Horarios</h1>
      <Card>
        <CardHeader>
          <CardTitle>Horarios de Entrenamiento</CardTitle>
          <CardDescription>
            Programación semanal de clases y profesores asignados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {horarios.map((horario) => (
              <div key={horario.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">
                    {horario.dia_semana}
                  </h3>
                  <Badge variant="outline">
                    {horario.hora_inicio}-{horario.hora_fin}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Grupo:</span>
                    <div className="flex gap-1">
                      {horario.grupos.map((grupo) => (
                        <Badge
                          key={grupo.id}
                          className={getGrupoColor(grupo.nombre)}
                        >
                          {grupo.nombre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profesor:</span>
                    <div className="flex gap-1">
                      {horario.profesores.map((profesor) => (
                        <span key={profesor.id} className="text-sm font-medium">
                          {profesor.nombre}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Atletas:</span>
                    <span className="text-sm font-medium">
                      {
                        atletas.filter((a) =>
                          horario.grupos.some((g) => g.id === a.grupo?.id)
                        ).length
                      }
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profesores</CardTitle>
          <CardDescription>
            Información de los instructores del club
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profesores.map((profesor) => {
              const horariosProfesor = horarios.filter((h) =>
                h.profesores.some((p) => p.id === profesor.id)
              );
              const gruposUnicos = new Set(
                horariosProfesor.flatMap((h) => h.grupos.map((g) => g.nombre))
              );

              return (
                <div
                  key={profesor.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {profesor.nombre
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{profesor.nombre}</h3>
                      <p className="text-sm text-gray-600">{profesor.email}</p>
                      {profesor.telefono && (
                        <p className="text-sm text-gray-500">
                          {profesor.telefono}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Clases:</span>
                      <span className="font-medium">
                        {horariosProfesor.length}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Grupos:</span>
                      <span className="font-medium">{gruposUnicos.size}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

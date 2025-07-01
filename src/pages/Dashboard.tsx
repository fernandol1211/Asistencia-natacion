import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Clock, TrendingUp } from "lucide-react";
import {
  useProfesores,
  useGrupos,
  useAtletasConAsistencia,
} from "../hooks/useSupabaseData";

export default function DashboardPage() {
  const { profesores } = useProfesores();
  const { grupos } = useGrupos();
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

  const getAsistenciaColor = (porcentaje: number) => {
    if (porcentaje >= 90) return "text-green-600";
    if (porcentaje >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const promedioAsistencia =
    atletas.length > 0
      ? Math.round(
          atletas.reduce(
            (acc, atleta) => acc + atleta.porcentaje_asistencia,
            0
          ) / atletas.length
        )
      : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Atletas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{atletas.length}</div>
            <p className="text-xs text-muted-foreground">Activos en el club</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Grupos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{grupos.length}</div>
            <p className="text-xs text-muted-foreground">Diferentes niveles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profesores</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profesores.length}</div>
            <p className="text-xs text-muted-foreground">
              Instructores activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Asistencia Promedio
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promedioAsistencia}%</div>
            <p className="text-xs text-muted-foreground">Último mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Resumen por grupos */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen por Grupos</CardTitle>
          <CardDescription>
            Distribución de atletas y asistencia por grupo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {grupos.map((grupo) => {
              const atletasGrupo = atletas.filter(
                (a) => a.grupo?.id === grupo.id
              );
              const promedioAsistenciaGrupo =
                atletasGrupo.length > 0
                  ? Math.round(
                      atletasGrupo.reduce(
                        (acc, a) => acc + a.porcentaje_asistencia,
                        0
                      ) / atletasGrupo.length
                    )
                  : 0;

              return (
                <div key={grupo.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getGrupoColor(grupo.nombre)}>
                      {grupo.nombre}
                    </Badge>
                    <span className="text-sm text-gray-500">{grupo.nivel}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Atletas:</span>
                      <span className="font-medium">{atletasGrupo.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Asistencia:</span>
                      <span
                        className={`font-medium ${getAsistenciaColor(
                          promedioAsistenciaGrupo
                        )}`}
                      >
                        {promedioAsistenciaGrupo}%
                      </span>
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

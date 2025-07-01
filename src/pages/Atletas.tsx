import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import { useGrupos, useAtletasConAsistencia } from "../hooks/useSupabaseData";

export default function AtletasPage() {
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { grupos } = useGrupos();
  const { atletas } = useAtletasConAsistencia();

  // Filtrar atletas
  const filteredAtletas = atletas.filter((atleta) => {
    const matchesGroup =
      selectedGroup === "all" || atleta.grupo?.nombre === selectedGroup;
    const matchesSearch = `${atleta.nombre} ${atleta.apellido}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesGroup && matchesSearch;
  });

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Atletas</CardTitle>
          <CardDescription>
            Lista completa de atletas y su información
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar atleta..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex-1">
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por grupo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los grupos</SelectItem>
                  {grupos.map((grupo) => (
                    <SelectItem key={grupo.id} value={grupo.nombre}>
                      {grupo.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Atleta</TableHead>
                  <TableHead>Grupo</TableHead>
                  <TableHead>Nivel</TableHead>
                  <TableHead>Asistencia</TableHead>
                  <TableHead>Clases</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAtletas.map((atleta) => (
                  <TableRow key={atleta.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{`${atleta.nombre[0]}${atleta.apellido[0]}`}</AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="font-medium">
                            {atleta.nombre} {atleta.apellido}
                          </span>
                          {atleta.email && (
                            <p className="text-sm text-gray-500">
                              {atleta.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getGrupoColor(atleta.grupo?.nombre || "")}
                      >
                        {atleta.grupo?.nombre}
                      </Badge>
                    </TableCell>
                    <TableCell>{atleta.grupo?.nivel}</TableCell>
                    <TableCell>
                      <span
                        className={getAsistenciaColor(
                          atleta.porcentaje_asistencia
                        )}
                      >
                        {atleta.porcentaje_asistencia}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {atleta.clases_asistidas}/{atleta.total_clases}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          atleta.porcentaje_asistencia >= 80
                            ? "default"
                            : "destructive"
                        }
                      >
                        {atleta.porcentaje_asistencia >= 80
                          ? "Activo"
                          : "Atención"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Calendar,
  Users,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  Search,
} from "lucide-react";

// Datos de ejemplo basados en el SQL
const grupos = [
  {
    id: 1,
    nombre: "Delfines",
    nivel: "Principiante",
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: 2,
    nombre: "Tiburones",
    nivel: "Intermedio",
    color: "bg-green-100 text-green-800",
  },
  {
    id: 3,
    nombre: "Orcas",
    nivel: "Avanzado",
    color: "bg-purple-100 text-purple-800",
  },
  {
    id: 4,
    nombre: "Ballenas",
    nivel: "Adultos",
    color: "bg-orange-100 text-orange-800",
  },
  {
    id: 5,
    nombre: "Focas",
    nivel: "Infantil",
    color: "bg-pink-100 text-pink-800",
  },
];

const profesores = [
  { id: 1, nombre: "Fernando Ladera", email: "fernandoladera1211@gmail.com" },
  { id: 2, nombre: "Laura Torres", email: "laura@clubnatacion.com" },
  { id: 3, nombre: "Miguel Ángel Soto", email: "miguel@clubnatacion.com" },
];

const atletas = [
  { id: 1, nombre: "Juan García", grupo: "Delfines", asistencia: 85 },
  { id: 2, nombre: "María López", grupo: "Delfines", asistencia: 92 },
  { id: 3, nombre: "Pedro Martínez", grupo: "Delfines", asistencia: 78 },
  { id: 4, nombre: "Ana Rodríguez", grupo: "Tiburones", asistencia: 88 },
  { id: 5, nombre: "Luis Fernández", grupo: "Tiburones", asistencia: 95 },
  { id: 6, nombre: "Sofía González", grupo: "Tiburones", asistencia: 82 },
  { id: 7, nombre: "Carlos Pérez", grupo: "Orcas", asistencia: 90 },
  { id: 8, nombre: "Laura Sánchez", grupo: "Orcas", asistencia: 87 },
  { id: 9, nombre: "Miguel Ramírez", grupo: "Orcas", asistencia: 93 },
  { id: 10, nombre: "Elena Torres", grupo: "Ballenas", asistencia: 89 },
  { id: 11, nombre: "Javier Díaz", grupo: "Ballenas", asistencia: 91 },
  { id: 12, nombre: "Carmen Ruiz", grupo: "Ballenas", asistencia: 86 },
  { id: 13, nombre: "David Hernández", grupo: "Focas", asistencia: 94 },
  { id: 14, nombre: "Isabel Jiménez", grupo: "Focas", asistencia: 88 },
  { id: 15, nombre: "Francisco Moreno", grupo: "Focas", asistencia: 92 },
];

const horarios = [
  {
    id: 1,
    dia: "Lunes",
    hora: "08:00-10:00",
    grupo: "Delfines",
    profesor: "Fernando Ladera",
  },
  {
    id: 2,
    dia: "Lunes",
    hora: "16:00-18:00",
    grupo: "Tiburones",
    profesor: "Laura Torres",
  },
  {
    id: 3,
    dia: "Martes",
    hora: "09:00-11:00",
    grupo: "Orcas",
    profesor: "Laura Torres",
  },
  {
    id: 4,
    dia: "Miércoles",
    hora: "08:30-10:30",
    grupo: "Focas",
    profesor: "Fernando Ladera",
  },
  {
    id: 5,
    dia: "Jueves",
    hora: "17:00-19:00",
    grupo: "Ballenas",
    profesor: "Laura Torres",
  },
  {
    id: 6,
    dia: "Viernes",
    hora: "15:00-17:00",
    grupo: "Tiburones",
    profesor: "Miguel Ángel Soto",
  },
  {
    id: 7,
    dia: "Sábado",
    hora: "10:00-12:00",
    grupo: "Orcas",
    profesor: "Miguel Ángel Soto",
  },
];

export default function SwimmingAttendance() {
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const filteredAtletas = atletas.filter((atleta) => {
    const matchesGroup =
      selectedGroup === "all" || atleta.grupo === selectedGroup;
    const matchesSearch = atleta.nombre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  const getGrupoColor = (grupoNombre: string) => {
    const grupo = grupos.find((g) => g.nombre === grupoNombre);
    return grupo?.color || "bg-gray-100 text-gray-800";
  };

  const getAsistenciaColor = (porcentaje: number) => {
    if (porcentaje >= 90) return "text-green-600";
    if (porcentaje >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sistema de Asistencia - Club de Natación
          </h1>
          <p className="text-gray-600">
            Gestión completa de asistencia para atletas y profesores
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="attendance">Asistencia</TabsTrigger>
            <TabsTrigger value="athletes">Atletas</TabsTrigger>
            <TabsTrigger value="schedule">Horarios</TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Atletas
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{atletas.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Activos en el club
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Grupos</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{grupos.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Diferentes niveles
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Profesores
                  </CardTitle>
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
                  <div className="text-2xl font-bold">
                    {Math.round(
                      atletas.reduce(
                        (acc, atleta) => acc + atleta.asistencia,
                        0
                      ) / atletas.length
                    )}
                    %
                  </div>
                  <p className="text-xs text-muted-foreground">Último mes</p>
                </CardContent>
              </Card>
            </div>

            {/* Grupos Overview */}
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
                      (a) => a.grupo === grupo.nombre
                    );
                    const promedioAsistencia =
                      atletasGrupo.length > 0
                        ? Math.round(
                            atletasGrupo.reduce(
                              (acc, a) => acc + a.asistencia,
                              0
                            ) / atletasGrupo.length
                          )
                        : 0;

                    return (
                      <div key={grupo.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={grupo.color}>{grupo.nombre}</Badge>
                          <span className="text-sm text-gray-500">
                            {grupo.nivel}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Atletas:</span>
                            <span className="font-medium">
                              {atletasGrupo.length}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Asistencia:</span>
                            <span
                              className={`font-medium ${getAsistenciaColor(
                                promedioAsistencia
                              )}`}
                            >
                              {promedioAsistencia}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance */}
          <TabsContent value="attendance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Marcar Asistencia</CardTitle>
                <CardDescription>
                  Registra la asistencia de los atletas para la fecha
                  seleccionada
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="date">Fecha</Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="schedule">Horario</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar horario" />
                      </SelectTrigger>
                      <SelectContent>
                        {horarios.map((horario) => (
                          <SelectItem
                            key={horario.id}
                            value={horario.id.toString()}
                          >
                            {horario.dia} {horario.hora} - {horario.grupo}
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
                        <TableHead>Asistencia</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {atletas.slice(0, 8).map((atleta) => (
                        <TableRow key={atleta.id}>
                          <TableCell className="font-medium">
                            {atleta.nombre}
                          </TableCell>
                          <TableCell>
                            <Badge className={getGrupoColor(atleta.grupo)}>
                              {atleta.grupo}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span
                              className={getAsistenciaColor(atleta.asistencia)}
                            >
                              {atleta.asistencia}%
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Athletes */}
          <TabsContent value="athletes" className="space-y-6">
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
                    <Select
                      value={selectedGroup}
                      onValueChange={setSelectedGroup}
                    >
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
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAtletas.map((atleta) => {
                        const grupo = grupos.find(
                          (g) => g.nombre === atleta.grupo
                        );
                        return (
                          <TableRow key={atleta.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback>
                                    {atleta.nombre
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">
                                  {atleta.nombre}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getGrupoColor(atleta.grupo)}>
                                {atleta.grupo}
                              </Badge>
                            </TableCell>
                            <TableCell>{grupo?.nivel}</TableCell>
                            <TableCell>
                              <span
                                className={getAsistenciaColor(
                                  atleta.asistencia
                                )}
                              >
                                {atleta.asistencia}%
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  atleta.asistencia >= 80
                                    ? "default"
                                    : "destructive"
                                }
                              >
                                {atleta.asistencia >= 80
                                  ? "Activo"
                                  : "Atención"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Schedule */}
          <TabsContent value="schedule" className="space-y-6">
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
                    <div
                      key={horario.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{horario.dia}</h3>
                        <Badge variant="outline">{horario.hora}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Grupo:</span>
                          <Badge className={getGrupoColor(horario.grupo)}>
                            {horario.grupo}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Profesor:
                          </span>
                          <span className="text-sm font-medium">
                            {horario.profesor}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Atletas:
                          </span>
                          <span className="text-sm font-medium">
                            {
                              atletas.filter((a) => a.grupo === horario.grupo)
                                .length
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
                    const horariosProfesor = horarios.filter(
                      (h) => h.profesor === profesor.nombre
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
                            <p className="text-sm text-gray-600">
                              {profesor.email}
                            </p>
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
                            <span className="font-medium">
                              {
                                new Set(horariosProfesor.map((h) => h.grupo))
                                  .size
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

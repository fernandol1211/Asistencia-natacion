// // src/components/TestConnection.tsx
// import { useEffect, useState } from "react";
// import { supabase } from "./lib/supabase";
// import type { Profesores } from "./lib/supabase";

// const TestConnection = () => {
//   const [profesores, setprofesores] = useState<Profesores[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const testConnection = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // 1. Verificar conexión con Supabase
//       const { error: connectionError } = await supabase
//         .from("profesores")
//         .select("id")
//         .limit(1);

//       if (connectionError) throw new Error(connectionError.message);

//       // 2. Leer todos los datos
//       const { data, error: readError } = await supabase
//         .from("profesores")
//         .select("*")
//         .order("nombre", { ascending: true });

//       if (readError) throw new Error(readError.message);

//       // 3. Manejar caso de datos vacíos
//       if (!data || data.length === 0) {
//         setprofesores([]);
//         return;
//       }

//       setprofesores(data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Error desconocido");
//     } finally {
//       setLoading(false);
//     }
//   };

//   console.log(profesores);

//   useEffect(() => {
//     testConnection();
//   }, []);

//   if (loading) {
//     return (
//       <div className="p-4 bg-blue-50 rounded-lg">
//         <p className="text-blue-700">Verificando conexión con Supabase...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4 bg-red-100 text-red-800 rounded-lg">
//         <h3 className="font-bold">❌ Error de conexión</h3>
//         <p>{error}</p>
//         <button
//           className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
//           onClick={testConnection}
//         >
//           Reintentar
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 bg-green-50 text-green-800 rounded-lg">
//       <h3 className="font-bold">✅ Conexión exitosa con Supabase!</h3>

//       <div className="mt-4">
//         <p className="font-medium">
//           {profesores.length > 0
//             ? `Datos recuperados (${profesores.length} registros):`
//             : "La tabla existe pero no contiene registros"}
//         </p>

//         {profesores.length > 0 && (
//           <ul className="mt-2 space-y-2 max-h-60 overflow-y-auto">
//             {profesores.map((member) => (
//               <li
//                 key={member.id}
//                 className="bg-white p-3 rounded shadow-sm border border-gray-200"
//               >
//                 <div className="font-bold text-gray-800">{member.nombre}</div>
//                 <div className="text-sm text-gray-600">{member.email}</div>
//                 <div className="text-xs text-gray-400 mt-1">
//                   ID: {member.id}
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TestConnection;
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Users, Clock, Save, CheckCircle, Info } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Configuración de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Definimos tipos específicos para las respuestas de Supabase
interface GrupoDB {
  id: number;
  nombre: string;
  nivel: string;
}

interface ProfesorDB {
  id: number;
  nombre: string;
}

interface RawHorarioDB {
  id: number;
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
  grupos: {
    grupos: GrupoDB;
  }[];
  profesores: {
    profesores: ProfesorDB;
  }[];
}

interface AtletaDB {
  id: number;
  nombre: string;
  apellido: string;
  grupo_id: number;
}

interface AsistenciaDB {
  atleta_id: number;
  presente: boolean;
}

// Tipos para el componente
interface HorarioUI {
  id: number;
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
  grupos: GrupoDB[];
  profesores: ProfesorDB[];
}

interface AtletaUI {
  id: number;
  nombre: string;
  apellido: string;
  grupo_id: number;
  presente: boolean;
}

export default function AttendanceTracker() {
  const [horarios, setHorarios] = useState<HorarioUI[]>([]);
  const [selectedHorario, setSelectedHorario] = useState<HorarioUI | null>(
    null
  );
  const [atletas, setAtletas] = useState<AtletaUI[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    content: string;
  } | null>(null);

  // Usamos useRef para rastrear si es la primera carga
  const initialLoadRef = useRef(true);

  // Obtener nombre del día en formato capitalizado
  const getDayName = useCallback((date: string) => {
    return new Date(date + "T00:00:00")
      .toLocaleDateString("es-ES", { weekday: "long" })
      .replace(/^\w/, (c) => c.toUpperCase());
  }, []);

  // Obtener horarios disponibles para el día seleccionado desde Supabase
  useEffect(() => {
    const fetchHorarios = async () => {
      const dayName = getDayName(selectedDate);

      setLoading(true);
      try {
        const { data: horarios, error } = await supabase
          .from("horarios")
          .select(
            `
            id,
            dia_semana,
            hora_inicio,
            hora_fin,
            grupos:horarios_grupos ( grupos (id, nombre, nivel) ),
            profesores:profesores_horarios ( profesores (id, nombre) )
          `
          )
          .eq("dia_semana", dayName);

        if (error) throw error;

        // Convertir a tipo HorarioUI usando tipo intermedio
        const formattedHorarios = horarios.map((horario) => {
          const rawHorario = horario as unknown as RawHorarioDB;

          return {
            id: rawHorario.id,
            dia_semana: rawHorario.dia_semana,
            hora_inicio: rawHorario.hora_inicio,
            hora_fin: rawHorario.hora_fin,
            grupos: rawHorario.grupos.map((g) => g.grupos),
            profesores: rawHorario.profesores.map((p) => p.profesores),
          };
        });

        setHorarios(formattedHorarios);

        // Solo resetear la selección si no es la primera carga
        if (!initialLoadRef.current) {
          setSelectedHorario(null);
          setAtletas([]);
        } else {
          initialLoadRef.current = false;
        }
      } catch (error) {
        console.error("Error cargando horarios:", error);
        setMessage({
          type: "error",
          content: "Error al cargar horarios",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHorarios();
  }, [selectedDate, getDayName]);

  // Obtener atletas cuando se selecciona un horario
  const fetchAtletas = useCallback(async () => {
    if (!selectedHorario) return;

    setLoading(true);
    try {
      const grupoIds = selectedHorario.grupos.map((g) => g.id);

      // Obtener atletas de los grupos desde Supabase
      const { data: atletasDelGrupo, error: atletasError } = await supabase
        .from("atletas")
        .select("id, nombre, apellido, grupo_id")
        .in("grupo_id", grupoIds);

      if (atletasError) throw atletasError;

      // Obtener asistencias existentes desde Supabase
      const { data: asistenciasExistentes, error: asistenciasError } =
        await supabase
          .from("asistencias")
          .select("atleta_id, presente")
          .eq("fecha", selectedDate)
          .eq("horario_id", selectedHorario.id);

      if (asistenciasError) throw asistenciasError;

      // Combinar datos de atletas con asistencias
      const atletasConAsistencia = (atletasDelGrupo as AtletaDB[]).map(
        (atleta) => ({
          id: atleta.id,
          nombre: atleta.nombre,
          apellido: atleta.apellido,
          grupo_id: atleta.grupo_id,
          presente:
            (asistenciasExistentes as AsistenciaDB[])?.some(
              (a) => a.atleta_id === atleta.id && a.presente
            ) ?? false,
        })
      );

      setAtletas(atletasConAsistencia);
    } catch (error) {
      console.error("Error cargando atletas:", error);
      setMessage({
        type: "error",
        content: "No se pudieron cargar los atletas",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedHorario, selectedDate]);

  useEffect(() => {
    if (selectedHorario) {
      fetchAtletas();
    }
  }, [selectedHorario, selectedDate, fetchAtletas]);

  const toggleAsistencia = (atletaId: number) => {
    setAtletas((prev) =>
      prev.map((atleta) =>
        atleta.id === atletaId
          ? { ...atleta, presente: !atleta.presente }
          : atleta
      )
    );
  };

  const toggleAllAsistencias = () => {
    const allPresent = atletas.every((a) => a.presente);
    setAtletas((prev) => prev.map((a) => ({ ...a, presente: !allPresent })));
  };

  const guardarAsistencias = useCallback(async () => {
    if (!selectedHorario || atletas.length === 0) return;

    setSaving(true);
    try {
      const profesorId = selectedHorario.profesores[0]?.id;
      if (!profesorId) throw new Error("Profesor no asignado");

      // Preparar datos para Supabase
      const asistenciasData = atletas.map((atleta) => ({
        fecha: selectedDate,
        horario_id: selectedHorario.id,
        profesor_id: profesorId,
        atleta_id: atleta.id,
        presente: atleta.presente,
      }));

      // Usar upsert para actualizar o insertar asistencias
      const { error } = await supabase
        .from("asistencias")
        .upsert(asistenciasData, {
          onConflict: "fecha,horario_id,atleta_id",
        });

      if (error) throw error;

      setMessage({
        type: "success",
        content: `Asistencias guardadas: ${
          atletas.filter((a) => a.presente).length
        } presentes`,
      });
    } catch (error) {
      console.error("Error guardando asistencias:", error);

      // Mensaje más específico del error
      let errorMessage = "Error al guardar asistencias";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setMessage({
        type: "error",
        content: errorMessage,
      });
    } finally {
      setSaving(false);
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMessage(null), 3000);
    }
  }, [selectedHorario, atletas, selectedDate]);

  const atletasPresentes = atletas.filter((a) => a.presente).length;
  const totalAtletas = atletas.length;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Control de Asistencias - Club de Natación
          </CardTitle>
          <CardDescription>
            Registra la asistencia diaria de los atletas
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Mensajes de estado */}
          {message && (
            <Alert
              variant={message.type === "success" ? "default" : "destructive"}
            >
              <AlertDescription>{message.content}</AlertDescription>
            </Alert>
          )}

          {/* Alerta informativa */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Versión Conectada a Supabase:</strong> Esta aplicación
              ahora se conecta a una base de datos real para gestionar
              asistencias.
            </AlertDescription>
          </Alert>

          {/* Controles de fecha y horario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 flex-shrink-0" />
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">Fecha</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {horarios.length > 0 ? (
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 flex-shrink-0" />
                <div className="w-full">
                  <label className="block text-sm font-medium mb-1">
                    Horario
                  </label>
                  <Select
                    value={selectedHorario?.id.toString() || ""}
                    onValueChange={(value) => {
                      const horario = horarios.find(
                        (h) => h.id.toString() === value
                      );
                      setSelectedHorario(horario || null);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un horario" />
                    </SelectTrigger>
                    <SelectContent>
                      {horarios.map((horario) => (
                        <SelectItem
                          key={horario.id}
                          value={horario.id.toString()}
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium">
                              {horario.hora_inicio} - {horario.hora_fin}
                            </span>
                            <Badge variant="secondary">
                              {horario.grupos.map((g) => g.nombre).join(", ")}
                            </Badge>
                            <Badge variant="outline">
                              {horario.profesores
                                .map((p) => p.nombre)
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
                  <label className="block text-sm font-medium mb-1">
                    Horario
                  </label>
                  <Select disabled value="">
                    <SelectTrigger>
                      <SelectValue placeholder="Cargando horarios..." />
                    </SelectTrigger>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Lista de atletas */}
          {selectedHorario ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-lg font-semibold">
                  {selectedHorario.grupos
                    .map((g) => `${g.nombre} (${g.nivel})`)
                    .join(", ")}
                </h3>

                <div className="flex flex-wrap items-center gap-3">
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
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Cargando atletas...</p>
                </div>
              ) : atletas.length > 0 ? (
                <>
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
                      onClick={guardarAsistencias}
                      disabled={saving}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {saving ? "Guardando..." : "Guardar Asistencias"}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Users className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p>No hay atletas registrados en este grupo</p>
                </div>
              )}
            </div>
          ) : (
            horarios.length === 0 &&
            !loading && (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay horarios programados para esta fecha</p>
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}

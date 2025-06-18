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
import {
  Calendar,
  Users,
  Clock,
  Save,
  CheckCircle,
  LogIn,
  LogOut,
} from "lucide-react";
import { type Session } from "@supabase/supabase-js"; // Importa Session como type-only
import LoginForm from "./components/LoginForm";
import { supabase } from "./lib/supabase"; // Moveremos supabase a un archivo separado

// Tipos
interface GrupoDB {
  id: number;
  nombre: string;
  nivel: string;
}

interface ProfesorDB {
  id: number;
  nombre: string;
  user_id?: string;
}

interface HorarioUI {
  id: number;
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
  grupos: GrupoDB[];
  profesores: ProfesorDB[];
}

interface HorarioSupabase {
  id: number;
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
  grupos: { grupos: GrupoDB }[];
  profesores: { profesores: ProfesorDB }[];
}

interface AtletaUI {
  id: number;
  nombre: string;
  apellido: string;
  grupo_id: number;
  presente: boolean;
}

interface AtletaSupabase {
  id: number;
  nombre: string;
  apellido: string;
  grupo_id: number;
}

interface AsistenciaSupabase {
  atleta_id: number;
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
  const [session, setSession] = useState<Session | null>(null);
  const [profesorId, setProfesorId] = useState<number | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    content: string;
  } | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const initialLoadRef = useRef(true);

  // Verificar sesión al cargar
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfesorId(session.user.id);
        setShowLogin(false);
      } else {
        setShowLogin(true);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) {
          fetchProfesorId(session.user.id);
          setShowLogin(false);
        } else {
          setProfesorId(null);
          setShowLogin(true);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Obtener ID del profesor basado en user_id
  const fetchProfesorId = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profesores")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      if (data) {
        setProfesorId(data.id);
      }
    } catch (error) {
      console.error("Error obteniendo ID de profesor:", error);
      setMessage({
        type: "error",
        content: "No se pudo obtener la información del profesor",
      });
    }
  };

  // Obtener nombre del día en formato capitalizado
  const getDayName = useCallback((date: string) => {
    return new Date(date + "T00:00:00")
      .toLocaleDateString("es-ES", { weekday: "long" })
      .replace(/^\w/, (c) => c.toUpperCase());
  }, []);

  // Obtener horarios disponibles para el día seleccionado
  useEffect(() => {
    const fetchHorarios = async () => {
      if (!session) return;

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

        // Convertir a tipo HorarioUI usando conversión segura
        const formattedHorarios = (
          horarios as unknown as HorarioSupabase[]
        ).map((horario) => ({
          id: horario.id,
          dia_semana: horario.dia_semana,
          hora_inicio: horario.hora_inicio,
          hora_fin: horario.hora_fin,
          grupos: horario.grupos.map((g) => g.grupos),
          profesores: horario.profesores.map((p) => p.profesores),
        }));

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

    if (session) {
      fetchHorarios();
    }
  }, [selectedDate, getDayName, session]);

  // Obtener atletas cuando se selecciona un horario
  const fetchAtletas = useCallback(async () => {
    if (!selectedHorario || !session || !profesorId) return;

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
          .eq("horario_id", selectedHorario.id)
          .eq("profesor_id", profesorId);

      if (asistenciasError) throw asistenciasError;

      // Combinar datos de atletas con asistencias
      const atletasConAsistencia = (atletasDelGrupo as AtletaSupabase[]).map(
        (atleta) => ({
          id: atleta.id,
          nombre: atleta.nombre,
          apellido: atleta.apellido,
          grupo_id: atleta.grupo_id,
          presente:
            (asistenciasExistentes as AsistenciaSupabase[])?.some(
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
  }, [selectedHorario, selectedDate, session, profesorId]);

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
    if (!selectedHorario || atletas.length === 0 || !profesorId) {
      setMessage({
        type: "error",
        content: "Faltan datos para guardar asistencias",
      });
      return;
    }

    // Verificar que el profesor está asignado a este horario
    const profesorAsignado = selectedHorario.profesores.some(
      (p) => p.id === profesorId
    );
    if (!profesorAsignado) {
      setMessage({
        type: "error",
        content: "No estás asignado a este horario",
      });
      return;
    }

    setSaving(true);
    try {
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

      let errorMessage = "Error al guardar asistencias";

      // Manejo seguro de errores
      if (error instanceof Error) {
        if (error.message.includes("violates row-level security policy")) {
          errorMessage =
            "Error de permisos: No tienes acceso para modificar estas asistencias";
        } else {
          errorMessage = error.message;
        }
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      setMessage({
        type: "error",
        content: errorMessage,
      });
    } finally {
      setSaving(false);
      // Limpiar el mensaje después de 5 segundos
      setTimeout(() => setMessage(null), 5000);
    }
  }, [selectedHorario, atletas, selectedDate, profesorId]);

  // Cerrar sesión
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setMessage({
        type: "success",
        content: "Sesión cerrada correctamente",
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setMessage({
        type: "error",
        content: "Ocurrió un error al cerrar sesión",
      });
    }
  };

  const atletasPresentes = atletas.filter((a) => a.presente).length;
  const totalAtletas = atletas.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mostrar mensajes flotantes */}
      {message && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
            message.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white max-w-md transition-all duration-300`}
        >
          {message.content}
        </div>
      )}

      {/* Barra superior */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            <h1 className="text-xl font-bold">Control de Asistencias</h1>
          </div>

          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-sm hidden sm:inline">
                {session.user.email}
              </span>
              <Button
                variant="outline"
                className="text-white border-white hover:bg-blue-700 flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Cerrar sesión</span>
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="text-white border-white hover:bg-blue-700 flex items-center gap-2"
              onClick={() => setShowLogin(true)}
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Iniciar sesión</span>
            </Button>
          )}
        </div>
      </header>

      {/* Pantalla de inicio de sesión */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <LoginForm
            onCancel={() => setShowLogin(false)}
            onLoginSuccess={() => {
              setMessage({
                type: "success",
                content: "Sesión iniciada correctamente",
              });
            }}
          />
        </div>
      )}

      {/* Contenido principal */}
      <main className="container mx-auto p-6 max-w-4xl">
        {session ? (
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

                  {/* Botón para cerrar sesión dentro de la tarjeta */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Controles de fecha y horario */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 flex-shrink-0" />
                  <div className="w-full">
                    <label className="block text-sm font-medium mb-1">
                      Fecha
                    </label>
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
                                  {horario.grupos
                                    .map((g) => g.nombre)
                                    .join(", ")}
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
                                onCheckedChange={() =>
                                  toggleAsistencia(atleta.id)
                                }
                              />
                              <label
                                htmlFor={`atleta-${atleta.id}`}
                                className="text-sm font-medium cursor-pointer"
                              >
                                {atleta.nombre} {atleta.apellido}
                              </label>
                            </div>
                            <Badge
                              variant={
                                atleta.presente ? "default" : "secondary"
                              }
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
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Control de Asistencias
              </h2>
              <p className="text-gray-600 mb-6">
                Inicia sesión como profesor para registrar las asistencias
                diarias
              </p>
              <Button
                size="lg"
                className="flex items-center gap-2 mx-auto"
                onClick={() => setShowLogin(true)}
              >
                <LogIn className="h-5 w-5" />
                Iniciar sesión
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

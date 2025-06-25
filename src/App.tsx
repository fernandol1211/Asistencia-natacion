"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";
import Header from "./components/Header";
import LoginModal from "./components/LoginModal";
import AttendanceCard from "./components/AttendanceCard";
import NoSessionView from "./components/NoSessionView";
import Message from "./components/Message";
import type {
  HorarioUI,
  AtletaUI,
  HorarioSupabase,
  AtletaSupabase,
  AsistenciaSupabase,
  MessageType,
  GrupoDB,
  ProfesorDB,
} from "./types";

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
  const [message, setMessage] = useState<MessageType>(null);
  const [showLogin, setShowLogin] = useState(false);
  const initialLoadRef = useRef(true);

  // Verificar sesión al cargar y manejar eventos de autenticación
  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfesorId(session.user.id);
        setShowLogin(false);
      } else {
        setShowLogin(true);
      }
    });

    // Escuchar cambios en la autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (session) {
          fetchProfesorId(session.user.id);
          setShowLogin(false);

          // Mostrar mensaje según el tipo de evento
          if (event === "SIGNED_IN") {
            setMessage({
              type: "success",
              content: "Sesión iniciada correctamente",
            });
          } else if (event === "USER_UPDATED") {
            setMessage({
              type: "success",
              content:
                "¡Registro exitoso! Por favor verifica tu email antes de iniciar sesión",
            });
          }
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

        // Convertir a tipo HorarioUI y filtrar valores nulos
        const formattedHorarios = (
          horarios as unknown as HorarioSupabase[]
        ).map((horario) => ({
          id: horario.id,
          dia_semana: horario.dia_semana,
          hora_inicio: horario.hora_inicio,
          hora_fin: horario.hora_fin,
          grupos: horario.grupos
            .map((g) => g.grupos)
            .filter((g): g is GrupoDB => g !== null),
          profesores: horario.profesores
            .map((p) => p.profesores)
            .filter((p): p is ProfesorDB => p !== null),
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

      // Obtener atletas de los grupos
      const { data: atletasDelGrupo, error: atletasError } = await supabase
        .from("atletas")
        .select("id, nombre, apellido, grupo_id")
        .in("grupo_id", grupoIds);

      if (atletasError) throw atletasError;

      // Obtener asistencias existentes
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
      <Message message={message} />
      <Header
        session={session}
        onLogout={handleLogout}
        onLoginClick={() => setShowLogin(true)}
      />
      <LoginModal
        show={showLogin}
        onCancel={() => setShowLogin(false)}
        onLoginSuccess={() => {
          setMessage({
            type: "success",
            content: "Sesión iniciada correctamente",
          });
        }}
        onRegisterSuccess={() => {
          setMessage({
            type: "success",
            content:
              "¡Registro exitoso! Por favor verifica tu email antes de iniciar sesión",
          });
        }}
      />
      <main className="container mx-auto px-3 py-4 sm:px-4 md:px-6 lg:px-8 max-w-7xl">
        {session ? (
          <AttendanceCard
            profesorId={profesorId}
            onLogout={handleLogout}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            horarios={horarios}
            selectedHorario={selectedHorario}
            onHorarioChange={setSelectedHorario}
            atletas={atletas}
            toggleAsistencia={toggleAsistencia}
            toggleAllAsistencias={toggleAllAsistencias}
            atletasPresentes={atletasPresentes}
            totalAtletas={totalAtletas}
            loading={loading}
            saving={saving}
            onSave={guardarAsistencias}
          />
        ) : (
          <NoSessionView onLoginClick={() => setShowLogin(true)} />
        )}
      </main>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../lib/supabase";
import AttendanceCard from "./AttendanceCard";
import NoSessionView from "./NoSessionView";
import Message from "./Message";
import type {
  HorarioUI,
  AtletaUI,
  HorarioSupabase,
  AtletaSupabase,
  AsistenciaSupabase,
  MessageType,
  GrupoDB,
  ProfesorDB,
} from "../types";
import { useAuth } from "../context/AuthContext";

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
  const [profesorId, setProfesorId] = useState<string | null>(null);
  const [message, setMessage] = useState<MessageType>(null);
  const initialLoadRef = useRef(true);

  const { session, logout } = useAuth(); // Añadimos logout del contexto

  // Obtener ID del profesor
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

  // Obtener nombre del día
  const getDayName = useCallback((date: string) => {
    return new Date(date + "T00:00:00")
      .toLocaleDateString("es-ES", { weekday: "long" })
      .replace(/^\w/, (c) => c.toUpperCase());
  }, []);

  // Obtener horarios disponibles
  useEffect(() => {
    const fetchHorarios = async () => {
      if (!session) return;

      const dayName = getDayName(selectedDate);

      setLoading(true);
      try {
        const { data: horarios, error } = await supabase
          .from("horarios")
          .select(
            `id, dia_semana, hora_inicio, hora_fin,
             grupos:horarios_grupos ( grupos (id, nombre, nivel) ),
             profesores:profesores_horarios ( profesores (id, nombre) )`
          )
          .eq("dia_semana", dayName);

        if (error) throw error;

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
      fetchProfesorId(session.user.id);
    }
  }, [selectedDate, getDayName, session]);

  // Obtener atletas
  const fetchAtletas = useCallback(async () => {
    if (!selectedHorario || !session || !profesorId) return;

    setLoading(true);
    try {
      const grupoIds = selectedHorario.grupos.map((g) => g.id);

      const { data: atletasDelGrupo, error: atletasError } = await supabase
        .from("atletas")
        .select("id, nombre, apellido, grupo_id")
        .in("grupo_id", grupoIds);

      if (atletasError) throw atletasError;

      const { data: asistenciasExistentes, error: asistenciasError } =
        await supabase
          .from("asistencias")
          .select("atleta_id, presente")
          .eq("fecha", selectedDate)
          .eq("horario_id", selectedHorario.id)
          .eq("profesor_id", profesorId);

      if (asistenciasError) throw asistenciasError;

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

  const toggleAsistencia = (atletaId: string) => {
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
      const asistenciasData = atletas.map((atleta) => ({
        fecha: selectedDate,
        horario_id: selectedHorario.id,
        profesor_id: profesorId,
        atleta_id: atleta.id,
        presente: atleta.presente,
      }));

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

  const atletasPresentes = atletas.filter((a) => a.presente).length;
  const totalAtletas = atletas.length;

  return (
    <>
      <Message message={message} />
      {session ? (
        <AttendanceCard
          profesorId={profesorId}
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
          onLogout={logout} // Añadimos onLogout aquí
        />
      ) : (
        <NoSessionView />
      )}
    </>
  );
}

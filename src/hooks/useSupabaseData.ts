import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type {
  GrupoDB,
  ProfesorDB,
  HorarioUI,
  AtletaConAsistencia,
} from "@/types";

// Tipos para las respuestas de Supabase
interface HorarioSupabaseResponse {
  id: string;
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
  horarios_grupos: { grupos: GrupoDB }[] | null; // Cambiado a objeto simple
  profesores_horarios: { profesores: ProfesorDB }[] | null; // Cambiado a objeto simple
}

interface AtletaSupabaseResponse {
  id: string;
  nombre: string;
  apellido: string;
  grupo_id: string | null;
  grupos: GrupoDB | null; // Cambiado a objeto simple
}

interface AsistenciaSupabaseResponse {
  atleta_id: string;
  presente: boolean;
}

// Hook para obtener grupos
export function useGrupos() {
  const [grupos, setGrupos] = useState<GrupoDB[]>([]);

  useEffect(() => {
    const fetchGrupos = async () => {
      const { data, error } = await supabase.from("grupos").select("*");

      if (error) {
        console.error("Error fetching grupos:", error);
        return;
      }
      setGrupos(data as GrupoDB[]);
    };
    fetchGrupos();
  }, []);

  return { grupos };
}

// Hook para obtener profesores
export function useProfesores() {
  const [profesores, setProfesores] = useState<ProfesorDB[]>([]);

  useEffect(() => {
    const fetchProfesores = async () => {
      const { data, error } = await supabase.from("profesores").select("*");

      if (error) {
        console.error("Error fetching profesores:", error);
        return;
      }
      setProfesores(data as ProfesorDB[]);
    };
    fetchProfesores();
  }, []);

  return { profesores };
}

// Hook para obtener horarios - CORREGIDO
export function useHorarios() {
  const [horarios, setHorarios] = useState<HorarioUI[]>([]);

  useEffect(() => {
    const fetchHorarios = async () => {
      const { data, error } = await supabase.from("horarios").select(`
          id,
          dia_semana,
          hora_inicio,
          hora_fin,
          horarios_grupos ( grupos (id, nombre, nivel) ),
          profesores_horarios ( profesores (id, nombre) )
        `);

      if (error) {
        console.error("Error fetching horarios:", error);
        return;
      }

      // Transformar datos CORREGIDO
      const transformed: HorarioUI[] = (
        (data as HorarioSupabaseResponse[]) || []
      ).map((h) => {
        // Extraer grupos como array plano
        const grupos = h.horarios_grupos
          ? h.horarios_grupos
              .map((hg) => hg.grupos)
              .filter((g): g is GrupoDB => g !== null)
          : [];

        // Extraer profesores como array plano
        const profesores = h.profesores_horarios
          ? h.profesores_horarios
              .map((ph) => ph.profesores)
              .filter((p): p is ProfesorDB => p !== null)
          : [];

        return {
          id: h.id,
          dia_semana: h.dia_semana,
          hora_inicio: h.hora_inicio,
          hora_fin: h.hora_fin,
          grupos: grupos,
          profesores: profesores,
        };
      });

      setHorarios(transformed);
    };

    fetchHorarios();
  }, []);

  return { horarios };
}

// Hook para obtener atletas con asistencia - CORREGIDO
export function useAtletasConAsistencia() {
  const [atletas, setAtletas] = useState<AtletaConAsistencia[]>([]);

  useEffect(() => {
    const fetchAtletas = async () => {
      const { data: atletasData, error: atletasError } = await supabase.from(
        "atletas"
      ).select(`
          id,
          nombre,
          apellido,
          grupo_id,
          grupos (id, nombre, nivel)
        `);

      if (atletasError) {
        console.error("Error fetching atletas:", atletasError);
        return;
      }

      const { data: asistenciaData, error: asistenciaError } =
        await supabase.from("asistencias").select(`
          atleta_id,
          presente
        `);

      if (asistenciaError) {
        console.error("Error fetching asistencias:", asistenciaError);
        return;
      }

      // Transformación CORREGIDA
      const atletasConAsistencia: AtletaConAsistencia[] = (
        (atletasData as AtletaSupabaseResponse[]) || []
      ).map((atleta) => {
        const asistencias = (
          (asistenciaData as AsistenciaSupabaseResponse[]) || []
        ).filter((a) => a.atleta_id === atleta.id);

        const totalClases = asistencias.length;
        const clasesAsistidas = asistencias.filter(
          (a) => a.presente === true
        ).length;
        const porcentaje =
          totalClases > 0
            ? Math.round((clasesAsistidas / totalClases) * 100)
            : 0;

        return {
          id: atleta.id,
          nombre: atleta.nombre,
          apellido: atleta.apellido,
          grupo_id: atleta.grupo_id || "",
          grupo: atleta.grupos, // Ahora es un objeto simple
          clases_asistidas: clasesAsistidas,
          total_clases: totalClases,
          porcentaje_asistencia: porcentaje,
        };
      });

      setAtletas(atletasConAsistencia);
    };

    fetchAtletas();
  }, []);

  return { atletas };
}

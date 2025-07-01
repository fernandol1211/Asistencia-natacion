import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type {
  GrupoDB,
  ProfesorDB,
  HorarioUI,
  AtletaConAsistencia,
} from "@/types";

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

// Hook para obtener horarios CORREGIDO
export function useHorarios() {
  const [horarios, setHorarios] = useState<HorarioUI[]>([]);

  useEffect(() => {
    const fetchHorarios = async () => {
      // Consulta corregida con sintaxis adecuada para relaciones
      const { data, error } = await supabase.from("horarios").select(`
          id,
          dia_semana,
          hora_inicio,
          hora_fin,
          grupos_horarios ( grupos (id, nombre, nivel) ),
          profesores_horarios ( profesores (id, nombre) )
        `);

      if (error) {
        console.error("Error fetching horarios:", error);
        return;
      }

      // Transformar datos
      const transformed: HorarioUI[] = (data || []).map((h: any) => ({
        id: h.id,
        dia_semana: h.dia_semana,
        hora_inicio: h.hora_inicio,
        hora_fin: h.hora_fin,
        grupos: h.grupos_horarios.map((g: any) => g.grupos),
        profesores: h.profesores_horarios.map((p: any) => p.profesores),
      }));

      setHorarios(transformed);
    };

    fetchHorarios();
  }, []);

  return { horarios };
}

// Hook para obtener atletas con asistencia CORREGIDO
export function useAtletasConAsistencia() {
  const [atletas, setAtletas] = useState<AtletaConAsistencia[]>([]);

  useEffect(() => {
    const fetchAtletas = async () => {
      // Consulta corregida
      const { data: atletasData, error: atletasError } = await supabase.from(
        "atletas"
      ).select(`
          id,
          nombre,
          apellido,
          email,
          grupo_id,
          grupos (id, nombre, nivel)
        `);

      if (atletasError) {
        console.error("Error fetching atletas:", atletasError);
        return;
      }

      // Obtener estadísticas de asistencia
      const { data: asistenciaData, error: asistenciaError } =
        await supabase.from("asistencias").select(`
          atleta_id,
          presente
        `);

      if (asistenciaError) {
        console.error("Error fetching asistencias:", asistenciaError);
        return;
      }

      // Calcular porcentajes de asistencia
      const atletasConAsistencia: AtletaConAsistencia[] = (
        atletasData || []
      ).map((atleta: any) => {
        const asistencias = (asistenciaData || []).filter(
          (a: any) => a.atleta_id === atleta.id
        );

        const totalClases = asistencias.length;
        const clasesAsistidas = asistencias.filter(
          (a: any) => a.presente
        ).length;
        const porcentaje =
          totalClases > 0
            ? Math.round((clasesAsistidas / totalClases) * 100)
            : 0;

        return {
          id: atleta.id,
          nombre: atleta.nombre,
          apellido: atleta.apellido,
          email: atleta.email,
          grupo_id: atleta.grupo_id,
          grupo: atleta.grupos,
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

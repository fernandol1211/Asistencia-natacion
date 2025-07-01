// src/types/index.ts
export interface GrupoDB {
  id: number;
  nombre: string;
  nivel: string;
}

export interface ProfesorDB {
  id: number;
  nombre: string;
  user_id?: string;
  email?: string; // Nueva propiedad
  telefono?: string; // Nueva propiedad
}

export interface HorarioUI {
  id: number;
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
  grupos: GrupoDB[];
  profesores: ProfesorDB[];
}

export interface HorarioSupabase {
  id: number;
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
  grupos: { grupos: GrupoDB }[];
  profesores: { profesores: ProfesorDB }[];
}

export interface AtletaUI {
  id: number;
  nombre: string;
  apellido: string;
  grupo_id: number;
  presente: boolean;
}

export interface AtletaSupabase {
  id: number;
  nombre: string;
  apellido: string;
  grupo_id: number;
}

export interface AsistenciaSupabase {
  atleta_id: number;
  presente: boolean;
}

export type MessageType = {
  type: "success" | "error";
  content: string;
} | null;

// Agrega estas interfaces
export interface AtletaConAsistencia {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  grupo_id: number;
  grupo: GrupoDB;
  clases_asistidas: number;
  total_clases: number;
  porcentaje_asistencia: number;
}

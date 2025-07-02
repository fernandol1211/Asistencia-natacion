// src/types/index.ts
export interface GrupoDB {
  id: string; // Cambiado a string para UUIDs
  nombre: string;
  nivel: string;
}

export interface ProfesorDB {
  id: string; // Cambiado a string para UUIDs
  nombre: string;
  user_id?: string;
  email?: string;
  telefono?: string;
}

export interface HorarioUI {
  id: string; // Cambiado a string para UUIDs
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
  grupos: GrupoDB[];
  profesores: ProfesorDB[];
}

export interface HorarioSupabase {
  id: string; // Cambiado a string para UUIDs
  dia_semana: string;
  hora_inicio: string;
  hora_fin: string;
  grupos: { grupos: GrupoDB }[];
  profesores: { profesores: ProfesorDB }[];
}

// Actualizado: añadido campo nota
export interface AtletaUI {
  id: string; // Cambiado a string para UUIDs
  nombre: string;
  apellido: string;
  grupo_id: string; // Cambiado a string para UUIDs
  presente: boolean;
  nota?: number; // Nuevo campo añadido
}

export interface AtletaSupabase {
  id: string; // Cambiado a string para UUIDs
  nombre: string;
  apellido: string;
  grupo_id: string; // Cambiado a string para UUIDs
}

// Actualizado: añadido campo nota
export interface AsistenciaSupabase {
  id?: string; // Cambiado a string para UUIDs
  fecha: Date | string;
  horario_id: string; // Cambiado a string para UUIDs
  profesor_id: string; // Cambiado a string para UUIDs
  atleta_id: string; // Cambiado a string para UUIDs
  presente: boolean;
  nota?: number; // Nuevo campo añadido
}

export type MessageType = {
  type: "success" | "error";
  content: string;
} | null;

// Actualizado: añadido campos relacionados con notas
export interface AtletaConAsistencia {
  id: string; // Cambiado a string para UUIDs
  nombre: string;
  apellido: string;
  email?: string; // Hecho opcional ya que puede no existir
  grupo_id: string; // Cambiado a string para UUIDs
  grupo: GrupoDB | null; // Puede ser null si no tiene grupo asignado
  clases_asistidas: number;
  total_clases: number;
  porcentaje_asistencia: number;
  promedio_nota?: number; // Nuevo campo añadido
  ultima_nota?: number; // Nuevo campo añadido
}

// Nueva interfaz para el payload de asistencias
export interface AsistenciaPayload {
  fecha: string;
  horario_id: string; // Cambiado a string para UUIDs
  profesor_id: string; // Cambiado a string para UUIDs
  atleta_id: string; // Cambiado a string para UUIDs
  presente: boolean;
  nota?: number;
}

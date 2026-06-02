export type Objetivo = 'bajar_peso' | 'fuerza' | 'resistencia';

export type TipoRutina = 'cardio' | 'fuerza' | 'flexibilidad';

export type Vista = 'login' | 'registro' | 'dashboard' | 'perfil' | 'detalle' | 'progreso' | 'imc' | 'logros' | 'peso' | 'comidas'  | 'admin';
export interface Usuario {
  id: string;
  nombre: string;
  peso: number;
  nivelEnergia: number;
  objetivo: Objetivo;
  rol?: string;
}

export interface Ejercicio {
  id: string;
  nombre: string;
  duracion: number;
  intensidad: 'baja' | 'media' | 'alta';
  calorias: number;
  tipo: TipoRutina;
  descripcion: string;
  repeticiones?: number;
  series?: number;
}

export interface Rutina {
  id: string;
  tipo: TipoRutina;
  ejercicios: Ejercicio[];
  totalCalorias: number;
  duracionTotal: number;
  intensidadGeneral: 'baja' | 'media' | 'alta';
  fechaCreacion: Date;
}


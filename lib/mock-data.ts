import { Ejercicio, Rutina, TipoRutina } from './types';

export const ejerciciosCardio: Ejercicio[] = [
  {
    id: '1',
    nombre: 'Saltos de Tijera',
    duracion: 5,
    intensidad: 'alta',
    calorias: 50,
    tipo: 'cardio',
    descripcion: 'Saltos abriendo y cerrando piernas y brazos',
    repeticiones: 30,
    series: 3
  },
  {
    id: '2',
    nombre: 'Burpees',
    duracion: 8,
    intensidad: 'alta',
    calorias: 80,
    tipo: 'cardio',
    descripcion: 'Ejercicio completo de cuerpo',
    repeticiones: 15,
    series: 3
  },
  {
    id: '3',
    nombre: 'Mountain Climbers',
    duracion: 5,
    intensidad: 'media',
    calorias: 45,
    tipo: 'cardio',
    descripcion: 'Escaladores en posición de plancha',
    repeticiones: 20,
    series: 3
  },
  {
    id: '4',
    nombre: 'Cuerda Imaginaria',
    duracion: 10,
    intensidad: 'media',
    calorias: 70,
    tipo: 'cardio',
    descripcion: 'Simulación de saltar la cuerda',
    repeticiones: 100,
    series: 2
  }
];

export const ejerciciosFuerza: Ejercicio[] = [
  {
    id: '5',
    nombre: 'Sentadillas',
    duracion: 8,
    intensidad: 'media',
    calorias: 40,
    tipo: 'fuerza',
    descripcion: 'Sentadillas con peso corporal',
    repeticiones: 15,
    series: 4
  },
  {
    id: '6',
    nombre: 'Flexiones',
    duracion: 6,
    intensidad: 'alta',
    calorias: 35,
    tipo: 'fuerza',
    descripcion: 'Push-ups clásicas',
    repeticiones: 12,
    series: 4
  },
  {
    id: '7',
    nombre: 'Plancha',
    duracion: 5,
    intensidad: 'media',
    calorias: 25,
    tipo: 'fuerza',
    descripcion: 'Mantener posición de plancha',
    repeticiones: 1,
    series: 3
  },
  {
    id: '8',
    nombre: 'Zancadas',
    duracion: 8,
    intensidad: 'media',
    calorias: 45,
    tipo: 'fuerza',
    descripcion: 'Lunges alternados',
    repeticiones: 12,
    series: 3
  }
];

export const ejerciciosFlexibilidad: Ejercicio[] = [
  {
    id: '9',
    nombre: 'Estiramiento de Isquiotibiales',
    duracion: 5,
    intensidad: 'baja',
    calorias: 10,
    tipo: 'flexibilidad',
    descripcion: 'Estiramiento de piernas posterior',
    repeticiones: 1,
    series: 2
  },
  {
    id: '10',
    nombre: 'Yoga - Perro Boca Abajo',
    duracion: 5,
    intensidad: 'baja',
    calorias: 15,
    tipo: 'flexibilidad',
    descripcion: 'Postura de yoga clásica',
    repeticiones: 1,
    series: 3
  },
  {
    id: '11',
    nombre: 'Estiramiento de Cadera',
    duracion: 4,
    intensidad: 'baja',
    calorias: 8,
    tipo: 'flexibilidad',
    descripcion: 'Apertura de caderas',
    repeticiones: 1,
    series: 2
  },
  {
    id: '12',
    nombre: 'Rotación de Torso',
    duracion: 3,
    intensidad: 'baja',
    calorias: 5,
    tipo: 'flexibilidad',
    descripcion: 'Rotación suave del torso',
    repeticiones: 10,
    series: 2
  }
];

export function generarRutina(nivelEnergia: number, objetivo: string): Rutina {
  let tipo: TipoRutina;
  let ejerciciosBase: Ejercicio[];

  // Selección automática basada en energía y objetivo
  if (nivelEnergia < 30) {
    tipo = 'flexibilidad';
    ejerciciosBase = ejerciciosFlexibilidad;
  } else if (nivelEnergia < 60) {
    tipo = objetivo === 'fuerza' ? 'fuerza' : 'cardio';
    ejerciciosBase = objetivo === 'fuerza' ? ejerciciosFuerza : ejerciciosCardio;
  } else {
    if (objetivo === 'bajar_peso') {
      tipo = 'cardio';
      ejerciciosBase = ejerciciosCardio;
    } else if (objetivo === 'fuerza') {
      tipo = 'fuerza';
      ejerciciosBase = ejerciciosFuerza;
    } else {
      tipo = 'cardio';
      ejerciciosBase = [...ejerciciosCardio.slice(0, 2), ...ejerciciosFuerza.slice(0, 2)];
    }
  }

  // Seleccionar ejercicios aleatorios
  const ejerciciosSeleccionados = ejerciciosBase
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(4, ejerciciosBase.length));

  const totalCalorias = ejerciciosSeleccionados.reduce((sum, e) => sum + e.calorias, 0);
  const duracionTotal = ejerciciosSeleccionados.reduce((sum, e) => sum + e.duracion, 0);

  return {
    id: Date.now().toString(),
    tipo,
    ejercicios: ejerciciosSeleccionados,
    totalCalorias,
    duracionTotal,
    intensidadGeneral: nivelEnergia < 40 ? 'baja' : nivelEnergia < 70 ? 'media' : 'alta',
    fechaCreacion: new Date()
  };
}

export function ajustarRutinaPorCansancio(rutina: Rutina): Rutina {
  const ejerciciosAjustados = rutina.ejercicios.map(e => ({
    ...e,
    repeticiones: e.repeticiones ? Math.floor(e.repeticiones * 0.7) : e.repeticiones,
    series: e.series ? Math.max(1, e.series - 1) : e.series,
    calorias: Math.floor(e.calorias * 0.7),
    intensidad: e.intensidad === 'alta' ? 'media' : e.intensidad === 'media' ? 'baja' : 'baja'
  })) as Ejercicio[];

  return {
    ...rutina,
    ejercicios: ejerciciosAjustados,
    totalCalorias: ejerciciosAjustados.reduce((sum, e) => sum + e.calorias, 0),
    intensidadGeneral: 'baja'
  };
}

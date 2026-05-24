"use client";

import { TipoRutina } from '@/lib/types';
import { Heart, Dumbbell, Sparkles } from 'lucide-react';

interface RoutineTypeLabelProps {
  tipo: TipoRutina;
  intensidad: 'baja' | 'media' | 'alta';
}

export function RoutineTypeLabel({ tipo, intensidad }: RoutineTypeLabelProps) {
  const config = {
    cardio: {
      label: 'Rutina Cardio',
      icon: Heart,
      color: 'from-red-500/20 to-orange-500/20 border-red-500/30',
      textColor: 'text-red-400',
      description: 'Mejora tu resistencia cardiovascular'
    },
    fuerza: {
      label: 'Rutina Fuerza',
      icon: Dumbbell,
      color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30',
      textColor: 'text-blue-400',
      description: 'Desarrolla masa muscular y potencia'
    },
    flexibilidad: {
      label: 'Rutina Flexibilidad',
      icon: Sparkles,
      color: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
      textColor: 'text-green-400',
      description: 'Mejora tu movilidad y recuperación'
    }
  };

  const { label, icon: Icon, color, textColor, description } = config[tipo];

  const intensidadLabels = {
    baja: { label: 'Intensidad Baja', emoji: '🌱' },
    media: { label: 'Intensidad Media', emoji: '⚡' },
    alta: { label: 'Intensidad Alta', emoji: '🔥' }
  };

  return (
    <div className={`rounded-2xl bg-gradient-to-r ${color} border p-4`}>
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${textColor}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className={`font-bold text-lg ${textColor}`}>{label}</h3>
            <span className="text-sm">
              {intensidadLabels[intensidad].emoji}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
          <span className="text-xs text-muted-foreground mt-1 inline-block">
            {intensidadLabels[intensidad].label}
          </span>
        </div>
      </div>
    </div>
  );
}

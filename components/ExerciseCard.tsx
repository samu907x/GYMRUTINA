"use client";

import { useEffect, useState } from "react";

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Ejercicio } from '@/lib/types';

import {
  Clock,
  Flame,
  Repeat,
  Layers,
  Play,
  CheckCircle,
  PauseCircle
} from 'lucide-react';
import { on } from "events";

interface ExerciseCardProps {
  ejercicio: Ejercicio;
  index: number;
    onFinish: () => void;
}

export function ExerciseCard({ ejercicio, index, onFinish }: ExerciseCardProps) {

  const [iniciado, setIniciado] = useState(false);
  const [finalizado, setFinalizado] = useState(false);
  const [segundos, setSegundos] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (iniciado && !finalizado) {
      interval = setInterval(() => {
        setSegundos((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [iniciado, finalizado]);

  const formatearTiempo = (totalSegundos: number) => {
    const mins = Math.floor(totalSegundos / 60);
    const secs = totalSegundos % 60;

    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const iniciarEjercicio = () => {
    setIniciado(true);
    setFinalizado(false);
  };

  const finalizarEjercicio = () => {
     console.log("FINALIZADO:", ejercicio.id);

    setFinalizado(true);
    setIniciado(false);

    onFinish();
  };

  const getIntensidadColor = (intensidad: string) => {
    switch (intensidad) {
      case 'alta':
        return 'bg-destructive/20 text-destructive border-destructive/30';

      case 'media':
        return 'bg-accent/20 text-accent border-accent/30';

      case 'baja':
        return 'bg-primary/20 text-primary border-primary/30';

      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'cardio':
        return '🏃';

      case 'fuerza':
        return '💪';

      case 'flexibilidad':
        return '🧘';

      default:
        return '🏋️';
    }
  };

  return (
    <Card
      className={`group border-border/50 transition-all duration-300
      ${
        finalizado
          ? 'border-green-500/40 bg-green-500/5'
          : 'bg-card/50 hover:bg-card/80 hover:border-primary/30'
      }`}
    >
      <CardContent className="p-4">

        <div className="flex items-start gap-4">

          {/* Número */}
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
            {index + 1}
          </div>

          <div className="flex-1 min-w-0">

            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-2">

              <div>
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <span>{getTipoIcon(ejercicio.tipo)}</span>
                  {ejercicio.nombre}
                </h3>

                <p className="text-sm text-muted-foreground mt-0.5">
                  {ejercicio.descripcion}
                </p>
              </div>

              <Badge
                variant="outline"
                className={getIntensidadColor(ejercicio.intensidad)}
              >
                {ejercicio.intensidad}
              </Badge>

            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-3 mt-3">

              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{ejercicio.duracion} min</span>
              </div>

              <div className="flex items-center gap-1.5 text-sm text-accent">
                <Flame className="w-4 h-4" />
                <span>{ejercicio.calorias} kcal</span>
              </div>

              {ejercicio.repeticiones && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Repeat className="w-4 h-4" />
                  <span>{ejercicio.repeticiones} reps</span>
                </div>
              )}

              {ejercicio.series && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Layers className="w-4 h-4" />
                  <span>{ejercicio.series} series</span>
                </div>
              )}

            </div>

            {/* TIMER */}
            <div className="mt-4 flex items-center gap-2">

              <div className="px-3 py-1 rounded-lg bg-primary/10 text-primary font-mono text-sm">
                ⏱️ {formatearTiempo(segundos)}
              </div>

              {iniciado && !finalizado && (
                <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                  En progreso
                </Badge>
              )}

              {finalizado && (
                <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                  Finalizado
                </Badge>
              )}

            </div>

            {/* BOTONES */}
            <div className="flex gap-2 mt-4">

              {!iniciado && !finalizado && (
                <Button
                  onClick={iniciarEjercicio}
                  className="gap-2"
                >
                  <Play className="w-4 h-4" />
                  Empezar
                </Button>
              )}

              {iniciado && !finalizado && (
                <Button
                  variant="destructive"
                  onClick={finalizarEjercicio}
                  className="gap-2"
                >
                  <PauseCircle className="w-4 h-4" />
                  Finalizar
                </Button>
              )}

              {finalizado && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSegundos(0);
                    setFinalizado(false);
                    setIniciado(false);
                  }}
                  className="gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Reiniciar
                </Button>
              )}

            </div>

          </div>

        </div>

      </CardContent>
    </Card>
  );
}
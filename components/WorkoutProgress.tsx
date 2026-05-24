"use client";

import { Progress } from "@/components/ui/progress";

interface WorkoutProgressProps {
  completados: number;
  total: number;
}

export function WorkoutProgress({
  completados,
  total,
}: WorkoutProgressProps) {

  const porcentaje = (completados / total) * 100;

  return (
    <div className="mb-6">

      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-foreground">
          Progreso de rutina
        </h3>

        <span className="text-sm text-muted-foreground">
          {completados} / {total} ejercicios
        </span>
      </div>

      <Progress value={porcentaje} className="h-3" />

      <p className="text-sm text-primary mt-2 font-medium">
        {Math.round(porcentaje)}% completado
      </p>

    </div>
  );
}
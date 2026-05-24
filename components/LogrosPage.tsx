"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/context";
import { Navbar } from "./Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Logro {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  emoji: string;
  fecha_obtenido: string;
}

const TODOS_LOS_LOGROS = [
  { codigo: "primera_rutina", nombre: "Primera rutina", descripcion: "Completaste tu primera rutina", emoji: "🎯" },
  { codigo: "cinco_rutinas", nombre: "En racha", descripcion: "Completaste 5 rutinas", emoji: "🔥" },
  { codigo: "diez_rutinas", nombre: "Dedicado", descripcion: "Completaste 10 rutinas", emoji: "💪" },
  { codigo: "calorias_500", nombre: "Quemador", descripcion: "Quemaste 500 kcal en total", emoji: "🌡️" },
  { codigo: "calorias_1000", nombre: "Incinerador", descripcion: "Quemaste 1000 kcal en total", emoji: "⚡" },
  { codigo: "primer_reto", nombre: "Retador", descripcion: "Completaste tu primer reto diario", emoji: "🏆" },
  { codigo: "cinco_retos", nombre: "Guerrero", descripcion: "Completaste 5 retos diarios", emoji: "⚔️" },
  { codigo: "racha_3", nombre: "3 días seguidos", descripcion: "Entrenaste 3 días seguidos", emoji: "📅" },
  { codigo: "racha_7", nombre: "Semana de fuego", descripcion: "Entrenaste 7 días seguidos", emoji: "🗓️" },
];

export function LogrosPage() {
  const { usuario } = useApp();
  const [logros, setLogros] = useState<Logro[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (usuario) {
      fetch(`/api/logros?usuario_id=${usuario.id}`)
        .then(r => r.json())
        .then(data => {
          if (data.success) setLogros(data.logros);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [usuario]);

  const tieneLogro = (codigo: string) => logros.some(l => l.codigo === codigo);
  const fechaLogro = (codigo: string) => {
    const logro = logros.find(l => l.codigo === codigo);
    if (!logro) return null;
    return new Date(logro.fecha_obtenido).toLocaleDateString("es-CO", {
      day: "numeric", month: "long", year: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">🏅 Logros</h1>
        <p className="text-muted-foreground mb-8">
          {logros.length} de {TODOS_LOS_LOGROS.length} logros desbloqueados
        </p>

        {/* Barra de progreso */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Progreso total</span>
            <span>{Math.round((logros.length / TODOS_LOS_LOGROS.length) * 100)}%</span>
          </div>
          <div className="h-3 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(logros.length / TODOS_LOS_LOGROS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Logros obtenidos */}
        {logros.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">✅ Desbloqueados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TODOS_LOS_LOGROS.filter(l => tieneLogro(l.codigo)).map(logro => (
                <Card key={logro.codigo} className="border-primary/30 bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{logro.emoji}</span>
                      <div>
                        <p className="font-bold text-foreground">{logro.nombre}</p>
                        <p className="text-xs text-muted-foreground">{logro.descripcion}</p>
                        <p className="text-xs text-primary mt-1">
                          Obtenido el {fechaLogro(logro.codigo)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Logros pendientes */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">🔒 Por desbloquear</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TODOS_LOS_LOGROS.filter(l => !tieneLogro(l.codigo)).map(logro => (
              <Card key={logro.codigo} className="border-border/50 bg-card/50 opacity-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl grayscale">{logro.emoji}</span>
                    <div>
                      <p className="font-bold text-foreground">{logro.nombre}</p>
                      <p className="text-xs text-muted-foreground">{logro.descripcion}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
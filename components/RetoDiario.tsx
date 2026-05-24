"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ejerciciosCardio, ejerciciosFuerza } from "@/lib/mock-data";
import { Ejercicio } from "@/lib/types";
import { Flame, Clock, Zap } from "lucide-react";

const ejerciciosDificiles = [
  ...ejerciciosCardio.filter(e => e.intensidad === 'alta'),
  ...ejerciciosFuerza.filter(e => e.intensidad === 'alta'),
];

function getReto(fecha: string): Ejercicio[] {
  let hash = 0;
  for (let i = 0; i < fecha.length; i++) {
    hash = (hash * 31 + fecha.charCodeAt(i)) % ejerciciosDificiles.length;
  }
  const inicio = hash % ejerciciosDificiles.length;
  const reto: Ejercicio[] = [];
  for (let i = 0; i < 3; i++) {
    reto.push(ejerciciosDificiles[(inicio + i) % ejerciciosDificiles.length]);
  }
  return reto;
}

function getTiempoRestante(): string {
  const ahora = new Date();
  const manana = new Date();
  manana.setDate(manana.getDate() + 1);
  manana.setHours(0, 0, 0, 0);
  const diff = manana.getTime() - ahora.getTime();
  const horas = Math.floor(diff / (1000 * 60 * 60));
  const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diff % (1000 * 60)) / 1000);
  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
}

const desbloquearLogro = (usuario_id: string, codigo: string, nombre: string, descripcion: string, emoji: string) => {
  fetch("/api/logros", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario_id, codigo, nombre, descripcion, emoji })
  });
};

export function RetoDiario() {
  const hoy = new Date().toLocaleDateString("es-CO");
  const ejercicios = getReto(hoy);
  const [completados, setCompletados] = useState<string[]>([]);
  const [tiempoRestante, setTiempoRestante] = useState(getTiempoRestante());
  const [completado, setCompletado] = useState(false);

  useEffect(() => {
    const guardado = localStorage.getItem(`reto_${hoy}`);
    if (guardado === "completado") setCompletado(true);
  }, [hoy]);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTiempoRestante(getTiempoRestante());
    }, 1000);
    return () => clearInterval(intervalo);
  }, []);

  const toggleEjercicio = (id: string) => {
    if (completado) return;
    setCompletados(prev => {
      const nuevo = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      if (nuevo.length === ejercicios.length) {
        setCompletado(true);
        localStorage.setItem(`reto_${hoy}`, "completado");

        // Verificar logros de retos
        const uid = localStorage.getItem("usuario_id");
        if (uid) {
          const retosCompletados = Object.keys(localStorage).filter(k => k.startsWith("reto_")).length;
          if (retosCompletados >= 1) desbloquearLogro(uid, "primer_reto", "Retador", "Completaste tu primer reto diario", "🏆");
          if (retosCompletados >= 5) desbloquearLogro(uid, "cinco_retos", "Guerrero", "Completaste 5 retos diarios", "⚔️");
        }
      }
      return nuevo;
    });
  };

  const totalCalorias = ejercicios.reduce((acc, e) => acc + e.calorias, 0);
  const totalMinutos = ejercicios.reduce((acc, e) => acc + e.duracion, 0);

  return (
    <Card className={`border-border/50 mt-8 ${completado ? 'border-yellow-500/50 bg-yellow-500/5' : 'bg-card/50'}`}>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-foreground flex items-center gap-2">
            🏆 Reto del Día
            {completado && <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">¡Completado!</Badge>}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            Nuevo reto en <span className="font-mono font-bold text-foreground ml-1">{tiempoRestante}</span>
          </div>
        </div>
        <div className="flex gap-4 text-sm mt-1">
          <span className="flex items-center gap-1 text-red-400">
            <Flame className="w-4 h-4" /> {totalCalorias} kcal
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-4 h-4" /> {totalMinutos} min
          </span>
          <span className="flex items-center gap-1 text-primary">
            <Zap className="w-4 h-4" /> Alta intensidad
          </span>
        </div>
      </CardHeader>
      <CardContent>
        {completado && completados.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-4xl mb-2">🎉</p>
            <p className="text-yellow-400 font-bold text-lg">¡Reto completado hoy!</p>
            <p className="text-muted-foreground text-sm mt-1">Vuelve mañana para el siguiente reto</p>
          </div>
        ) : (
          <div className="space-y-3">
            {ejercicios.map((ejercicio) => {
              const hecho = completados.includes(ejercicio.id);
              return (
                <div
                  key={ejercicio.id}
                  onClick={() => toggleEjercicio(ejercicio.id)}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                    hecho
                      ? 'border-yellow-500/30 bg-yellow-500/10 opacity-70'
                      : 'border-border/50 bg-background/50 hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      hecho ? 'border-yellow-500 bg-yellow-500' : 'border-muted-foreground'
                    }`}>
                      {hecho && <span className="text-black text-xs font-bold">✓</span>}
                    </div>
                    <div>
                      <p className={`font-medium ${hecho ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {ejercicio.nombre}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {ejercicio.series} series × {ejercicio.repeticiones} reps • {ejercicio.calorias} kcal
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                    Alta intensidad
                  </Badge>
                </div>
              );
            })}

            {completados.length > 0 && completados.length < ejercicios.length && (
              <p className="text-center text-sm text-muted-foreground pt-2">
                {ejercicios.length - completados.length} ejercicio(s) restante(s)
              </p>
            )}

            {completados.length === ejercicios.length && (
              <div className="text-center py-4">
                <p className="text-yellow-400 font-bold text-lg">🎉 ¡Reto completado!</p>
                <p className="text-muted-foreground text-sm">+500 XP • {totalCalorias} kcal quemadas</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
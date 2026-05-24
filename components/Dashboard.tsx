"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/lib/context';
import { Navbar } from './Navbar';
import { ExerciseCard } from './ExerciseCard';
import { CaloriesIndicator } from './CaloriesIndicator';
import { RoutineTypeLabel } from './RoutineTypeLabel';
import { WorkoutProgress } from './WorkoutProgress';
import { RetoDiario } from './RetoDiario';
import {
  Sparkles,
  Zap,
  Clock,
  ChevronRight,
  Battery,
  Target,
  RefreshCw
} from 'lucide-react';

export function Dashboard() {
  const [ejerciciosCompletados, setEjerciciosCompletados] = useState<string[]>([]);
  const {
    usuario,
    rutina,
    estaCansado,
    generarNuevaRutina,
    ajustarPorCansancio,
    setVista
  } = useApp();

  useEffect(() => {
    if (!rutina && usuario) {
      generarNuevaRutina();
    }
  }, [rutina, usuario, generarNuevaRutina]);

useEffect(() => {
  if (
    rutina &&
    usuario &&
    ejerciciosCompletados.length === rutina.ejercicios.length &&
    ejerciciosCompletados.length > 0
  ) {
    // Guardar progreso
    fetch("/api/progreso", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario_id: usuario.id,
        rutina_tipo: rutina.tipo,
        calorias: rutina.totalCalorias,
        ejercicios_completados: ejerciciosCompletados.length,
        ejercicios_total: rutina.ejercicios.length
      })
    }).then(() => {
      // Verificar logros después de guardar el progreso
      fetch(`/api/progreso?usuario_id=${usuario.id}`)
        .then(r => r.json())
        .then(data => {
          if (!data.success) return;
          const historial = data.progreso;
          const totalRutinas = historial.length;
          const totalCalorias = historial.reduce((acc: number, p: any) => acc + p.calorias, 0);

          const desbloquear = (codigo: string, nombre: string, descripcion: string, emoji: string) => {
            fetch("/api/logros", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ usuario_id: usuario.id, codigo, nombre, descripcion, emoji })
            });
          };

          if (totalRutinas >= 1) desbloquear("primera_rutina", "Primera rutina", "Completaste tu primera rutina", "🎯");
          if (totalRutinas >= 5) desbloquear("cinco_rutinas", "En racha", "Completaste 5 rutinas", "🔥");
          if (totalRutinas >= 10) desbloquear("diez_rutinas", "Dedicado", "Completaste 10 rutinas", "💪");
          if (totalCalorias >= 500) desbloquear("calorias_500", "Quemador", "Quemaste 500 kcal en total", "🌡️");
          if (totalCalorias >= 1000) desbloquear("calorias_1000", "Incinerador", "Quemaste 1000 kcal en total", "⚡");
        });
    });
  }
}, [ejerciciosCompletados.length]);

  if (!usuario) return null;

  const frases: Record<string, string[]> = {
    bajar_peso: [
      "Cada gota de sudor es un paso más cerca de tu meta 🔥",
      "No pares cuando estés cansado, para cuando hayas terminado 💪",
      "Tu cuerpo puede hacerlo, convence a tu mente 🧠",
      "El dolor de hoy es la fuerza de mañana ⚡",
    ],
    fuerza: [
      "Los músculos se construyen fuera de tu zona de confort 💪",
      "Cada repetición te hace más fuerte que ayer 🏋️",
      "La fuerza no viene del cuerpo, viene de la voluntad 🔥",
      "Levanta más pesado, sé más fuerte 💥",
    ],
    resistencia: [
      "Un kilómetro más, un paso más hacia tu mejor versión 🏃",
      "La resistencia se construye un entrenamiento a la vez ⚡",
      "No es velocidad, es constancia lo que te lleva lejos 🎯",
      "Respira, sigue, no te rindas 💨",
    ],
  };

  const frasesObjetivo = frases[usuario.objetivo] || frases.resistencia;
  const frase = frasesObjetivo[new Date().getDay() % frasesObjetivo.length];

  const getObjetivoLabel = (objetivo: string) => {
    switch (objetivo) {
      case 'bajar_peso':
        return { label: 'Bajar de peso', emoji: '🔥' };
      case 'fuerza':
        return { label: 'Ganar fuerza', emoji: '💪' };
      case 'resistencia':
        return { label: 'Mejorar resistencia', emoji: '🏃' };
      default:
        return { label: objetivo, emoji: '🎯' };
    }
  };

  const objetivoInfo = getObjetivoLabel(usuario.objetivo);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                ¡Hola, {usuario.nombre}! 👋
              </h1>
              <p className="text-primary font-medium mt-1 italic">
                {frase}
              </p>
            </div>
            <Button
              onClick={generarNuevaRutina}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Generar nueva rutina
            </Button>
          </div>
        </section>

        {/* User Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Battery className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Energía</p>
                  <p className="text-lg font-bold text-foreground">{usuario.nivelEnergia}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <span className="text-lg">{objetivoInfo.emoji}</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Objetivo</p>
                  <p className="text-sm font-bold text-foreground">{objetivoInfo.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <Target className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Peso</p>
                  <p className="text-lg font-bold text-foreground">{usuario.peso} kg</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Duración</p>
                  <p className="text-lg font-bold text-foreground">{rutina?.duracionTotal || 0} min</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {rutina && (
          <>
            {/* Routine Type & Calories */}
            <section className="grid md:grid-cols-2 gap-6 mb-8">
              <RoutineTypeLabel
                tipo={rutina.tipo}
                intensidad={rutina.intensidadGeneral}
              />
              <CaloriesIndicator calorias={rutina.totalCalorias} />
            </section>

            {/* Fatigue Adjustment */}
            <section className="mb-8">
              <Card className={`border-border/50 transition-all duration-500 ${
                estaCansado
                  ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30'
                  : 'bg-card/50'
              }`}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        estaCansado ? 'bg-yellow-500/20' : 'bg-muted'
                      }`}>
                        <Zap className={`w-5 h-5 ${estaCansado ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {estaCansado ? '¡Rutina ajustada!' : '¿Te sientes cansado?'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {estaCansado
                            ? 'La intensidad se ha reducido para cuidar tu cuerpo'
                            : 'Podemos ajustar tu rutina a menor intensidad'}
                        </p>
                      </div>
                    </div>
                    {!estaCansado && (
                      <Button
                        variant="outline"
                        onClick={ajustarPorCansancio}
                        className="gap-2 border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Estoy cansado
                      </Button>
                    )}
                    {estaCansado && (
                      <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                        Intensidad reducida
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Exercise List */}
            <WorkoutProgress
              completados={ejerciciosCompletados.length}
              total={rutina.ejercicios.length}
            />

            {ejerciciosCompletados.length === rutina.ejercicios.length && ejerciciosCompletados.length > 0 && (
              <div className="mb-6 p-6 rounded-2xl border border-green-500/30 bg-green-500/10">
                <h2 className="text-2xl font-bold text-green-400 mb-2">
                  🎉 Rutina completada
                </h2>
                <p className="text-muted-foreground">
                  Has completado todos los ejercicios correctamente.
                </p>
                <div className="flex gap-6 mt-4 text-sm">
                  <span className="text-primary">
                    🔥 {rutina.ejercicios.reduce((total, ejercicio) => total + ejercicio.calorias, 0)} kcal
                  </span>
                  <span className="text-accent">
                    ⏱️ {rutina.ejercicios.reduce((total, ejercicio) => total + ejercicio.duracion, 0)} min
                  </span>
                  <span className="text-green-400">
                    🏆 +250 XP
                  </span>
                </div>
              </div>
            )}

            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">
                  Tu rutina de hoy
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setVista('detalle')}
                  className="gap-1 text-primary"
                >
                  Ver detalle completo
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid gap-4">
                {rutina.ejercicios.map((ejercicio, index) => (
                  <ExerciseCard
                    key={ejercicio.id}
                    ejercicio={ejercicio}
                    index={index}
                    onFinish={() => {
                      setEjerciciosCompletados(prev => {
                        if (prev.includes(ejercicio.id)) return prev;
                        return [...prev, ejercicio.id];
                      });
                    }}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {!rutina && (
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Genera tu primera rutina
              </h3>
              <p className="text-muted-foreground mb-6">
                Haz clic en el botón para crear una rutina personalizada
              </p>
              <Button
                onClick={generarNuevaRutina}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Generar rutina
              </Button>
            </CardContent>
          </Card>
        )}

        <RetoDiario />
      </main>
    </div>
  );
}
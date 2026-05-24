"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/context";
import { Navbar } from "./Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, Zap, Calendar } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line, CartesianGrid
} from "recharts";

interface Progreso {
  id: number;
  usuario_id: number;
  fecha: string;
  rutina_tipo: string;
  calorias: number;
  ejercicios_completados: number;
  ejercicios_total: number;
}

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b"];

export function ProgresosPage() {
  const { usuario } = useApp();
  const [progreso, setProgreso] = useState<Progreso[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  if (usuario) {
    fetch(`/api/progreso?usuario_id=${usuario.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setProgreso(data.progreso);
          const calcularRachaDesdeData = (data: Progreso[]) => {
  if (data.length === 0) return 0;
  const fechas = data.map((p) => new Date(p.fecha).toLocaleDateString());
  const unicas = [...new Set(fechas)];
  let racha = 1;
  for (let i = 0; i < unicas.length - 1; i++) {
    const a = new Date(unicas[i]);
    const b = new Date(unicas[i + 1]);
    const diff = (a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) racha++;
    else break;
  }
  return racha;
};
          
          // Verificar logros de racha
          const racha = calcularRachaDesdeData(data.progreso);
          const desbloquear = (codigo: string, nombre: string, descripcion: string, emoji: string) => {
            fetch("/api/logros", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ usuario_id: usuario.id, codigo, nombre, descripcion, emoji })
            });
          };
          if (racha >= 3) desbloquear("racha_3", "3 días seguidos", "Entrenaste 3 días seguidos", "📅");
          if (racha >= 7) desbloquear("racha_7", "Semana de fuego", "Entrenaste 7 días seguidos", "🗓️");
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }
}, [usuario]);

  const totalCalorias = progreso.reduce((acc, p) => acc + p.calorias, 0);
  const totalRutinas = progreso.length;
  const totalEjercicios = progreso.reduce((acc, p) => acc + p.ejercicios_completados, 0);

  const calcularRacha = () => {
    if (progreso.length === 0) return 0;
    const fechas = progreso.map((p) => new Date(p.fecha).toLocaleDateString());
    const unicas = [...new Set(fechas)];
    let racha = 1;
    for (let i = 0; i < unicas.length - 1; i++) {
      const a = new Date(unicas[i]);
      const b = new Date(unicas[i + 1]);
      const diff = (a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) racha++;
      else break;
    }
    return racha;
  };

  const racha = calcularRacha();

  // Datos para gráfico de barras (calorías por día)
  const caloriasporDia = () => {
    const mapa: Record<string, number> = {};
    progreso.forEach((p) => {
      const fecha = new Date(p.fecha).toLocaleDateString("es-CO", { day: "numeric", month: "short" });
      mapa[fecha] = (mapa[fecha] || 0) + p.calorias;
    });
    return Object.entries(mapa).map(([fecha, calorias]) => ({ fecha, calorias })).slice(-7);
  };

  // Datos para gráfico circular (tipos de rutina)
  const tiposRutina = () => {
    const mapa: Record<string, number> = {};
    progreso.forEach((p) => {
      mapa[p.rutina_tipo] = (mapa[p.rutina_tipo] || 0) + 1;
    });
    return Object.entries(mapa).map(([name, value]) => ({ name, value }));
  };

  // Datos para gráfico de línea (ejercicios completados por sesión)
  const ejerciciosPorSesion = progreso
    .slice(-10)
    .reverse()
    .map((p, i) => ({
      sesion: `#${i + 1}`,
      completados: p.ejercicios_completados,
      total: p.ejercicios_total,
    }));

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "cardio": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "fuerza": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "flexibilidad": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-primary/20 text-primary border-primary/30";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">
          📊 Progresos y Estadísticas
        </h1>

        {/* Estadísticas generales */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Calorías totales</p>
                  <p className="text-lg font-bold text-foreground">{totalCalorias} kcal</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Rutinas completadas</p>
                  <p className="text-lg font-bold text-foreground">{totalRutinas}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ejercicios hechos</p>
                  <p className="text-lg font-bold text-foreground">{totalEjercicios}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Racha de días</p>
                  <p className="text-lg font-bold text-foreground">{racha} 🔥</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Gráficos */}
        {progreso.length > 0 && (
          <>
            {/* Barras y Circular */}
            <section className="grid md:grid-cols-2 gap-6 mb-6">
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-foreground text-base">🔥 Calorías por día</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={caloriasporDia()}>
                      <XAxis dataKey="fecha" tick={{ fill: "#6b7280", fontSize: 11 }} />
                      <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }}
                        labelStyle={{ color: "#f9fafb" }}
                        itemStyle={{ color: "#22c55e" }}
                      />
                      <Bar dataKey="calorias" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-foreground text-base">💪 Tipos de rutina</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={tiposRutina()}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {tiposRutina().map((_, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend
                        formatter={(value) => <span style={{ color: "#9ca3af", fontSize: 12 }}>{value}</span>}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }}
                        itemStyle={{ color: "#f9fafb" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </section>

            {/* Línea */}
            <Card className="border-border/50 bg-card/50 mb-6">
              <CardHeader>
                <CardTitle className="text-foreground text-base">📈 Ejercicios completados por sesión</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={ejerciciosPorSesion}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="sesion" tick={{ fill: "#6b7280", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }}
                      labelStyle={{ color: "#f9fafb" }}
                      itemStyle={{ color: "#3b82f6" }}
                    />
                    <Line type="monotone" dataKey="completados" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6" }} name="Completados" />
                    <Line type="monotone" dataKey="total" stroke="#6b7280" strokeWidth={1} strokeDasharray="4 4" dot={false} name="Total" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}

        {/* Historial */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-foreground">Historial de rutinas</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground text-center py-8">Cargando...</p>
            ) : progreso.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Aún no tienes rutinas completadas. ¡Completa tu primera rutina!
              </p>
            ) : (
              <div className="space-y-3">
                {progreso.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50"
                  >
                    <div className="flex items-center gap-3">
                      <Badge className={getTipoColor(p.rutina_tipo)}>
                        {p.rutina_tipo}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {p.ejercicios_completados}/{p.ejercicios_total} ejercicios
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(p.fecha).toLocaleDateString("es-CO", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">{p.calorias} kcal</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
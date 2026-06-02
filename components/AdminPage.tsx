"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/context";
import { Navbar } from "./Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Trophy, Flame, Utensils, Trash2, Shield } from "lucide-react";

interface UsuarioAdmin {
  id: number;
  nombre: string;
  correo: string;
  peso: number;
  nivel_energia: number;
  objetivo: string;
  rol: string;
  fecha_registro: string;
}

interface Stats {
  total_usuarios: number;
  total_rutinas: number;
  total_calorias: number;
  total_comidas: number;
}

interface ProgresoUsuario {
  nombre: string;
  correo: string;
  rutinas_completadas: number;
  calorias_totales: number;
}

export function AdminPage() {
  const { usuario } = useApp();
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [progreso, setProgreso] = useState<ProgresoUsuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [eliminando, setEliminando] = useState<number | null>(null);

  const cargarDatos = () => {
    fetch("/api/admin")
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setUsuarios(data.usuarios);
          setStats(data.stats);
          setProgreso(data.progreso);
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const eliminarUsuario = async (id: number, nombre: string) => {
    if (!confirm(`¿Seguro que quieres eliminar a ${nombre}? Esta acción no se puede deshacer.`)) return;
    setEliminando(id);
    await fetch(`/api/admin?id=${id}`, { method: "DELETE" });
    cargarDatos();
    setEliminando(null);
  };

  const getObjetivoLabel = (objetivo: string) => {
    switch (objetivo) {
      case "bajar_peso": return "🔥 Bajar peso";
      case "fuerza": return "💪 Fuerza";
      case "resistencia": return "🏃 Resistencia";
      default: return objetivo;
    }
  };

  if (!usuario) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <p className="text-muted-foreground text-center">Cargando panel de administrador...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Panel de Administrador</h1>
            <p className="text-muted-foreground">Gestión y estadísticas globales de FitRoutine Pro</p>
          </div>
        </div>

        {/* Stats generales */}
        {stats && (
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Usuarios</p>
                    <p className="text-2xl font-bold text-foreground">{stats.total_usuarios}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Rutinas completadas</p>
                    <p className="text-2xl font-bold text-foreground">{stats.total_rutinas}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Calorías quemadas</p>
                    <p className="text-2xl font-bold text-foreground">{stats.total_calorias}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                    <Utensils className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Comidas registradas</p>
                    <p className="text-2xl font-bold text-foreground">{stats.total_comidas}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Ranking de usuarios */}
        <Card className="border-border/50 bg-card/50 mb-8">
          <CardHeader>
            <CardTitle className="text-foreground">🏆 Ranking de usuarios más activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {progreso.map((p, i) => (
                <div key={p.correo} className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-background/50">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                    </span>
                    <div>
                      <p className="font-medium text-foreground">{p.nombre}</p>
                      <p className="text-xs text-muted-foreground">{p.correo}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">{p.rutinas_completadas} rutinas</p>
                    <p className="text-xs text-muted-foreground">{p.calorias_totales} kcal</p>
                  </div>
                </div>
              ))}
              {progreso.length === 0 && (
                <p className="text-muted-foreground text-center py-4">No hay datos aún</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Lista de usuarios */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-foreground">👥 Todos los usuarios ({usuarios.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {usuarios.map(u => (
                <div key={u.id} className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-bold text-sm">
                        {u.nombre.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{u.nombre}</p>
                        {u.rol === "admin" && (
                          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                            Admin
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{u.correo}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {getObjetivoLabel(u.objetivo)} · {u.peso} kg · Energía: {u.nivel_energia}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        {new Date(u.fecha_registro).toLocaleDateString("es-CO", {
                          day: "numeric", month: "short", year: "numeric"
                        })}
                      </p>
                    </div>
                    {u.rol !== "admin" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => eliminarUsuario(u.id, u.nombre)}
                        disabled={eliminando === u.id}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
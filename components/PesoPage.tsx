"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/context";
import { Navbar } from "./Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

interface RegistroPeso {
  id: number;
  usuario_id: number;
  peso: number;
  fecha: string;
}

export function PesoPage() {
  const { usuario } = useApp();
  const [historial, setHistorial] = useState<RegistroPeso[]>([]);
  const [nuevoPeso, setNuevoPeso] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const cargarHistorial = () => {
    if (usuario) {
      fetch(`/api/peso?usuario_id=${usuario.id}`)
        .then(r => r.json())
        .then(data => {
          if (data.success) setHistorial(data.historial);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  };

  useEffect(() => {
    cargarHistorial();
  }, [usuario]);

  const guardarPeso = async () => {
    if (!usuario || !nuevoPeso) return;
    setGuardando(true);

    await fetch("/api/peso", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario_id: usuario.id, peso: Number(nuevoPeso) })
    });

    setNuevoPeso("");
    cargarHistorial();
    setGuardando(false);
  };

  const datosGrafico = historial.map(r => ({
    fecha: new Date(r.fecha).toLocaleDateString("es-CO", { day: "numeric", month: "short" }),
    peso: r.peso
  }));

  const pesoActual = historial.length > 0 ? historial[historial.length - 1].peso : usuario?.peso || 0;
  const pesoInicial = historial.length > 0 ? historial[0].peso : usuario?.peso || 0;
  const diferencia = pesoActual - pesoInicial;
  const pesoMin = historial.length > 0 ? Math.min(...historial.map(r => r.peso)) : 0;
  const pesoMax = historial.length > 0 ? Math.max(...historial.map(r => r.peso)) : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground mb-2">📅 Historial de Peso</h1>
        <p className="text-muted-foreground mb-8">Registra tu peso y ve tu evolución</p>

        {/* Registrar nuevo peso */}
        <Card className="border-border/50 bg-card/50 mb-6">
          <CardHeader>
            <CardTitle className="text-foreground text-base">Registrar peso de hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Ej: 70.5"
                  min={30}
                  max={300}
                  value={nuevoPeso}
                  onChange={e => setNuevoPeso(e.target.value)}
                  className="bg-input border-border"
                />
              </div>
              <Button
                onClick={guardarPeso}
                disabled={!nuevoPeso || guardando}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {guardando ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas */}
        {historial.length > 0 && (
          <>
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Peso actual</p>
                  <p className="text-2xl font-bold text-foreground">{pesoActual} kg</p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Cambio total</p>
                  <div className="flex items-center justify-center gap-1">
                    {diferencia < 0 ? (
                      <TrendingDown className="w-4 h-4 text-green-400" />
                    ) : diferencia > 0 ? (
                      <TrendingUp className="w-4 h-4 text-red-400" />
                    ) : (
                      <Minus className="w-4 h-4 text-muted-foreground" />
                    )}
                    <p className={`text-2xl font-bold ${
                      diferencia < 0 ? 'text-green-400' : diferencia > 0 ? 'text-red-400' : 'text-foreground'
                    }`}>
                      {diferencia > 0 ? '+' : ''}{diferencia.toFixed(1)} kg
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Mínimo</p>
                  <p className="text-2xl font-bold text-green-400">{pesoMin} kg</p>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Máximo</p>
                  <p className="text-2xl font-bold text-red-400">{pesoMax} kg</p>
                </CardContent>
              </Card>
            </section>

            {/* Gráfico */}
            <Card className="border-border/50 bg-card/50 mb-6">
              <CardHeader>
                <CardTitle className="text-foreground text-base">📈 Evolución del peso</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={datosGrafico}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="fecha" tick={{ fill: "#6b7280", fontSize: 11 }} />
                    <YAxis
                      tick={{ fill: "#6b7280", fontSize: 11 }}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }}
                      labelStyle={{ color: "#f9fafb" }}
                      itemStyle={{ color: "#22c55e" }}
                      formatter={(value: any) => [`${value} kg`, "Peso"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="peso"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={{ fill: "#22c55e", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Historial */}
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="text-foreground text-base">Registros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[...historial].reverse().map((r, i) => {
                    const anterior = historial[historial.length - 2 - i];
                    const diff = anterior ? r.peso - anterior.peso : 0;
                    return (
                      <div key={r.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background/50">
                        <p className="text-sm text-muted-foreground">
                          {new Date(r.fecha).toLocaleDateString("es-CO", {
                            day: "numeric", month: "long", year: "numeric"
                          })}
                        </p>
                        <div className="flex items-center gap-3">
                          {diff !== 0 && (
                            <span className={`text-xs ${diff < 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {diff > 0 ? '+' : ''}{diff.toFixed(1)} kg
                            </span>
                          )}
                          <p className="font-bold text-foreground">{r.peso} kg</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {historial.length === 0 && !isLoading && (
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-12 text-center">
              <p className="text-4xl mb-4">⚖️</p>
              <p className="text-foreground font-medium">Aún no tienes registros</p>
              <p className="text-muted-foreground text-sm mt-1">Registra tu peso de hoy para empezar a ver tu evolución</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
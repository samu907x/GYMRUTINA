"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/context";
import { Navbar } from "./Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Flame, Trash2, Plus } from "lucide-react";

interface Comida {
  id: number;
  usuario_id: number;
  tipo: string;
  nombre: string;
  calorias: number;
  fecha: string;
  hora: string;
}

const TIPOS = [
  { value: "desayuno", label: "🌅 Desayuno" },
  { value: "almuerzo", label: "☀️ Almuerzo" },
  { value: "cena", label: "🌙 Cena" },
  { value: "merienda", label: "🍎 Merienda" },
];

export function ComidasPage() {
  const { usuario } = useApp();
  const [comidas, setComidas] = useState<Comida[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);

  const [nuevaComida, setNuevaComida] = useState({
    tipo: "desayuno",
    nombre: "",
    calorias: "",
  });

  const cargarComidas = () => {
    if (usuario) {
      fetch(`/api/comidas?usuario_id=${usuario.id}&fecha=${fecha}`)
        .then(r => r.json())
        .then(data => {
          if (data.success) setComidas(data.comidas);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  };

  useEffect(() => {
    cargarComidas();
  }, [usuario, fecha]);

  const guardarComida = async () => {
    if (!usuario || !nuevaComida.nombre || !nuevaComida.calorias) return;
    setGuardando(true);

    const hora = new Date().toTimeString().slice(0, 5);

    await fetch("/api/comidas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario_id: usuario.id,
        tipo: nuevaComida.tipo,
        nombre: nuevaComida.nombre,
        calorias: Number(nuevaComida.calorias),
        fecha,
        hora
      })
    });

    setNuevaComida({ tipo: "desayuno", nombre: "", calorias: "" });
    cargarComidas();
    setGuardando(false);
  };

  const eliminarComida = async (id: number) => {
    await fetch(`/api/comidas?id=${id}`, { method: "DELETE" });
    cargarComidas();
  };

  const totalCalorias = comidas.reduce((acc, c) => acc + c.calorias, 0);

  const comidasPorTipo = (tipo: string) => comidas.filter(c => c.tipo === tipo);

  const caloriasObjetivo = 2000;
  const porcentaje = Math.min((totalCalorias / caloriasObjetivo) * 100, 100);
  const colorBarra = porcentaje < 60 ? "bg-green-500" : porcentaje < 90 ? "bg-yellow-500" : "bg-red-500";

  if (!usuario) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground mb-2">🍽️ Diario de Comidas</h1>
        <p className="text-muted-foreground mb-6">Registra lo que comes cada día</p>

        {/* Selector de fecha */}
        <div className="flex items-center gap-3 mb-6">
          <Input
            type="date"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            className="bg-input border-border w-auto"
          />
        </div>

        {/* Resumen de calorías */}
        <Card className="border-border/50 bg-card/50 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-400" />
                <span className="font-semibold text-foreground">Calorías del día</span>
              </div>
              <span className="text-2xl font-bold text-foreground">
                {totalCalorias} <span className="text-sm text-muted-foreground">/ {caloriasObjetivo} kcal</span>
              </span>
            </div>
            <div className="h-3 rounded-full bg-secondary overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${colorBarra}`}
                style={{ width: `${porcentaje}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{Math.round(porcentaje)}% del objetivo diario</p>
          </CardContent>
        </Card>

        {/* Agregar comida */}
        <Card className="border-border/50 bg-card/50 mb-6">
          <CardHeader>
            <CardTitle className="text-foreground text-base flex items-center gap-2">
              <Plus className="w-4 h-4" /> Agregar comida
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel>Tipo</FieldLabel>
                <Select value={nuevaComida.tipo} onValueChange={v => setNuevaComida(prev => ({ ...prev, tipo: v }))}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>Calorías (kcal)</FieldLabel>
                <Input
                  type="number"
                  placeholder="Ej: 350"
                  min={0}
                  value={nuevaComida.calorias}
                  onChange={e => setNuevaComida(prev => ({ ...prev, calorias: e.target.value }))}
                  className="bg-input border-border"
                />
              </Field>
            </div>
            <Field>
              <FieldLabel>¿Qué comiste?</FieldLabel>
              <Input
                type="text"
                placeholder="Ej: Arroz con pollo, ensalada..."
                value={nuevaComida.nombre}
                onChange={e => setNuevaComida(prev => ({ ...prev, nombre: e.target.value }))}
                className="bg-input border-border"
              />
            </Field>
            <Button
              onClick={guardarComida}
              disabled={!nuevaComida.nombre || !nuevaComida.calorias || guardando}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {guardando ? "Guardando..." : "Agregar"}
            </Button>
          </CardContent>
        </Card>

        {/* Comidas por tipo */}
        {TIPOS.map(tipo => {
          const lista = comidasPorTipo(tipo.value);
          if (lista.length === 0) return null;
          const totalTipo = lista.reduce((acc, c) => acc + c.calorias, 0);

          return (
            <Card key={tipo.value} className="border-border/50 bg-card/50 mb-4">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground text-base">{tipo.label}</CardTitle>
                  <span className="text-sm text-muted-foreground">{totalTipo} kcal</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lista.map(comida => (
                    <div key={comida.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-background/50">
                      <div>
                        <p className="text-sm font-medium text-foreground">{comida.nombre}</p>
                        {comida.hora && (
                          <p className="text-xs text-muted-foreground">{comida.hora}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-primary">{comida.calorias} kcal</span>
                        <button
                          onClick={() => eliminarComida(comida.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {comidas.length === 0 && !isLoading && (
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-12 text-center">
              <p className="text-4xl mb-4">🍽️</p>
              <p className="text-foreground font-medium">Sin registros para este día</p>
              <p className="text-muted-foreground text-sm mt-1">Agrega lo que comiste hoy</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
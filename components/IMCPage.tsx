"use client";

import { useState } from "react";
import { useApp } from "@/lib/context";
import { Navbar } from "./Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FieldLabel, Field } from "@/components/ui/field";

interface ResultadoIMC {
  valor: number;
  categoria: string;
  color: string;
  emoji: string;
  descripcion: string;
  recomendacion: string;
}

export function IMCPage() {
  const { usuario } = useApp();
  const [altura, setAltura] = useState("");
  const [resultado, setResultado] = useState<ResultadoIMC | null>(null);

  const calcularIMC = () => {
    if (!usuario || !altura) return;

    const alturaM = Number(altura) / 100;
    const imc = usuario.peso / (alturaM * alturaM);
    const imcRedondeado = Math.round(imc * 10) / 10;

    let categoria = "";
    let color = "";
    let emoji = "";
    let descripcion = "";
    let recomendacion = "";

    if (imc < 18.5) {
      categoria = "Bajo peso";
      color = "text-blue-400";
      emoji = "🔵";
      descripcion = "Tu peso está por debajo del rango saludable.";
      recomendacion = "Te recomendamos rutinas de fuerza para ganar masa muscular y aumentar tu peso de forma saludable.";
    } else if (imc < 25) {
      categoria = "Peso normal";
      color = "text-green-400";
      emoji = "🟢";
      descripcion = "¡Excelente! Tu peso está dentro del rango saludable.";
      recomendacion = "Mantén tu rutina actual con un balance de cardio y fuerza para mantenerte en forma.";
    } else if (imc < 30) {
      categoria = "Sobrepeso";
      color = "text-yellow-400";
      emoji = "🟡";
      descripcion = "Tu peso está ligeramente por encima del rango saludable.";
      recomendacion = "Te recomendamos rutinas de cardio y una dieta balanceada para alcanzar tu peso ideal.";
    } else {
      categoria = "Obesidad";
      color = "text-red-400";
      emoji = "🔴";
      descripcion = "Tu peso está significativamente por encima del rango saludable.";
      recomendacion = "Te recomendamos consultar con un médico y comenzar con rutinas de baja intensidad progresivamente.";
    }

    setResultado({ valor: imcRedondeado, categoria, color, emoji, descripcion, recomendacion });
  };

  const getRangoAncho = (imc: number) => {
    const min = 15;
    const max = 40;
    const porcentaje = ((imc - min) / (max - min)) * 100;
    return Math.min(Math.max(porcentaje, 0), 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          ⚖️ Calculadora de IMC
        </h1>
        <p className="text-muted-foreground mb-8">
          Índice de Masa Corporal — calcula si tu peso es saludable
        </p>

        <Card className="border-border/50 bg-card/50 mb-6">
          <CardHeader>
            <CardTitle className="text-foreground text-base">Tus datos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-background/50 border border-border/50">
              <span className="text-muted-foreground text-sm">Peso actual:</span>
              <span className="font-bold text-foreground">{usuario?.peso} kg</span>
            </div>

            <Field>
              <FieldLabel htmlFor="altura">Altura (cm)</FieldLabel>
              <Input
                id="altura"
                type="number"
                placeholder="Ej: 175"
                min={100}
                max={250}
                value={altura}
                onChange={(e) => setAltura(e.target.value)}
                className="bg-input border-border"
              />
            </Field>

            <Button
              onClick={calcularIMC}
              disabled={!altura}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              Calcular IMC
            </Button>
          </CardContent>
        </Card>

        {resultado && (
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="text-foreground text-base">Resultado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Valor IMC */}
              <div className="text-center">
                <p className="text-6xl font-bold text-foreground mb-2">{resultado.valor}</p>
                <p className={`text-xl font-semibold ${resultado.color}`}>
                  {resultado.emoji} {resultado.categoria}
                </p>
              </div>

              {/* Barra de rango */}
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Bajo peso</span>
                  <span>Normal</span>
                  <span>Sobrepeso</span>
                  <span>Obesidad</span>
                </div>
                <div className="relative h-4 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500">
                  <div
                    className="absolute top-0 w-4 h-4 bg-white rounded-full border-2 border-gray-800 shadow-lg transform -translate-x-1/2"
                    style={{ left: `${getRangoAncho(resultado.valor)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>15</span>
                  <span>18.5</span>
                  <span>25</span>
                  <span>30</span>
                  <span>40</span>
                </div>
              </div>

              {/* Descripción */}
              <div className="p-4 rounded-xl border border-border/50 bg-background/50 space-y-2">
                <p className="text-sm text-foreground">{resultado.descripcion}</p>
                <p className="text-sm text-muted-foreground">💡 {resultado.recomendacion}</p>
              </div>

              {/* Tabla de rangos */}
              <div>
                <p className="text-sm font-medium text-foreground mb-3">Rangos de referencia:</p>
                <div className="space-y-2">
                  {[
                    { rango: "Menos de 18.5", cat: "Bajo peso", color: "text-blue-400" },
                    { rango: "18.5 — 24.9", cat: "Peso normal", color: "text-green-400" },
                    { rango: "25 — 29.9", cat: "Sobrepeso", color: "text-yellow-400" },
                    { rango: "30 o más", cat: "Obesidad", color: "text-red-400" },
                  ].map((item) => (
                    <div key={item.cat} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.rango}</span>
                      <span className={`font-medium ${item.color}`}>{item.cat}</span>
                    </div>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

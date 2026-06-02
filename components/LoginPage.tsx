"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  FieldGroup,
  Field,
  FieldLabel,
} from "@/components/ui/field";

import { useApp } from "@/lib/context";

import {
  Dumbbell,
  Eye,
  EyeOff,
  Zap,
} from "lucide-react";

export function LoginPage() {

  const { setVista, setUsuario, error, setError } = useApp();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setError("");

    if (!correo || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    setIsLoading(true);

    try {

      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo, password }),
      });

      const data = await response.json();

      if (data.success) {
  console.log("DATA:", data.usuario);
  
  setUsuario({
  id: data.usuario.id.toString(),
  nombre: data.usuario.nombre,
  peso: Number(data.usuario.peso),
  nivelEnergia: Number(data.usuario.nivel_energia),
  objetivo: data.usuario.objetivo,
  rol: data.usuario.rol,
});
localStorage.setItem("usuario", JSON.stringify({
  id: data.usuario.id.toString(),
  nombre: data.usuario.nombre,
  peso: Number(data.usuario.peso),
  nivelEnergia: Number(data.usuario.nivel_energia),
  objetivo: data.usuario.objetivo,
  rol: data.usuario.rol,
}));
localStorage.setItem("usuario_id", data.usuario.id.toString());

  setVista("dashboard");
}

       else {
        setError("Credenciales incorrectas");
      }

    } catch (error) {
  console.log("CATCH ERROR:", error);
  setError("Error del servidor: " + String(error));
}
    setIsLoading(false);
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-background p-4">

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative z-10 border-border/50 bg-card/80 backdrop-blur-sm">

        <CardHeader className="text-center space-y-4">

          <div className="mx-auto w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
            <Dumbbell className="w-8 h-8 text-primary" />
          </div>

          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              FitRoutine Pro
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Inicia sesión para acceder a tus rutinas personalizadas
            </CardDescription>
          </div>

        </CardHeader>

        <CardContent>

          <form onSubmit={handleSubmit} className="space-y-6">

            <FieldGroup>

              {/* CORREO */}
              <Field>
                <FieldLabel htmlFor="correo">Correo</FieldLabel>
                <Input
                  id="correo"
                  type="email"
                  placeholder="tu@email.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="bg-input border-border"
                />
              </Field>

              {/* PASSWORD */}
              <Field>
                <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-input border-border pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </Field>

            </FieldGroup>

            {/* ERROR */}
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
                <Zap className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* BOTÓN LOGIN */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Iniciando sesión...
                </span>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>

            {/* DIVIDER */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  ¿Nuevo aquí?
                </span>
              </div>
            </div>

            {/* BOTÓN REGISTRO */}
            <Button
              type="button"
              variant="outline"
              className="w-full border-border hover:bg-secondary"
              onClick={() => {
                setError("");
                setVista("registro");
              }}
            >
              Crear cuenta nueva
            </Button>

          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Simulador de Rutinas Inteligentes de Gimnasio
          </p>

        </CardContent>

      </Card>

    </div>

  );

}
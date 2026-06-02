"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useApp } from '@/lib/context';
import { Objetivo } from '@/lib/types';
import { Dumbbell, ArrowLeft, Zap, Target, Scale, Battery } from 'lucide-react';

export function RegisterPage() {
  const { setVista, error, setError, setUsuario } = useApp();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [peso, setPeso] = useState(70);
  const [nivelEnergia, setNivelEnergia] = useState([50]);
  const [objetivo, setObjetivo] = useState<Objetivo>('resistencia');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nombre || !correo || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          correo,
          password,
          peso,
          nivel_energia: nivelEnergia[0],
          objetivo
        })
      });

      const data = await response.json();

      if (data.success) {
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
        setVista('dashboard');
      } else {
        setError(data.error || 'Error al registrar');
      }

    } catch (error) {
  console.log("ERROR FETCH:", error);
  setError('Error del servidor');
}

    setIsLoading(false);
  };

  const getEnergiaColor = (nivel: number) => {
    if (nivel < 30) return 'text-destructive';
    if (nivel < 60) return 'text-accent';
    return 'text-primary';
  };

  const getEnergiaLabel = (nivel: number) => {
    if (nivel < 30) return 'Bajo';
    if (nivel < 60) return 'Moderado';
    return 'Alto';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 py-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-lg relative z-10 border-border/50 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <button
            onClick={() => {
              setError('');
              setVista('login');
            }}
            className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="mx-auto w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center">
            <Dumbbell className="w-8 h-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Crear tu cuenta
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Configura tu perfil para rutinas personalizadas
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <FieldGroup>

              <Field>
                <FieldLabel htmlFor="nombre">Nombre de usuario</FieldLabel>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Tu nombre de usuario"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="bg-input border-border"
                />
              </Field>

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

              <Field>
                <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 4 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input border-border"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="peso" className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-muted-foreground" />
                  Peso (kg)
                </FieldLabel>
                <Input
                  id="peso"
                  type="number"
                  min={30}
                  max={200}
                  value={peso}
                  onChange={(e) => setPeso(Number(e.target.value))}
                  className="bg-input border-border"
                />
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel className="flex items-center gap-2">
                    <Battery className="w-4 h-4 text-muted-foreground" />
                    Nivel de energía
                  </FieldLabel>
                  <span className={`text-sm font-semibold ${getEnergiaColor(nivelEnergia[0])}`}>
                    {getEnergiaLabel(nivelEnergia[0])} ({nivelEnergia[0]}%)
                  </span>
                </div>
                <div className="pt-2">
                  <Slider
                    value={nivelEnergia}
                    onValueChange={setNivelEnergia}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted-foreground">Cansado</span>
                    <span className="text-xs text-muted-foreground">Energético</span>
                  </div>
                </div>
              </Field>

              <Field>
                <FieldLabel className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  Objetivo físico
                </FieldLabel>
                <Select value={objetivo} onValueChange={(v) => setObjetivo(v as Objetivo)}>
                  <SelectTrigger className="bg-input border-border">
                    <SelectValue placeholder="Selecciona tu objetivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bajar_peso">
                      <span className="flex items-center gap-2">
                        🔥 Bajar de peso
                      </span>
                    </SelectItem>
                    <SelectItem value="fuerza">
                      <span className="flex items-center gap-2">
                        💪 Ganar fuerza
                      </span>
                    </SelectItem>
                    <SelectItem value="resistencia">
                      <span className="flex items-center gap-2">
                        🏃 Mejorar resistencia
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>

            </FieldGroup>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
                <Zap className="w-4 h-4" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Creando cuenta...
                </span>
              ) : (
                'Comenzar mi entrenamiento'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
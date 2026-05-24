"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useApp } from '@/lib/context';
import { Objetivo } from '@/lib/types';
import { Navbar } from './Navbar';
import { 
  User, 
  Scale, 
  Battery, 
  Target, 
  Save, 
  Check,
  ArrowLeft
} from 'lucide-react';

export function ProfilePage() {
  const { usuario, actualizarPerfil, setVista } = useApp();
  const [peso, setPeso] = useState(usuario?.peso || 70);
  const [nivelEnergia, setNivelEnergia] = useState([usuario?.nivelEnergia || 50]);
  const [objetivo, setObjetivo] = useState<Objetivo>(usuario?.objetivo || 'resistencia');
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (usuario) {
      setPeso(usuario.peso);
      setNivelEnergia([usuario.nivelEnergia]);
      setObjetivo(usuario.objetivo);
    }
  }, [usuario]);

  if (!usuario) return null;

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    actualizarPerfil({
      peso,
      nivelEnergia: nivelEnergia[0],
      objetivo
    });
    
    setIsLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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

  const getInitials = (nombre: string) => {
    return nombre.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <section className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setVista('dashboard')}
            className="gap-2 mb-4 -ml-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al dashboard
          </Button>

          <h1 className="text-3xl font-bold text-foreground">
            Mi Perfil
          </h1>
          <p className="text-muted-foreground mt-1">
            Actualiza tu información para obtener rutinas más personalizadas
          </p>
        </section>

        {/* Profile Card */}
        <Card className="border-border/50 bg-card/50 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-4 border-primary/30">
                <AvatarFallback className="bg-primary/20 text-primary font-bold text-2xl">
                  {getInitials(usuario.nombre)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{usuario.nombre}</h2>
                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                  <User className="w-4 h-4" />
                  Usuario activo
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Form */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Configuración de entrenamiento
            </CardTitle>
            <CardDescription>
              Ajusta estos valores para que las rutinas se adapten mejor a ti
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="peso" className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-muted-foreground" />
                  Peso actual (kg)
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
                <p className="text-xs text-muted-foreground mt-1">
                  Tu peso influye en el cálculo de calorías quemadas
                </p>
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel className="flex items-center gap-2">
                    <Battery className="w-4 h-4 text-muted-foreground" />
                    Nivel de energía actual
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
                <p className="text-xs text-muted-foreground mt-2">
                  Define la intensidad de tus rutinas automáticamente
                </p>
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
                <p className="text-xs text-muted-foreground mt-1">
                  El sistema seleccionará ejercicios según tu objetivo
                </p>
              </Field>
            </FieldGroup>

            <div className="pt-4 border-t border-border">
              <Button 
                onClick={handleSave}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2"
                disabled={isLoading || saved}
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Guardando...
                  </>
                ) : saved ? (
                  <>
                    <Check className="w-4 h-4" />
                    ¡Guardado!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Actualizar perfil
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <Card className="border-border/50 bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                  <Battery className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Energía adaptativa</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    El sistema ajusta la dificultad de tus rutinas según tu nivel de energía
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-gradient-to-br from-accent/10 to-accent/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Rutinas inteligentes</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Los ejercicios se seleccionan automáticamente según tu objetivo
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

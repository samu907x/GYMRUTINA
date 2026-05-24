"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useApp } from '@/lib/context';
import { Navbar } from './Navbar';
import { RoutineTypeLabel } from './RoutineTypeLabel';
import { 
  ArrowLeft, 
  Clock, 
  Flame, 
  Zap,
  Calendar,
  Download,
  Share2
} from 'lucide-react';

export function RutinaDetalle() {
  const { rutina, setVista, estaCansado } = useApp();

  if (!rutina) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No hay rutina generada</p>
              <Button
                onClick={() => setVista('dashboard')}
                className="mt-4"
              >
                Ir al dashboard
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const getIntensidadBadge = (intensidad: string) => {
    switch (intensidad) {
      case 'alta':
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Alta</Badge>;
      case 'media':
        return <Badge className="bg-accent/20 text-accent border-accent/30">Media</Badge>;
      case 'baja':
        return <Badge className="bg-primary/20 text-primary border-primary/30">Baja</Badge>;
      default:
        return <Badge variant="outline">{intensidad}</Badge>;
    }
  };

  const getTipoEmoji = (tipo: string) => {
    switch (tipo) {
      case 'cardio': return '🏃';
      case 'fuerza': return '💪';
      case 'flexibilidad': return '🧘';
      default: return '🏋️';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
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

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Detalle de Rutina
              </h1>
              <p className="text-muted-foreground mt-1 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {rutina.fechaCreacion.toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                Compartir
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Exportar
              </Button>
            </div>
          </div>
        </section>

        {/* Routine Type */}
        <section className="mb-8">
          <RoutineTypeLabel tipo={rutina.tipo} intensidad={rutina.intensidadGeneral} />
        </section>

        {/* Stats Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{rutina.duracionTotal}</p>
              <p className="text-xs text-muted-foreground">minutos</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4 text-center">
              <Flame className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{rutina.totalCalorias}</p>
              <p className="text-xs text-muted-foreground">calorías</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4 text-center">
              <Zap className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground capitalize">{rutina.intensidadGeneral}</p>
              <p className="text-xs text-muted-foreground">intensidad</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4 text-center">
              <span className="text-2xl block mb-1">{getTipoEmoji(rutina.tipo)}</span>
              <p className="text-lg font-bold text-foreground capitalize">{rutina.tipo}</p>
              <p className="text-xs text-muted-foreground">tipo de rutina</p>
            </CardContent>
          </Card>
        </section>

        {/* Fatigue indicator */}
        {estaCansado && (
          <section className="mb-8">
            <Card className="border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-500">Rutina ajustada por cansancio</h3>
                  <p className="text-sm text-muted-foreground">
                    Se ha reducido la intensidad y las repeticiones en un 30%
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Exercise Table */}
        <section>
          <Card className="border-border/50 bg-card/50 overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">Lista de ejercicios</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Ejercicio</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="text-center">Duración</TableHead>
                      <TableHead className="text-center">Intensidad</TableHead>
                      <TableHead className="text-center">Series</TableHead>
                      <TableHead className="text-center">Reps</TableHead>
                      <TableHead className="text-right">Calorías</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rutina.ejercicios.map((ejercicio, index) => (
                      <TableRow key={ejercicio.id} className="border-border/50">
                        <TableCell className="font-medium text-primary">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{ejercicio.nombre}</p>
                            <p className="text-xs text-muted-foreground">{ejercicio.descripcion}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1">
                            {getTipoEmoji(ejercicio.tipo)}
                            <span className="capitalize text-sm">{ejercicio.tipo}</span>
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          {ejercicio.duracion} min
                        </TableCell>
                        <TableCell className="text-center">
                          {getIntensidadBadge(ejercicio.intensidad)}
                        </TableCell>
                        <TableCell className="text-center">
                          {ejercicio.series || '-'}
                        </TableCell>
                        <TableCell className="text-center">
                          {ejercicio.repeticiones || '-'}
                        </TableCell>
                        <TableCell className="text-right text-accent font-medium">
                          {ejercicio.calorias} kcal
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Summary */}
        <section className="mt-8">
          <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-bold text-lg text-foreground">Resumen total</h3>
                  <p className="text-muted-foreground">
                    {rutina.ejercicios.length} ejercicios • {rutina.duracionTotal} minutos • {rutina.totalCalorias} calorías
                  </p>
                </div>
               <Button
  onClick={() => {
    alert("🔥 Rutina iniciada");
    setVista('dashboard');
  }}
  className="bg-primary hover:bg-primary/90 text-primary-foreground"
>
  🚀 Comenzar rutina
</Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

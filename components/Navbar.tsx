"use client";

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useApp } from '@/lib/context';
import { Dumbbell, User, LogOut, Home, Settings, BarChart2, Scale, Medal, UtensilsCrossed } from 'lucide-react';
export function Navbar() {
  const { usuario, vista, setVista, logout } = useApp();

  if (!usuario) return null;

  const getInitials = (nombre: string) => {
    return nombre.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => setVista('dashboard')}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-lg text-foreground hidden sm:inline">
            FitRoutine Pro
          </span>
        </button>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          <Button
            variant={vista === 'dashboard' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setVista('dashboard')}
            className="gap-2"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Button>

          <Button
            variant={vista === 'progreso' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setVista('progreso')}
            className="gap-2"
          >
            <BarChart2 className="w-4 h-4" />
            <span className="hidden sm:inline">Progresos</span>
          </Button>

          <Button
            variant={vista === 'imc' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setVista('imc')}
            className="gap-2"
          >
            <Scale className="w-4 h-4" />
            <span className="hidden sm:inline">IMC</span>
          </Button>

          <Button
            variant={vista === 'logros' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setVista('logros')}
            className="gap-2"
          >
            <Medal className="w-4 h-4" />
            <span className="hidden sm:inline">Logros</span>
          </Button>

          <Button
            variant={vista === 'peso' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setVista('peso')}
            className="gap-2"
          >
            <Scale className="w-4 h-4" />
            <span className="hidden sm:inline">Peso</span>
          </Button>

          <Button
  variant={vista === 'comidas' ? 'secondary' : 'ghost'}
  size="sm"
  onClick={() => setVista('comidas')}
  className="gap-2"
>
  <UtensilsCrossed className="w-4 h-4" />
  <span className="hidden sm:inline">Comidas</span>
</Button>

          <Button
            variant={vista === 'perfil' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setVista('perfil')}
            className="gap-2"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Perfil</span>
          </Button>
        </nav>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-3 h-auto py-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">{usuario.nombre}</p>
                <p className="text-xs text-muted-foreground">Nivel: {usuario.nivelEnergia}%</p>
              </div>
              <Avatar className="h-9 w-9 border-2 border-primary/30">
                <AvatarFallback className="bg-primary/20 text-primary font-semibold text-sm">
                  {getInitials(usuario.nombre)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-3 p-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                  {getInitials(usuario.nombre)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{usuario.nombre}</p>
                <p className="text-xs text-muted-foreground">{usuario.peso} kg</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setVista('perfil')} className="gap-2 cursor-pointer">
              <User className="w-4 h-4" />
              Mi perfil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="gap-2 cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
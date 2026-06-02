"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { Usuario, Rutina, Vista } from './types';
import { generarRutina, ajustarRutinaPorCansancio } from './mock-data';

interface AppContextType {
  usuario: Usuario | null;
  rutina: Rutina | null;
  vista: Vista;
  estaCansado: boolean;
  error: string;
  setVista: (vista: Vista) => void;
  setUsuario: (usuario: Usuario | null) => void;
  logout: () => void;
  generarNuevaRutina: () => void;
  ajustarPorCansancio: () => void;
  actualizarPerfil: (datos: Partial<Usuario>) => void;
  setError: (error: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [usuarioState, setUsuarioState] = useState<Usuario | null>(() => {
  if (typeof window === 'undefined') return null;
  const guardado = localStorage.getItem("usuario");
  return guardado ? JSON.parse(guardado) : null;
});
  const [rutina, setRutina] = useState<Rutina | null>(null);
  const [vista, setVista] = useState<Vista>('login');
  const [estaCansado, setEstaCansado] = useState(false);
  const [error, setError] = useState('');
  console.log("VISTA:", vista, "USUARIO:", usuarioState?.nombre);

  const logout = () => {
  setUsuarioState(null);
  setRutina(null);
  setVista('login');
  setEstaCansado(false);
  setError('');
  localStorage.removeItem("usuario");
  localStorage.removeItem("usuario_id");
};

  const generarNuevaRutina = () => {
    if (usuarioState) {
      const nuevaRutina = generarRutina(usuarioState.nivelEnergia, usuarioState.objetivo);
      setRutina(nuevaRutina);
      setEstaCansado(false);
    }
  };

  const ajustarPorCansancio = () => {
    if (rutina) {
      const rutinaAjustada = ajustarRutinaPorCansancio(rutina);
      setRutina(rutinaAjustada);
      setEstaCansado(true);
    }
  };

  const actualizarPerfil = (datos: Partial<Usuario>) => {
    if (usuarioState) {
      const usuarioActualizado = { ...usuarioState, ...datos };
      setUsuarioState(usuarioActualizado);
    }
  };

  return (
    <AppContext.Provider
      value={{
        usuario: usuarioState,
        rutina,
        vista,
        estaCansado,
        error,
        setVista,
        setUsuario: setUsuarioState,
        logout,
        generarNuevaRutina,
        ajustarPorCansancio,
        actualizarPerfil,
        setError
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
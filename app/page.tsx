"use client";

import { AppProvider, useApp } from '@/lib/context';
import { LoginPage } from '@/components/LoginPage';
import { RegisterPage } from '@/components/RegisterPage';
import { Dashboard } from '@/components/Dashboard';
import { ProfilePage } from '@/components/ProfilePage';
import { RutinaDetalle } from '@/components/RutinaDetalle';
import { ProgresosPage } from '@/components/ProgresosPage';
import { IMCPage } from '@/components/IMCPage';
import { LogrosPage } from '@/components/LogrosPage';
import { PesoPage } from '@/components/PesoPage';
import { ComidasPage } from '@/components/ComidasPage';
import { AdminPage } from '@/components/AdminPage';

function AppContent() {
  const { vista } = useApp();

  switch (vista) {
    case 'login':
      return <LoginPage />;
    case 'registro':
      return <RegisterPage />;
    case 'dashboard':
      return <Dashboard />;
    case 'perfil':
      return <ProfilePage />;
    case 'detalle':
      return <RutinaDetalle />;
    case 'progreso':
      return <ProgresosPage />;
    case 'imc':
      return <IMCPage />;
    case 'logros':
      return <LogrosPage />;
    case 'peso':
      return <PesoPage />;
    case 'comidas':
      return <ComidasPage />;
    case 'admin':
      return <AdminPage />; 
    default: 
      return <LoginPage />;
  }
}

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
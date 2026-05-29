import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { Inicio } from './pages/Inicio';
import { Atritos } from './pages/Atritos';
import { NovoAtrito } from './pages/NovoAtrito';
import { Oportunidades } from './pages/Oportunidades';
import { Padroes } from './pages/Padroes';
import { ToastContainer } from './components/Toast';
import { ConfirmDialog } from './components/ConfirmDialog';
import { useState } from 'react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('inicio');

  const renderPage = () => {
    switch (currentPage) {
      case 'inicio':
        return <Inicio onNavigate={setCurrentPage} />;
      case 'atritos':
        return <Atritos onNavigate={setCurrentPage} />;
      case 'novo-atrito':
        return <NovoAtrito onNavigate={setCurrentPage} />;
      case 'oportunidades':
        return <Oportunidades onNavigate={setCurrentPage} />;
      case 'padroes':
        return <Padroes />;
      default:
        return <Inicio onNavigate={setCurrentPage} />;
    }
  };

  return (
    <AppProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <MobileNav currentPage={currentPage} onNavigate={setCurrentPage} />
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className="flex-1 overflow-y-auto pt-14 md:pt-0">
          <div className="p-4 md:p-8 animate-in fade-in duration-200">{renderPage()}</div>
        </main>
      </div>
      <ToastContainer />
      <ConfirmDialog />
    </AppProvider>
  );
}

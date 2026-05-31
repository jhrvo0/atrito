import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { BottomNav } from './components/BottomNav';
import { Inicio } from './pages/Inicio';
import { Atritos } from './pages/Atritos';
import { NovoAtrito } from './pages/NovoAtrito';
import { Ideias } from './pages/Oportunidades';
import { Padroes } from './pages/Padroes';
import { ToastContainer } from './components/Toast';
import { ConfirmDialog } from './components/ConfirmDialog';

export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <div className="flex min-h-dvh md:h-screen md:overflow-hidden bg-background">
          <MobileNav />
          <Sidebar />
          <main className="flex-1 overflow-y-auto md:pt-0 pb-20 md:pb-0" style={{ paddingTop: 'calc(2.75rem + env(safe-area-inset-top, 0px))' }}>
            <div className="p-4 md:p-6 lg:p-8 animate-in fade-in duration-200">
              <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/atritos" element={<Atritos />} />
                <Route path="/atritos/novo" element={<NovoAtrito />} />
                <Route path="/oportunidades" element={<Ideias />} />
                <Route path="/padroes" element={<Padroes />} />
                <Route path="*" element={<Inicio />} />
              </Routes>
            </div>
          </main>
          <BottomNav />
        </div>
        <ToastContainer />
        <ConfirmDialog />
      </AppProvider>
    </HashRouter>
  );
}

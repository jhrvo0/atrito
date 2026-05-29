import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="flex h-screen overflow-hidden bg-background">
          <MobileNav />
          <Sidebar />
          <main className="flex-1 overflow-y-auto pt-11 md:pt-0">
            <div className="p-4 md:p-6 lg:p-8 animate-in fade-in duration-200">
              <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/atritos" element={<Atritos />} />
                <Route path="/atritos/novo" element={<NovoAtrito />} />
                <Route path="/oportunidades" element={<Oportunidades />} />
                <Route path="/padroes" element={<Padroes />} />
                <Route path="*" element={<Inicio />} />
              </Routes>
            </div>
          </main>
        </div>
        <ToastContainer />
        <ConfirmDialog />
      </AppProvider>
    </BrowserRouter>
  );
}

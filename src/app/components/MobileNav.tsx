import { Moon, Sun } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function MobileNav() {
  const { theme, toggleTheme } = useApp();

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-b border-border/60 px-4 py-2.5 flex items-center justify-between z-40 safe-area-top">
      <h1 className="text-lg font-display tracking-tight">Atrito</h1>
      <button
        onClick={toggleTheme}
        className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground active:scale-95"
        title={theme === 'light' ? 'Modo escuro' : 'Modo claro'}
      >
        {theme === 'light' ? <Moon size={18} strokeWidth={1.75} /> : <Sun size={18} strokeWidth={1.75} />}
      </button>
    </div>
  );
}

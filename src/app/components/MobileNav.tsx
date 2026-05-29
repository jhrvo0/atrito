import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Home, FileText, Lightbulb, TrendingUp, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { to: '/', label: 'Início', icon: Home },
  { to: '/atritos', label: 'Atritos', icon: FileText },
  { to: '/oportunidades', label: 'Oportunidades', icon: Lightbulb },
  { to: '/padroes', label: 'Padrões', icon: TrendingUp },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useApp();

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 bg-sidebar border-b border-sidebar-border px-4 py-2.5 flex items-center justify-between z-40">
        <h1 className="text-lg font-display tracking-tight">Atrito</h1>
        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-sidebar-accent rounded-md transition-colors text-muted-foreground"
            title={theme === 'light' ? 'Modo escuro' : 'Modo claro'}
          >
            {theme === 'light' ? <Moon size={18} strokeWidth={1.75} /> : <Sun size={18} strokeWidth={1.75} />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-sidebar-accent rounded-md transition-colors"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`md:hidden fixed top-[45px] left-0 bottom-0 w-56 bg-sidebar border-r border-sidebar-border z-30 transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="p-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `w-full flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors duration-150 text-[13px] ${
                    isActive
                      ? 'bg-sidebar-accent text-foreground font-medium'
                      : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground'
                  }`
                }
              >
                <Icon size={16} strokeWidth={1.75} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </>
  );
}

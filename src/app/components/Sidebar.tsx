import { NavLink } from 'react-router-dom';
import { Home, FileText, TrendingUp, Sun, Moon } from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { to: '/', label: 'Início', icon: Home },
  { to: '/atritos', label: 'Atritos', icon: FileText },
  { to: '/padroes', label: 'Padrões', icon: TrendingUp },
];

export function Sidebar() {
  const { theme, toggleTheme } = useApp();

  return (
    <aside className="hidden md:flex w-56 bg-sidebar border-r border-sidebar-border h-screen sticky top-0 flex-col">
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-xl font-display tracking-tight">Atrito</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Pequenos incômodos, bons produtos</p>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
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

      <div className="px-3 pb-4">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground transition-colors duration-150"
        >
          {theme === 'light' ? <Moon size={16} strokeWidth={1.75} /> : <Sun size={16} strokeWidth={1.75} />}
          <span>{theme === 'light' ? 'Modo escuro' : 'Modo claro'}</span>
        </button>
      </div>
    </aside>
  );
}

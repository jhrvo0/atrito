import { NavLink } from 'react-router-dom';
import { Home, FileText, Lightbulb, TrendingUp } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Início', icon: Home },
  { to: '/atritos', label: 'Atritos', icon: FileText },
  { to: '/oportunidades', label: 'Oportunidades', icon: Lightbulb },
  { to: '/padroes', label: 'Padrões', icon: TrendingUp },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-60 bg-sidebar border-r border-sidebar-border h-screen sticky top-0 flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-2xl font-display">Atrito</h1>
        <p className="text-sm text-muted-foreground mt-1">Pequenos incômodos, bons produtos</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-150 text-left ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

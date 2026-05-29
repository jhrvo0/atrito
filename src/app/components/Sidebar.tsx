import React from 'react';
import { Home, FileText, Lightbulb, TrendingUp } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const navItems = [
    { id: 'inicio', label: 'Início', icon: Home },
    { id: 'atritos', label: 'Atritos', icon: FileText },
    { id: 'oportunidades', label: 'Oportunidades', icon: Lightbulb },
    { id: 'padroes', label: 'Padrões', icon: TrendingUp }
  ];

  return (
    <aside className="hidden md:flex w-60 bg-sidebar border-r border-sidebar-border h-screen sticky top-0 flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-2xl font-display">Atrito</h1>
        <p className="text-sm text-muted-foreground mt-1">Pequenos incômodos, bons produtos</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-150 text-left ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

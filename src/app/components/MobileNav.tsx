import React, { useState } from 'react';
import { Menu, X, Home, FileText, Lightbulb, TrendingUp } from 'lucide-react';

interface MobileNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function MobileNav({ currentPage, onNavigate }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'inicio', label: 'Início', icon: Home },
    { id: 'atritos', label: 'Atritos', icon: FileText },
    { id: 'oportunidades', label: 'Oportunidades', icon: Lightbulb },
    { id: 'padroes', label: 'Padrões', icon: TrendingUp }
  ];

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setIsOpen(false);
  };

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 bg-sidebar border-b border-sidebar-border px-4 py-3 flex items-center justify-between z-40">
        <div>
          <h1 className="text-xl font-display">Atrito</h1>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-sidebar-accent rounded-md transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`md:hidden fixed top-[57px] left-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border z-30 transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
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
      </div>
    </>
  );
}

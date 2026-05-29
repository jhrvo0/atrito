import { NavLink } from 'react-router-dom';
import { Home, FileText, Plus, Lightbulb, TrendingUp } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Início', icon: Home },
  { to: '/atritos', label: 'Atritos', icon: FileText },
  { to: '/atritos/novo', label: 'Novo', icon: Plus, isCreate: true },
  { to: '/oportunidades', label: 'Oportunidades', icon: Lightbulb },
  { to: '/padroes', label: 'Padrões', icon: TrendingUp },
];

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-sm border-t border-border/60 safe-area-bottom">
      <div className="flex items-center justify-around h-14 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors duration-150 ${
                  item.isCreate
                    ? ''
                    : isActive
                      ? 'text-primary'
                      : 'text-muted-foreground active:text-foreground'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.isCreate ? (
                    <div className={`w-10 h-10 -mt-4 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-primary-foreground scale-110'
                        : 'bg-primary text-primary-foreground active:scale-95'
                    }`}>
                      <Plus size={20} strokeWidth={2.5} />
                    </div>
                  ) : (
                    <Icon size={20} strokeWidth={isActive ? 2.25 : 1.75} />
                  )}
                  <span className={`text-[10px] leading-none ${item.isCreate ? 'mt-0.5' : ''}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

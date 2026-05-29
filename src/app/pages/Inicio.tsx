import { useNavigate } from 'react-router-dom';
import { Plus, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { DataManagement } from '../components/DataManagement';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils/date';

export function Inicio() {
  const navigate = useNavigate();
  const { atritos, opportunities } = useApp();

  const recentAtritos = atritos.slice(0, 4);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-medium">Caderno de pesquisa</p>
        <h1 className="text-3xl md:text-4xl mb-3 leading-tight">
          Observe o que normalmente<br className="hidden sm:block" /> passa despercebido.
        </h1>
        <p className="text-base text-muted-foreground mb-6 max-w-lg leading-relaxed">
          Pequenos incômodos revelam bons produtos. Registre fricções do cotidiano,
          extraia padrões e transforme observações em oportunidades.
        </p>
        <Button onClick={() => navigate('/atritos/novo')}>
          <Plus size={16} />
          Nova observação
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-10">
        <Card className="text-center py-4">
          <p className="text-2xl font-display">{atritos.length}</p>
          <p className="text-xs text-muted-foreground mt-0.5">observações</p>
        </Card>
        <Card className="text-center py-4">
          <p className="text-2xl font-display">{opportunities.length}</p>
          <p className="text-xs text-muted-foreground mt-0.5">oportunidades</p>
        </Card>
        <Card className="text-center py-4">
          <p className="text-2xl font-display">{atritos.filter((a) => a.intensity === 'alta').length}</p>
          <p className="text-xs text-muted-foreground mt-0.5">alta intensidade</p>
        </Card>
      </div>

      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg">Observações recentes</h2>
          {atritos.length > 0 && (
            <button
              onClick={() => navigate('/atritos')}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              Ver todas <ArrowRight size={12} />
            </button>
          )}
        </div>

        {atritos.length === 0 ? (
          <Card className="py-8 text-center">
            <p className="text-sm text-muted-foreground mb-1">Nenhuma observação ainda.</p>
            <p className="text-xs text-muted-foreground/60 mb-4">
              Comece notando algo que te incomodou hoje — pode ser qualquer coisa.
            </p>
            <Button variant="secondary" size="sm" onClick={() => navigate('/atritos/novo')}>
              <Plus size={14} />
              Registrar primeira observação
            </Button>
          </Card>
        ) : (
          <div className="space-y-2">
            {recentAtritos.map((atrito) => (
              <button
                key={atrito.id}
                onClick={() => navigate('/atritos')}
                className="w-full text-left"
              >
                <Card className="py-3 px-4 hover:border-border transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-sm font-medium truncate">{atrito.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{atrito.description}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-muted-foreground capitalize">{atrito.context}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        atrito.intensity === 'alta' ? 'bg-orange-500' :
                        atrito.intensity === 'média' ? 'bg-amber-400' : 'bg-stone-300'
                      }`} />
                    </div>
                  </div>
                </Card>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border/50 pt-6">
        <p className="text-xs text-muted-foreground/60 mb-3">Dados locais</p>
        <DataManagement onDataChanged={() => window.location.reload()} />
      </div>
    </div>
  );
}

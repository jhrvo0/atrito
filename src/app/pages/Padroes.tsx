import { FileText, Lightbulb, AlertTriangle, Clock } from 'lucide-react';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils/date';

export function Padroes() {
  const { atritos, opportunities } = useApp();

  const contextCounts = atritos.reduce(
    (acc, atrito) => {
      acc[atrito.context] = (acc[atrito.context] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const intensityCounts = atritos.reduce(
    (acc, atrito) => {
      acc[atrito.intensity] = (acc[atrito.intensity] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const frequencyCounts = atritos.reduce(
    (acc, atrito) => {
      acc[atrito.frequency] = (acc[atrito.frequency] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const statusCounts = atritos.reduce(
    (acc, atrito) => {
      acc[atrito.status] = (acc[atrito.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const opportunityStatusCounts = opportunities.reduce(
    (acc, opp) => {
      acc[opp.status] = (acc[opp.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const sortedContexts = Object.entries(contextCounts).sort((a, b) => b[1] - a[1]);
  const mostProblematicContexts = sortedContexts.slice(0, 5);

  const highIntensityAtritos = atritos
    .filter((a) => a.intensity === 'alta')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const frequentProblems = atritos
    .filter((a) => a.frequency === 'frequentemente')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const highPriorityOpportunities = opportunities
    .filter((o) => o.priority === 'alta')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getBarWidth = (count: number, max: number) => {
    return `${(count / max) * 100}%`;
  };

  const maxContextCount = Math.max(...Object.values(contextCounts), 1);

  const statusColors: Record<string, string> = {
    'observado': 'bg-stone-400 dark:bg-stone-500',
    'investigando': 'bg-violet-500',
    'virou ideia': 'bg-emerald-500',
    'descartado': 'bg-muted-foreground/30',
  };

  const opportunityStatusColors: Record<string, string> = {
    'ideia': 'bg-stone-400 dark:bg-stone-500',
    'validando': 'bg-violet-500',
    'protótipo': 'bg-blue-500',
    'em desenvolvimento': 'bg-emerald-500',
    'arquivada': 'bg-muted-foreground/30',
  };

  if (atritos.length === 0) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-medium">Análise</p>
          <h1 className="text-2xl mb-1">Padrões</h1>
          <p className="text-sm text-muted-foreground">Insights emergentes das suas observações.</p>
        </div>
        <Card className="py-10 text-center">
          <p className="text-sm text-muted-foreground mb-1">Nenhum dado para analisar.</p>
          <p className="text-xs text-muted-foreground/60">Registre algumas observações primeiro para ver padrões emergentes.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-medium">Análise</p>
        <h1 className="text-2xl mb-1">Padrões</h1>
        <p className="text-sm text-muted-foreground">Insights emergentes das suas observações.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-8">
        <Card className="text-center py-3">
          <p className="text-2xl font-display">{atritos.length}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">observações</p>
        </Card>
        <Card className="text-center py-3">
          <p className="text-2xl font-display">{opportunities.length}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">oportunidades</p>
        </Card>
        <Card className="text-center py-3">
          <p className="text-2xl font-display">{intensityCounts['alta'] || 0}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">alta intensidade</p>
        </Card>
        <Card className="text-center py-3">
          <p className="text-2xl font-display">{frequencyCounts['frequentemente'] || 0}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">frequentes</p>
        </Card>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-base font-medium mb-3">Resumo geral</h2>
          <Card>
            <div className="space-y-4">
              <div>
                <h3 className="text-xs text-muted-foreground mb-2">Atritos por contexto</h3>
                <div className="space-y-2">
                  {sortedContexts.length === 0 ? (
                    <p className="text-xs text-muted-foreground/60">Sem dados</p>
                  ) : (
                    sortedContexts.map(([context, count]) => (
                      <div key={context}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs capitalize">{context}</span>
                          <span className="text-xs text-muted-foreground font-medium">{count}</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary/70 rounded-full transition-all duration-300"
                            style={{ width: getBarWidth(count, maxContextCount) }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="text-base font-medium mb-3">Contextos problemáticos</h2>
          <Card>
            {mostProblematicContexts.length === 0 ? (
              <p className="text-xs text-muted-foreground/60">Sem dados</p>
            ) : (
              <div className="space-y-3">
                {mostProblematicContexts.map(([context, count], index) => (
                  <div key={context} className="flex items-baseline gap-3">
                    <span className="text-xs text-muted-foreground/40 font-mono w-4 shrink-0">{String(index + 1).padStart(2, '0')}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium capitalize">{context}</p>
                      <p className="text-[11px] text-muted-foreground">{count} ocorrência{count > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </section>

        <section>
          <h2 className="text-base font-medium mb-3">Recorrência</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card>
              <h3 className="text-xs text-muted-foreground mb-2">Distribuição por frequência</h3>
              <div className="space-y-2">
                {Object.entries(frequencyCounts).length === 0 ? (
                  <p className="text-xs text-muted-foreground/60">Sem dados</p>
                ) : (
                  Object.entries(frequencyCounts).map(([frequency, count]) => (
                    <div key={frequency}>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs capitalize">{frequency}</span>
                        <span className="text-xs text-muted-foreground font-medium">{count}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary/70 rounded-full transition-all duration-300"
                          style={{ width: getBarWidth(count, atritos.length) }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card>
              <h3 className="text-xs text-muted-foreground mb-2">Distribuição por status</h3>
              <div className="space-y-2">
                {Object.entries(statusCounts).length === 0 ? (
                  <p className="text-xs text-muted-foreground/60">Sem dados</p>
                ) : (
                  Object.entries(statusCounts).map(([status, count]) => (
                    <div key={status}>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs capitalize">{status}</span>
                        <span className="text-xs text-muted-foreground font-medium">{count}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${statusColors[status] || 'bg-muted-foreground/30'}`}
                          style={{ width: getBarWidth(count, atritos.length) }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-base font-medium mb-3">Observações de maior impacto</h2>
          <Card>
            <div className="space-y-3">
              {highIntensityAtritos.length === 0 ? (
                <p className="text-xs text-muted-foreground/60">Nenhuma observação de alta intensidade</p>
              ) : (
                highIntensityAtritos.map((atrito) => (
                  <div key={atrito.id} className="border-l-2 border-orange-400 dark:border-orange-500/60 pl-3">
                    <p className="text-sm font-medium leading-snug">{atrito.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] text-muted-foreground capitalize">{atrito.context}</span>
                      <span className="text-[11px] text-muted-foreground/30">·</span>
                      <span className="text-[11px] text-muted-foreground">{formatDate(atrito.createdAt)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </section>

        <section>
          <h2 className="text-base font-medium mb-3">Problemas recorrentes</h2>
          <Card>
            <div className="space-y-3">
              {frequentProblems.length === 0 ? (
                <p className="text-xs text-muted-foreground/60">Nenhum problema frequente identificado</p>
              ) : (
                frequentProblems.map((atrito) => (
                  <div key={atrito.id} className="border-l-2 border-amber-400 dark:border-amber-500/60 pl-3">
                    <p className="text-sm font-medium leading-snug">{atrito.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] text-muted-foreground capitalize">{atrito.context}</span>
                      <span className="text-[11px] text-muted-foreground/30">·</span>
                      <span className="text-[11px] text-muted-foreground">{formatDate(atrito.createdAt)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </section>

        <section>
          <h2 className="text-base font-medium mb-3">Oportunidades com maior potencial</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card>
              <h3 className="text-xs text-muted-foreground mb-2">Status das oportunidades</h3>
              <div className="space-y-2">
                {Object.entries(opportunityStatusCounts).length === 0 ? (
                  <p className="text-xs text-muted-foreground/60">Sem dados</p>
                ) : (
                  Object.entries(opportunityStatusCounts).map(([status, count]) => (
                    <div key={status}>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs capitalize">{status}</span>
                        <span className="text-xs text-muted-foreground font-medium">{count}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${opportunityStatusColors[status] || 'bg-muted-foreground/30'}`}
                          style={{ width: getBarWidth(count, opportunities.length) }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card>
              <h3 className="text-xs text-muted-foreground mb-2">Alta prioridade</h3>
              <div className="space-y-2.5">
                {highPriorityOpportunities.length === 0 ? (
                  <p className="text-xs text-muted-foreground/60">Nenhuma oportunidade de alta prioridade</p>
                ) : (
                  highPriorityOpportunities.map((opportunity) => (
                    <div key={opportunity.id} className="border-l-2 border-primary pl-3">
                      <p className="text-sm font-medium leading-snug">{opportunity.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                        {opportunity.originalProblem}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}

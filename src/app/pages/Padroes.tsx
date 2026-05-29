import React from 'react';
import { TrendingUp, FileText, Lightbulb, MapPin, AlertTriangle, Clock, BarChart3 } from 'lucide-react';
import { Card } from '../components/Card';
import { useApp } from '../context/AppContext';

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

  const stats = [
    { label: 'Total de Atritos', value: atritos.length, icon: FileText },
    { label: 'Oportunidades Geradas', value: opportunities.length, icon: Lightbulb },
    {
      label: 'Atritos Alta Intensidade',
      value: intensityCounts['alta'] || 0,
      icon: AlertTriangle
    },
    {
      label: 'Problemas Frequentes',
      value: frequencyCounts['frequentemente'] || 0,
      icon: Clock
    }
  ];

  const getBarWidth = (count: number, max: number) => {
    return `${(count / max) * 100}%`;
  };

  const maxContextCount = Math.max(...Object.values(contextCounts), 1);

  const statusColors: Record<string, string> = {
    'observado': 'bg-blue-500',
    'investigando': 'bg-purple-500',
    'virou ideia': 'bg-green-500',
    'descartado': 'bg-gray-400',
  };

  const opportunityStatusColors: Record<string, string> = {
    'ideia': 'bg-blue-500',
    'validando': 'bg-purple-500',
    'protótipo': 'bg-indigo-500',
    'em desenvolvimento': 'bg-green-500',
    'arquivada': 'bg-gray-400',
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl mb-1 md:mb-2">Padrões Encontrados</h1>
        <p className="text-sm md:text-base text-muted-foreground">Análise dos atritos registrados e oportunidades identificadas</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl md:text-3xl font-display">{stat.value}</p>
                </div>
                <Icon className="text-primary" size={20} />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
        <Card>
          <h2 className="text-lg md:text-xl mb-4">Atritos por Contexto</h2>
          <div className="space-y-3">
            {sortedContexts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum atrito registrado ainda</p>
            ) : (
              sortedContexts.map(([context, count]) => (
                <div key={context}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm capitalize">{context}</span>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: getBarWidth(count, maxContextCount) }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg md:text-xl mb-4">Contextos Mais Problemáticos</h2>
          <p className="text-sm text-muted-foreground mb-4">Áreas com maior concentração de atritos</p>
          <div className="space-y-2">
            {mostProblematicContexts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum dado disponível</p>
            ) : (
              mostProblematicContexts.map(([context, count], index) => (
                <div key={context} className="flex items-center gap-3">
                  <span className="text-xl font-display text-muted-foreground w-6">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium capitalize">{context}</p>
                    <p className="text-xs text-muted-foreground">{count} atritos registrados</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
        <Card>
          <h2 className="text-lg md:text-xl mb-4">Distribuição por Status</h2>
          <div className="space-y-3">
            {Object.entries(statusCounts).length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum dado disponível</p>
            ) : (
              Object.entries(statusCounts).map(([status, count]) => (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm capitalize">{status}</span>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${statusColors[status] || 'bg-gray-400'}`}
                      style={{ width: getBarWidth(count, atritos.length) }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg md:text-xl mb-4">Distribuição por Frequência</h2>
          <div className="space-y-3">
            {Object.entries(frequencyCounts).length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum dado disponível</p>
            ) : (
              Object.entries(frequencyCounts).map(([frequency, count]) => (
                <div key={frequency}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm capitalize">{frequency}</span>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: getBarWidth(count, atritos.length) }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
        <Card>
          <h2 className="text-lg md:text-xl mb-4">Atritos de Maior Intensidade</h2>
          <div className="space-y-3">
            {highIntensityAtritos.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum atrito de alta intensidade</p>
            ) : (
              highIntensityAtritos.map((atrito) => (
                <div key={atrito.id} className="border-l-2 border-destructive pl-3">
                  <p className="text-sm font-medium mb-1">{atrito.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="capitalize">{atrito.context}</span>
                    <span>·</span>
                    <span>{atrito.createdAt}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg md:text-xl mb-4">Problemas Recorrentes</h2>
          <div className="space-y-3">
            {frequentProblems.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum problema frequente identificado</p>
            ) : (
              frequentProblems.map((atrito) => (
                <div key={atrito.id} className="border-l-2 border-orange-400 pl-3">
                  <p className="text-sm font-medium mb-1">{atrito.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="capitalize">{atrito.context}</span>
                    <span>·</span>
                    <span>{atrito.createdAt}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <h2 className="text-lg md:text-xl mb-4">Status das Oportunidades</h2>
          <div className="space-y-3">
            {Object.entries(opportunityStatusCounts).length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma oportunidade registrada</p>
            ) : (
              Object.entries(opportunityStatusCounts).map(([status, count]) => (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm capitalize">{status}</span>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${opportunityStatusColors[status] || 'bg-gray-400'}`}
                      style={{ width: getBarWidth(count, opportunities.length) }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg md:text-xl mb-4">Oportunidades com Maior Potencial</h2>
          <div className="space-y-3">
            {highPriorityOpportunities.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma oportunidade de alta prioridade identificada
              </p>
            ) : (
              highPriorityOpportunities.map((opportunity) => (
                <div key={opportunity.id} className="border-l-2 border-primary pl-3">
                  <p className="text-sm font-medium mb-1">{opportunity.title}</p>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                    {opportunity.originalProblem}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-green-50 text-green-700">
                      {opportunity.status}
                    </span>
                    <span className="text-xs text-muted-foreground">{opportunity.createdAt}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

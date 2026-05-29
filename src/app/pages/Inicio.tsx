import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Lightbulb, MapPin, AlertTriangle } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { DataManagement } from '../components/DataManagement';
import { useApp } from '../context/AppContext';

export function Inicio() {
  const navigate = useNavigate();
  const { atritos, opportunities } = useApp();

  const highIntensityCount = atritos.filter((a) => a.intensity === 'alta').length;

  const contextCounts = atritos.reduce(
    (acc, atrito) => {
      acc[atrito.context] = (acc[atrito.context] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const mostCommonContext = Object.entries(contextCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Nenhum';

  const stats = [
    {
      label: 'Total de Atritos',
      value: atritos.length,
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      label: 'Oportunidades',
      value: opportunities.length,
      icon: Lightbulb,
      color: 'text-green-600',
    },
    {
      label: 'Contexto Recorrente',
      value: mostCommonContext.charAt(0).toUpperCase() + mostCommonContext.slice(1),
      icon: MapPin,
      color: 'text-purple-600',
    },
    {
      label: 'Alta Intensidade',
      value: highIntensityCount,
      icon: AlertTriangle,
      color: 'text-orange-600',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'observado':
        return 'bg-blue-50 text-blue-700';
      case 'investigando':
        return 'bg-purple-50 text-purple-700';
      case 'virou ideia':
        return 'bg-green-50 text-green-700';
      case 'descartado':
        return 'bg-gray-50 text-gray-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl mb-2 md:mb-3">Atrito</h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-4 md:mb-8">Pequenos incômodos revelam bons produtos.</p>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mb-6 md:mb-8">
          Registre os pequenos problemas, fricções e incômodos do seu dia a dia. Transforme essas observações
          em oportunidades de produto, melhorias de experiência e ideias de pesquisa.
        </p>
        <Button onClick={() => navigate('/atritos/novo')} size="lg" className="w-full md:w-auto">
          <Plus size={20} />
          Registrar atrito
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-12">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl md:text-3xl">{stat.value}</p>
                </div>
                <Icon className={stat.color} size={20} />
              </div>
            </Card>
          );
        })}
      </div>

      <div>
        <h2 className="text-2xl mb-4">Atritos Recentes</h2>
        {atritos.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Nenhum atrito registrado ainda.</p>
            <Button onClick={() => navigate('/atritos/novo')}>
              <Plus size={20} />
              Registrar primeiro atrito
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {atritos.slice(0, 5).map((atrito) => (
              <Card key={atrito.id} onClick={() => navigate('/atritos')} className="p-4 md:p-5">
                <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium mb-1 text-sm md:text-base">{atrito.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">{atrito.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground capitalize">{atrito.context}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                        atrito.intensity === 'alta'
                          ? 'bg-orange-100 text-orange-700'
                          : atrito.intensity === 'média'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {atrito.intensity}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${getStatusColor(atrito.status)}`}>
                      {atrito.status}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="mt-12 border-t border-border pt-8">
        <h2 className="text-xl mb-4">Dados</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Exporte um backup dos seus dados ou importe um backup anterior.
        </p>
        <DataManagement onDataChanged={() => window.location.reload()} />
      </div>
    </div>
  );
}

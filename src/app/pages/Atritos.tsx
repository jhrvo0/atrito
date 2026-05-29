import { useState, useEffect } from 'react';
import { Search, Plus, X, Eye, Lightbulb, Trash2, FileText, Download, Copy } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Tag } from '../components/Tag';
import { Select } from '../components/Select';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { useApp } from '../context/AppContext';
import { Atrito, AtritoStatus } from '../types';
import { generateOpportunityFromAtrito } from '../utils/opportunityGenerator';
import { exportAtritoToMarkdown, downloadMarkdown, copyToClipboard } from '../utils/markdown';
import { loadFilters, saveFilters, FiltersState } from '../utils/storage';
import { formatDate } from '../utils/date';
import {
  CONTEXT_OPTIONS,
  INTENSITY_OPTIONS,
  FREQUENCY_OPTIONS,
  ATRITO_STATUS_OPTIONS,
} from '../constants';
import { showConfirm } from '../components/ConfirmDialog';
import { showToast } from '../components/Toast';

interface AtritosProps {
  onNavigate: (page: string) => void;
}

const defaultFilters: FiltersState = {
  searchTerm: '',
  contextFilter: '',
  intensityFilter: '',
  frequencyFilter: '',
  statusFilter: '',
};

export function Atritos({ onNavigate }: AtritosProps) {
  const { atritos, opportunities, deleteAtrito, updateAtrito, addOpportunity } = useApp();
  const [filters, setFilters] = useState<FiltersState>(() => loadFilters());
  const [selectedAtrito, setSelectedAtrito] = useState<Atrito | null>(null);

  useEffect(() => {
    saveFilters(filters);
  }, [filters]);

  const filteredAtritos = atritos.filter((atrito) => {
    const term = filters.searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      atrito.title.toLowerCase().includes(term) ||
      atrito.description.toLowerCase().includes(term) ||
      (atrito.improvisedSolution && atrito.improvisedSolution.toLowerCase().includes(term));
    const matchesContext = !filters.contextFilter || atrito.context === filters.contextFilter;
    const matchesIntensity = !filters.intensityFilter || atrito.intensity === filters.intensityFilter;
    const matchesFrequency = !filters.frequencyFilter || atrito.frequency === filters.frequencyFilter;
    const matchesStatus = !filters.statusFilter || atrito.status === filters.statusFilter;

    return matchesSearch && matchesContext && matchesIntensity && matchesFrequency && matchesStatus;
  });

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  const hasActiveFilters =
    filters.searchTerm ||
    filters.contextFilter ||
    filters.intensityFilter ||
    filters.frequencyFilter ||
    filters.statusFilter;

  const handleTransformToOpportunity = (atrito: Atrito) => {
    const existingOpportunity = opportunities.find((opp) => opp.atritos.includes(atrito.id));
    if (existingOpportunity) {
      showToast('Este atrito já foi transformado em oportunidade.', 'info');
      onNavigate('oportunidades');
      return;
    }

    const newOpportunity = generateOpportunityFromAtrito(atrito);
    addOpportunity(newOpportunity);
    updateAtrito(atrito.id, { status: 'virou ideia' });
    setSelectedAtrito(null);
    showToast('Oportunidade criada com sucesso!');
    onNavigate('oportunidades');
  };

  const handleChangeStatus = (atrito: Atrito, newStatus: AtritoStatus) => {
    updateAtrito(atrito.id, { status: newStatus });
    if (selectedAtrito?.id === atrito.id) {
      setSelectedAtrito({ ...atrito, status: newStatus });
    }
  };

  const handleExportAtrito = (atrito: Atrito) => {
    const markdown = exportAtritoToMarkdown(atrito);
    downloadMarkdown(markdown, `atrito-${atrito.id}.md`);
    showToast('Arquivo Markdown baixado!');
  };

  const handleCopyAtrito = async (atrito: Atrito) => {
    const markdown = exportAtritoToMarkdown(atrito);
    const success = await copyToClipboard(markdown);
    if (success) {
      showToast('Atrito copiado para a área de transferência!');
    }
  };

  const handleDeleteAtrito = async (atrito: Atrito) => {
    const confirmed = await showConfirm({
      title: 'Excluir atrito',
      message: `Tem certeza que deseja excluir "${atrito.title}"? Esta ação não pode ser desfeita.`,
      confirmLabel: 'Excluir',
    });
    if (confirmed) {
      deleteAtrito(atrito.id);
      setSelectedAtrito(null);
      showToast('Atrito excluído.');
    }
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl mb-1 md:mb-2">Atritos</h1>
          <p className="text-sm md:text-base text-muted-foreground">Registros de problemas e fricções observados</p>
        </div>
        <Button onClick={() => onNavigate('novo-atrito')} className="w-full sm:w-auto">
          <Plus size={20} />
          Novo atrito
        </Button>
      </div>

      <div className="mb-6 space-y-3 md:space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Buscar atritos..."
              value={filters.searchTerm}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
              icon={<Search size={18} />}
            />
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} className="w-full sm:w-auto">
              <X size={18} />
              <span className="hidden sm:inline">Limpar filtros</span>
              <span className="sm:hidden">Limpar</span>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <Select
            value={filters.contextFilter}
            onChange={(e) => setFilters({ ...filters, contextFilter: e.target.value })}
            placeholder="Contexto"
            options={[{ value: '', label: 'Todos os contextos' }, ...CONTEXT_OPTIONS]}
          />

          <Select
            value={filters.intensityFilter}
            onChange={(e) => setFilters({ ...filters, intensityFilter: e.target.value })}
            placeholder="Intensidade"
            options={[{ value: '', label: 'Todas intensidades' }, ...INTENSITY_OPTIONS]}
          />

          <Select
            value={filters.frequencyFilter}
            onChange={(e) => setFilters({ ...filters, frequencyFilter: e.target.value })}
            placeholder="Frequência"
            options={[{ value: '', label: 'Todas frequências' }, ...FREQUENCY_OPTIONS]}
          />

          <Select
            value={filters.statusFilter}
            onChange={(e) => setFilters({ ...filters, statusFilter: e.target.value })}
            placeholder="Status"
            options={[{ value: '', label: 'Todos os status' }, ...ATRITO_STATUS_OPTIONS]}
          />
        </div>
      </div>

      {filteredAtritos.length === 0 ? (
        <EmptyState
          icon={<FileText size={48} />}
          title="Nenhum atrito encontrado"
          description={
            hasActiveFilters
              ? 'Tente ajustar os filtros ou limpar a busca para ver mais resultados'
              : 'Comece registrando seu primeiro atrito'
          }
          action={
            hasActiveFilters ? (
              <Button variant="secondary" onClick={clearFilters}>
                <X size={18} />
                Limpar filtros
              </Button>
            ) : (
              <Button onClick={() => onNavigate('novo-atrito')}>
                <Plus size={20} />
                Registrar primeiro atrito
              </Button>
            )
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredAtritos.map((atrito) => (
            <Card key={atrito.id} className="p-4 md:p-5">
              <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium mb-2 text-sm md:text-base">{atrito.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-3 line-clamp-2">{atrito.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <Tag variant="context">{atrito.context}</Tag>
                    <Tag variant="intensity">{atrito.intensity}</Tag>
                    <Tag variant="frequency">{atrito.frequency}</Tag>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(atrito.status)}`}>
                      {atrito.status}
                    </span>
                  </div>
                </div>
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDate(atrito.createdAt)}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedAtrito(atrito)}
                      className="text-muted-foreground hover:text-foreground transition-colors p-1"
                      title="Ver detalhes"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleTransformToOpportunity(atrito)}
                      className="text-muted-foreground hover:text-primary transition-colors p-1"
                      title="Transformar em oportunidade"
                      disabled={atrito.status === 'virou ideia'}
                    >
                      <Lightbulb size={18} />
                    </button>
                    <button
                      onClick={() => handleExportAtrito(atrito)}
                      className="text-muted-foreground hover:text-foreground transition-colors p-1"
                      title="Exportar Markdown"
                    >
                      <Download size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteAtrito(atrito)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={!!selectedAtrito} onClose={() => setSelectedAtrito(null)} title="Detalhes do Atrito">
        {selectedAtrito && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl mb-2">{selectedAtrito.title}</h3>
              <p className="text-muted-foreground">{selectedAtrito.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Contexto</p>
                <p className="font-medium">{selectedAtrito.context}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Intensidade</p>
                <p className="font-medium">{selectedAtrito.intensity}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Frequência</p>
                <p className="font-medium">{selectedAtrito.frequency}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Quem foi afetado</p>
                <p className="font-medium">{selectedAtrito.affected}</p>
              </div>
            </div>

            {selectedAtrito.improvisedSolution && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Solução improvisada</p>
                <p className="text-sm">{selectedAtrito.improvisedSolution}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-muted-foreground mb-2">Status</p>
              <div className="flex flex-wrap gap-2">
                {ATRITO_STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleChangeStatus(selectedAtrito, opt.value)}
                    className={`px-3 py-1.5 rounded text-sm transition-all ${
                      selectedAtrito.status === opt.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-border gap-3">
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => handleCopyAtrito(selectedAtrito)}>
                  <Copy size={18} />
                  Copiar
                </Button>
                <Button variant="secondary" onClick={() => handleExportAtrito(selectedAtrito)}>
                  <Download size={18} />
                  Exportar .md
                </Button>
              </div>
              <Button
                onClick={() => handleTransformToOpportunity(selectedAtrito)}
                disabled={selectedAtrito.status === 'virou ideia'}
              >
                <Lightbulb size={18} />
                Transformar em oportunidade
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, X, FileText, SlidersHorizontal } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { EmptyState } from '../components/EmptyState';
import { BottomSheet } from '../components/BottomSheet';
import { AtritoFilters } from '../components/AtritoFilters';
import { AtritoCard } from '../components/AtritoCard';
import { AtritoDetailsModal } from '../components/AtritoDetailsModal';
import { EditAtritoModal } from '../components/EditAtritoModal';
import { BriefingModal } from '../components/BriefingModal';
import { useApp } from '../context/AppContext';
import { Atrito, AtritoStatus, PromptTemplateType } from '../types';
import { loadFilters, saveFilters, FiltersState } from '../utils/storage';
import { showConfirm } from '../components/ConfirmDialog';
import { showToast } from '../components/Toast';
import { InvestigationContextForm } from '../components/InvestigationContextForm';

const defaultFilters: FiltersState = {
  searchTerm: '',
  contextFilter: '',
  intensityFilter: '',
  frequencyFilter: '',
  statusFilter: '',
};

function groupByDate(atritos: Atrito[]): { label: string; items: Atrito[] }[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups: { label: string; items: Atrito[] }[] = [];
  const todayItems: Atrito[] = [];
  const yesterdayItems: Atrito[] = [];
  const olderItems: Atrito[] = [];

  for (const atrito of atritos) {
    const date = new Date(atrito.createdAt);
    const atritoDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (atritoDate.getTime() === today.getTime()) {
      todayItems.push(atrito);
    } else if (atritoDate.getTime() === yesterday.getTime()) {
      yesterdayItems.push(atrito);
    } else {
      olderItems.push(atrito);
    }
  }

  if (todayItems.length > 0) groups.push({ label: 'Hoje', items: todayItems });
  if (yesterdayItems.length > 0) groups.push({ label: 'Ontem', items: yesterdayItems });
  if (olderItems.length > 0) groups.push({ label: 'Anteriores', items: olderItems });

  return groups;
}

export function Atritos() {
  const navigate = useNavigate();
  const {
    atritos,
    opportunities,
    investigationContexts,
    deleteAtrito,
    deleteOpportunity,
    updateAtrito,
    addOpportunity,
    addInvestigationContext,
    deleteInvestigationContext,
  } = useApp();

  const [filters, setFilters] = useState<FiltersState>(() => loadFilters());
  const [selectedAtrito, setSelectedAtrito] = useState<Atrito | null>(null);
  const [showInvestigationForm, setShowInvestigationForm] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [editingAtrito, setEditingAtrito] = useState<Atrito | null>(null);
  const [showBriefingModal, setShowBriefingModal] = useState(false);
  const [selectedTemplateType, setSelectedTemplateType] = useState<PromptTemplateType>('pain-deepening');

  const getContextForAtrito = (atritoId: string) => {
    return investigationContexts.find((c) => c.atritoId === atritoId);
  };

  const uniqueContexts = [...new Set(atritos.map((a) => a.context))].sort();
  const contextOptions = uniqueContexts.map((c) => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }));

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

  const hasActiveFilters =
    filters.searchTerm ||
    filters.contextFilter ||
    filters.intensityFilter ||
    filters.frequencyFilter ||
    filters.statusFilter;

  const activeFilterCount = [filters.contextFilter, filters.intensityFilter, filters.frequencyFilter, filters.statusFilter].filter(Boolean).length;

  const handleChangeStatus = (atrito: Atrito, newStatus: AtritoStatus) => {
    updateAtrito(atrito.id, { status: newStatus });
    if (selectedAtrito?.id === atrito.id) {
      setSelectedAtrito({ ...atrito, status: newStatus });
    }
  };

  const handleDeleteAtrito = async (atrito: Atrito) => {
    const linkedOpportunities = opportunities.filter((o) => o.atritos.includes(atrito.id));

    if (linkedOpportunities.length > 0) {
      const confirmed = await showConfirm({
        title: 'Excluir observação',
        message: `Esta observação está vinculada a ${linkedOpportunities.length} ideia(s). O que deseja fazer?`,
        confirmLabel: 'Excluir tudo',
        cancelLabel: 'Cancelar',
      });
      if (!confirmed) return;

      for (const opp of linkedOpportunities) {
        deleteOpportunity(opp.id);
      }
    } else {
      const confirmed = await showConfirm({
        title: 'Excluir observação',
        message: `Tem certeza que deseja excluir "${atrito.title}"?`,
        confirmLabel: 'Excluir',
      });
      if (!confirmed) return;
    }

    deleteAtrito(atrito.id);
    setSelectedAtrito(null);
    setEditingAtrito(null);
    setShowBriefingModal(false);
    showToast('Observação excluída.');
  };

  const handleDeleteInvestigationContext = async (atrito: Atrito) => {
    const context = getContextForAtrito(atrito.id);
    if (!context) return;
    const confirmed = await showConfirm({
      title: 'Excluir contexto aprofundado',
      message: 'Tem certeza que deseja excluir o contexto aprofundado? Esta ação não pode ser desfeita.',
      confirmLabel: 'Excluir',
    });
    if (!confirmed) return;
    deleteInvestigationContext(context.id);
    setSelectedAtrito({ ...atrito });
    setEditingAtrito({ ...atrito });
    showToast('Contexto aprofundado excluído.');
  };

  const groups = groupByDate(filteredAtritos);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl mb-0.5">Atritos</h1>
          <p className="text-xs text-muted-foreground hidden md:block">Observações de fricções cotidianas</p>
        </div>
        <Button onClick={() => navigate('/atritos/novo')} size="sm" className="hidden md:flex">
          <Plus size={14} />
          Nova
        </Button>
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Buscar..."
              value={filters.searchTerm}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
              icon={<Search size={14} />}
              className="min-h-[44px] md:min-h-0"
            />
          </div>
          <button
            onClick={() => setShowFilterSheet(true)}
            className={`md:hidden flex items-center gap-1.5 px-3 rounded-md border border-border/60 text-xs font-medium transition-all min-h-[44px] active:scale-95 ${
              activeFilterCount > 0
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-muted-foreground'
            }`}
          >
            <SlidersHorizontal size={14} />
            {activeFilterCount > 0 && <span>{activeFilterCount}</span>}
          </button>
          {hasActiveFilters && (
            <Button variant="ghost" onClick={() => setFilters(defaultFilters)} size="sm" className="hidden md:flex">
              <X size={14} />
            </Button>
          )}
        </div>

        <div className="hidden md:block">
          <AtritoFilters
            filters={filters}
            onFiltersChange={setFilters}
            contextOptions={contextOptions}
          />
        </div>
      </div>

      {filteredAtritos.length === 0 ? (
        <EmptyState
          icon={<FileText size={36} />}
          title={hasActiveFilters ? 'Nenhum resultado' : 'Nenhuma observação ainda'}
          description={
            hasActiveFilters
              ? 'Ajuste os filtros para ver mais resultados.'
              : 'Comece a notar as fricções do seu dia a dia. Toda observação pode revelar um sinal útil.'
          }
          examples={
            !hasActiveFilters
              ? ['Fila demorada no caixa', 'App que trava no celular', 'Instruções confusas de montagem']
              : undefined
          }
          action={
            hasActiveFilters ? (
              <Button variant="secondary" size="sm" onClick={() => setFilters(defaultFilters)}>
                <X size={14} />
                Limpar filtros
              </Button>
            ) : (
              <Button size="sm" onClick={() => navigate('/atritos/novo')}>
                <Plus size={14} />
                Registrar observação
              </Button>
            )
          }
        />
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <div key={group.label}>
              <h3 className="text-xs text-muted-foreground font-medium mb-2 uppercase tracking-wider">{group.label}</h3>
              <div className="space-y-2">
                {group.items.map((atrito) => (
                  <AtritoCard
                    key={atrito.id}
                    atrito={atrito}
                    hasContext={!!getContextForAtrito(atrito.id)}
                    onClick={() => setSelectedAtrito(atrito)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <AtritoDetailsModal
        atrito={selectedAtrito}
        isOpen={!!selectedAtrito}
        onClose={() => setSelectedAtrito(null)}
        investigationContext={selectedAtrito ? getContextForAtrito(selectedAtrito.id) : undefined}
        opportunities={opportunities}
        onChangeStatus={handleChangeStatus}
        onEdit={() => setEditingAtrito(selectedAtrito)}
        onInvestigate={() => setShowInvestigationForm(true)}
        onOpenBriefing={() => setShowBriefingModal(true)}
        onDelete={() => selectedAtrito && handleDeleteAtrito(selectedAtrito)}
        onAddOpportunity={addOpportunity}
        onUpdateAtrito={updateAtrito}
      />

      <BottomSheet isOpen={showFilterSheet} onClose={() => setShowFilterSheet(false)} title="Filtros">
        <AtritoFilters
          filters={filters}
          onFiltersChange={setFilters}
          contextOptions={contextOptions}
        />
      </BottomSheet>

      <BriefingModal
        isOpen={showBriefingModal}
        onClose={() => setShowBriefingModal(false)}
        atrito={selectedAtrito}
        investigationContext={selectedAtrito ? getContextForAtrito(selectedAtrito.id) : undefined}
        selectedTemplateType={selectedTemplateType}
        onTemplateTypeChange={setSelectedTemplateType}
      />

      {selectedAtrito && (
        <InvestigationContextForm
          isOpen={showInvestigationForm}
          onClose={() => setShowInvestigationForm(false)}
          atrito={selectedAtrito}
          existingContext={getContextForAtrito(selectedAtrito.id)}
          onSave={(context) => {
            addInvestigationContext(context);
            showToast('Contexto salvo!', 'success');
          }}
        />
      )}

      {editingAtrito && (
        <EditAtritoModal
          atrito={editingAtrito}
          isOpen={!!editingAtrito}
          onClose={() => setEditingAtrito(null)}
          onSave={(updates) => {
            updateAtrito(editingAtrito.id, updates);
            setSelectedAtrito({ ...editingAtrito, ...updates });
            setEditingAtrito(null);
            showToast('Observação atualizada!');
          }}
          onDeleteContext={() => handleDeleteInvestigationContext(editingAtrito)}
          hasContext={!!getContextForAtrito(editingAtrito.id)}
        />
      )}
    </div>
  );
}

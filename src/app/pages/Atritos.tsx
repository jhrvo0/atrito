import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, X, Trash2, FileText, Download, Copy, PenLine, SlidersHorizontal, Sparkles, Pencil, Check } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import { Tag } from '../components/Tag';
import { Select } from '../components/Select';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { BottomSheet } from '../components/BottomSheet';
import { useApp } from '../context/AppContext';
import { Atrito, AtritoStatus, PromptTemplateType } from '../types';
import { generatePromptFromAtritoContext } from '../utils/promptGenerator';
import { PROMPT_TEMPLATES } from '../utils/promptTemplates';
import { exportAtritoToMarkdown, downloadMarkdown, copyToClipboard } from '../utils/markdown';
import { loadFilters, saveFilters, FiltersState } from '../utils/storage';
import { formatDate } from '../utils/date';
import {
  CONTEXT_OPTIONS,
  INTENSITY_OPTIONS,
  FREQUENCY_OPTIONS,
  AFFECTED_OPTIONS,
  isValidContext,
  isValidIntensity,
  isValidFrequency,
  isValidAffected,
  ATRITO_STATUS_OPTIONS,
} from '../constants';
import { showConfirm } from '../components/ConfirmDialog';
import { showToast } from '../components/Toast';
import { InvestigationContextForm } from '../components/InvestigationContextForm';
import { InvestigationSummary } from '../components/InvestigationSummary';

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
  const { atritos, opportunities, investigationContexts, deleteAtrito, deleteOpportunity, updateAtrito, addInvestigationContext, deleteInvestigationContext } = useApp();
  const [filters, setFilters] = useState<FiltersState>(() => loadFilters());
  const [selectedAtrito, setSelectedAtrito] = useState<Atrito | null>(null);
  const [showInvestigationForm, setShowInvestigationForm] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [editingAtrito, setEditingAtrito] = useState<Atrito | null>(null);

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

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  const hasActiveFilters =
    filters.searchTerm ||
    filters.contextFilter ||
    filters.intensityFilter ||
    filters.frequencyFilter ||
    filters.statusFilter;

  const activeFilterCount = [filters.contextFilter, filters.intensityFilter, filters.frequencyFilter, filters.statusFilter].filter(Boolean).length;

  const [showBriefingModal, setShowBriefingModal] = useState(false);
  const [selectedTemplateType, setSelectedTemplateType] = useState<PromptTemplateType>('pain-deepening');

  const handleOpenBriefingModal = (atrito: Atrito) => {
    setSelectedAtrito(atrito);
    setShowBriefingModal(true);
  };

  const generatedPrompt = useMemo(() => {
    if (!selectedAtrito) return '';
    const context = getContextForAtrito(selectedAtrito.id);
    return generatePromptFromAtritoContext({
      atrito: selectedAtrito,
      investigationContext: context,
      templateType: selectedTemplateType,
    });
  }, [selectedAtrito, selectedTemplateType, investigationContexts]);

  const handleCopyPrompt = async () => {
    if (!generatedPrompt) return;
    const success = await copyToClipboard(generatedPrompt);
    if (success) {
      showToast('Prompt copiado!');
    }
  };

  const handleExportPrompt = () => {
    if (!selectedAtrito || !generatedPrompt) return;
    const filename = `briefing-${selectedTemplateType}-${selectedAtrito.id}.md`;
    downloadMarkdown(generatedPrompt, filename);
    showToast('Briefing exportado!');
  };

  const handleChangeStatus = (atrito: Atrito, newStatus: AtritoStatus) => {
    updateAtrito(atrito.id, { status: newStatus });
    if (selectedAtrito?.id === atrito.id) {
      setSelectedAtrito({ ...atrito, status: newStatus });
    }
  };

  const handleExportAtrito = (atrito: Atrito) => {
    const context = getContextForAtrito(atrito.id);
    const markdown = exportAtritoToMarkdown(atrito, context);
    downloadMarkdown(markdown, `atrito-${atrito.id}.md`);
    showToast('Markdown baixado!');
  };

  const handleCopyAtrito = async (atrito: Atrito) => {
    const context = getContextForAtrito(atrito.id);
    const markdown = exportAtritoToMarkdown(atrito, context);
    const success = await copyToClipboard(markdown);
    if (success) {
      showToast('Copiado para a área de transferência!');
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
    showToast('Contexto aprofundado excluído.');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'observado':
        return 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300';
      case 'investigando':
        return 'bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300';
      case 'virou ideia':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
      case 'descartado':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const groups = groupByDate(filteredAtritos);

  const FilterContent = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Select
          value={filters.contextFilter}
          onChange={(e) => setFilters({ ...filters, contextFilter: e.target.value })}
          options={[{ value: '', label: 'Contexto' }, ...contextOptions]}
        />
        <Select
          value={filters.intensityFilter}
          onChange={(e) => setFilters({ ...filters, intensityFilter: e.target.value })}
          options={[{ value: '', label: 'Intensidade' }, ...INTENSITY_OPTIONS]}
        />
        <Select
          value={filters.frequencyFilter}
          onChange={(e) => setFilters({ ...filters, frequencyFilter: e.target.value })}
          options={[{ value: '', label: 'Frequência' }, ...FREQUENCY_OPTIONS]}
        />
        <Select
          value={filters.statusFilter}
          onChange={(e) => setFilters({ ...filters, statusFilter: e.target.value })}
          options={[{ value: '', label: 'Status' }, ...ATRITO_STATUS_OPTIONS]}
        />
      </div>
      {hasActiveFilters && (
        <Button variant="ghost" onClick={clearFilters} size="sm" className="w-full">
          <X size={14} />
          Limpar filtros
        </Button>
      )}
    </div>
  );

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
            <Button variant="ghost" onClick={clearFilters} size="sm" className="hidden md:flex">
              <X size={14} />
            </Button>
          )}
        </div>

        <div className="hidden md:flex flex-wrap gap-2">
          <div className="w-36">
            <Select
              value={filters.contextFilter}
              onChange={(e) => setFilters({ ...filters, contextFilter: e.target.value })}
              options={[{ value: '', label: 'Contexto' }, ...contextOptions]}
            />
          </div>
          <div className="w-32">
            <Select
              value={filters.intensityFilter}
              onChange={(e) => setFilters({ ...filters, intensityFilter: e.target.value })}
              options={[{ value: '', label: 'Intensidade' }, ...INTENSITY_OPTIONS]}
            />
          </div>
          <div className="w-36">
            <Select
              value={filters.frequencyFilter}
              onChange={(e) => setFilters({ ...filters, frequencyFilter: e.target.value })}
              options={[{ value: '', label: 'Frequência' }, ...FREQUENCY_OPTIONS]}
            />
          </div>
          <div className="w-32">
            <Select
              value={filters.statusFilter}
              onChange={(e) => setFilters({ ...filters, statusFilter: e.target.value })}
              options={[{ value: '', label: 'Status' }, ...ATRITO_STATUS_OPTIONS]}
            />
          </div>
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
              <Button variant="secondary" size="sm" onClick={clearFilters}>
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
                  <Card key={atrito.id} className="py-3 px-4" onClick={() => setSelectedAtrito(atrito)}>
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="text-sm font-medium leading-snug">{atrito.title}</h3>
                          <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0 hidden md:inline">{formatDate(atrito.createdAt)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{atrito.description}</p>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Tag variant="context">{atrito.context}</Tag>
                          <Tag variant="intensity">{atrito.intensity}</Tag>
                          <span className={`text-[11px] px-1.5 py-0.5 rounded font-medium ${getStatusColor(atrito.status)}`}>
                            {atrito.status}
                          </span>
                          {getContextForAtrito(atrito.id) && (
                            <Tag variant="investigated">aprofundado</Tag>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!selectedAtrito} onClose={() => setSelectedAtrito(null)} title="Observação">
        {selectedAtrito && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg mb-1">{selectedAtrito.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{selectedAtrito.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Contexto</p>
                <p className="text-sm font-medium capitalize">{selectedAtrito.context}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Intensidade</p>
                <p className="text-sm font-medium capitalize">{selectedAtrito.intensity}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Frequência</p>
                <p className="text-sm font-medium capitalize">{selectedAtrito.frequency}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Quem foi afetado</p>
                <p className="text-sm font-medium capitalize">{selectedAtrito.affected}</p>
              </div>
            </div>

            {selectedAtrito.improvisedSolution && (
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Solução improvisada</p>
                <p className="text-sm">{selectedAtrito.improvisedSolution}</p>
              </div>
            )}

            <div>
              <p className="text-xs text-muted-foreground mb-2">Status</p>
              <div className="flex flex-wrap gap-1.5">
                {ATRITO_STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleChangeStatus(selectedAtrito, opt.value)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-all min-h-[32px] active:scale-95 ${
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

            {(() => {
              const existingContext = getContextForAtrito(selectedAtrito.id);
              if (existingContext) {
                return (
                  <div className="border-t border-border/50 pt-4">
                    <InvestigationSummary
                      context={existingContext}
                      onEdit={() => setShowInvestigationForm(true)}
                    />
                  </div>
                );
              }
              return null;
            })()}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-border/50 gap-3">
              <div className="flex gap-1.5 flex-wrap">
                <Button variant="secondary" size="sm" onClick={() => setEditingAtrito(selectedAtrito)}>
                  <Pencil size={14} />
                  Editar
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setShowInvestigationForm(true)}>
                  <PenLine size={14} />
                  Aprofundar
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleCopyAtrito(selectedAtrito)}>
                  <Copy size={14} />
                  Copiar
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleExportAtrito(selectedAtrito)}>
                  <Download size={14} />
                  Exportar
                </Button>
              </div>
              <div className="flex flex-col items-end gap-1">
                {!getContextForAtrito(selectedAtrito.id) && selectedAtrito.status !== 'virou ideia' && (
                  <p className="text-[11px] text-muted-foreground text-right max-w-[220px] hidden md:block">
                    Aprofundar o contexto antes de gerar o briefing tende a tornar o prompt mais preciso.
                  </p>
                )}
                <Button
                  size="sm"
                  onClick={() => handleOpenBriefingModal(selectedAtrito)}
                >
                  <Sparkles size={14} />
                  Gerar briefing para IA
                </Button>
              </div>
            </div>

            <div className="pt-3 border-t border-border/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteAtrito(selectedAtrito)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full justify-center"
              >
                <Trash2 size={14} />
                Excluir observação
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <BottomSheet isOpen={showFilterSheet} onClose={() => setShowFilterSheet(false)} title="Filtros">
        <FilterContent />
      </BottomSheet>

      <Modal isOpen={showBriefingModal} onClose={() => setShowBriefingModal(false)} title="Briefing para IA">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            O Atrito não usa IA internamente. Ele apenas organiza suas informações em um prompt para você copiar e usar onde quiser.
          </p>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Tipo de análise</label>
            <div className="space-y-3">
              <div>
                <p className="text-[11px] text-muted-foreground/60 mb-1.5">Principais</p>
                <div className="grid grid-cols-1 gap-1.5">
                  {PROMPT_TEMPLATES.filter((t) => t.category === 'principal').map((t) => (
                    <button
                      key={t.type}
                      onClick={() => setSelectedTemplateType(t.type)}
                      className={`text-left p-2 rounded-md text-xs transition-all ${
                        selectedTemplateType === t.type
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      <span className="font-medium">{t.label}</span>
                      <p className="text-[10px] opacity-70 mt-0.5">{t.description}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground/60 mb-1.5">Avançados</p>
                <div className="grid grid-cols-1 gap-1.5">
                  {PROMPT_TEMPLATES.filter((t) => t.category === 'avançado').map((t) => (
                    <button
                      key={t.type}
                      onClick={() => setSelectedTemplateType(t.type)}
                      className={`text-left p-2 rounded-md text-xs transition-all ${
                        selectedTemplateType === t.type
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      <span className="font-medium">{t.label}</span>
                      <p className="text-[10px] opacity-70 mt-0.5">{t.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 max-h-[40vh] overflow-y-auto">
            <pre className="text-xs whitespace-pre-wrap font-mono text-foreground/80 leading-relaxed">
              {generatedPrompt}
            </pre>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowBriefingModal(false)}>
              Fechar
            </Button>
            <Button variant="secondary" size="sm" onClick={handleExportPrompt}>
              <Download size={14} />
              Exportar Markdown
            </Button>
            <Button size="sm" onClick={handleCopyPrompt}>
              <Copy size={14} />
              Copiar prompt
            </Button>
          </div>
        </div>
      </Modal>

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

type EditFormData = {
  title: string;
  description: string;
  context: string;
  intensity: string;
  frequency: string;
  affected: string;
  improvisedSolution: string;
};

function ChipSelect({ options, value, onChange, label }: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  label?: string;
}) {
  return (
    <div>
      {label && <label className="block text-xs text-muted-foreground mb-2 font-medium">{label}</label>}
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 md:py-1.5 rounded-full text-xs font-medium transition-all duration-150 border min-h-[36px] md:min-h-0 active:scale-95 ${
              value === opt.value
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-muted-foreground border-border/60 hover:border-border hover:text-foreground'
            }`}
          >
            {value === opt.value && <Check size={12} strokeWidth={2.5} />}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function EditAtritoModal({
  atrito,
  isOpen,
  onClose,
  onSave,
  onDeleteContext,
  hasContext,
}: {
  atrito: Atrito;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Atrito>) => void;
  onDeleteContext: () => void;
  hasContext: boolean;
}) {
  const [formData, setFormData] = useState<EditFormData>({
    title: atrito.title,
    description: atrito.description || '',
    context: atrito.context,
    intensity: atrito.intensity,
    frequency: atrito.frequency,
    affected: atrito.affected,
    improvisedSolution: atrito.improvisedSolution || '',
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];
    if (!formData.title.trim()) newErrors.push('Título');
    if (!formData.context) newErrors.push('Contexto');
    if (!formData.intensity) newErrors.push('Intensidade');
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors([]);
    onSave({
      title: formData.title.trim(),
      description: formData.description.trim(),
      context: isValidContext(formData.context) ? formData.context : 'outro',
      intensity: isValidIntensity(formData.intensity) ? formData.intensity : 'média',
      frequency: isValidFrequency(formData.frequency) ? formData.frequency : 'às vezes',
      affected: isValidAffected(formData.affected) ? formData.affected : 'eu',
      improvisedSolution: formData.improvisedSolution.trim() || undefined,
    });
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Editar observação">
      <form onSubmit={handleSubmit} className="space-y-5">
        {errors.length > 0 && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive">
            Campos obrigatórios: {errors.join(', ')}
          </div>
        )}

        <div>
          <label className="block text-xs text-muted-foreground mb-2 font-medium">
            Título <span className="text-destructive">*</span>
          </label>
          <Input
            placeholder="O que aconteceu?"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="min-h-[44px]"
          />
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-2 font-medium">Descrição</label>
          <Textarea
            placeholder="Descreva o que aconteceu..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="min-h-[44px]"
          />
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-2 font-medium">
            Contexto <span className="text-destructive">*</span>
          </label>
          <ChipSelect
            options={CONTEXT_OPTIONS}
            value={formData.context}
            onChange={(v) => setFormData({ ...formData, context: v })}
          />
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-2 font-medium">
            Intensidade <span className="text-destructive">*</span>
          </label>
          <ChipSelect
            options={INTENSITY_OPTIONS}
            value={formData.intensity}
            onChange={(v) => setFormData({ ...formData, intensity: v })}
          />
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-2 font-medium">Frequência</label>
          <ChipSelect
            options={FREQUENCY_OPTIONS}
            value={formData.frequency}
            onChange={(v) => setFormData({ ...formData, frequency: v })}
          />
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-2 font-medium">Quem foi afetado?</label>
          <ChipSelect
            options={AFFECTED_OPTIONS}
            value={formData.affected}
            onChange={(v) => setFormData({ ...formData, affected: v })}
          />
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-2 font-medium">Solução improvisada</label>
          <Textarea
            placeholder="Como você contornou esse problema?"
            value={formData.improvisedSolution}
            onChange={(e) => setFormData({ ...formData, improvisedSolution: e.target.value })}
            rows={2}
            className="min-h-[44px]"
          />
        </div>

        {hasContext && (
          <div className="pt-2 border-t border-border/50">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onDeleteContext}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full justify-center"
            >
              <Trash2 size={14} />
              Excluir contexto aprofundado
            </Button>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1 min-h-[48px]">
            Cancelar
          </Button>
          <Button type="submit" className="flex-1 min-h-[48px]">
            Salvar
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
}

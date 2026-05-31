import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, Trash2, FileCode, Download, Copy, FileDown, Search, X, SlidersHorizontal } from 'lucide-react';
import { Card } from '../components/Card';
import { Modal } from '../components/Modal';
import { BottomSheet } from '../components/BottomSheet';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { EmptyState } from '../components/EmptyState';
import { useApp } from '../context/AppContext';
import { Opportunity, Priority, PromptTemplateType } from '../types';
import { generatePromptFromContext } from '../utils/promptGenerator';
import { PROMPT_TEMPLATES } from '../utils/promptTemplates';
import {
  exportOpportunityToMarkdown,
  exportAllOpportunitiesToMarkdown,
  downloadMarkdown,
  copyToClipboard,
} from '../utils/markdown';
import { formatDate } from '../utils/date';
import {
  OPPORTUNITY_STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  isValidOpportunityStatus,
} from '../constants';
import { loadOpportunityFilters, saveOpportunityFilters, OpportunityFiltersState } from '../utils/storage';
import { showConfirm } from '../components/ConfirmDialog';
import { showToast } from '../components/Toast';

const defaultFilters: OpportunityFiltersState = {
  searchTerm: '',
  statusFilter: '',
  priorityFilter: '',
};

export function Ideias() {
  const navigate = useNavigate();
  const { opportunities, atritos, investigationContexts, deleteOpportunity, updateOpportunity } = useApp();
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [filters, setFilters] = useState<OpportunityFiltersState>(() => loadOpportunityFilters());
  const [promptModalOpportunity, setPromptModalOpportunity] = useState<Opportunity | null>(null);
  const [selectedTemplateType, setSelectedTemplateType] = useState<PromptTemplateType>('mvp-definition');
  const [showFilterSheet, setShowFilterSheet] = useState(false);

  useEffect(() => {
    saveOpportunityFilters(filters);
  }, [filters]);

  const filteredOpportunities = opportunities.filter((opp) => {
    const term = filters.searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      opp.title.toLowerCase().includes(term) ||
      opp.originalProblem.toLowerCase().includes(term) ||
      opp.hypothesis.toLowerCase().includes(term);
    const matchesStatus = !filters.statusFilter || opp.status === filters.statusFilter;
    const matchesPriority = !filters.priorityFilter || opp.priority === filters.priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  const hasActiveFilters = filters.searchTerm || filters.statusFilter || filters.priorityFilter;
  const activeFilterCount = [filters.statusFilter, filters.priorityFilter].filter(Boolean).length;

  const getPriorityBorder = (priority: string) => {
    switch (priority) {
      case 'alta':
        return 'border-l-orange-500';
      case 'média':
        return 'border-l-amber-400';
      case 'baixa':
        return 'border-l-stone-300 dark:border-l-stone-600';
      default:
        return 'border-l-stone-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta':
        return 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300';
      case 'média':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
      case 'baixa':
        return 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ideia':
        return 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300';
      case 'validando':
        return 'bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300';
      case 'protótipo':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300';
      case 'em desenvolvimento':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
      case 'arquivada':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleShowPrompt = (opportunity: Opportunity) => {
    setPromptModalOpportunity(opportunity);
    setSelectedTemplateType('mvp-definition');
  };

  const generatedPrompt = useMemo(() => {
    if (!promptModalOpportunity) return '';

    const linkedAtrito = promptModalOpportunity.atritos.length > 0
      ? atritos.find((a) => promptModalOpportunity.atritos.includes(a.id))
      : undefined;

    const investigationCtx = linkedAtrito
      ? investigationContexts.find((c) => c.atritoId === linkedAtrito.id)
      : undefined;

    return generatePromptFromContext({
      opportunity: promptModalOpportunity,
      atrito: linkedAtrito,
      investigationContext: investigationCtx,
      templateType: selectedTemplateType,
    });
  }, [promptModalOpportunity, selectedTemplateType, atritos, investigationContexts]);

  const handleCopyPrompt = async () => {
    if (!generatedPrompt) return;
    const success = await copyToClipboard(generatedPrompt);
    if (success) {
      showToast('Prompt copiado!');
    }
  };

  const handleExportPrompt = () => {
    if (!promptModalOpportunity || !generatedPrompt) return;
    const filename = `prompt-${selectedTemplateType}-${promptModalOpportunity.id}.md`;
    downloadMarkdown(generatedPrompt, filename);
    showToast('Prompt exportado!');
  };

  const handleExportOpportunity = (opportunity: Opportunity) => {
    const markdown = exportOpportunityToMarkdown(opportunity, atritos, investigationContexts);
    downloadMarkdown(markdown, `ideia-${opportunity.id}.md`);
    showToast('Markdown baixado!');
  };

  const handleExportAll = () => {
    const markdown = exportAllOpportunitiesToMarkdown(filteredOpportunities, atritos, investigationContexts);
    downloadMarkdown(markdown, 'todas-ideias.md');
    showToast('Arquivo baixado!');
  };

  const handleCopyOpportunity = async (opportunity: Opportunity) => {
    const markdown = exportOpportunityToMarkdown(opportunity, atritos, investigationContexts);
    const success = await copyToClipboard(markdown);
    if (success) {
      showToast('Copiado!');
    }
  };

  const handleChangePriority = (opportunity: Opportunity, newPriority: Priority) => {
    updateOpportunity(opportunity.id, { priority: newPriority });
    if (selectedOpportunity?.id === opportunity.id) {
      setSelectedOpportunity({ ...opportunity, priority: newPriority });
    }
  };

  const handleDeleteOpportunity = async (opportunity: Opportunity) => {
    const confirmed = await showConfirm({
        title: 'Excluir ideia',
        message: `Tem certeza que deseja excluir "${opportunity.title}"?`,
      confirmLabel: 'Excluir',
    });
    if (confirmed) {
      deleteOpportunity(opportunity.id);
      setSelectedOpportunity(null);
      showToast('Ideia excluída.');
    }
  };

  const FilterContent = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Select
          value={filters.statusFilter}
          onChange={(e) => setFilters({ ...filters, statusFilter: e.target.value })}
          options={[{ value: '', label: 'Status' }, ...OPPORTUNITY_STATUS_OPTIONS]}
        />
        <Select
          value={filters.priorityFilter}
          onChange={(e) => setFilters({ ...filters, priorityFilter: e.target.value })}
          options={[{ value: '', label: 'Prioridade' }, ...PRIORITY_OPTIONS]}
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
          <h1 className="text-2xl mb-0.5">Ideias</h1>
          <p className="text-xs text-muted-foreground hidden md:block">Desdobramentos úteis a partir das suas observações</p>
        </div>
        {filteredOpportunities.length > 0 && (
          <Button variant="secondary" size="sm" onClick={handleExportAll}>
            <FileDown size={14} />
            <span className="hidden md:inline">Exportar</span>
          </Button>
        )}
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
              value={filters.statusFilter}
              onChange={(e) => setFilters({ ...filters, statusFilter: e.target.value })}
              options={[{ value: '', label: 'Status' }, ...OPPORTUNITY_STATUS_OPTIONS]}
            />
          </div>
          <div className="w-32">
            <Select
              value={filters.priorityFilter}
              onChange={(e) => setFilters({ ...filters, priorityFilter: e.target.value })}
              options={[{ value: '', label: 'Prioridade' }, ...PRIORITY_OPTIONS]}
            />
          </div>
        </div>
      </div>

      {filteredOpportunities.length === 0 ? (
        <EmptyState
          icon={<Lightbulb size={36} />}
          title={hasActiveFilters ? 'Nenhum resultado' : 'Nenhuma ideia ainda'}
          description={
            hasActiveFilters
              ? 'Ajuste os filtros para ver mais resultados.'
              : 'Ideias surgem a partir de atritos registrados. Transforme uma observação em um desdobramento útil.'
          }
          action={
            hasActiveFilters ? (
              <Button variant="secondary" size="sm" onClick={clearFilters}>
                <X size={14} />
                Limpar filtros
              </Button>
            ) : (
              <Button size="sm" onClick={() => navigate('/atritos')}>
                Ver observações
              </Button>
            )
          }
        />
      ) : (
        <div className="space-y-2">
          {filteredOpportunities.map((opportunity) => (
            <Card key={opportunity.id} className={`py-3 px-4 border-l-2 ${getPriorityBorder(opportunity.priority)}`} onClick={() => setSelectedOpportunity(opportunity)}>
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-medium leading-snug">{opportunity.title}</h3>
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0 hidden md:inline">{formatDate(opportunity.createdAt)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1 mb-1">{opportunity.originalProblem}</p>
                  {opportunity.hypothesis && (
                    <p className="text-xs text-foreground/80 line-clamp-1 mb-2">
                      <span className="text-muted-foreground">Hipótese:</span> {opportunity.hypothesis}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`text-[11px] px-1.5 py-0.5 rounded font-medium ${getPriorityColor(opportunity.priority)}`}>
                      {opportunity.priority}
                    </span>
                    <span className={`text-[11px] px-1.5 py-0.5 rounded font-medium ${getStatusColor(opportunity.status)}`}>
                      {opportunity.status}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
        title="Ideia"
      >
        {selectedOpportunity && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg mb-1">{selectedOpportunity.title}</h3>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Problema observado</p>
              <p className="text-sm">{selectedOpportunity.originalProblem}</p>
            </div>

            {selectedOpportunity.hypothesis && (
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Hipótese de solução</p>
                <p className="text-sm">{selectedOpportunity.hypothesis}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Público</p>
                <p className="text-sm font-medium">{selectedOpportunity.targetAudience}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Prioridade</p>
                <div className="flex flex-wrap gap-1.5">
                  {PRIORITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleChangePriority(selectedOpportunity, opt.value)}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-all min-h-[32px] active:scale-95 ${
                        selectedOpportunity.priority === opt.value
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {selectedOpportunity.whyItMatters && (
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Por que isso importa</p>
                <p className="text-sm">{selectedOpportunity.whyItMatters}</p>
              </div>
            )}

            {selectedOpportunity.suggestedMVP && (
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">MVP sugerido</p>
                <p className="text-sm">{selectedOpportunity.suggestedMVP}</p>
              </div>
            )}

            {selectedOpportunity.whatNotToBuild && (
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">O que NÃO construir agora</p>
                <p className="text-sm">{selectedOpportunity.whatNotToBuild}</p>
              </div>
            )}

            {selectedOpportunity.validationQuestion && (
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Pergunta de validação</p>
                <p className="text-sm">{selectedOpportunity.validationQuestion}</p>
              </div>
            )}

            <div>
              <p className="text-xs text-muted-foreground mb-2">Status</p>
              <Select
                value={selectedOpportunity.status}
                onChange={(e) => {
                  if (!isValidOpportunityStatus(e.target.value)) return;
                  const val = e.target.value;
                  updateOpportunity(selectedOpportunity.id, { status: val });
                  setSelectedOpportunity({ ...selectedOpportunity, status: val });
                }}
                options={OPPORTUNITY_STATUS_OPTIONS}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-border/50 gap-3">
              <div className="flex gap-1.5 flex-wrap">
                <Button variant="secondary" size="sm" onClick={() => handleCopyOpportunity(selectedOpportunity)}>
                  <Copy size={14} />
                  Copiar
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleExportOpportunity(selectedOpportunity)}>
                  <Download size={14} />
                  Exportar
                </Button>
              </div>
              <Button size="sm" onClick={() => handleShowPrompt(selectedOpportunity)}>
                <FileCode size={14} />
                Gerar prompt
              </Button>
            </div>

            <div className="pt-3 border-t border-border/50">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteOpportunity(selectedOpportunity)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full justify-center"
              >
                <Trash2 size={14} />
                Excluir ideia
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!promptModalOpportunity}
        onClose={() => setPromptModalOpportunity(null)}
        title="Prompt para IA"
      >
        {promptModalOpportunity && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Escolha o tipo de análise e copie o prompt para seu assistente de IA.
            </p>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Tipo de prompt</label>
              <Select
                value={selectedTemplateType}
                onChange={(e) => {
                  const valid = PROMPT_TEMPLATES.find((t) => t.type === e.target.value);
                  if (valid) setSelectedTemplateType(valid.type);
                }}
                options={PROMPT_TEMPLATES.map((t) => ({
                  value: t.type,
                  label: t.label,
                }))}
              />
              <p className="text-[11px] text-muted-foreground/60 mt-1">
                {PROMPT_TEMPLATES.find((t) => t.type === selectedTemplateType)?.description}
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-3 max-h-[40vh] overflow-y-auto">
              <pre className="text-xs whitespace-pre-wrap font-mono text-foreground/80 leading-relaxed">
                {generatedPrompt}
              </pre>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setPromptModalOpportunity(null)}>
                Fechar
              </Button>
              <Button variant="secondary" size="sm" onClick={handleExportPrompt}>
                <Download size={14} />
                Exportar
              </Button>
              <Button size="sm" onClick={handleCopyPrompt}>
                <Copy size={14} />
                Copiar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <BottomSheet isOpen={showFilterSheet} onClose={() => setShowFilterSheet(false)} title="Filtros">
        <FilterContent />
      </BottomSheet>
    </div>
  );
}

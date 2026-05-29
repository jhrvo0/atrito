import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, Eye, Trash2, FileCode, Download, Copy, FileDown, Search, X } from 'lucide-react';
import { Card } from '../components/Card';
import { Tag } from '../components/Tag';
import { Modal } from '../components/Modal';
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

export function Oportunidades() {
  const navigate = useNavigate();
  const { opportunities, atritos, investigationContexts, deleteOpportunity, updateOpportunity } = useApp();
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [filters, setFilters] = useState<OpportunityFiltersState>(() => loadOpportunityFilters());
  const [promptModalOpportunity, setPromptModalOpportunity] = useState<Opportunity | null>(null);
  const [selectedTemplateType, setSelectedTemplateType] = useState<PromptTemplateType>('mvp-definition');

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta':
        return 'bg-red-50 text-red-700';
      case 'média':
        return 'bg-yellow-50 text-yellow-700';
      case 'baixa':
        return 'bg-green-50 text-green-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ideia':
        return 'bg-blue-50 text-blue-700';
      case 'validando':
        return 'bg-purple-50 text-purple-700';
      case 'protótipo':
        return 'bg-indigo-50 text-indigo-700';
      case 'em desenvolvimento':
        return 'bg-green-50 text-green-700';
      case 'arquivada':
        return 'bg-gray-50 text-gray-700';
      default:
        return 'bg-gray-50 text-gray-700';
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
      showToast('Prompt copiado para a área de transferência!');
    }
  };

  const handleExportPrompt = () => {
    if (!promptModalOpportunity || !generatedPrompt) return;
    const filename = `prompt-${selectedTemplateType}-${promptModalOpportunity.id}.md`;
    downloadMarkdown(generatedPrompt, filename);
    showToast('Prompt exportado como Markdown!');
  };

  const handleExportOpportunity = (opportunity: Opportunity) => {
    const markdown = exportOpportunityToMarkdown(opportunity, atritos, investigationContexts);
    downloadMarkdown(markdown, `oportunidade-${opportunity.id}.md`);
    showToast('Arquivo Markdown baixado!');
  };

  const handleExportAll = () => {
    const markdown = exportAllOpportunitiesToMarkdown(filteredOpportunities, atritos, investigationContexts);
    downloadMarkdown(markdown, 'todas-oportunidades.md');
    showToast('Arquivo Markdown baixado!');
  };

  const handleCopyOpportunity = async (opportunity: Opportunity) => {
    const markdown = exportOpportunityToMarkdown(opportunity, atritos, investigationContexts);
    const success = await copyToClipboard(markdown);
    if (success) {
      showToast('Oportunidade copiada para a área de transferência!');
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
      title: 'Excluir oportunidade',
      message: `Tem certeza que deseja excluir "${opportunity.title}"? Esta ação não pode ser desfeita.`,
      confirmLabel: 'Excluir',
    });
    if (confirmed) {
      deleteOpportunity(opportunity.id);
      setSelectedOpportunity(null);
      showToast('Oportunidade excluída.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl mb-1 md:mb-2">Oportunidades</h1>
          <p className="text-sm md:text-base text-muted-foreground">Ideias e hipóteses geradas a partir dos atritos observados</p>
        </div>
        {filteredOpportunities.length > 0 && (
          <Button variant="secondary" onClick={handleExportAll} className="w-full sm:w-auto">
            <FileDown size={18} />
            Exportar todas
          </Button>
        )}
      </div>

      <div className="mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Buscar oportunidades..."
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            value={filters.statusFilter}
            onChange={(e) => setFilters({ ...filters, statusFilter: e.target.value })}
            placeholder="Filtrar por status"
            options={[{ value: '', label: 'Todos os status' }, ...OPPORTUNITY_STATUS_OPTIONS]}
          />
          <Select
            value={filters.priorityFilter}
            onChange={(e) => setFilters({ ...filters, priorityFilter: e.target.value })}
            placeholder="Filtrar por prioridade"
            options={[{ value: '', label: 'Todas prioridades' }, ...PRIORITY_OPTIONS]}
          />
        </div>
      </div>

      {filteredOpportunities.length === 0 ? (
        <EmptyState
          icon={<Lightbulb size={48} />}
          title={hasActiveFilters ? 'Nenhuma oportunidade encontrada' : 'Nenhuma oportunidade ainda'}
          description={
            hasActiveFilters
              ? 'Tente ajustar os filtros ou limpar a busca para ver mais resultados'
              : 'Transforme seus atritos em oportunidades de produto clicando no botão "Transformar em oportunidade" na página de atritos'
          }
          action={
            hasActiveFilters ? (
              <Button variant="secondary" onClick={clearFilters}>
                <X size={18} />
                Limpar filtros
              </Button>
            ) : (
              <Button onClick={() => navigate('/atritos')}>Ver atritos</Button>
            )
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredOpportunities.map((opportunity) => (
            <Card key={opportunity.id} className="p-4 md:p-5">
              <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium mb-2 text-sm md:text-base">{opportunity.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-3 line-clamp-2">
                    {opportunity.originalProblem}
                  </p>
                  {opportunity.hypothesis && (
                    <p className="text-xs md:text-sm text-foreground mb-3 line-clamp-1">
                      <span className="text-muted-foreground">Hipótese:</span> {opportunity.hypothesis}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(opportunity.priority)}`}>
                      {opportunity.priority}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(opportunity.status)}`}>
                      {opportunity.status}
                    </span>
                    <Tag variant="default">{opportunity.targetAudience}</Tag>
                  </div>
                </div>
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(opportunity.createdAt)}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedOpportunity(opportunity)}
                      className="text-muted-foreground hover:text-foreground transition-colors p-1"
                      title="Ver detalhes"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleShowPrompt(opportunity)}
                      className="text-muted-foreground hover:text-primary transition-colors p-1"
                      title="Gerar prompt"
                    >
                      <FileCode size={18} />
                    </button>
                    <button
                      onClick={() => handleExportOpportunity(opportunity)}
                      className="text-muted-foreground hover:text-foreground transition-colors p-1"
                      title="Exportar Markdown"
                    >
                      <Download size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteOpportunity(opportunity)}
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

      {/* Modal de detalhes */}
      <Modal
        isOpen={!!selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
        title="Detalhes da Oportunidade"
      >
        {selectedOpportunity && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl mb-2">{selectedOpportunity.title}</h3>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Problema Observado</p>
              <p className="text-sm">{selectedOpportunity.originalProblem}</p>
            </div>

            {selectedOpportunity.hypothesis && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Hipótese de Solução</p>
                <p className="text-sm">{selectedOpportunity.hypothesis}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Público</p>
                <p className="text-sm font-medium">{selectedOpportunity.targetAudience}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Prioridade</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {PRIORITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleChangePriority(selectedOpportunity, opt.value)}
                      className={`px-3 py-1 rounded text-sm transition-all ${
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
                <p className="text-sm text-muted-foreground mb-1">Por que isso importa</p>
                <p className="text-sm">{selectedOpportunity.whyItMatters}</p>
              </div>
            )}

            {selectedOpportunity.suggestedMVP && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">MVP Sugerido</p>
                <p className="text-sm">{selectedOpportunity.suggestedMVP}</p>
              </div>
            )}

            {selectedOpportunity.whatNotToBuild && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">O que NÃO construir agora</p>
                <p className="text-sm">{selectedOpportunity.whatNotToBuild}</p>
              </div>
            )}

            {selectedOpportunity.validationQuestion && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pergunta de Validação</p>
                <p className="text-sm">{selectedOpportunity.validationQuestion}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-muted-foreground mb-2">Status</p>
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

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-border gap-3">
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => handleCopyOpportunity(selectedOpportunity)}>
                  <Copy size={18} />
                  Copiar
                </Button>
                <Button variant="secondary" onClick={() => handleExportOpportunity(selectedOpportunity)}>
                  <Download size={18} />
                  Exportar .md
                </Button>
              </div>
              <Button onClick={() => handleShowPrompt(selectedOpportunity)}>
                <FileCode size={18} />
                Gerar prompt
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de prompt */}
      <Modal
        isOpen={!!promptModalOpportunity}
        onClose={() => setPromptModalOpportunity(null)}
        title="Gerar Prompt para IA"
      >
        {promptModalOpportunity && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Escolha o tipo de análise e copie o prompt gerado para o seu assistente de IA.
            </p>

            <div>
              <label className="text-sm font-medium mb-2 block">Tipo de prompt</label>
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
              <p className="text-xs text-muted-foreground mt-1">
                {PROMPT_TEMPLATES.find((t) => t.type === selectedTemplateType)?.description}
              </p>
            </div>

            <div className="bg-muted rounded-lg p-4 max-h-[50vh] overflow-y-auto">
              <pre className="text-xs whitespace-pre-wrap font-mono text-foreground">
                {generatedPrompt}
              </pre>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setPromptModalOpportunity(null)}>
                Fechar
              </Button>
              <Button variant="secondary" onClick={handleExportPrompt}>
                <Download size={18} />
                Exportar .md
              </Button>
              <Button onClick={handleCopyPrompt}>
                <Copy size={18} />
                Copiar prompt
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

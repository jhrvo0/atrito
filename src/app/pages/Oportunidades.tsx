import React, { useState } from 'react';
import { Lightbulb, Eye, Trash2, FileCode, Download, Copy, FileDown } from 'lucide-react';
import { Card } from '../components/Card';
import { Tag } from '../components/Tag';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { Select } from '../components/Select';
import { EmptyState } from '../components/EmptyState';
import { useApp } from '../context/AppContext';
import { Opportunity, Priority } from '../types';
import { generatePrompt } from '../utils/promptGenerator';
import {
  exportOpportunityToMarkdown,
  exportAllOpportunitiesToMarkdown,
  downloadMarkdown,
  copyToClipboard,
} from '../utils/markdown';

interface OportunidadesProps {
  onNavigate: (page: string) => void;
}

export function Oportunidades({ onNavigate }: OportunidadesProps) {
  const { opportunities, deleteOpportunity, updateOpportunity } = useApp();
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const filteredOpportunities = opportunities.filter((opp) => {
    return !statusFilter || opp.status === statusFilter;
  });

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

  const handleCopyPrompt = async (opportunity: Opportunity) => {
    const prompt = generatePrompt(opportunity);
    const success = await copyToClipboard(prompt);
    if (success) {
      alert('Prompt copiado para área de transferência!');
    }
  };

  const handleExportOpportunity = (opportunity: Opportunity) => {
    const markdown = exportOpportunityToMarkdown(opportunity);
    downloadMarkdown(markdown, `oportunidade-${opportunity.id}.md`);
  };

  const handleExportAll = () => {
    const markdown = exportAllOpportunitiesToMarkdown(filteredOpportunities);
    downloadMarkdown(markdown, 'todas-oportunidades.md');
  };

  const handleCopyOpportunity = async (opportunity: Opportunity) => {
    const markdown = exportOpportunityToMarkdown(opportunity);
    const success = await copyToClipboard(markdown);
    if (success) {
      alert('Oportunidade copiada para área de transferência!');
    }
  };

  const handleChangePriority = (opportunity: Opportunity, newPriority: Priority) => {
    updateOpportunity(opportunity.id, { priority: newPriority });
    if (selectedOpportunity?.id === opportunity.id) {
      setSelectedOpportunity({ ...opportunity, priority: newPriority });
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

      <div className="mb-6">
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          placeholder="Filtrar por status"
          options={[
            { value: '', label: 'Todos os status' },
            { value: 'ideia', label: 'Ideia' },
            { value: 'validando', label: 'Validando' },
            { value: 'protótipo', label: 'Protótipo' },
            { value: 'em desenvolvimento', label: 'Em desenvolvimento' },
            { value: 'arquivada', label: 'Arquivada' }
          ]}
        />
      </div>

      {filteredOpportunities.length === 0 ? (
        <EmptyState
          icon={<Lightbulb size={48} />}
          title="Nenhuma oportunidade ainda"
          description="Transforme seus atritos em oportunidades de produto clicando no botão 'Transformar em oportunidade' na página de atritos"
          action={<Button onClick={() => onNavigate('atritos')}>Ver atritos</Button>}
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
                    {opportunity.createdAt}
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
                      onClick={() => handleCopyPrompt(opportunity)}
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
                      onClick={() => {
                        if (confirm('Tem certeza que deseja excluir esta oportunidade?')) {
                          deleteOpportunity(opportunity.id);
                        }
                      }}
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

      <Modal
        isOpen={!!selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
        title="Detalhes da Oportunidade"
      >
        {selectedOpportunity && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-display mb-2">{selectedOpportunity.title}</h3>
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
                  {(['baixa', 'média', 'alta'] as Priority[]).map((priority) => (
                    <button
                      key={priority}
                      onClick={() => handleChangePriority(selectedOpportunity, priority)}
                      className={`px-3 py-1 rounded text-sm transition-all ${
                        selectedOpportunity.priority === priority
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {priority}
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
                  updateOpportunity(selectedOpportunity.id, {
                    status: e.target.value as any
                  });
                  setSelectedOpportunity({ ...selectedOpportunity, status: e.target.value as any });
                }}
                options={[
                  { value: 'ideia', label: 'Ideia' },
                  { value: 'validando', label: 'Validando' },
                  { value: 'protótipo', label: 'Protótipo' },
                  { value: 'em desenvolvimento', label: 'Em desenvolvimento' },
                  { value: 'arquivada', label: 'Arquivada' }
                ]}
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
              <Button onClick={() => handleCopyPrompt(selectedOpportunity)}>
                <FileCode size={18} />
                Gerar prompt
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

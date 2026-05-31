import { useState } from 'react';
import { Trash2, FileText, Download, Copy, PenLine, Sparkles, Pencil, Lightbulb } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Atrito, AtritoStatus, AtritoInvestigationContext, Opportunity } from '../types';
import { InvestigationSummary } from './InvestigationSummary';
import { exportAtritoToMarkdown, downloadMarkdown, copyToClipboard } from '../utils/markdown';
import { generateOpportunityFromAtrito } from '../utils/opportunityGenerator';
import { ATRITO_STATUS_OPTIONS } from '../constants';
import { showConfirm } from './ConfirmDialog';
import { showToast } from './Toast';

interface AtritoDetailsModalProps {
  atrito: Atrito | null;
  isOpen: boolean;
  onClose: () => void;
  investigationContext: AtritoInvestigationContext | undefined;
  opportunities: Opportunity[];
  onChangeStatus: (atrito: Atrito, newStatus: AtritoStatus) => void;
  onEdit: () => void;
  onInvestigate: () => void;
  onOpenBriefing: () => void;
  onDelete: () => void;
  onAddOpportunity: (opportunity: Opportunity) => void;
  onUpdateAtrito: (id: string, updates: Partial<Atrito>) => void;
}

export function AtritoDetailsModal({
  atrito,
  isOpen,
  onClose,
  investigationContext,
  opportunities,
  onChangeStatus,
  onEdit,
  onInvestigate,
  onOpenBriefing,
  onDelete,
  onAddOpportunity,
  onUpdateAtrito,
}: AtritoDetailsModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  if (!atrito) return null;

  const hasExistingOpportunity = opportunities.some((o) => o.atritos.includes(atrito.id));

  const handleExportAtrito = () => {
    const markdown = exportAtritoToMarkdown(atrito, investigationContext);
    downloadMarkdown(markdown, `atrito-${atrito.id}.md`);
    showToast('Markdown baixado!');
  };

  const handleCopyAtrito = async () => {
    const markdown = exportAtritoToMarkdown(atrito, investigationContext);
    const success = await copyToClipboard(markdown);
    if (success) {
      showToast('Copiado para a área de transferência!');
    }
  };

  const handleTransformToOpportunity = async () => {
    if (hasExistingOpportunity) {
      showToast('Este atrito já possui uma ideia vinculada.');
      return;
    }

    const confirmed = await showConfirm({
      title: 'Transformar em ideia',
      message: 'Gerar uma ideia automaticamente a partir desta observação?',
      confirmLabel: 'Gerar ideia',
      cancelLabel: 'Cancelar',
    });

    if (!confirmed) return;

    setIsGenerating(true);
    try {
      const opportunity = generateOpportunityFromAtrito(atrito, investigationContext);
      onAddOpportunity(opportunity);
      onUpdateAtrito(atrito.id, { status: 'virou ideia' });
      showToast('Ideia gerada com sucesso!');
    } catch {
      showToast('Erro ao gerar ideia.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Observação">
      <div className="space-y-5">
        <div>
          <h3 className="text-lg mb-1">{atrito.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{atrito.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Contexto</p>
            <p className="text-sm font-medium capitalize">{atrito.context}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Intensidade</p>
            <p className="text-sm font-medium capitalize">{atrito.intensity}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Frequência</p>
            <p className="text-sm font-medium capitalize">{atrito.frequency}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Quem foi afetado</p>
            <p className="text-sm font-medium capitalize">{atrito.affected}</p>
          </div>
        </div>

        {atrito.improvisedSolution && (
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Solução improvisada</p>
            <p className="text-sm">{atrito.improvisedSolution}</p>
          </div>
        )}

        <div>
          <p className="text-xs text-muted-foreground mb-2">Status</p>
          <div className="flex flex-wrap gap-1.5">
            {ATRITO_STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onChangeStatus(atrito, opt.value)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-all min-h-[32px] active:scale-95 ${
                  atrito.status === opt.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {investigationContext && (
          <div className="border-t border-border/50 pt-4">
            <InvestigationSummary
              context={investigationContext}
              onEdit={onInvestigate}
            />
          </div>
        )}

        <div className="pt-4 border-t border-border/50 space-y-3">
          <div className="flex gap-1.5 flex-wrap">
            <Button variant="secondary" size="sm" onClick={onEdit}>
              <Pencil size={14} />
              Editar
            </Button>
            <Button variant="secondary" size="sm" onClick={onInvestigate}>
              <PenLine size={14} />
              Aprofundar
            </Button>
            <Button variant="secondary" size="sm" onClick={handleCopyAtrito}>
              <Copy size={14} />
              Copiar
            </Button>
            <Button variant="secondary" size="sm" onClick={handleExportAtrito}>
              <Download size={14} />
              Exportar
            </Button>
          </div>
          {!investigationContext && atrito.status !== 'virou ideia' && (
            <p className="text-[11px] text-muted-foreground hidden md:block">
              Aprofundar o contexto antes de gerar o briefing tende a tornar o prompt mais preciso.
            </p>
          )}
          <Button
            size="sm"
            onClick={onOpenBriefing}
            className="w-full"
          >
            <Sparkles size={14} />
            Gerar briefing para IA
          </Button>
          {!hasExistingOpportunity && atrito.status !== 'virou ideia' && (
            <Button
              size="sm"
              variant="secondary"
              onClick={handleTransformToOpportunity}
              disabled={isGenerating}
              className="w-full"
            >
              <Lightbulb size={14} />
              {isGenerating ? 'Gerando...' : 'Transformar em ideia'}
            </Button>
          )}
          {hasExistingOpportunity && (
            <p className="text-[11px] text-muted-foreground text-center">
              <FileText size={12} className="inline mr-1" />
              Já existe uma ideia vinculada a esta observação.
            </p>
          )}
        </div>

        <div className="pt-3 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full justify-center"
          >
            <Trash2 size={14} />
            Excluir observação
          </Button>
        </div>
      </div>
    </Modal>
  );
}

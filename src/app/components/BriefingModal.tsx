import { useMemo } from 'react';
import { Download, Copy } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Atrito, AtritoInvestigationContext, PromptTemplateType } from '../types';
import { generatePromptFromAtritoContext } from '../utils/promptGenerator';
import { PROMPT_TEMPLATES } from '../utils/promptTemplates';
import { downloadMarkdown, copyToClipboard } from '../utils/markdown';
import { showToast } from './Toast';

interface BriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  atrito: Atrito | null;
  investigationContext: AtritoInvestigationContext | undefined;
  selectedTemplateType: PromptTemplateType;
  onTemplateTypeChange: (type: PromptTemplateType) => void;
}

export function BriefingModal({
  isOpen,
  onClose,
  atrito,
  investigationContext,
  selectedTemplateType,
  onTemplateTypeChange,
}: BriefingModalProps) {
  const generatedPrompt = useMemo(() => {
    if (!atrito) return '';
    return generatePromptFromAtritoContext({
      atrito,
      investigationContext,
      templateType: selectedTemplateType,
    });
  }, [atrito, investigationContext, selectedTemplateType]);

  const handleCopyPrompt = async () => {
    if (!generatedPrompt) return;
    const success = await copyToClipboard(generatedPrompt);
    if (success) {
      showToast('Prompt copiado!');
    }
  };

  const handleExportPrompt = () => {
    if (!atrito || !generatedPrompt) return;
    const filename = `briefing-${selectedTemplateType}-${atrito.id}.md`;
    downloadMarkdown(generatedPrompt, filename);
    showToast('Briefing exportado!');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Briefing para IA">
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
                    onClick={() => onTemplateTypeChange(t.type)}
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
                    onClick={() => onTemplateTypeChange(t.type)}
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
          <Button variant="secondary" size="sm" onClick={onClose}>
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
  );
}

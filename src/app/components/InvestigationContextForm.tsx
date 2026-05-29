import { useState } from 'react';
import { Save } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Textarea } from './Textarea';
import { Select } from './Select';
import { Atrito, AtritoInvestigationContext } from '../types';
import {
  TIMES_OCCURRED_OPTIONS,
  EMOTIONAL_IMPACT_OPTIONS,
  PRACTICAL_IMPACT_OPTIONS,
} from '../constants';
import {
  findInvestigationContextByAtritoId,
  saveOrUpdateInvestigationContext,
} from '../utils/storage';
import { showToast } from './Toast';

interface InvestigationContextFormProps {
  isOpen: boolean;
  onClose: () => void;
  atrito: Atrito;
  onSaved?: () => void;
}

interface FormData {
  scenario: string;
  timesOccurred: string;
  affectedPeopleDescription: string;
  currentWorkaround: string;
  emotionalImpact: string;
  practicalImpact: string;
  rootCauseGuess: string;
  evidence: string;
  similarSituations: string;
  questionsToAsk: string;
  notes: string;
}

const initialFormData: FormData = {
  scenario: '',
  timesOccurred: '',
  affectedPeopleDescription: '',
  currentWorkaround: '',
  emotionalImpact: '',
  practicalImpact: '',
  rootCauseGuess: '',
  evidence: '',
  similarSituations: '',
  questionsToAsk: '',
  notes: '',
};

function loadFormData(atritoId: string): FormData {
  const existing = findInvestigationContextByAtritoId(atritoId);
  if (!existing) return initialFormData;

  return {
    scenario: existing.scenario || '',
    timesOccurred: existing.timesOccurred || '',
    affectedPeopleDescription: existing.affectedPeopleDescription || '',
    currentWorkaround: existing.currentWorkaround || '',
    emotionalImpact: existing.emotionalImpact || '',
    practicalImpact: existing.practicalImpact || '',
    rootCauseGuess: existing.rootCauseGuess || '',
    evidence: existing.evidence || '',
    similarSituations: existing.similarSituations || '',
    questionsToAsk: existing.questionsToAsk || '',
    notes: existing.notes || '',
  };
}

export function InvestigationContextForm({
  isOpen,
  onClose,
  atrito,
  onSaved,
}: InvestigationContextFormProps) {
  const [formData, setFormData] = useState<FormData>(() =>
    loadFormData(atrito.id)
  );

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const hasData = Object.values(formData).some((v) => v.trim() !== '');

  const handleSave = () => {
    const context: AtritoInvestigationContext = {
      id: hasData
        ? findInvestigationContextByAtritoId(atrito.id)?.id || crypto.randomUUID()
        : crypto.randomUUID(),
      atritoId: atrito.id,
      scenario: formData.scenario,
      timesOccurred: (formData.timesOccurred as AtritoInvestigationContext['timesOccurred']) || 'primeira vez',
      affectedPeopleDescription: formData.affectedPeopleDescription,
      currentWorkaround: formData.currentWorkaround,
      emotionalImpact: (formData.emotionalImpact as AtritoInvestigationContext['emotionalImpact']) || 'nenhum',
      practicalImpact: (formData.practicalImpact as AtritoInvestigationContext['practicalImpact']) || 'nenhum',
      rootCauseGuess: formData.rootCauseGuess,
      evidence: formData.evidence,
      similarSituations: formData.similarSituations,
      questionsToAsk: formData.questionsToAsk,
      notes: formData.notes,
      createdAt: findInvestigationContextByAtritoId(atrito.id)?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveOrUpdateInvestigationContext(context);
    showToast('Contexto salvo com sucesso!', 'success');
    onSaved?.();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Aprofundar atrito">
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Responda o que puder. Quanto mais contexto, melhor será a geração de oportunidades.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Em qual cenário isso aconteceu?
            </label>
            <Textarea
              placeholder="Descreva o contexto, o lugar, o momento..."
              value={formData.scenario}
              onChange={(e) => handleChange('scenario', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Quantas vezes isso já aconteceu?
            </label>
            <Select
              value={formData.timesOccurred}
              onChange={(e) => handleChange('timesOccurred', e.target.value)}
              options={[{ value: '', label: 'Selecione...' }, ...TIMES_OCCURRED_OPTIONS]}
              placeholder="Frequência"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Impacto prático
              </label>
              <Select
                value={formData.practicalImpact}
                onChange={(e) => handleChange('practicalImpact', e.target.value)}
                options={[{ value: '', label: 'Selecione...' }, ...PRACTICAL_IMPACT_OPTIONS]}
                placeholder="Impacto"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Impacto emocional
              </label>
              <Select
                value={formData.emotionalImpact}
                onChange={(e) => handleChange('emotionalImpact', e.target.value)}
                options={[{ value: '', label: 'Selecione...' }, ...EMOTIONAL_IMPACT_OPTIONS]}
                placeholder="Impacto"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Quem foi afetado além de você?
            </label>
            <Textarea
              placeholder="Colegas, familiares, cliente, público..."
              value={formData.affectedPeopleDescription}
              onChange={(e) => handleChange('affectedPeopleDescription', e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              O que você tentou fazer para contornar?
            </label>
            <Textarea
              placeholder="Solucões improvisadas, workarounds, adaptções..."
              value={formData.currentWorkaround}
              onChange={(e) => handleChange('currentWorkaround', e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              O que você acha que causa esse atrito?
            </label>
            <Textarea
              placeholder="Hipótese sobre a causa raiz..."
              value={formData.rootCauseGuess}
              onChange={(e) => handleChange('rootCauseGuess', e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Isso se parece com algum outro problema?
            </label>
            <Textarea
              placeholder="Outras situações similares que você já viu..."
              value={formData.similarSituations}
              onChange={(e) => handleChange('similarSituations', e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Que pergunta você faria para outra pessoa que passou por isso?
            </label>
            <Textarea
              placeholder="Perguntas que ajudariam a entender melhor..."
              value={formData.questionsToAsk}
              onChange={(e) => handleChange('questionsToAsk', e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Evidência, exemplo ou observação importante
            </label>
            <Textarea
              placeholder="Screenshots, prints, falas, dados..."
              value={formData.evidence}
              onChange={(e) => handleChange('evidence', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Notas adicionais
            </label>
            <Textarea
              placeholder="Qualquer outra informação relevante..."
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-border">
          <Button onClick={handleSave}>
            <Save size={18} />
            Salvar contexto
          </Button>
        </div>
      </div>
    </Modal>
  );
}

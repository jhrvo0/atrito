import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Textarea } from './Textarea';
import { Select } from './Select';
import { Input } from './Input';
import { Atrito, AtritoInvestigationContext } from '../types';
import {
  TIMES_OCCURRED_OPTIONS,
  EMOTIONAL_IMPACT_OPTIONS,
  PRACTICAL_IMPACT_OPTIONS,
  isValidTimesOccurred,
  isValidEmotionalImpact,
  isValidPracticalImpact,
} from '../constants';

interface InvestigationContextFormProps {
  isOpen: boolean;
  onClose: () => void;
  atrito: Atrito;
  existingContext?: AtritoInvestigationContext;
  onSave: (context: AtritoInvestigationContext) => void;
}

interface FormData {
  scenario: string;
  timesOccurred: string;
  firstNoticedAt: string;
  lastOccurredAt: string;
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
  firstNoticedAt: '',
  lastOccurredAt: '',
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

function loadFormData(existing?: AtritoInvestigationContext): FormData {
  if (!existing) return initialFormData;

  return {
    scenario: existing.scenario || '',
    timesOccurred: existing.timesOccurred || '',
    firstNoticedAt: existing.firstNoticedAt || '',
    lastOccurredAt: existing.lastOccurredAt || '',
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

interface StepConfig {
  title: string;
  question: string;
  helper: string;
}

const steps: StepConfig[] = [
  {
    title: 'Cena',
    question: 'Onde você estava e o que estava tentando fazer?',
    helper: 'Descreva a cena como se estivesse anotando em um caderno de campo.',
  },
  {
    title: 'O atrito',
    question: 'O que exatamente travou, irritou ou confundiu?',
    helper: 'Pense no momento em que algo não saiu como esperado.',
  },
  {
    title: 'Impacto',
    question: 'O que isso te fez perder ou sentir?',
    helper: 'Refira-se tanto às consequências práticas quanto ao efeito emocional.',
  },
  {
    title: 'Padrão',
    question: 'Isso já aconteceu outras vezes ou com outras pessoas?',
    helper: 'Tente identificar se há um padrão recorrente.',
  },
  {
    title: 'Investigação',
    question: 'Que pergunta você faria para entender melhor esse problema?',
    helper: 'Pensar em boas perguntas já é um passo importante.',
  },
];

export function InvestigationContextForm({
  isOpen,
  onClose,
  atrito,
  existingContext,
  onSave,
}: InvestigationContextFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(() =>
    loadFormData(existingContext)
  );

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const buildContext = (): AtritoInvestigationContext => ({
    id: existingContext?.id || crypto.randomUUID(),
    atritoId: atrito.id,
    scenario: formData.scenario,
    timesOccurred: isValidTimesOccurred(formData.timesOccurred) ? formData.timesOccurred : undefined,
    firstNoticedAt: formData.firstNoticedAt || undefined,
    lastOccurredAt: formData.lastOccurredAt || undefined,
    affectedPeopleDescription: formData.affectedPeopleDescription,
    currentWorkaround: formData.currentWorkaround,
    emotionalImpact: isValidEmotionalImpact(formData.emotionalImpact) ? formData.emotionalImpact : undefined,
    practicalImpact: isValidPracticalImpact(formData.practicalImpact) ? formData.practicalImpact : undefined,
    rootCauseGuess: formData.rootCauseGuess,
    evidence: formData.evidence,
    similarSituations: formData.similarSituations,
    questionsToAsk: formData.questionsToAsk,
    notes: formData.notes,
    createdAt: existingContext?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const handleSave = () => {
    onSave(buildContext());
    onClose();
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const step = steps[currentStep];
  if (!step) return null;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const renderStepFields = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">Cenário</label>
              <Textarea
                placeholder="Estava no supermercado, tentando passar no caixa autoatendimento..."
                value={formData.scenario}
                onChange={(e) => handleChange('scenario', e.target.value)}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Primeira vez percebido</label>
                <Input
                  type="date"
                  value={formData.firstNoticedAt}
                  onChange={(e) => handleChange('firstNoticedAt', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Última ocorrência</label>
                <Input
                  type="date"
                  value={formData.lastOccurredAt}
                  onChange={(e) => handleChange('lastOccurredAt', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">Hipótese de causa</label>
              <Textarea
                placeholder="O que você acha que está causando esse atrito..."
                value={formData.rootCauseGuess}
                onChange={(e) => handleChange('rootCauseGuess', e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Evidência ou exemplo</label>
              <Textarea
                placeholder="Algo concreto que sustente sua percepção: prints, falas, situações..."
                value={formData.evidence}
                onChange={(e) => handleChange('evidence', e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Notas</label>
              <Textarea
                placeholder="Qualquer outra observação sobre o que aconteceu..."
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={2}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Impacto prático</label>
                <Select
                  value={formData.practicalImpact}
                  onChange={(e) => handleChange('practicalImpact', e.target.value)}
                  options={[{ value: '', label: 'Selecione...' }, ...PRACTICAL_IMPACT_OPTIONS]}
                  placeholder="Impacto"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Impacto emocional</label>
                <Select
                  value={formData.emotionalImpact}
                  onChange={(e) => handleChange('emotionalImpact', e.target.value)}
                  options={[{ value: '', label: 'Selecione...' }, ...EMOTIONAL_IMPACT_OPTIONS]}
                  placeholder="Impacto"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Solução improvisada</label>
              <Textarea
                placeholder="O que você tentou fazer para contornar esse problema..."
                value={formData.currentWorkaround}
                onChange={(e) => handleChange('currentWorkaround', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">Quantidade de vezes</label>
              <Select
                value={formData.timesOccurred}
                onChange={(e) => handleChange('timesOccurred', e.target.value)}
                options={[{ value: '', label: 'Selecione...' }, ...TIMES_OCCURRED_OPTIONS]}
                placeholder="Frequência"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Quem foi afetado</label>
              <Textarea
                placeholder="Além de você, quem mais sentiu isso: colegas, família, clientes..."
                value={formData.affectedPeopleDescription}
                onChange={(e) => handleChange('affectedPeopleDescription', e.target.value)}
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Situações semelhantes</label>
              <Textarea
                placeholder="Outros contextos onde algo parecido já aconteceu..."
                value={formData.similarSituations}
                onChange={(e) => handleChange('similarSituations', e.target.value)}
                rows={2}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5">Perguntas para entender melhor</label>
              <Textarea
                placeholder="Que perguntas você faria para outra pessoa que passou por isso..."
                value={formData.questionsToAsk}
                onChange={(e) => handleChange('questionsToAsk', e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Notas finais</label>
              <Textarea
                placeholder="Qualquer informação adicional que queira registrar..."
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={2}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Aprofundar atrito">
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Etapa {currentStep + 1} de {steps.length}
            </p>
            <span className="text-xs font-medium text-primary">{step.title}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1">
            <div
              className="bg-primary h-1 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg">{step.question}</h3>
          <p className="text-sm text-muted-foreground">{step.helper}</p>
        </div>

        <div>{renderStepFields()}</div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex gap-2">
            {!isFirstStep && (
              <Button variant="ghost" onClick={handleBack}>
                <ChevronLeft size={18} />
                Voltar
              </Button>
            )}
            <Button variant="ghost" onClick={handleSave}>
              Salvar rascunho
            </Button>
          </div>
          <div className="flex gap-2">
            {!isLastStep && (
              <Button onClick={handleNext}>
                Próximo
                <ChevronRight size={18} />
              </Button>
            )}
            {isLastStep && (
              <Button onClick={handleSave}>
                <Save size={18} />
                Salvar contexto
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

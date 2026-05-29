import { AtritoInvestigationContext } from '../types';
import { Tag } from './Tag';
import { formatDate, formatLocalDate } from '../utils/date';
import {
  TIMES_OCCURRED_OPTIONS,
  EMOTIONAL_IMPACT_OPTIONS,
  PRACTICAL_IMPACT_OPTIONS,
} from '../constants';

interface InvestigationSummaryProps {
  context: AtritoInvestigationContext;
  onEdit: () => void;
}

function getLabel<T extends { value: string; label: string }>(
  options: T[],
  value: string
): string {
  return options.find((o) => o.value === value)?.label || value;
}

export function InvestigationSummary({
  context,
  onEdit,
}: InvestigationSummaryProps) {
  const sections = [
    {
      label: 'Cenário',
      value: context.scenario,
    },
    {
      label: 'Quantidade de vezes',
      value: getLabel(TIMES_OCCURRED_OPTIONS, context.timesOccurred),
    },
    {
      label: 'Primeira vez percebido',
      value: context.firstNoticedAt ? formatLocalDate(context.firstNoticedAt) : '',
    },
    {
      label: 'Última ocorrência',
      value: context.lastOccurredAt ? formatLocalDate(context.lastOccurredAt) : '',
    },
    {
      label: 'Impacto prático',
      value: getLabel(PRACTICAL_IMPACT_OPTIONS, context.practicalImpact),
      tag: true,
    },
    {
      label: 'Impacto emocional',
      value: getLabel(EMOTIONAL_IMPACT_OPTIONS, context.emotionalImpact),
      tag: true,
    },
    {
      label: 'Solução improvisada',
      value: context.currentWorkaround,
    },
    {
      label: 'Hipótese de causa',
      value: context.rootCauseGuess,
    },
    {
      label: 'Quem foi afetado',
      value: context.affectedPeopleDescription,
    },
    {
      label: 'Situações similares',
      value: context.similarSituations,
    },
    {
      label: 'Perguntas pendentes',
      value: context.questionsToAsk,
    },
    {
      label: 'Evidências',
      value: context.evidence,
    },
    {
      label: 'Notas',
      value: context.notes,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Contexto construído</h4>
        <button
          onClick={onEdit}
          className="text-xs text-primary hover:underline"
        >
          Editar
        </button>
      </div>

      <div className="space-y-3">
        {sections.map(
          (section) =>
            section.value && (
              <div key={section.label}>
                <p className="text-xs text-muted-foreground mb-0.5">
                  {section.label}
                </p>
                {section.tag ? (
                  <Tag variant="default">{section.value}</Tag>
                ) : (
                  <p className="text-sm">{section.value}</p>
                )}
              </div>
            )
        )}
      </div>
    </div>
  );
}

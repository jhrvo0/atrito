import { Context, Intensity, Frequency, Affected, AtritoStatus, OpportunityStatus, Priority } from './types';

export const CONTEXT_OPTIONS: { value: Context; label: string }[] = [
  { value: 'casa', label: 'Casa' },
  { value: 'rua', label: 'Rua' },
  { value: 'faculdade', label: 'Faculdade' },
  { value: 'trabalho', label: 'Trabalho' },
  { value: 'transporte', label: 'Transporte' },
  { value: 'app/site', label: 'App/Site' },
  { value: 'compra', label: 'Compra' },
  { value: 'atendimento', label: 'Atendimento' },
  { value: 'outro', label: 'Outro' },
];

export const INTENSITY_OPTIONS: { value: Intensity; label: string }[] = [
  { value: 'baixa', label: 'Baixa' },
  { value: 'média', label: 'Média' },
  { value: 'alta', label: 'Alta' },
];

export const FREQUENCY_OPTIONS: { value: Frequency; label: string }[] = [
  { value: 'uma vez', label: 'Aconteceu uma vez' },
  { value: 'às vezes', label: 'Às vezes' },
  { value: 'frequentemente', label: 'Frequentemente' },
];

export const AFFECTED_OPTIONS: { value: Affected; label: string }[] = [
  { value: 'eu', label: 'Eu' },
  { value: 'outra pessoa', label: 'Outra pessoa' },
  { value: 'grupo', label: 'Grupo' },
  { value: 'público geral', label: 'Público geral' },
];

export const ATRITO_STATUS_OPTIONS: { value: AtritoStatus; label: string }[] = [
  { value: 'observado', label: 'Observado' },
  { value: 'investigando', label: 'Investigando' },
  { value: 'virou ideia', label: 'Virou ideia' },
  { value: 'descartado', label: 'Descartado' },
];

export const OPPORTUNITY_STATUS_OPTIONS: { value: OpportunityStatus; label: string }[] = [
  { value: 'ideia', label: 'Ideia' },
  { value: 'validando', label: 'Validando' },
  { value: 'protótipo', label: 'Protótipo' },
  { value: 'em desenvolvimento', label: 'Em desenvolvimento' },
  { value: 'arquivada', label: 'Arquivada' },
];

export const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: 'baixa', label: 'Baixa' },
  { value: 'média', label: 'Média' },
  { value: 'alta', label: 'Alta' },
];

export function isValidContext(value: string): value is Context {
  return (CONTEXT_OPTIONS as { value: string }[]).some((o) => o.value === value);
}

export function isValidIntensity(value: string): value is Intensity {
  return (INTENSITY_OPTIONS as { value: string }[]).some((o) => o.value === value);
}

export function isValidFrequency(value: string): value is Frequency {
  return (FREQUENCY_OPTIONS as { value: string }[]).some((o) => o.value === value);
}

export function isValidAffected(value: string): value is Affected {
  return (AFFECTED_OPTIONS as { value: string }[]).some((o) => o.value === value);
}

export function isValidAtritoStatus(value: string): value is AtritoStatus {
  return (ATRITO_STATUS_OPTIONS as { value: string }[]).some((o) => o.value === value);
}

export function isValidOpportunityStatus(value: string): value is OpportunityStatus {
  return (OPPORTUNITY_STATUS_OPTIONS as { value: string }[]).some((o) => o.value === value);
}

export function isValidPriority(value: string): value is Priority {
  return (PRIORITY_OPTIONS as { value: string }[]).some((o) => o.value === value);
}

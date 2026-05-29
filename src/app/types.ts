export type Context =
  | 'casa'
  | 'rua'
  | 'faculdade'
  | 'trabalho'
  | 'transporte'
  | 'app/site'
  | 'compra'
  | 'atendimento'
  | 'outro';

export type Intensity = 'baixa' | 'média' | 'alta';

export type Frequency = 'uma vez' | 'às vezes' | 'frequentemente';

export type Affected = 'eu' | 'outra pessoa' | 'grupo' | 'público geral';

export type AtritoStatus = 'observado' | 'investigando' | 'virou ideia' | 'descartado';

export type OpportunityStatus =
  | 'ideia'
  | 'validando'
  | 'protótipo'
  | 'em desenvolvimento'
  | 'arquivada';

export type Priority = 'baixa' | 'média' | 'alta';

export type TimesOccurred =
  | 'primeira vez'
  | '2-3 vezes'
  | 'várias vezes'
  | 'toda semana'
  | 'quase sempre';

export type EmotionalImpact = 'nenhum' | 'leve' | 'moderado' | 'forte' | 'muito forte';

export type PracticalImpact = 'nenhum' | 'leve' | 'moderado' | 'forte' | 'muito forte';

export interface Atrito {
  id: string;
  title: string;
  description: string;
  context: Context;
  intensity: Intensity;
  frequency: Frequency;
  affected: Affected;
  improvisedSolution?: string;
  status: AtritoStatus;
  createdAt: string;
}

export interface AtritoInvestigationContext {
  id: string;
  atritoId: string;
  scenario: string;
  timesOccurred: TimesOccurred;
  firstNoticedAt?: string;
  lastOccurredAt?: string;
  affectedPeopleDescription: string;
  currentWorkaround: string;
  emotionalImpact: EmotionalImpact;
  practicalImpact: PracticalImpact;
  rootCauseGuess: string;
  evidence: string;
  similarSituations: string;
  questionsToAsk: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Opportunity {
  id: string;
  title: string;
  originalProblem: string;
  hypothesis: string;
  targetAudience: string;
  whyItMatters: string;
  suggestedMVP: string;
  whatNotToBuild: string;
  validationQuestion: string;
  priority: Priority;
  status: OpportunityStatus;
  createdAt: string;
  atritos: string[];
}

export type PromptTemplateType =
  | 'pain-deepening'
  | 'solution-brainstorm'
  | 'user-research'
  | 'mvp-definition'
  | 'technical-issue'
  | 'opportunity-validation';

export interface PromptTemplate {
  type: PromptTemplateType;
  label: string;
  description: string;
}

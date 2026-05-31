import { PromptTemplate, PromptTemplateType } from '../types';

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    type: 'pain-deepening',
    label: 'Entender o problema',
    description: 'Identificar dores explícitas, ocultas, causas raiz e o que ainda falta descobrir.',
    category: 'principal',
  },
  {
    type: 'solution-brainstorm',
    label: 'Gerar ideias de solução',
    description: 'Gerar soluções possíveis, do simples ao ambicioso, com riscos e MVPs sugeridos.',
    category: 'principal',
  },
  {
    type: 'user-research',
    label: 'Criar plano de validação',
    description: 'Criar perguntas de entrevista, hipóteses a validar e sinais de problema real.',
    category: 'principal',
  },
  {
    type: 'mvp-definition',
    label: 'Definir MVP',
    description: 'Escolher hipótese principal, definir escopo mínimo e critérios de sucesso.',
    category: 'avançado',
  },
  {
    type: 'technical-issue',
    label: 'Criar issue técnica',
    description: 'Gerar contexto, problema, requisitos e critérios de aceite para uma GitHub Issue.',
    category: 'avançado',
  },
  {
    type: 'opportunity-validation',
    label: 'Avaliar potencial',
    description: 'Avaliar potencial, riscos, formas de validação e próximos passos.',
    category: 'avançado',
  },
];

export function getTemplateByType(type: PromptTemplateType): PromptTemplate | undefined {
  return PROMPT_TEMPLATES.find((t) => t.type === type);
}

export function getTemplateLabel(type: PromptTemplateType): string {
  return getTemplateByType(type)?.label ?? type;
}

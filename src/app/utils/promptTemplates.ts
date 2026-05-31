import { PromptTemplate, PromptTemplateType } from '../types';

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    type: 'pain-deepening',
    label: 'Aprofundar dor',
    description: 'Identificar dores explícitas, ocultas, causas raiz e o que ainda falta descobrir.',
  },
  {
    type: 'solution-brainstorm',
    label: 'Brainstorm de soluções',
    description: 'Gerar soluções possíveis, do simples ao ambicioso, com riscos e MVPs sugeridos.',
  },
  {
    type: 'user-research',
    label: 'Pesquisa com usuários',
    description: 'Criar perguntas de entrevista, hipóteses a validar e sinais de problema real.',
  },
  {
    type: 'mvp-definition',
    label: 'Definir MVP',
    description: 'Escolher hipótese principal, definir escopo mínimo e critérios de sucesso.',
  },
  {
    type: 'technical-issue',
    label: 'Criar issue técnica',
    description: 'Gerar contexto, problema, requisitos e critérios de aceite para uma GitHub Issue.',
  },
  {
    type: 'opportunity-validation',
    label: 'Validar ideia',
    description: 'Avaliar potencial, riscos, formas de validação e próximos passos.',
  },
];

export function getTemplateByType(type: PromptTemplateType): PromptTemplate | undefined {
  return PROMPT_TEMPLATES.find((t) => t.type === type);
}

export function getTemplateLabel(type: PromptTemplateType): string {
  return getTemplateByType(type)?.label ?? type;
}

import { Opportunity, Atrito, AtritoInvestigationContext, PromptTemplateType } from '../types';
import { getTemplateByType } from './promptTemplates';

interface PromptContext {
  atrito: Atrito;
  investigationContext?: AtritoInvestigationContext;
  opportunity?: Opportunity;
  templateType: PromptTemplateType;
}

function buildAtritoSection(atrito: Atrito | undefined): string {
  if (!atrito) {
    return '> Dados do atrito original não disponíveis.\n';
  }

  const lines = [
    `### Dados do Atrito`,
    `- **Título:** ${atrito.title}`,
    `- **Descrição:** ${atrito.description}`,
    `- **Contexto:** ${atrito.context}`,
    `- **Intensidade:** ${atrito.intensity}`,
    `- **Frequência:** ${atrito.frequency}`,
    `- **Afetado:** ${atrito.affected}`,
  ];

  if (atrito.improvisedSolution) {
    lines.push(`- **Solução improvisada:** ${atrito.improvisedSolution}`);
  }

  return lines.join('\n');
}

function buildInvestigationSection(ctx: AtritoInvestigationContext | undefined): string {
  if (!ctx) {
    return [
      '### Contexto Aprofundado',
      '',
      '> Contexto aprofundado ainda não preenchido. Considere preencher para gerar prompts mais precisos.',
      '',
    ].join('\n');
  }

  const lines = ['### Contexto Aprofundado'];

  if (ctx.scenario) lines.push(`- **Cenário:** ${ctx.scenario}`);
  if (ctx.timesOccurred) lines.push(`- **Quantas vezes aconteceu:** ${ctx.timesOccurred}`);
  if (ctx.affectedPeopleDescription) lines.push(`- **Quem foi afetado:** ${ctx.affectedPeopleDescription}`);
  if (ctx.currentWorkaround) lines.push(`- **Solução atual (workaround):** ${ctx.currentWorkaround}`);
  if (ctx.practicalImpact) lines.push(`- **Impacto prático:** ${ctx.practicalImpact}`);
  if (ctx.emotionalImpact) lines.push(`- **Impacto emocional:** ${ctx.emotionalImpact}`);
  if (ctx.rootCauseGuess) lines.push(`- **Hipótese de causa raiz:** ${ctx.rootCauseGuess}`);
  if (ctx.evidence) lines.push(`- **Evidências:** ${ctx.evidence}`);
  if (ctx.similarSituations) lines.push(`- **Situações semelhantes:** ${ctx.similarSituations}`);
  if (ctx.questionsToAsk) lines.push(`- **Perguntas pendentes:** ${ctx.questionsToAsk}`);
  if (ctx.notes) lines.push(`- **Notas adicionais:** ${ctx.notes}`);

  if (lines.length === 1) {
    lines.push('> Contexto aprofundado preenchido, mas sem campos detalhados.');
  }

  return lines.join('\n');
}

function buildOpportunitySection(opportunity: Opportunity): string {
  const lines = [
    '### Dados da Oportunidade',
    `- **Título:** ${opportunity.title}`,
    `- **Problema original:** ${opportunity.originalProblem}`,
    `- **Prioridade:** ${opportunity.priority}`,
    `- **Status:** ${opportunity.status}`,
    `- **Público-alvo:** ${opportunity.targetAudience}`,
  ];

  if (opportunity.hypothesis) lines.push(`- **Hipótese:** ${opportunity.hypothesis}`);
  if (opportunity.whyItMatters) lines.push(`- **Por que importa:** ${opportunity.whyItMatters}`);
  if (opportunity.suggestedMVP) lines.push(`- **MVP sugerido:** ${opportunity.suggestedMVP}`);
  if (opportunity.whatNotToBuild) lines.push(`- **Não construir agora:** ${opportunity.whatNotToBuild}`);
  if (opportunity.validationQuestion) lines.push(`- **Pergunta de validação:** ${opportunity.validationQuestion}`);

  return lines.join('\n');
}

function templatePainDeepening(): string {
  return [
    '## Sua tarefa: Aprofundar a dor',
    '',
    'Analise profundamente o problema descrito abaixo. Seu objetivo é entender a dor em camadas, sem pular para soluções.',
    '',
    '### 1. Dores explícitas',
    '- Liste as dores que estão diretamente descritas pelo usuário.',
    '- Cite trechos ou frases que evidenciem essas dores.',
    '',
    '### 2. Dores ocultas (inferidas)',
    '- Identifique dores que não foram ditas explicitamente, mas que podem ser inferidas.',
    '- Explique o raciocínio por trás de cada inferência.',
    '',
    '### 3. Possíveis causas raiz',
    '- Para cada dor identificada, aponte pelo menos uma causa raiz possível.',
    '- Diferencie sintomas de causas.',
    '',
    '### 4. Perguntas de entrevista sugeridas',
    '- Liste 5-8 perguntas que ajudariam a validar as dores identificadas.',
    '- Prefira perguntas abertas que convidam à reflexão.',
    '',
    '### 5. O que ainda falta descobrir',
    '- Aponte lacunas de informação que impedem uma compreensão completa do problema.',
    '- Sugira formas de preencher essas lacunas.',
    '',
    '**Importante:** Não proponha soluções nesta fase. Foque apenas em entender a dor.',
  ].join('\n');
}

function templateSolutionBrainstorm(): string {
  return [
    '## Sua tarefa: Brainstorm de soluções',
    '',
    'Gere soluções criativas e práticas para o problema descrito abaixo.',
    '',
    '### 1. Soluções simples',
    '- Liste 3-5 soluções que podem ser implementadas com esforço mínimo.',
    '- Cada solução deve ser descrita em 1-2 frases.',
    '',
    '### 2. Soluções de médio porte',
    '- Liste 3-5 soluções que requerem mais esforço, mas ainda são viáveis.',
    '- Indique o que cada uma delas resolveria.',
    '',
    '### 3. Soluções ambiciosas',
    '- Liste 2-3 soluções ousadas que transformariam completamente a experiência.',
    '- Indique por que seriam ambiciosas.',
    '',
    '### 4. Riscos e trade-offs',
    '- Para cada categoria, aponte 1-2 riscos principais.',
    '- Indique dependências ou limitações.',
    '',
    '### 5. MVP sugerido',
    '- Proponha um MVP pequeno que valide a hipótese central.',
    '- Defina o que está dentro e fora do escopo.',
    '',
    '### 6. O que NÃO construir agora',
    '- Liste funcionalidades ou ideias que devem ser adiadas.',
    '- Justifique cada uma.',
  ].join('\n');
}

function templateUserResearch(): string {
  return [
    '## Sua tarefa: Pesquisa com usuários',
    '',
    'Crie um plano de pesquisa para validar as hipóteses sobre o problema descrito.',
    '',
    '### 1. Perguntas de entrevista',
    '- Liste 8-12 perguntas para entrevistar pessoas afetadas pelo problema.',
    '- Misture perguntas abertas e fechadas.',
    '- Organize por ordem: contexto → comportamento → dor → solução.',
    '',
    '### 2. Hipóteses a validar',
    '- Liste 3-5 hipóteses centrais que precisam ser confirmadas ou refutadas.',
    '- Indique como cada hipótese seria validada.',
    '',
    '### 3. Sinais de que o problema é real',
    '- Descreva 3-5 sinais observáveis que indicam que o problema existe de fato.',
    '- Indique onde procurar esses sinais.',
    '',
    '### 4. Perguntas a evitar',
    '- Liste perguntas enviesadas que devem ser evitadas.',
    '- Explique por que cada uma é enviesada.',
    '',
    '### 5. Critérios de parada',
    '- Defina quando a pesquisa é suficiente para tomar uma decisão.',
    '- Indique sinais de que é hora de avançar ou pivotar.',
  ].join('\n');
}

function templateMvpDefinition(): string {
  return [
    '## Sua tarefa: Definir MVP',
    '',
    'Defina um produto mínimo viável que valide a hipótese central da ideia.',
    '',
    '### 1. Hipótese principal',
    '- Identifique a hipótese mais importante a validar.',
    '- Explique por que ela é a mais crítica.',
    '',
    '### 2. Escopo mínimo',
    '- Liste as funcionalidades essenciais do MVP (máximo 5).',
    '- Para cada uma, descreva o que ela faz em uma frase.',
    '',
    '### 3. Requisitos funcionais',
    '- Liste o que o usuário precisa conseguir fazer.',
    '- Priorize por ordem de importância.',
    '',
    '### 4. Critérios de sucesso',
    '- Defina 2-3 métricas ou sinais mensuráveis de sucesso.',
    '- Explique como cada um seria medido.',
    '',
    '### 5. Validação rápida',
    '- Sugira uma forma de validar o MVP em até 2 semanas.',
    '- Indique o que constituiria uma validação bem-sucedida.',
    '',
    '### 6. Restrições',
    '- Liste limitações técnicas, de tempo ou de recurso a considerar.',
  ].join('\n');
}

function templateTechnicalIssue(): string {
  return [
    '## Sua tarefa: Criar issue técnica',
    '',
    'Gere o conteúdo para uma GitHub Issue que descreva este problema/funcionalidade.',
    '',
    '### Contexto',
    '- Descreva o contexto do problema ou funcionalidade.',
    '- Inclua dados relevantes do atrito e da ideia.',
    '',
    '### Problema',
    '- Explique o problema de forma clara e concisa.',
    '- Indique quem é afetado e como.',
    '',
    '### Objetivo',
    '- Defina o que se pretende alcançar com esta issue.',
    '',
    '### Requisitos',
    '- Liste os requisitos funcionais e não-funcionais.',
    '- Seja específico e mensurável.',
    '',
    '### Restrições',
    '- Indique limitações técnicas, de prazo ou de escopo.',
    '',
    '### Critérios de aceite',
    '- Liste condições que devem ser verdadeiras para que a issue seja considerada completa.',
    '',
    '### Fora de escopo',
    '- Liste explicitamente o que NÃO deve ser incluído nesta iteração.',
  ].join('\n');
}

function templateOpportunityValidation(): string {
  return [
    '## Sua tarefa: Validar ideia',
    '',
    'Avalie o potencial desta ideia e sugira próximos passos concretos.',
    '',
    '### 1. Avaliação de potencial',
    '- Avalie o potencial desta ideia (alto/médio/baixo) e justifique.',
    '- Indique o impacto potencial se implementado.',
    '',
    '### 2. Riscos identificados',
    '- Liste 3-5 riscos principais associados a esta ideia.',
    '- Para cada risco, sugira uma forma de mitigá-lo.',
    '',
    '### 3. Formas simples de validação',
    '- Sugira 2-3 formas baratas e rápidas de validar a ideia antes de construir.',
    '- Indique o custo de tempo/esforço de cada uma.',
    '',
    '### 4. Dados que faltam',
    '- Liste informações ausentes que são necessárias para uma decisão fundamentada.',
    '- Sugira como obter esses dados.',
    '',
    '### 5. Próximos passos',
    '- Defina 3-5 ações concretas e ordenadas para avançar.',
    '- Cada ação deve ser específica e realizável em até 1 semana.',
  ].join('\n');
}

const TEMPLATE_BUILDERS: Record<PromptTemplateType, () => string> = {
  'pain-deepening': templatePainDeepening,
  'solution-brainstorm': templateSolutionBrainstorm,
  'user-research': templateUserResearch,
  'mvp-definition': templateMvpDefinition,
  'technical-issue': templateTechnicalIssue,
  'opportunity-validation': templateOpportunityValidation,
};

export function generatePromptFromContext({
  atrito,
  investigationContext,
  opportunity,
  templateType,
}: PromptContext): string {
  const template = getTemplateByType(templateType);
  const templateName = template?.label ?? templateType;

  const sections: string[] = [
    `# Prompt: ${templateName}`,
    '',
    '## Instrução',
    '',
    'Analise as informações abaixo e responda à tarefa proposta com foco, especificidade e ações práticas.',
    'Evite respostas genéricas. Use os dados concretos fornecidos.',
    '',
    buildAtritoSection(atrito),
    '',
    buildInvestigationSection(investigationContext),
  ];

  if (opportunity) {
    sections.push('');
    sections.push(buildOpportunitySection(opportunity));
  }

  sections.push('');
  sections.push('---');
  sections.push('');
  sections.push(TEMPLATE_BUILDERS[templateType]());
  sections.push('');
  sections.push('---');
  sections.push('');
  sections.push('*Seja específico. Evite genéricos. Foque em ações concretas e mensuráveis.*');

  return sections.join('\n');
}

export function generatePrompt(opportunity: Opportunity): string {
  return generatePromptFromContext({
    atrito: {
      id: '',
      title: opportunity.title,
      description: opportunity.originalProblem,
      context: 'geral',
      intensity: 'média',
      frequency: 'às vezes',
      affected: 'eu',
      status: 'observado',
      createdAt: opportunity.createdAt,
    },
    opportunity,
    templateType: 'mvp-definition',
  });
}

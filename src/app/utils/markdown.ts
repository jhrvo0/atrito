import { Atrito, Opportunity, AtritoInvestigationContext } from '../types';
import { formatDate } from './date';

export function exportInvestigationContextToMarkdown(ctx: AtritoInvestigationContext): string {
  const lines = [
    '## Contexto Aprofundado',
    '',
  ];

  if (ctx.scenario) lines.push(`**Cenário:** ${ctx.scenario}`);
  if (ctx.timesOccurred) lines.push(`**Quantas vezes aconteceu:** ${ctx.timesOccurred}`);
  if (ctx.firstNoticedAt) lines.push(`**Primeira vez notado:** ${ctx.firstNoticedAt}`);
  if (ctx.lastOccurredAt) lines.push(`**Última vez que aconteceu:** ${ctx.lastOccurredAt}`);
  if (ctx.affectedPeopleDescription) lines.push(`**Quem foi afetado:** ${ctx.affectedPeopleDescription}`);
  if (ctx.currentWorkaround) lines.push(`**Solução atual:** ${ctx.currentWorkaround}`);
  if (ctx.emotionalImpact) lines.push(`**Impacto emocional:** ${ctx.emotionalImpact}`);
  if (ctx.practicalImpact) lines.push(`**Impacto prático:** ${ctx.practicalImpact}`);
  if (ctx.rootCauseGuess) lines.push(`**Hipótese de causa raiz:** ${ctx.rootCauseGuess}`);
  if (ctx.evidence) lines.push(`**Evidências:** ${ctx.evidence}`);
  if (ctx.similarSituations) lines.push(`**Situações semelhantes:** ${ctx.similarSituations}`);
  if (ctx.questionsToAsk) lines.push(`**Perguntas pendentes:** ${ctx.questionsToAsk}`);
  if (ctx.notes) lines.push(`**Notas:** ${ctx.notes}`);

  return lines.join('\n');
}

export function exportAtritoToMarkdown(
  atrito: Atrito,
  investigationContext?: AtritoInvestigationContext
): string {
  const lines = [
    `# Atrito: ${atrito.title}`,
    '',
    `**Data:** ${formatDate(atrito.createdAt)}`,
    `**Status:** ${atrito.status}`,
    `**Contexto:** ${atrito.context}`,
    `**Intensidade:** ${atrito.intensity}`,
    `**Frequência:** ${atrito.frequency}`,
    `**Afetado:** ${atrito.affected}`,
    '',
    '## Descrição',
    '',
    atrito.description,
  ];

  if (atrito.improvisedSolution) {
    lines.push('', '## Solução Improvisada', '', atrito.improvisedSolution);
  }

  if (investigationContext) {
    lines.push('', exportInvestigationContextToMarkdown(investigationContext));
  }

  lines.push('', '---', '*Observação: este registro faz parte do projeto Atrito — uma ferramenta de observação deliberada de problemas cotidianos.*');

  return lines.join('\n');
}

export function exportOpportunityToMarkdown(
  opportunity: Opportunity,
  atritos?: Atrito[],
  investigationContexts?: AtritoInvestigationContext[]
): string {
  const lines = [
    `# Oportunidade: ${opportunity.title}`,
    '',
    `**Data:** ${formatDate(opportunity.createdAt)}`,
    `**Status:** ${opportunity.status}`,
    `**Prioridade:** ${opportunity.priority}`,
    `**Público:** ${opportunity.targetAudience}`,
    '',
    '## Problema Observado',
    '',
    opportunity.originalProblem,
    '',
    '## Hipótese de Solução',
    '',
    opportunity.hypothesis || 'A definir',
    '',
    '## Por que isso importa',
    '',
    opportunity.whyItMatters || 'A definir',
    '',
    '## MVP Sugerido',
    '',
    opportunity.suggestedMVP || 'A definir',
    '',
    '## O que NÃO construir agora',
    '',
    opportunity.whatNotToBuild || 'A definir',
    '',
    '## Pergunta de Validação',
    '',
    opportunity.validationQuestion || 'A definir',
  ];

  if (opportunity.atritos.length > 0 && atritos && investigationContexts) {
    const linkedAtritos = atritos.filter((a) => opportunity.atritos.includes(a.id));

    if (linkedAtritos.length > 0) {
      lines.push('', '---', '', '## Atritos Vinculados');

      for (const atrito of linkedAtritos) {
        lines.push('', `### ${atrito.title}`);
        lines.push(`- **Descrição:** ${atrito.description}`);
        lines.push(`- **Contexto:** ${atrito.context}`);
        lines.push(`- **Intensidade:** ${atrito.intensity}`);
        lines.push(`- **Frequência:** ${atrito.frequency}`);

        const ctx = investigationContexts.find((c) => c.atritoId === atrito.id);
        if (ctx) {
          lines.push('', exportInvestigationContextToMarkdown(ctx));
        }
      }
    }

    lines.push('', `---`, `*Referência: atrito(s) #${opportunity.atritos.join(', #')}*`);
  } else if (opportunity.atritos.length > 0) {
    lines.push('', `---`, `*Referência: atrito(s) #${opportunity.atritos.join(', #')}*`);
  }

  return lines.join('\n');
}

export function exportAllOpportunitiesToMarkdown(
  opportunities: Opportunity[],
  atritos?: Atrito[],
  investigationContexts?: AtritoInvestigationContext[]
): string {
  const header = [
    '# Todas as Oportunidades — Atrito',
    '',
    `**Exportado em:** ${formatDate(new Date().toISOString())}`,
    `**Total:** ${opportunities.length} oportunidades`,
    '',
    '---',
    '',
  ].join('\n');

  const items = opportunities
    .map((opp) => exportOpportunityToMarkdown(opp, atritos, investigationContexts))
    .join('\n\n---\n\n');

  return header + items;
}

export function downloadMarkdown(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

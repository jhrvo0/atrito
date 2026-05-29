import { Atrito, Opportunity } from '../types';
import { formatDate } from './date';

export function exportAtritoToMarkdown(atrito: Atrito): string {
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

  lines.push('', '---', '*Observação: este registro faz parte do projeto Atrito — uma ferramenta de observação deliberada de problemas cotidianos.*');

  return lines.join('\n');
}

export function exportOpportunityToMarkdown(opportunity: Opportunity): string {
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

  if (opportunity.atritos.length > 0) {
    lines.push('', `---`, `*Referência: atrito(s) #${opportunity.atritos.join(', #')}*`);
  }

  return lines.join('\n');
}

export function exportAllOpportunitiesToMarkdown(opportunities: Opportunity[]): string {
  const header = [
    '# Todas as Oportunidades — Atrito',
    '',
    `**Exportado em:** ${formatDate(new Date().toISOString())}`,
    `**Total:** ${opportunities.length} oportunidades`,
    '',
    '---',
    '',
  ].join('\n');

  const items = opportunities.map((opp) => exportOpportunityToMarkdown(opp)).join('\n\n---\n\n');

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

import { Atrito, Opportunity } from '../types';

export function exportAtritoToMarkdown(atrito: Atrito): string {
  return `# Atrito: ${atrito.title}

**Data:** ${atrito.createdAt}
**Status:** ${atrito.status}
**Contexto:** ${atrito.context}
**Intensidade:** ${atrito.intensity}
**Frequência:** ${atrito.frequency}
**Afetado:** ${atrito.affected}

## Descrição

${atrito.description}

${atrito.improvisedSolution ? `## Solução Improvisada\n\n${atrito.improvisedSolution}` : ''}
`;
}

export function exportOpportunityToMarkdown(opportunity: Opportunity): string {
  return `# Oportunidade: ${opportunity.title}

**Data:** ${opportunity.createdAt}
**Status:** ${opportunity.status}
**Prioridade:** ${opportunity.priority}
**Público:** ${opportunity.targetAudience}

## Problema Original

${opportunity.originalProblem}

## Hipótese de Solução

${opportunity.hypothesis || 'A definir'}

## Por que isso importa

${opportunity.whyItMatters || 'A definir'}

## MVP Sugerido

${opportunity.suggestedMVP || 'A definir'}

## O que NÃO construir agora

${opportunity.whatNotToBuild || 'A definir'}

## Pergunta de Validação

${opportunity.validationQuestion || 'A definir'}
`;
}

export function exportAllOpportunitiesToMarkdown(opportunities: Opportunity[]): string {
  const header = `# Todas as Oportunidades - Atrito

**Exportado em:** ${new Date().toLocaleDateString('pt-BR')}
**Total:** ${opportunities.length} oportunidades

---

`;

  const items = opportunities.map((opp) => exportOpportunityToMarkdown(opp)).join('\n---\n\n');

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

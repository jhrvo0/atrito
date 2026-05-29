import { Opportunity } from '../types';

export function generatePrompt(opportunity: Opportunity): string {
  return `# Prompt para Desenvolvimento de Produto

## Contexto

Você é um product designer/developer analisando uma oportunidade de produto identificada a partir de observações reais do dia a dia.

## Problema Observado

${opportunity.originalProblem}

## Contexto do Problema

- **Público afetado:** ${opportunity.targetAudience}
- **Prioridade:** ${opportunity.priority}
- **Status atual:** ${opportunity.status}

## Hipótese de Solução

${opportunity.hypothesis || 'A definir - descreva sua hipótese de como resolver o problema'}

## MVP Sugerido

${opportunity.suggestedMVP || 'A definir - descreva o mínimo viável para validar a hipótese'}

## Por que isso importa

${opportunity.whyItMatters || 'A definir - explique o impacto potencial'}

## Requisitos Iniciais

1. Resolver o problema principal de forma simples
2. Ser acessível para o público-alvo
3. Permitir validação rápida da hipótese
4. Não exigir infraestrutura complexa no início

## Restrições

- Não usar inteligência artificial no MVP
- Não criar backend complexo
- Focar em resolver apenas o problema principal
- Manter o custo de desenvolvimento baixo
- Priorizar usabilidade sobre funcionalidade

## O que NÃO construir agora

${opportunity.whatNotToBuild || 'Não defina ainda - liste funcionalidades que não devem ser incluídas no MVP'}

## Critérios de Sucesso

1. Pessoas do público-alvo conseguem usar sem ajuda
2. O problema principal é resolvido de forma mensurável
3. Usuários expressam satisfação com a solução
4. A solução pode ser replicada para outros contextos

## Pergunta de Validação

${opportunity.validationQuestion || 'A definir - qual pergunta precisa ser respondida antes de construir?'}

---

**Próximo passo:** Responda cada seção acima com detalhes específicos para essa oportunidade. Foque em ações concretas e mensuráveis.`;
}

import { Opportunity } from '../types';

export function generatePrompt(opportunity: Opportunity): string {
  return `# Prompt para Refinamento de Oportunidade de Produto

## Contexto

Analise a oportunidade abaixo identificada a partir de observações reais do cotidiano. O objetivo é refinar a ideia, propor um escopo de MVP claro e listar requisitos e restrições concretos.

## Problema Observado

${opportunity.originalProblem}

## Dados da Oportunidade

- **Público afetado:** ${opportunity.targetAudience}
- **Prioridade:** ${opportunity.priority}
- **Status atual:** ${opportunity.status}

## Hipótese de Solução

${opportunity.hypothesis || 'A definir — descreva sua hipótese de como resolver o problema.'}

## Por que isso importa

${opportunity.whyItMatters || 'A definir — explique o impacto potencial.'}

## O que NÃO construir agora

${opportunity.whatNotToBuild || 'A definir — liste funcionalidades que não devem ser incluídas no MVP.'}

## Pergunta de Validação

${opportunity.validationQuestion || 'A definir — qual pergunta precisa ser respondida antes de construir?'}

---

## Sua tarefa

Com base nas informações acima, responda cada seção abaixo:

### 1. Refinamento da Oportunidade
- Reformule o problema de forma mais clara e específica
- Identifique a causa raiz da fricção

### 2. Escopo do MVP
- Descreva o que o MVP deve fazer (máximo 5 funcionalidades)
- Defina o que é essencial vs. o que pode vir depois

### 3. Requisitos Funcionais
- Liste o que o usuário precisa conseguir fazer
- Priorize por ordem de importância

### 4. Restrições
- Liste limitações técnicas, de tempo ou de recurso
- Considere: sem backend complexo, sem IA, custo baixo

### 5. Critérios de Sucesso
- Como saber se o MVP funcionou?
- Defina 2-3 métricas ou sinais mensuráveis

### 6. Perguntas de Validação
- Quais perguntas responder antes de construir?
- Como descobrir se as pessoas realmente usariam?

---

*Seja específico. Evite genéricos. Foque em ações concretas e mensuráveis.*`;
}

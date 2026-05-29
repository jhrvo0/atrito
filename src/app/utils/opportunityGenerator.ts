import { Atrito, AtritoInvestigationContext, Opportunity, Priority } from '../types';

function calculatePriorityFromContext(
  practicalImpact: string,
  emotionalImpact: string,
  timesOccurred: string
): Priority {
  const strongPractical = practicalImpact === 'forte' || practicalImpact === 'muito forte';
  const strongEmotional = emotionalImpact === 'forte' || emotionalImpact === 'muito forte';
  const moderateOrAbove =
    practicalImpact === 'moderado' || practicalImpact === 'forte' || practicalImpact === 'muito forte';
  const frequent = timesOccurred === 'quase sempre' || timesOccurred === 'toda semana';

  if (strongPractical && strongEmotional) return 'alta';
  if (frequent && moderateOrAbove) return 'alta';
  if (timesOccurred === 'primeira vez' && (practicalImpact === 'leve' || practicalImpact === 'nenhum')) return 'baixa';
  return 'média';
}

function calculatePriority(intensity: Atrito['intensity'], frequency: Atrito['frequency']): Priority {
  if (intensity === 'alta' && frequency === 'frequentemente') return 'alta';
  if (intensity === 'alta' && frequency === 'às vezes') return 'alta';
  if (intensity === 'média' && frequency === 'frequentemente') return 'alta';
  if (intensity === 'média' && frequency === 'às vezes') return 'média';
  if (intensity === 'baixa' && frequency === 'uma vez') return 'baixa';
  return 'média';
}

const HYPOTHESIS_MAP: Record<Atrito['context'], string> = {
  'compra': 'Simplificar ou agilizar o processo de compra poderia reduzir a fricção e melhorar a experiência do cliente.',
  'app/site': 'Reduzir etapas ou tornar o fluxo mais intuitivo poderia diminuir a frustração e aumentar a retenção.',
  'casa': 'Um objeto, serviço ou adaptação simples poderia eliminar esse incômodo doméstico recorrente.',
  'faculdade': 'Estudantes enfrentam esse problema com frequência; uma solução leve poderia melhorar o dia a dia acadêmico.',
  'transporte': 'Resolver essa fricção no deslocamento poderia beneficiar milhares de pessoas que dependem do transporte público.',
  'trabalho': 'Uma ferramenta ou processo mais eficiente poderia recuperar tempo produtivo e reduzir frustração no trabalho.',
  'rua': 'Problemas no espaço público afetam muitas pessoas; uma solução escalável poderia melhorar a vivência urbana.',
  'atendimento': 'Melhorar a experiência de atendimento poderia reduzir filas, reclamações e perda de tempo.',
  'outro': 'Esse problema merece atenção; uma solução pensada poderia beneficiar diversas pessoas.',
};

const MVP_MAP: Record<Atrito['frequency'], string> = {
  'uma vez': 'Pesquise se outras pessoas já passaram por isso. Valide se o problema é recorrente antes de construir qualquer coisa.',
  'às vezes': 'Crie um protótipo simples (papel ou digital) para testar se uma solução resolve o problema quando ele aparece.',
  'frequentemente': 'Desenvolva um MVP funcional mínimo e teste com um grupo pequeno de usuários durante 2 semanas.',
};

export function generateOpportunityFromAtrito(
  atrito: Atrito,
  investigationContext?: AtritoInvestigationContext
): Opportunity {
  const affectedLabel =
    atrito.affected === 'eu'
      ? 'pessoas que enfrentam o mesmo problema'
      : `${atrito.affected}`;

  const hasCtx = !!investigationContext;

  const hypothesis = hasCtx && investigationContext.rootCauseGuess
    ? `A causa raiz parece ser: ${investigationContext.rootCauseGuess}. Uma solução direcionada poderia eliminar a fricção no contexto "${investigationContext.scenario || atrito.context}".`
    : HYPOTHESIS_MAP[atrito.context] || 'Uma solução pensada poderia resolver esse problema de forma simples e eficiente.';

  const whyItMatters = hasCtx
    ? (() => {
        const parts: string[] = [];
        if (investigationContext.scenario) {
          parts.push(`No cenário "${investigationContext.scenario}"`);
        } else {
          parts.push(`No contexto de ${atrito.context}`);
        }
        if (investigationContext.timesOccurred) {
          parts.push(`isso já aconteceu ${investigationContext.timesOccurred}`);
        }
        if (investigationContext.practicalImpact && investigationContext.practicalImpact !== 'nenhum') {
          parts.push(`com impacto prático ${investigationContext.practicalImpact}`);
        }
        if (investigationContext.emotionalImpact && investigationContext.emotionalImpact !== 'nenhum') {
          parts.push(`e impacto emocional ${investigationContext.emotionalImpact}`);
        }
        if (parts.length > 0) {
          parts[0] = parts[0].charAt(0).toLowerCase() + parts[0].slice(1);
          return parts.join(', ') + '. Resolver isso poderia melhorar significativamente a experiência.';
        }
        return `Esse problema acontece ${atrito.frequency} no contexto de ${atrito.context}, afetando ${atrito.affected}. Quando algo frustra várias pessoas com frequência, vale investigar se existe uma solução viável.`;
      })()
    : `Esse problema acontece ${atrito.frequency} no contexto de ${atrito.context}, afetando ${atrito.affected}. Quando algo frustra várias pessoas com frequência, vale investigar se existe uma solução viável.`;

  const suggestedMVP = hasCtx && investigationContext.currentWorkaround
    ? `Você já improvisou: "${investigationContext.currentWorkaround}". Transforme isso em um protótipo testável. Valide com pessoas que enfrentam o mesmo problema.`
    : MVP_MAP[atrito.frequency] || 'Valide a demanda com uma pesquisa simples antes de construir.';

  const whatNotToBuild = hasCtx
    ? 'Não construa um produto completo no início. Evite backend complexo, integrações, gamificação ou qualquer coisa que não seja essencial para validar a hipótese. Foque no que pode ser testado com o menor esforço possível.'
    : 'Não construa um produto completo no início. Evite backend complexo, integrações, gamificação ou qualquer coisa que não seja essencial para validar a hipótese.';

  const validationQuestion = hasCtx && investigationContext.evidence
    ? `Você já tem evidência de que o problema é real: "${investigationContext.evidence}". A próxima pergunta é: quantas pessoas se identificariam com isso e estariam dispostas a usar uma solução?`
    : `Se existisse uma solução simples para isso, quantas pessoas usariam? Como descobrir isso sem construir nada?`;

  const priority = hasCtx && investigationContext.practicalImpact && investigationContext.emotionalImpact && investigationContext.timesOccurred
    ? calculatePriorityFromContext(
        investigationContext.practicalImpact,
        investigationContext.emotionalImpact,
        investigationContext.timesOccurred
      )
    : calculatePriority(atrito.intensity, atrito.frequency);

  return {
    id: Date.now().toString(),
    title: atrito.title,
    originalProblem: atrito.description,
    hypothesis,
    targetAudience: affectedLabel,
    whyItMatters,
    suggestedMVP,
    whatNotToBuild,
    validationQuestion,
    priority,
    status: 'ideia',
    createdAt: new Date().toISOString(),
    atritos: [atrito.id],
  };
}

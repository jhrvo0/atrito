import { Atrito, Opportunity, Priority } from '../types';

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

export function generateOpportunityFromAtrito(atrito: Atrito): Opportunity {
  const affectedLabel =
    atrito.affected === 'eu'
      ? 'pessoas que enfrentam o mesmo problema'
      : `${atrito.affected}`;

  return {
    id: Date.now().toString(),
    title: atrito.title,
    originalProblem: atrito.description,
    hypothesis: HYPOTHESIS_MAP[atrito.context] || 'Uma solução pensada poderia resolver esse problema de forma simples e eficiente.',
    targetAudience: affectedLabel,
    whyItMatters: `Esse problema acontece ${atrito.frequency} no contexto de ${atrito.context}, afetando ${atrito.affected}. Quando algo frustra várias pessoas com frequência, vale investigar se existe uma solução viável.`,
    suggestedMVP: MVP_MAP[atrito.frequency] || 'Valide a demanda com uma pesquisa simples antes de construir.',
    whatNotToBuild: 'Não construa um produto completo no início. Evite backend complexo, integrações, gamificação ou qualquer coisa que não seja essencial para validar a hipótese.',
    validationQuestion: `Se existisse uma solução simples para isso, quantas pessoas usariam? Como descobrir isso sem construir nada?`,
    priority: calculatePriority(atrito.intensity, atrito.frequency),
    status: 'ideia',
    createdAt: new Date().toISOString(),
    atritos: [atrito.id],
  };
}

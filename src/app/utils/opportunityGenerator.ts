import { Atrito, Opportunity } from '../types';

export function generateOpportunityFromAtrito(atrito: Atrito): Opportunity {
  const hypothesisMap: Record<string, string> = {
    'compra': 'Uma solução que reduza o tempo de espera ou melhore a experiência de compra poderia impactar positivamente muchos usuários.',
    'app/site': 'Simplificar o fluxo de autenticação ou reduzir fricções digitais poderia melhorar significativamente a retenção.',
    'casa': 'Um produto ou serviço que resolva esse incômodo doméstico poderia ter demanda real no mercado.',
    'faculdade': 'Estudantes enfrentam esse problema regularmente; uma solução simples poderia melhorar a experiência acadêmica.',
    'transporte': 'Mobilidade urbana tem muitas fricções; resolver essaSpecificamente poderia beneficiar milhares de pessoas.',
    'trabalho': 'Produtividade no trabalho é afetada porSmallThings; uma solução focada poderia ter alto impacto.',
    'rua': 'Problemas no espaço público afetam a todos; uma solução escalável poderia melhorar a vida na cidade.',
    'atendimento': 'Atendimento ao cliente é uma dor comum; melhorar essa experiência poderia gerar valor real.',
    'outro': 'Esse problema merece atenção; uma solução pensada poderia beneficiar diversas pessoas.',
  };

  const mvpMap: Record<string, string> = {
    'uma vez': 'Comece com uma pesquisa rápida para validar se outras pessoas já enfrentaram o mesmo problema.',
    'às vezes': 'Crie um protótipo simples ou FAQ para testar se a solução resolve o problema quando ele ocorre.',
    'frequentemente': 'Desenvolva um MVP funcional que possa ser testado por um grupo pequeno de usuários por 2 semanas.',
  };

  const priorityMap: Record<string, 'baixa' | 'média' | 'alta'> = {
    'baixa': 'baixa',
    'média': 'média',
    'alta': 'alta',
  };

  return {
    id: Date.now().toString(),
    title: atrito.title,
    originalProblem: atrito.description,
    hypothesis: hypothesisMap[atrito.context] || 'Uma solução pensada poderia resolver esse problema de forma elegante.',
    targetAudience: atrito.affected === 'eu' ? 'Usuários que enfrentam o mesmo problema' : `${atrito.affected.charAt(0).toUpperCase() + atrito.affected.slice(1)} afetados por esse problema`,
    whyItMatters: `Esse problema ocorre ${atrito.frequency} no contexto de ${atrito.context}, afetando ${atrito.affected}.`,
    suggestedMVP: mvpMap[atrito.frequency] || 'Valide a demanda com uma pesquisa simples antes de construir.',
    whatNotToBuild: 'Não construa um produto complexo no início. Valide a hipótese com o menor esforço possível.',
    validationQuestion: `Quantas pessoas já enfrentaram esse problema e tentaram resolver de outra forma?`,
    priority: priorityMap[atrito.intensity] || 'média',
    status: 'ideia',
    createdAt: new Date().toISOString().split('T')[0],
    atritos: [atrito.id],
  };
}

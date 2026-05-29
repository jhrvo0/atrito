import { Atrito, Opportunity } from '../types';

export const mockAtritos: Atrito[] = [
  {
    id: '1',
    title: 'Fila lenta no caixa do supermercado',
    description:
      'Apenas um caixa aberto durante horário de pico. Esperei 25 minutos com poucas compras.',
    context: 'compra',
    intensity: 'média',
    frequency: 'frequentemente',
    affected: 'público geral',
    improvisedSolution: 'Tentei usar o caixa de autoatendimento, mas estava quebrado',
    status: 'observado',
    createdAt: '2026-05-28'
  },
  {
    id: '2',
    title: 'App do banco pede código a cada login',
    description:
      'Mesmo salvando o dispositivo como confiável, sempre pede código SMS. Demora muito.',
    context: 'app/site',
    intensity: 'alta',
    frequency: 'frequentemente',
    affected: 'eu',
    improvisedSolution: 'Anoto o código antes de abrir o app',
    status: 'virou ideia',
    createdAt: '2026-05-27'
  },
  {
    id: '3',
    title: 'Porta do banheiro não fecha direito',
    description: 'A fechadura está desalinhada. Preciso forçar para trancar.',
    context: 'casa',
    intensity: 'baixa',
    frequency: 'às vezes',
    affected: 'eu',
    status: 'observado',
    createdAt: '2026-05-26'
  },
  {
    id: '4',
    title: 'Não tem lugar para sentar na biblioteca',
    description:
      'Durante a semana de provas, a biblioteca lota cedo. Muita gente ocupa mesa sozinha.',
    context: 'faculdade',
    intensity: 'alta',
    frequency: 'frequentemente',
    affected: 'grupo',
    improvisedSolution: 'Chego às 7h para garantir lugar',
    status: 'observado',
    createdAt: '2026-05-25'
  },
  {
    id: '5',
    title: 'Ônibus não para no ponto final',
    description: 'Motorista decide parar antes porque "está atrasado". Tenho que andar 3 quadras.',
    context: 'transporte',
    intensity: 'média',
    frequency: 'às vezes',
    affected: 'público geral',
    status: 'observado',
    createdAt: '2026-05-24'
  }
];

export const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Sistema de reserva de mesas na biblioteca',
    originalProblem: 'Não tem lugar para sentar na biblioteca durante semana de provas',
    hypothesis:
      'Um sistema simples de reserva de mesas por horário poderia distribuir melhor o espaço e reduzir ocupação ociosa',
    targetAudience: 'Estudantes universitários durante período de provas',
    whyItMatters:
      'Ambiente de estudo adequado impacta diretamente no desempenho acadêmico. Muitos alunos desistem de usar a biblioteca pela incerteza.',
    suggestedMVP:
      'Planilha Google compartilhada com slots de 2 horas por mesa. Validar por 1 semana se as pessoas respeitam.',
    whatNotToBuild: 'App nativo, integração com sistema acadêmico, controle de presença automatizado',
    validationQuestion: 'Quantos alunos fariam reserva se fosse simples? A biblioteca aceitaria testar?',
    priority: 'alta',
    status: 'ideia',
    createdAt: '2026-05-25',
    atritos: ['4']
  },
  {
    id: '2',
    title: 'Rastreador de filas em supermercados',
    originalProblem: 'Fila lenta no caixa do supermercado com apenas um caixa aberto',
    hypothesis:
      'App que mostra tempo de espera em tempo real em cada supermercado próximo, alimentado por usuários',
    targetAudience: 'Pessoas que fazem compras rápidas em horário de pico',
    whyItMatters:
      'Tempo é recurso escasso. Quem tem 20 minutos para comprar poderia escolher melhor onde ir.',
    suggestedMVP:
      'Bot no Telegram onde usuários reportam tempo de fila atual. Outros consultam antes de sair de casa.',
    whatNotToBuild: 'Parceria com supermercados, câmeras com IA, gamificação de pontos',
    validationQuestion: 'Quantas pessoas reportariam a fila se ganhassem 30 segundos de informação útil?',
    priority: 'média',
    status: 'validando',
    createdAt: '2026-05-28',
    atritos: ['1']
  }
];

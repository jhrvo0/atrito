# Atrito

**Pequenos incômodos revelam bons produtos.**

Atrito é um aplicativo web minimalista para registrar pequenos problemas, fricções e incômodos do dia a dia, transformando esses registros em oportunidades de produto, melhorias de experiência e ideias de pesquisa.

## Funcionalidades

1. **Registrar atritos** — Formulário com contexto, intensidade, frequência e público afetado
2. **Buscar e filtrar** — Busca por título, descrição e solução improvisada; filtros por contexto, intensidade, frequência e status
3. **Aprofundar contexto** — Formulário rico para enriquecer o atrito com cenário, impactos, causas raiz e evidências
4. **Transformar em oportunidade** — Geração automática com hipótese, MVP sugerido e prioridade calculada
5. **Gerar prompts para IA** — 6 tipos de prompt estruturado para diferentes objetivos de análise
6. **Gerenciar oportunidades** — Filtros por status e prioridade, alteração de status, exportação
7. **Analisar padrões** — Estatísticas, distribuições e contextos mais problemáticos
8. **Exportar Markdown** — Individual ou em lote, compatível com GitHub Issues e Notion
9. **Persistência local** — Todos os dados salvos no localStorage

## Como Instalar

```bash
git clone https://github.com/jhrvo0/atrito.git
cd atrito
npm install
```

## Como Rodar

```bash
npm run dev
```

Acesse http://localhost:5173

## Build para Produção

```bash
npm run build
```

O resultado estará na pasta `dist/`.

## Estrutura do Projeto

```
src/
├── app/
│   ├── components/
│   │   ├── Button.tsx          - Botão com variantes
│   │   ├── Card.tsx            - Container de conteúdo
│   │   ├── ConfirmDialog.tsx   - Modal de confirmação
│   │   ├── EmptyState.tsx      - Estado vazio
│   │   ├── Input.tsx           - Campo de texto com ícone
│   │   ├── InvestigationContextForm.tsx - Formulário de aprofundamento
│   │   ├── InvestigationSummary.tsx     - Resumo do contexto aprofundado
│   │   ├── Modal.tsx           - Modal genérico
│   │   ├── MobileNav.tsx       - Navegação mobile
│   │   ├── Select.tsx          - Seleção dropdown
│   │   ├── Sidebar.tsx         - Navegação desktop
│   │   ├── Tag.tsx             - Etiquetas coloridas
│   │   ├── Textarea.tsx        - Campo de texto multilinha
│   │   └── Toast.tsx           - Notificações toast
│   ├── context/
│   │   └── AppContext.tsx      - Estado global com persistência
│   ├── pages/
│   │   ├── Inicio.tsx          - Página inicial com stats
│   │   ├── Atritos.tsx         - Listagem, busca e filtros
│   │   ├── NovoAtrito.tsx      - Formulário de cadastro
│   │   ├── Oportunidades.tsx   - Gestão de oportunidades e prompts
│   │   └── Padroes.tsx         - Análise e padrões
│   ├── utils/
│   │   ├── date.ts             - Utilitários de data (PT-BR)
│   │   ├── markdown.ts         - Exportação em Markdown
│   │   ├── opportunityGenerator.ts - Geração de oportunidades
│   │   ├── promptGenerator.ts  - Geração de prompts para IA
│   │   ├── promptTemplates.ts  - Templates de prompt
│   │   └── storage.ts          - Persistência no localStorage
│   ├── constants.ts            - Opções tipadas e validadores
│   ├── types.ts                - Tipos TypeScript
│   └── App.tsx                 - Componente raiz com rotas
└── styles/
    ├── fonts.css               - Fontes (Newsreader + Work Sans)
    ├── index.css               - Entry point de estilos
    ├── tailwind.css            - Configuração Tailwind
    └── theme.css               - Tokens de design
```

## Fluxo Recomendado

O app foi pensado para um fluxo de 4 etapas:

1. **Registrar** — Anote o atrito com contexto, intensidade e frequência
2. **Aprofundar** — Preencha cenário, impactos, causa raiz e evidências (opcional, mas melhora muito a qualidade dos prompts)
3. **Transformar** — Gere uma oportunidade automaticamente a partir do atrito
4. **Gerar prompt** — Escolha o tipo de análise e gere um prompt estruturado para IA

## Contexto Aprofundado

O formulário de aprofundamento permite enriquecer um atrito com informações detalhadas:

- **Cenário** — Onde e quando aconteceu
- **Frequência real** — Quantas vezes já ocorreu
- **Impacto prático e emocional** — Escala de 5 níveis
- **Causa raiz** — Hipótese sobre o motivo do atrito
- **Evidências** — Dados, prints ou observações relevantes
- **Perguntas** — O que você gostaria de perguntar a quem passou por isso

Preencher o contexto é opcional, mas gera prompts muito mais precisos e úteis.

## Prompt Lab

O Prompt Lab permite gerar prompts estruturados para diferentes objetivos. Cada prompt inclui os dados do atrito, o contexto aprofundado (quando disponível) e os dados da oportunidade.

### Tipos de Prompt Disponíveis

| Tipo | Objetivo |
|------|----------|
| **Aprofundar dor** | Identificar dores explícitas, ocultas, causas raiz e lacunas de informação |
| **Brainstorm de soluções** | Gerar soluções do simples ao ambicioso, com riscos e MVP |
| **Pesquisa com usuários** | Criar plano de entrevistas, hipóteses a validar e sinais de problema real |
| **Definir MVP** | Definir escopo mínimo, requisitos e critérios de sucesso |
| **Criar issue técnica** | Gerar conteúdo para GitHub Issue com contexto, requisitos e critérios de aceite |
| **Validar oportunidade** | Avaliar potencial, riscos, formas de validação e próximos passos |

Cada prompt é exportável como Markdown, pronto para colar em qualquer assistente de IA.

## Tecnologias

- **React 18** — Framework UI
- **TypeScript** — Tipagem estática
- **Tailwind CSS v4** — Estilização utility-first
- **Vite** — Build tool e dev server
- **Lucide React** — Ícones
- **Context API** — Gerenciamento de estado
- **localStorage** — Persistência local

## Persistência

Todos os dados são salvos no `localStorage` do navegador:

- **Atritos** — Lista completa de registros
- **Oportunidades** — Ideias geradas a partir dos atritos
- **Contextos aprofundados** — Detalhes enriquecidos de cada atrito
- **Filtros** — Filtros ativos nas páginas de atritos e oportunidades

Os dados persistem entre sessões. Para backup, use a funcionalidade de exportação em Markdown.

**Nota:** Os dados ficam apenas no navegador atual.

## Design

- **Estética:** Archival Minimalism — inspirado em catálogos de museus
- **Tipografia:** Newsreader (títulos) + Work Sans (corpo)
- **Paleta:** Fundo `#FAFAFA`, texto `#1A1A1A`, primário `#2563EB`
- **Responsivo:** Sidebar no desktop, menu hamburger no mobile

## Limitações Conhecidas

- Dados ficam apenas no navegador (sem sincronização entre dispositivos)
- Sem autenticação ou multiusuário
- Sem backup automático

## Próximos Passos

- Exportação em JSON para backup completo
- Importação de dados
- Gráficos interativos na página de padrões
- Modo escuro

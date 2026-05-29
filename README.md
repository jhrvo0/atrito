# Atrito

**Pequenos incômodos revelam bons produtos.**

Atrito é um aplicativo web minimalista para registrar pequenos problemas, fricções e incômodos do dia a dia, transformando esses registros em oportunidades de produto, melhorias de experiência e ideias de pesquisa.

## Funcionalidades

1. **Registrar atritos** — Formulário com contexto, intensidade, frequência e público afetado
2. **Buscar e filtrar** — Busca por título, descrição e solução improvisada; filtros por contexto, intensidade, frequência e status
3. **Transformar em oportunidade** — Geração automática com hipótese, MVP sugerido e prioridade calculada
4. **Gerenciar oportunidades** — Filtros por status e prioridade, alteração de status, exportação
5. **Analisar padrões** — Estatísticas, distribuições e contextos mais problemáticos
6. **Exportar Markdown** — Individual ou em lote, compatível com GitHub Issues e Notion
7. **Gerar prompts para IA** — Prompt estruturado para refinar oportunidades, com visualização e cópia
8. **Persistência local** — Todos os dados salvos no localStorage

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
│   │   ├── Oportunidades.tsx   - Gestão de oportunidades
│   │   └── Padroes.tsx         - Análise e padrões
│   ├── utils/
│   │   ├── date.ts             - Utilitários de data (PT-BR)
│   │   ├── markdown.ts         - Exportação em Markdown
│   │   ├── opportunityGenerator.ts - Geração de oportunidades
│   │   ├── promptGenerator.ts  - Geração de prompts para IA
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

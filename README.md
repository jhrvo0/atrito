# Atrito

**Pequenos incômodos revelam bons produtos.**

Atrito é um aplicativo web minimalista para registrar pequenos problemas, fricções e incômodos do dia a dia, transformando essas observações em oportunidades de produto, melhorias de experiência e ideias de pesquisa.

## Conceito

A ideia central é que os pequenos atritos que encontramos no cotidiano podem revelar oportunidades valiosas de produto. Ao documentar sistematicamente esses incômodos, conseguimos identificar padrões, priorizar problemas reais e gerar hipóteses de soluções baseadas em observações concretas.

## Funcionalidades

### Fluxo Completo

1. **Registrar um atrito** - Formulário completo com contexto, intensidade, frequência e afetados
2. **Ver atritos na listagem** - Cards com todas as informações e ações rápidas
3. **Filtrar e buscar** - Busca por palavra-chave e filtros por contexto, intensidade, frequência e status
4. **Transformar em oportunidade** - Geração automática de oportunidade com hipótese e MVP sugerido
5. **Gerenciar oportunidades** - Status, prioridade, exportação e geração de prompts
6. **Analisar padrões** - Estatísticas, distribuições e contextos mais problemáticos
7. **Exportar dados** - Markdown individual ou em lote para GitHub Issues, Notion ou documentação
8. **Gerar prompts** - Prompts estruturados para IA com problema, hipótese e requisitos
9. **Persistência local** - Todos os dados salvos no localStorage, nada se perde ao recarregar

### Páginas

#### 1. Início
- Nome do app e frase de apresentação
- Botão para registrar novo atrito
- Cards de resumo: total de atritos, oportunidades, contexto recorrente, alta intensidade
- Lista dos atritos recentes

#### 2. Atritos
- Listagem completa em cards
- Busca por palavra-chave
- Filtros por contexto, intensidade, frequência e status
- Ações: ver detalhes, transformar em oportunidade, exportar Markdown, excluir
- Modal com detalhes completos e mudança de status
- Empty state quando não há registros

#### 3. Novo Atrito
- Formulário com campos: título, descrição, contexto, intensidade, frequência, afetados, solução improvisada
- Validação de campos obrigatórios
- Status inicial automático: "observado"
- Data de criação automática

#### 4. Oportunidades
- Cards com problema, hipótese, público, MVP e prioridade
- Filtros por status
- Ações: ver detalhes, alterar status/prioridade, gerar prompt, exportar, excluir
- Exportação em lote de todas as oportunidades

#### 5. Padrões Encontrados
- Estatísticas gerais
- Atritos por contexto com barras de progresso
- Contextos mais problemáticos
- Distribuição por status e frequência
- Atritos de maior intensidade
- Problemas recorrentes
- Oportunidades com maior potencial

## Status dos Atritos

- **Observado** - Atrito registrado, aguardando análise
- **Investigando** - Sendo analisado ou pesquisado
- **Virou ideia** - Transformado em oportunidade de produto
- **Descartado** - Não será tratado

## Status das Oportunidades

- **Ideia** - Conceito inicial
- **Validando** - Sendo testado ou pesquisado
- **Protótipo** - Em fase de prototipação
- **Em desenvolvimento** - Sendro construído
- **Arquivada** - Não será desenvolvida

## Tecnologias

- **React 18** - Framework UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4** - Estilização utility-first
- **Vite** - Build tool e dev server
- **Lucide React** - Ícones line style
- **Context API** - Gerenciamento de estado
- **localStorage** - Persistência local

## Como Instalar

```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre na pasta do projeto
cd atrito

# Instale as dependências
pnpm install
```

## Como Rodar

```bash
# Inicie o servidor de desenvolvimento
pnpm dev

# Acesse no navegador
# http://localhost:5173
```

## Build para Produção

```bash
# Gere a versão de produção
pnpm build

# O resultado estará na pasta dist/
```

## Estrutura do Projeto

```
src/
├── app/
│   ├── components/
│   │   ├── Button.tsx         - Botão com variantes
│   │   ├── Card.tsx           - Container de conteúdo
│   │   ├── EmptyState.tsx     - Estado vazio
│   │   ├── Input.tsx          - Campo de texto
│   │   ├── Modal.tsx          - Modal/Dialog
│   │   ├── Select.tsx         - Seleção dropdown
│   │   ├── Sidebar.tsx        - Navegação desktop
│   │   ├── MobileNav.tsx      - Navegação mobile
│   │   ├── Tag.tsx            - Etiquetas/badges
│   │   └── Textarea.tsx       - Campo de texto multilinha
│   ├── context/
│   │   └── AppContext.tsx     - Estado global com persistência
│   ├── data/
│   │   └── mockData.ts        - Dados de exemplo iniciais
│   ├── pages/
│   │   ├── Atritos.tsx        - Listagem e gerenciamento
│   │   ├── Inicio.tsx         - Página inicial
│   │   ├── NovoAtrito.tsx     - Formulário de cadastro
│   │   ├── Oportunidades.tsx  - Gestão de oportunidades
│   │   └── Padroes.tsx        - Análise e padrões
│   ├── utils/
│   │   ├── storage.ts         - Persistência no localStorage
│   │   ├── markdown.ts        - Exportação em Markdown
│   │   ├── opportunityGenerator.ts - Geração de oportunidades
│   │   └── promptGenerator.ts - Geração de prompts para IA
│   ├── types.ts               - Tipos TypeScript
│   └── App.tsx                - Componente raiz com rotas
└── styles/
    ├── fonts.css              - Importação de fontes
    ├── index.css              - Entry point de estilos
    ├── tailwind.css           - Configuração Tailwind
    └── theme.css              - Tokens de design
```

## Persistência

Todos os dados são salvos no `localStorage` do navegador:

- **Atritos** - Lista completa de registros
- **Oportunidades** - Ideias geradas a partir dos atritos
- **Filtros** - Filtros ativos na página de atritos

Os dados persistem entre sessões. Ao recarregar a página ou fechar e reabrir o navegador, todos os registros continuam disponíveis.

**Nota:** Os dados ficam apenas no navegador atual. Para backup, use a funcionalidade de exportação em Markdown.

## Design

### Estética
- **Archival Minimalism** - Inspirado em catálogos de museus
- Design limpo, moderno e elegante
- Bastante espaço em branco
- Hierarquia visual clara

### Tipografia
- **Display**: Newsreader (serif elegante para títulos)
- **Body**: Work Sans (sans-serif clean para UI)

### Paleta de Cores
- Background: `#FAFAFA` (cinza ultra claro)
- Foreground: `#1A1A1A` (preto suave)
- Primary: `#2563EB` (azul equilibrado)
- Muted: `#6B6B6B` (cinza médio)
- Border: `rgba(0, 0, 0, 0.08)` (hairline sutil)

### Responsividade
- Desktop: sidebar lateral (240px) + conteúdo principal
- Mobile: menu hamburger + navegação expansível
- Breakpoint: 768px (md)

## Filosofia

Este não é mais um app de notas genérico. É uma ferramenta de **observação deliberada** do mundo. A premissa é simples: problemas pequenos e frequentes, quando documentados sistematicamente, revelam lacunas de mercado, oportunidades de produto e insights sobre comportamento humano que passariam despercebidos.

O design minimalista e sério reflete essa intenção: é um caderno de pesquisa, não um jogo. É para quem quer transformar observação casual em metodologia.

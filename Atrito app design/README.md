# Atrito

**Pequenos incômodos revelam bons produtos.**

Atrito é um aplicativo minimalista para registrar pequenos problemas, fricções e incômodos do dia a dia, transformando essas observações em oportunidades de produto, melhorias de experiência e ideias de pesquisa.

## Conceito

A ideia central é que os pequenos atritos que encontramos no cotidiano podem revelar oportunidades valiosas de produto. Ao documentar sistematicamente esses incômodos, conseguimos identificar padrões, priorizar problemas reais e gerar hipóteses de soluções baseadas em observações concretas.

## Páginas

### 1. Início
Tela de boas-vindas com:
- Resumo estatístico (total de atritos, oportunidades, contextos recorrentes, alta intensidade)
- Lista de atritos recentes
- Call-to-action para registrar novo atrito

### 2. Atritos
Página de listagem e gerenciamento de atritos com:
- Busca textual
- Filtros por contexto, intensidade, frequência e status
- Visualização em cards
- Ações: ver detalhes, transformar em oportunidade, exportar e excluir
- Modal com detalhes completos do atrito

### 3. Novo Atrito
Formulário para registrar novos atritos com campos:
- Título curto
- Descrição detalhada
- Contexto (casa, rua, faculdade, trabalho, transporte, app/site, compra, atendimento, outro)
- Intensidade (baixa, média, alta)
- Frequência (uma vez, às vezes, frequentemente)
- Quem foi afetado (eu, outra pessoa, grupo, público geral)
- Solução improvisada (opcional)

### 4. Oportunidades
Banco de ideias geradas a partir dos atritos, com:
- Filtros por status
- Cards com problema original, hipótese, público-alvo e prioridade
- Modal detalhado com todos os campos da oportunidade
- Função para gerar prompt estruturado (copia para área de transferência)
- Gerenciamento de status (ideia → validando → protótipo → em desenvolvimento → arquivada)

### 5. Padrões Encontrados
Painel de análise com:
- Estatísticas gerais
- Distribuição de atritos por contexto (com barras horizontais)
- Contextos mais problemáticos
- Atritos de maior intensidade
- Problemas recorrentes
- Oportunidades de alta prioridade

## Design

### Estética
- **Archival Minimalism**: Inspirado em catálogos de museus (MoMA, Rijksmuseum)
- Design limpo, moderno e elegante
- Bastante espaço em branco
- Hierarquia visual clara
- Bordas suaves e cards discretos

### Tipografia
- **Display**: Newsreader (serif elegante para títulos)
- **Body**: Work Sans (sans-serif clean para UI e corpo)

### Paleta de Cores
- Background: `#FAFAFA` (cinza ultra claro)
- Foreground: `#1A1A1A` (preto suave)
- Primary: `#2563EB` (azul equilibrado)
- Muted: `#6B6B6B` (cinza médio para labels)
- Border: `rgba(0, 0, 0, 0.08)` (hairline sutil)

### Responsividade
- Desktop: sidebar lateral (240px) + conteúdo principal
- Mobile: menu hamburger no topo + navegação expansível
- Breakpoint: 768px (md)
- Cards adaptam layout de horizontal para vertical em telas menores
- Padding e tamanhos de fonte ajustados para mobile

## Estrutura de Arquivos

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
│   │   └── AppContext.tsx     - Estado global da aplicação
│   ├── data/
│   │   └── mockData.ts        - Dados de exemplo
│   ├── pages/
│   │   ├── Atritos.tsx        - Listagem de atritos
│   │   ├── Inicio.tsx         - Página inicial
│   │   ├── NovoAtrito.tsx     - Formulário de atrito
│   │   ├── Oportunidades.tsx  - Gestão de oportunidades
│   │   └── Padroes.tsx        - Analytics e padrões
│   ├── types.ts               - Tipos TypeScript
│   └── App.tsx                - Componente raiz
└── styles/
    ├── fonts.css              - Importação de fontes
    ├── index.css              - Entry point de estilos
    ├── tailwind.css           - Configuração Tailwind
    └── theme.css              - Tokens de design

guidelines/
└── Guidelines.md              - Documentação de design
```

## Tecnologias

- **React 18** - Framework UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4** - Estilização utility-first
- **Lucide React** - Ícones line style
- **Context API** - Gerenciamento de estado
- **Vite** - Build tool

## Funcionalidades

- ✅ Registro de atritos com classificação detalhada
- ✅ Transformação de atritos em oportunidades
- ✅ Busca e filtros múltiplos
- ✅ Análise de padrões e contextos
- ✅ Geração de prompts estruturados
- ✅ Interface responsiva (desktop + mobile)
- ✅ Empty states informativos
- ✅ Navegação intuitiva
- ✅ Modal para detalhes expandidos

## Próximos Passos (Sugestões)

1. **Persistência**: Integrar com Supabase ou localStorage para salvar dados
2. **Exportação**: Permitir exportar atritos/oportunidades como CSV ou JSON
3. **Tags customizadas**: Adicionar sistema de tags personalizadas
4. **Relacionamentos**: Vincular múltiplos atritos a uma oportunidade
5. **Timeline**: Visualização temporal dos atritos
6. **Colaboração**: Compartilhar atritos/oportunidades com outras pessoas
7. **Templates**: Templates de oportunidades por tipo de problema
8. **Notificações**: Lembrar de revisar oportunidades antigas

## Filosofia do Projeto

Este não é mais um app de notas genérico. É uma ferramenta de **observação deliberada** do mundo. A premissa é simples: problemas pequenos e frequentes, quando documentados sistematicamente, revelam lacunas de mercado, oportunidades de produto e insights sobre comportamento humano que passariam despercebidos.

O design minimalista e sério reflete essa intenção: é um caderno de pesquisa, não um jogo. É para quem quer transformar observação casual em metodologia.

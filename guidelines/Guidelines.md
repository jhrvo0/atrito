# Atrito Design Guidelines

## Conceito

Atrito é um aplicativo minimalista para registrar pequenos incômodos, problemas e fricções do dia a dia, transformando essas observações em oportunidades de produto. A sensação visual deve ser de uma ferramenta indie de produtividade, um caderno digital de pesquisa ou um dashboard leve.

## Aesthetic Stance: Archival Minimalism

Inspirado em catálogos de museus (MoMA, Rijksmuseum) — seções numeradas, pairings serif/sans clean, neutrals texturizados, composição reverente. O produto deve parecer sério, calmo e útil, mas não corporativo demais.

## Typography

### Display: Newsreader
Serif elegante e moderna para títulos e headings principais. Transmite seriedade e clareza sem peso corporativo.

### Body: Work Sans
Sans-serif clean e altamente legível para texto de corpo, labels e UI. Excelente para interfaces e leitura prolongada.

### Hierarchy
- H1: Newsreader, 32px (2rem), medium weight
- H2: Newsreader, 24px (1.5rem), medium weight
- H3: Work Sans, 18px (1.125rem), medium weight
- Body: Work Sans, 16px (1rem), regular weight
- Small: Work Sans, 14px (0.875rem), regular weight
- Caption: Work Sans, 12px (0.75rem), regular weight

## Color Palette

### Neutrals (fundo claro)
- Background: `#FAFAFA` (cinza ultra claro)
- Surface/Card: `#FFFFFF` (branco puro)
- Border: `rgba(0, 0, 0, 0.08)` (hairline sutil)

### Text
- Foreground: `#1A1A1A` (preto suave)
- Muted: `#6B6B6B` (cinza médio para labels)
- Subtle: `#9CA3AF` (cinza claro para metadados)

### Accent (cor de destaque)
- Primary: `#2563EB` (azul equilibrado, não saturado)
- Primary hover: `#1D4ED8`
- Primary subtle: `#DBEAFE` (backgrounds suaves)

### Semantic
- Success: `#10B981` (verde suave)
- Warning: `#F59E0B` (amarelo/laranja)
- Destructive: `#EF4444` (vermelho controlado)

## Spacing Scale

Baseado em múltiplos de 4px para consistência:
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

## Components

### Cards
- Background: branco
- Border: 1px solid border
- Border radius: 8px
- Padding: 20px (lg: 24px)
- Shadow: nenhuma ou extremamente sutil (0 1px 3px rgba(0,0,0,0.04))

### Buttons
- Primary: bg-primary, text-white, medium weight
- Secondary: border com bg-transparent, text-foreground
- Ghost: text-foreground com hover:bg-muted
- Border radius: 6px
- Padding: 10px 20px (md: 12px 24px)
- Transition: all 150ms ease

### Tags
- Small pills com background suave
- Border radius: 4px
- Padding: 4px 10px
- Font size: 12px
- Cores contextuais suaves (não saturadas)

### Forms
- Inputs: border 1px, background branco/transparent
- Border radius: 6px
- Padding: 10px 14px
- Focus: ring azul sutil
- Labels acima dos campos, medium weight

## Layout Principles

### Whitespace
Generoso uso de espaço em branco. Seções devem respirar. Padding interno de cards e containers sempre >= 20px.

### Grid
- Desktop: sidebar 240px + main content com max-width 1200px
- Mobile: stack vertical, sidebar vira bottom nav ou menu hamburger

### Hierarchy Visual
Clara distinção entre níveis de informação:
1. Títulos grandes (H1/H2 em Newsreader)
2. Conteúdo principal (Body em Work Sans)
3. Metadados e labels (Small/Caption em cinza muted)

### Density
Moderada — não muito apertado (evitar sensação de planilha), não muito espaçado (evitar sensação de vazio).

## UI Patterns

### Navigation
- Sidebar simples no desktop com items claramente agrupados
- Bottom nav ou menu compacto no mobile
- Indicador de página ativa sutil (background ou border lateral)

### Filters & Search
- Inputs de busca com ícone de lupa
- Filtros em linha (desktop) ou painel dropdown (mobile)
- Botão "Limpar filtros" sempre visível quando filtros ativos

### Empty States
- Ícone simples (line icon, não ilustração)
- Texto curto explicativo
- CTA para ação primária

### Modals
- Overlay com opacity 0.5
- Modal centralizado, max-width 600px
- Padding generoso (32px)
- Close button no canto superior direito

## Visual Craft

### Borders
Hairline rules de 1px com low opacity. Borders devem organizar, não dominar.

### Transitions
Suaves e rápidas (150ms ease). Aplicar em hover states, focus, e toggle de UI elements.

### Icons
Line icons, não filled. Preferir Lucide React. Tamanho padrão: 20px.

### Focus States
Anel azul sutil (2px) com opacity reduzida. Sempre visível para acessibilidade.

## Content Guidelines

### Placeholder Content
Usar dados realistas:
- Nomes: "Maria Silva", "João Santos"
- Contextos: "Casa", "Trabalho", "Transporte"
- Datas: formato brasileiro (DD/MM/YYYY)
- Descrições: frases curtas e específicas, nunca lorem ipsum

### Tone of Voice
- Direto e funcional
- Sem emojis ou humor exagerado
- Labels claros: "Registrar atrito", "Transformar em oportunidade"
- Evitar jargão desnecessário

## Responsive Behavior

### Breakpoints
- Mobile: < 768px
- Desktop: >= 768px

### Mobile Adaptations
- Cards ocupam largura total com padding reduzido
- Filtros em dropdown/sheet recolhível
- Navegação vira bottom bar ou hamburger menu
- Tabelas viram cards empilhados
- Padding reduzido mas ainda generoso (16px min)

## What to Avoid

- Gamification visual (mascotes, badges, animações excessivas)
- Cores saturadas ou paletas vibrantes
- Ilustrações infantis ou decorativas
- Dashboards corporativos pesados
- Templates genéricos de SaaS
- Gradientes chamativos
- Sombras profundas
- Border radius excessivo (> 12px)

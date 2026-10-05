# Habit Tracker Web --- Especificação para Implementação

## 1. Objetivo

Transformar o sistema de acompanhamento de hábitos mostrado no vídeo de
referência --- originalmente estruturado como uma planilha mensal --- em
uma **aplicação web responsiva, interativa e visualmente próxima do
conceito original**, mas com UX muito melhor para navegador e celular.

O projeto deve permitir que o usuário:

-   crie e edite hábitos;
-   acompanhe hábitos diariamente;
-   visualize o progresso por dia, semana e mês;
-   veja percentuais de conclusão;
-   acompanhe gráficos de evolução;
-   defina objetivos;
-   navegue entre meses;
-   veja resumos automáticos;
-   mantenha os dados salvos mesmo depois de fechar o navegador.

> **Importante:** o vídeo deve ser usado como referência visual e
> funcional. Não é necessário reproduzir literalmente a aparência de uma
> planilha. A versão web deve transformar a mesma lógica em uma
> interface de produto real.

------------------------------------------------------------------------

# 2. Conceito do produto

O sistema é um **Habit Tracker / Habit Dashboard** baseado em uma grade
mensal.

A estrutura observada no vídeo possui:

1.  seleção de mês e ano;
2.  lista de hábitos diários;
3.  calendário dividido por semanas;
4.  uma célula para cada combinação `hábito × dia`;
5.  marcação de conclusão;
6.  percentual de progresso;
7.  gráfico de progresso diário;
8.  resumo geral dos hábitos;
9.  resumo semanal;
10. objetivos/metas;
11. navegação entre meses;
12. várias áreas de análise.

A aplicação web deve preservar essa lógica, mas organizá-la em
componentes modernos.

------------------------------------------------------------------------

# 3. Stack recomendada

## Frontend

-   React
-   Vite
-   TypeScript
-   Tailwind CSS
-   Lucide React para ícones
-   Recharts para gráficos

## Estado

Para o MVP:

-   React Context + `useReducer`

ou, se o projeto crescer:

-   Zustand

## Persistência

MVP:

-   `localStorage`

Versão futura:

-   Supabase/PostgreSQL

## Datas

Usar uma biblioteca como:

-   `date-fns`

Evitar implementar manualmente regras de calendário.

------------------------------------------------------------------------

# 4. Estrutura de diretórios

``` text
habit-tracker/
├── public/
│   └── favicon.svg
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   └── PageContainer.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── MonthSelector.tsx
│   │   │   ├── HabitTable.tsx
│   │   │   ├── HabitRow.tsx
│   │   │   ├── DayCell.tsx
│   │   │   ├── WeekHeader.tsx
│   │   │   ├── ProgressChart.tsx
│   │   │   ├── DailySummary.tsx
│   │   │   ├── WeeklySummary.tsx
│   │   │   ├── GoalSummary.tsx
│   │   │   └── ProgressCard.tsx
│   │   │
│   │   ├── habits/
│   │   │   ├── HabitForm.tsx
│   │   │   ├── HabitList.tsx
│   │   │   └── HabitActions.tsx
│   │   │
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   └── ProgressBar.tsx
│   │   │
│   │   └── charts/
│   │       ├── DailyProgressChart.tsx
│   │       ├── WeeklyProgressChart.tsx
│   │       └── HabitProgressChart.tsx
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Habits.tsx
│   │   └── Settings.tsx
│   │
│   ├── hooks/
│   │   ├── useHabits.ts
│   │   ├── useMonth.ts
│   │   ├── useProgress.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── context/
│   │   └── HabitContext.tsx
│   │
│   ├── services/
│   │   └── storage.ts
│   │
│   ├── utils/
│   │   ├── calendar.ts
│   │   ├── calculations.ts
│   │   ├── percentages.ts
│   │   └── formatters.ts
│   │
│   ├── types/
│   │   └── habit.ts
│   │
│   ├── data/
│   │   └── seed.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

------------------------------------------------------------------------

# 5. Modelo de dados

## Habit

``` ts
interface Habit {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  active: boolean;
  createdAt: string;
  goal?: number;
}
```

Exemplos:

``` text
Treinar no Gym
Tomar água
Correr mais de 5 km
Agradecer a Deus
Levantar às 5 AM
```

------------------------------------------------------------------------

## HabitCompletion

Cada marcação deve representar:

``` ts
interface HabitCompletion {
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
}
```

Exemplo:

``` json
{
  "habitId": "gym",
  "date": "2026-10-05",
  "completed": true
}
```

------------------------------------------------------------------------

## MonthData

``` ts
interface MonthData {
  year: number;
  month: number;
  habits: Habit[];
  completions: HabitCompletion[];
}
```

------------------------------------------------------------------------

# 6. Dashboard principal

A página principal deve ser o centro da aplicação.

Estrutura:

``` text
┌───────────────────────────────────────────────┐
│ Habit Tracker             Outubro 2026       │
│                                               │
│ [←] [Mês/Ano] [→]                             │
├───────────────────────────────────────────────┤
│                                               │
│ Progresso geral        75%                    │
│ ███████████████████░░                         │
│                                               │
├───────────────────────────────────────────────┤
│ HÁBITOS                                       │
│                                               │
│ Habit      Seg Ter Qua Qui Sex Sáb Dom        │
│ Gym         ✓   ✓   □   ✓   ✓   □   ✓        │
│ Água        ✓   ✓   ✓   ✓   □   ✓   ✓        │
│ Corrida     □   ✓   □   ✓   ✓   □   □        │
│                                               │
├───────────────────────────────────────────────┤
│ PROGRESSO DIÁRIO                              │
│                 📈                            │
│                                               │
├───────────────────────────────────────────────┤
│ RESUMO                                        │
│ 75% concluído    232 concluídos               │
│ 80 incompletos   Meta diária: 10              │
└───────────────────────────────────────────────┘
```

------------------------------------------------------------------------

# 7. Seletor de mês

O usuário deve conseguir navegar entre meses.

Exemplo:

``` text
          ←   OUTUBRO 2026   →
```

Também pode existir um seletor:

``` text
Mês: [ Outubro ▼ ]
Ano: [ 2026 ▼ ]
```

Ao mudar o mês:

-   atualizar calendário;
-   atualizar hábitos;
-   atualizar percentuais;
-   atualizar gráficos;
-   atualizar resumos.

Não recarregar a página.

------------------------------------------------------------------------

# 8. Calendário de hábitos

Essa é a parte mais importante do projeto.

A tabela deve possuir:

-   coluna fixa para o nome do hábito;
-   colunas para os dias;
-   agrupamento visual por semana;
-   checkbox/célula clicável;
-   indicação do dia atual;
-   indicação de fins de semana;
-   progresso por hábito.

Exemplo:

``` text
HÁBITO              SEMANA 1
                    S T Q Q S S D
Treinar Gym         ✓ ✓ ✓ □ ✓ ✓ □
Tomar água          ✓ ✓ □ ✓ ✓ ✓ ✓
Correr              □ ✓ □ ✓ ✓ □ □
```

Ao clicar na célula:

``` text
false → true
true  → false
```

A alteração deve atualizar imediatamente todos os cálculos relacionados.

------------------------------------------------------------------------

# 9. Células de hábito

Cada célula deve:

-   ser clicável;
-   possuir estado `completed` ou `not completed`;
-   ter feedback visual;
-   possuir `hover`;
-   ser acessível por teclado;
-   mostrar tooltip com a data.

Exemplo de tooltip:

``` text
05/10/2026
Tomar água
Concluído
```

------------------------------------------------------------------------

# 10. Progresso diário

Calcular:

``` text
hábitos concluídos no dia
────────────────────────── × 100
hábitos ativos
```

Exemplo:

``` text
10 hábitos
8 concluídos

80%
```

O dashboard deve apresentar o percentual de cada dia.

Exemplo visual:

``` text
SEG  TER  QUA  QUI  SEX  SÁB  DOM
80%  70%  60%  90%  100% 80%  70%
```

------------------------------------------------------------------------

# 11. Progresso por hábito

Para cada hábito:

``` text
Treinar no Gym
22 / 30 dias
73%
```

Também mostrar uma barra:

``` text
██████████████░░░░░░ 73%
```

------------------------------------------------------------------------

# 12. Progresso semanal

Cada semana deve possuir seu próprio percentual.

Exemplo:

``` text
SEMANA 1
78%

SEMANA 2
84%

SEMANA 3
65%

SEMANA 4
91%
```

O cálculo deve considerar somente os dias pertencentes àquela semana.

------------------------------------------------------------------------

# 13. Progresso geral

O progresso geral do mês:

``` text
total de conclusões
──────────────────────────── × 100
total de oportunidades
```

Exemplo:

``` text
230 / 305
75,4%
```

O número deve ser calculado dinamicamente.

Nunca armazenar o percentual como fonte principal de verdade.

------------------------------------------------------------------------

# 14. Resumo diário

Criar um card semelhante ao conceito visto no vídeo:

``` text
RESUMO DOS HÁBITOS DIÁRIOS

        75,4%

HÁBITOS DIÁRIOS
230 / 305

% COMPLETADO
75,4%

COMPLETADO
230

INCOMPLETO
75

OBJETIVO DIÁRIO
10
```

Todos os valores devem ser derivados dos dados.

------------------------------------------------------------------------

# 15. Gráfico de progresso diário

Utilizar Recharts.

Tipo recomendado:

-   AreaChart
-   LineChart

Exemplo:

``` text
100% ┤        ╭──╮
 80% ┤ ╭──╮  ╭╯  ╰╮
 60% ┤╭╯  ╰──╯     ╰╮
 40% ┤
     └──────────────────
       1  5  10  15  20  25  30
```

O eixo X representa os dias.

O eixo Y representa o percentual de conclusão.

------------------------------------------------------------------------

# 16. Resumo semanal

Criar uma seção:

``` text
RESUMO DOS HÁBITOS SEMANAIS

Semana:
[Todas ▼]

Semana 1
████████████████░░░░ 80%

Semana 2
██████████████░░░░░░ 70%

Semana 3
██████████████████░░ 90%
```

Permitir selecionar:

-   todas;
-   semana 1;
-   semana 2;
-   semana 3;
-   semana 4;
-   semana 5.

------------------------------------------------------------------------

# 17. Objetivos

O sistema deve permitir definir uma meta.

Exemplo:

``` text
OBJETIVO

Meta diária:
[ 10 ]

Meta mensal:
[ 80% ]
```

Também pode existir objetivo por hábito:

``` text
Treinar
Meta: 20 dias/mês
Atual: 14 dias
Progresso: 70%
```

------------------------------------------------------------------------

# 18. Gerenciamento de hábitos

Criar uma página ou modal para administrar hábitos.

## Adicionar

Botão:

``` text
+ Novo hábito
```

Formulário:

``` text
Nome
[____________________]

Ícone
[ 🏋️ ]

Meta
[ 20 ]

[Cancelar] [Criar hábito]
```

------------------------------------------------------------------------

## Editar

Permitir:

-   alterar nome;
-   alterar ícone;
-   alterar meta;
-   ativar/desativar.

------------------------------------------------------------------------

## Excluir

Não apagar imediatamente.

Mostrar confirmação:

``` text
Excluir hábito?

Essa ação pode remover o histórico desse hábito.

[Cancelar] [Excluir]
```

------------------------------------------------------------------------

# 19. Persistência

No MVP, usar `localStorage`.

Estrutura:

``` text
habit-tracker-data
```

Exemplo:

``` json
{
  "habits": [],
  "completions": [],
  "settings": {}
}
```

Ao abrir o site:

1.  verificar localStorage;
2.  carregar os dados;
3.  se não existir nada, criar dados iniciais;
4.  renderizar dashboard.

Cada alteração deve salvar automaticamente.

------------------------------------------------------------------------

# 20. Responsividade

O vídeo mostra uma planilha em tela grande, mas o site deve ser muito
melhor no celular.

## Desktop

Usar:

``` text
Sidebar
Dashboard
Tabela completa
Gráficos lado a lado
```

## Tablet

Reduzir espaçamentos.

## Mobile

A tabela pode possuir:

-   scroll horizontal;
-   primeira coluna fixa;
-   cabeçalho fixo.

Exemplo:

``` text
┌───────────────────────┐
│ ← Outubro 2026 →      │
├───────────────────────┤
│ Hábito │ S │ T │ Q │ Q │
│ Gym    │ ✓ │ ✓ │ □ │ ✓ │ →
│ Água   │ ✓ │ □ │ ✓ │ ✓ │ →
└───────────────────────┘
```

Não tentar colocar todos os dias na tela ao mesmo tempo no celular.

------------------------------------------------------------------------

# 21. Design visual

A referência do vídeo possui uma aparência escura, com:

-   fundo muito escuro;
-   cards escuros;
-   bordas finas;
-   textos claros;
-   detalhes em verde/ciano;
-   detalhes em vermelho/rosa;
-   gráficos minimalistas.

A versão web deve manter essa identidade, porém com uma aparência mais
moderna.

### Direção visual

``` text
Background: muito escuro
Cards: dark
Borders: discretas
Texto principal: claro
Texto secundário: cinza
Sucesso: verde/ciano
Atenção: amarelo
Falha/incompleto: vermelho/rosa
```

Não exagerar nas cores.

A interface deve parecer um **dashboard moderno de produtividade**, não
uma planilha.

------------------------------------------------------------------------

# 22. Layout recomendado

Desktop:

``` text
┌──────────────┬───────────────────────────────────────┐
│              │ Topbar                                │
│              ├───────────────────────────────────────┤
│   SIDEBAR    │                                       │
│              │ Progresso geral                       │
│ Dashboard    │                                       │
│ Hábitos      │ ┌───────────────────────────────────┐ │
│ Estatísticas │ │ Tabela de hábitos                  │ │
│ Configurações│ │                                   │ │
│              │ └───────────────────────────────────┘ │
│              │                                       │
│              │ ┌──────────────┐ ┌────────────────┐  │
│              │ │ Resumo       │ │ Gráfico        │  │
│              │ └──────────────┘ └────────────────┘  │
└──────────────┴───────────────────────────────────────┘
```

------------------------------------------------------------------------

# 23. Componentes importantes

## `HabitTable`

Responsável por:

-   renderizar hábitos;
-   renderizar dias;
-   separar semanas;
-   controlar células.

Props:

``` ts
interface HabitTableProps {
  habits: Habit[];
  year: number;
  month: number;
}
```

------------------------------------------------------------------------

## `DayCell`

Responsável por:

-   mostrar estado;
-   receber clique;
-   alterar conclusão;
-   mostrar tooltip.

``` ts
interface DayCellProps {
  habitId: string;
  date: Date;
  completed: boolean;
  onToggle: () => void;
}
```

------------------------------------------------------------------------

## `ProgressChart`

Recebe dados:

``` ts
{
  date: string;
  percentage: number;
}[]
```

------------------------------------------------------------------------

# 24. Funções de cálculo

Criar funções puras em:

``` text
src/utils/calculations.ts
```

Exemplos:

``` ts
calculateDailyProgress()
calculateWeeklyProgress()
calculateMonthlyProgress()
calculateHabitProgress()
calculateCompletedCount()
calculateIncompleteCount()
calculateGoalProgress()
```

Essas funções não devem depender de componentes React.

Isso facilita:

-   testes;
-   manutenção;
-   futuras APIs;
-   migração para backend.

------------------------------------------------------------------------

# 25. Regras de cálculo

## Percentual diário

``` text
concluídos naquele dia
─────────────────────── × 100
hábitos ativos
```

Se não houver hábitos ativos:

``` text
0%
```

------------------------------------------------------------------------

## Percentual mensal

``` text
total concluído
──────────────────────────── × 100
total de células possíveis
```

------------------------------------------------------------------------

## Percentual por hábito

``` text
dias concluídos
──────────────── × 100
dias disponíveis
```

------------------------------------------------------------------------

## Percentual semanal

``` text
conclusões da semana
──────────────────────── × 100
possibilidades da semana
```

Arredondar para uma casa decimal quando necessário.

------------------------------------------------------------------------

# 26. Estados da aplicação

O sistema precisa tratar:

### Loading

``` text
Carregando seus hábitos...
```

### Sem hábitos

``` text
Você ainda não possui hábitos.

[+ Criar primeiro hábito]
```

### Erro

``` text
Não foi possível carregar os dados.

[Tentar novamente]
```

### Primeiro acesso

Criar alguns hábitos de exemplo ou apresentar onboarding.

------------------------------------------------------------------------

# 27. Dados iniciais

Para facilitar demonstração e desenvolvimento:

``` ts
const defaultHabits = [
  {
    id: "gym",
    name: "Treinar no Gym",
    icon: "🏋️"
  },
  {
    id: "water",
    name: "Tomar água",
    icon: "💧"
  },
  {
    id: "run",
    name: "Correr mais de 5 km",
    icon: "🏃"
  },
  {
    id: "gratitude",
    name: "Agradecer a Deus",
    icon: "🙏"
  },
  {
    id: "wake-up",
    name: "Levantar às 5 AM",
    icon: "⏰"
  }
];
```

Esses dados devem ser apenas exemplos.

------------------------------------------------------------------------

# 28. Interações

A interface precisa responder imediatamente.

Ao marcar um hábito:

``` text
Clique
 ↓
Atualiza célula
 ↓
Atualiza estado
 ↓
Recalcula progresso
 ↓
Atualiza gráficos
 ↓
Salva no localStorage
```

Não exigir botão "Salvar".

------------------------------------------------------------------------

# 29. Acessibilidade

Implementar:

-   navegação por teclado;
-   `aria-label` nos botões;
-   contraste adequado;
-   foco visível;
-   checkbox semanticamente acessível;
-   tooltips não essenciais apenas como complemento;
-   suporte a leitores de tela.

------------------------------------------------------------------------

# 30. Arquitetura de estado

Exemplo:

``` ts
interface HabitState {
  habits: Habit[];
  completions: HabitCompletion[];
  selectedDate: Date;
}
```

Actions:

``` text
ADD_HABIT
UPDATE_HABIT
DELETE_HABIT
TOGGLE_COMPLETION
SET_MONTH
SET_YEAR
RESET_DATA
```

------------------------------------------------------------------------

# 31. Futuro backend

A arquitetura deve permitir substituir:

``` text
localStorage
```

por:

``` text
API
 ↓
Backend
 ↓
Database
```

sem precisar reescrever os componentes.

Futuramente:

``` text
React
   ↓
API
   ↓
Node.js / Express
   ↓
PostgreSQL / Supabase
```

Possíveis recursos futuros:

-   login;
-   múltiplos usuários;
-   sincronização entre dispositivos;
-   backup;
-   histórico permanente;
-   notificações;
-   metas;
-   streaks;
-   gamificação.

------------------------------------------------------------------------

# 32. Páginas

## `/`

Dashboard principal.

## `/habits`

Gerenciamento dos hábitos.

## `/statistics`

Estatísticas detalhadas.

## `/settings`

Configurações.

------------------------------------------------------------------------

# 33. Dashboard --- prioridade do MVP

O MVP deve obrigatoriamente ter:

-   [x] Dashboard
-   [x] criação de hábitos
-   [x] edição de hábitos
-   [x] exclusão de hábitos
-   [x] calendário mensal
-   [x] marcação diária
-   [x] progresso diário
-   [x] progresso semanal
-   [x] progresso mensal
-   [x] gráfico
-   [x] resumo
-   [x] navegação entre meses
-   [x] localStorage
-   [x] responsividade

Deixar para depois:

-   [ ] login
-   [ ] backend
-   [ ] sincronização
-   [ ] notificações
-   [ ] compartilhamento
-   [ ] aplicativo mobile
-   [ ] IA
-   [ ] gamificação avançada

------------------------------------------------------------------------

# 34. Regras para o Claude

Ao implementar este projeto:

### 1. Não criar tudo em um único arquivo

Separar componentes, hooks, tipos e utilitários.

### 2. TypeScript obrigatório

Evitar `any`.

### 3. Não duplicar lógica

Cálculos devem ficar em `utils`.

### 4. Componentes reutilizáveis

Não criar componentes gigantes.

### 5. Mobile-first

O site precisa funcionar muito bem no celular.

### 6. Dados reais

Não usar números fixos no dashboard.

Por exemplo, evitar:

``` tsx
<span>75.4%</span>
```

O correto é:

``` tsx
<span>{monthlyProgress}%</span>
```

### 7. Estado como fonte de verdade

Os gráficos e resumos devem derivar dos mesmos dados da tabela.

### 8. Persistência automática

Alterações devem ser salvas automaticamente.

------------------------------------------------------------------------

# 35. Ordem recomendada de implementação

Claude deve desenvolver nesta ordem:

## Fase 1 --- Base

-   criar projeto Vite;
-   configurar React;
-   configurar TypeScript;
-   configurar Tailwind;
-   criar layout.

## Fase 2 --- Dados

-   criar interfaces;
-   criar estado global;
-   criar localStorage;
-   criar hábitos padrão.

## Fase 3 --- Calendário

-   gerar dias do mês;
-   dividir semanas;
-   criar tabela;
-   criar células;
-   implementar marcação.

## Fase 4 --- Cálculos

-   progresso diário;
-   progresso semanal;
-   progresso mensal;
-   progresso por hábito.

## Fase 5 --- Dashboard

-   cards;
-   resumo;
-   barras de progresso;
-   gráfico.

## Fase 6 --- CRUD

-   adicionar hábito;
-   editar;
-   excluir;
-   ativar/desativar.

## Fase 7 --- UX

-   responsividade;
-   animações;
-   tooltips;
-   estados vazios;
-   acessibilidade.

## Fase 8 --- Refinamento

-   revisar layout;
-   corrigir bugs;
-   melhorar performance;
-   testar persistência;
-   testar diferentes meses.

------------------------------------------------------------------------

# 36. Critérios de aceitação

O projeto só deve ser considerado pronto quando:

-   [ ] consigo criar um hábito;
-   [ ] consigo editar um hábito;
-   [ ] consigo excluir um hábito;
-   [ ] consigo marcar/desmarcar qualquer dia;
-   [ ] consigo mudar de mês;
-   [ ] o número de dias muda corretamente de acordo com o mês;
-   [ ] fevereiro funciona corretamente;
-   [ ] anos bissextos funcionam;
-   [ ] os percentuais são calculados automaticamente;
-   [ ] os gráficos acompanham as alterações;
-   [ ] os dados continuam após atualizar a página;
-   [ ] o site funciona em desktop;
-   [ ] o site funciona em celular;
-   [ ] não existem números de progresso hardcoded;
-   [ ] não existem erros no console;
-   [ ] a interface é visualmente consistente.

------------------------------------------------------------------------

# 37. Prompt inicial para o Claude

Use o README como especificação principal e peça ao Claude:

``` text
Você é um engenheiro de software sênior especializado em React,
TypeScript e interfaces modernas.

Leia todo o README.md antes de começar.

Quero transformar a especificação em uma aplicação web completa
de acompanhamento de hábitos.

Regras:

1. Use React + Vite + TypeScript.
2. Use Tailwind CSS.
3. Use componentes reutilizáveis.
4. Use localStorage no MVP.
5. Não coloque toda a aplicação em App.tsx.
6. Separe componentes, hooks, utils, types e services.
7. O calendário deve ser gerado dinamicamente.
8. Todos os percentuais devem ser calculados a partir dos dados.
9. Não use números de exemplo como valores fixos no dashboard.
10. O sistema deve funcionar em desktop e mobile.
11. Use Recharts para os gráficos.
12. Use date-fns para manipulação de datas.
13. Não use dados falsos depois que o usuário começar a interagir.
14. A interface deve seguir a direção visual descrita no README.
15. Priorize qualidade e organização do código.

Antes de implementar, apresente:

- arquitetura;
- componentes;
- modelo de dados;
- fluxo de estado;
- estratégia de persistência.

Depois implemente por fases.

Ao terminar cada fase, verifique se ela funciona antes de
avançar para a próxima.
```

------------------------------------------------------------------------

# 38. Resultado esperado

O resultado final deve parecer um **produto SaaS moderno de
acompanhamento de hábitos**, mantendo a ideia central da planilha
apresentada no vídeo:

``` text
               HABIT TRACKER

        ┌──────────────────────┐
        │     75,4%            │
        │   PROGRESSO GERAL    │
        └──────────────────────┘

HÁBITOS
────────────────────────────────────────────
             S  T  Q  Q  S  S  D
Gym          ✓  ✓  ✓  □  ✓  ✓  □
Água         ✓  ✓  □  ✓  ✓  ✓  ✓
Corrida      □  ✓  □  ✓  ✓  □  □

────────────────────────────────────────────

PROGRESSO DIÁRIO
        ╭────╮
   ╭────╯    ╰──╮
───╯             ╰────

────────────────────────────────────────────

RESUMO

75,4% concluído
230 concluídos
80 incompletos
```

A aplicação deve ser **funcional primeiro e visualmente refinada
depois**, evitando complexidade desnecessária no MVP.

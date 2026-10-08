# TASKS.md — Habit Tracker

## Como usar este arquivo

Este arquivo é o roteiro oficial de implementação.

Legenda:

```text
[ ] pendente
[-] parcialmente concluído
[x] concluído
[!] bloqueado
```

### Regra

Claude deve trabalhar **uma tarefa principal por vez**.

Não implementar várias fases simultaneamente sem solicitação.

Depois de cada tarefa:

1. implementar;
2. verificar;
3. executar build/lint/testes disponíveis;
4. atualizar esta tarefa;
5. informar os arquivos alterados;
6. indicar a próxima tarefa.

---

# FASE 0 — Preparação

## 0.1 Criar repositório

- [x] Criar repositório Git
- [x] Criar `.gitignore`
- [x] Criar `README.md`
- [x] Criar `CLAUDE.md`
- [x] Criar `TASKS.md`

**Commit sugerido:**

```text
chore: initialize repository
```

---

## 0.2 Criar projeto Vite

- [x] Criar projeto React + TypeScript + Vite
- [x] Confirmar execução local
- [x] Confirmar build

**Critério:**

```bash
npm run dev
npm run build
```

funcionam sem erro.

**Commit:**

```text
chore: setup vite react typescript
```

---

# FASE 1 — Dependências

## 1.1 Instalar dependências principais

- [x] Tailwind CSS
- [x] Lucide React
- [x] Recharts
- [x] date-fns

Não instalar bibliotecas adicionais sem necessidade.

**Commit:**

```text
chore: add frontend dependencies
```

---

## 1.2 Configurar tema

- [x] Criar tema escuro
- [x] Definir tokens/classes visuais
- [x] Configurar fundo
- [x] Configurar cards
- [x] Configurar bordas
- [x] Configurar tipografia
- [x] Configurar estados de sucesso/erro

**Critério:**

A aplicação já deve possuir identidade visual coerente mesmo sem funcionalidades.

**Commit:**

```text
style: establish dark dashboard theme
```

---

# FASE 2 — Arquitetura

## 2.1 Criar estrutura de pastas

- [x] `components`
- [x] `pages`
- [x] `hooks`
- [x] `context`
- [x] `services`
- [x] `utils`
- [x] `types`
- [x] `data`

Não criar arquivos vazios sem necessidade.

---

## 2.2 Criar tipos

- [x] `Habit`
- [x] `HabitCompletion`
- [x] `AppSettings`
- [x] `HabitState`

**Critério:**

O projeto deve compilar sem `any`.

**Commit:**

```text
feat: define habit domain types
```

---

# FASE 3 — Layout base

## 3.1 App shell

- [x] Criar `App`
- [x] Criar layout principal
- [x] Criar área de conteúdo
- [x] Criar navegação

---

## 3.2 Sidebar

- [x] Dashboard
- [x] Hábitos
- [x] Estatísticas
- [x] Configurações

No mobile, a sidebar deve se adaptar.

---

## 3.3 Topbar

- [x] Título da página
- [x] Navegação básica
- [x] Espaçamento responsivo

---

## 3.4 Componentes UI básicos

- [x] Button
- [x] Card
- [x] Modal
- [x] Select
- [x] ProgressBar
- [x] Tooltip

Criar somente componentes que realmente serão utilizados.

**Commit:**

```text
feat: add application shell and ui primitives
```

---

# FASE 4 — Estado

## 4.1 Criar estado global

- [x] Criar `HabitContext`
- [x] Criar reducer
- [x] Criar estado inicial
- [x] Definir actions

Actions mínimas:

```text
ADD_HABIT
UPDATE_HABIT
DELETE_HABIT
TOGGLE_HABIT_ACTIVE
TOGGLE_COMPLETION
SET_MONTH
SET_YEAR
RESET_DATA
```

---

## 4.2 Dados iniciais

Criar hábitos de demonstração:

```text
Treinar no Gym
Tomar água
Correr mais de 5 km
Agradecer a Deus
Levantar às 5 AM
```

Os dados iniciais devem ser usados apenas no primeiro acesso.

**Commit:**

```text
feat: add habit state management
```

---

# FASE 5 — Datas e calendário

## 5.1 Utilitários de calendário

Criar funções para:

- [x] obter dias do mês;
- [x] obter semanas;
- [x] verificar dia atual;
- [x] formatar data;
- [x] gerar chave `YYYY-MM-DD`.

Usar `date-fns`.

---

## 5.2 Testar meses

Verificar:

- [x] janeiro;
- [x] fevereiro;
- [x] fevereiro em ano bissexto;
- [x] abril;
- [x] maio;
- [x] dezembro.

---

## 5.3 Seletor de mês

- [x] mês anterior;
- [x] próximo mês;
- [x] mês atual;
- [x] indicação do mês/ano selecionado.

A mudança deve ser instantânea, sem reload.

**Commit:**

```text
feat: add dynamic month navigation
```

---

# FASE 6 — Tabela de hábitos

## 6.1 Cabeçalho

- [x] nome do hábito;
- [x] dias do mês;
- [x] semanas;
- [x] destaque para dia atual.

---

## 6.2 HabitRow

- [x] renderizar nome;
- [x] renderizar ícone;
- [x] renderizar células;
- [x] mostrar progresso do hábito.

---

## 6.3 DayCell

- [x] estado não concluído;
- [x] estado concluído;
- [x] hover;
- [x] focus;
- [x] tooltip;
- [x] `aria-label`.

---

## 6.4 Toggle

- [x] clicar marca;
- [x] clicar novamente desmarca;
- [x] estado atualiza imediatamente.

**Critério:**

A tabela deve funcionar completamente antes de criar os gráficos.

**Commit:**

```text
feat: implement interactive habit calendar
```

---

# FASE 7 — CRUD de hábitos

## 7.1 Criar hábito

- [x] botão `+ Novo hábito`;
- [x] formulário;
- [x] validação do nome;
- [x] criar hábito;
- [x] fechar modal;
- [x] atualizar tabela.

---

## 7.2 Editar hábito

- [x] editar nome;
- [x] editar ícone;
- [x] editar meta;
- [x] salvar alterações.

---

## 7.3 Ativar/desativar

- [x] toggle de ativo;
- [x] hábitos inativos não contam nos cálculos;
- [x] histórico não deve ser destruído ao desativar.

---

## 7.4 Excluir

- [x] confirmação;
- [x] exclusão;
- [x] atualizar interface.

Definir claramente se o MVP apagará o histórico junto ou se manterá registros; não fazer isso silenciosamente.

**Commit:**

```text
feat: add habit management
```

---

# FASE 8 — Persistência

## 8.1 Serviço de storage

- [x] criar `storage.ts`;
- [x] salvar estado;
- [x] carregar estado;
- [x] tratar ausência de dados;
- [x] tratar JSON inválido;
- [x] fallback seguro.

---

## 8.2 Auto-save

Salvar quando:

- [x] hábito é criado;
- [x] hábito é editado;
- [x] hábito é removido;
- [x] conclusão é alterada;
- [x] configuração relevante muda.

---

## 8.3 Teste de persistência

Verificar:

```text
marcar hábito
↓
recarregar página
↓
estado continua correto
```

- [x] Verificado com teste de recarga simulada (jsdom) e em Chromium headless (toque + reload real).

**Commit:**

```text
feat: persist habit data locally
```

---

# FASE 9 — Cálculos

## 9.1 Funções puras

Criar:

- [x] `calculateDailyProgress`
- [x] `calculateWeeklyProgress`
- [x] `calculateMonthlyProgress`
- [x] `calculateHabitProgress`
- [x] `calculateCompletedCount`
- [x] `calculateIncompleteCount`
- [x] `calculateGoalProgress`

---

## 9.2 Regras

Garantir:

- [x] hábitos inativos não contam;
- [x] dias corretos do mês;
- [x] semanas corretas;
- [x] zero hábitos retorna 0%;
- [x] percentuais não ultrapassam 100%;
- [x] arredondamento consistente.

---

## 9.3 Casos de teste manual

Testar:

```text
0 hábitos
1 hábito / 0 conclusões
1 hábito / 1 conclusão
todos concluídos
nenhum concluído
fevereiro
ano bissexto
mês de 31 dias
```

**Commit:**

```text
feat: add habit progress calculations
```

---

# FASE 10 — Dashboard

## 10.1 Progress Card

Mostrar:

- [x] percentual mensal;
- [x] barra;
- [x] quantidade concluída;
- [x] quantidade possível.

---

## 10.2 Daily Summary

Mostrar:

- [x] progresso;
- [x] concluídos;
- [x] incompletos;
- [x] objetivo diário.

---

## 10.3 Habit Progress

Mostrar por hábito:

```text
Nome
X / Y dias
XX%
```

---

## 10.4 Weekly Summary

Mostrar:

- [x] Semana 1;
- [x] Semana 2;
- [x] Semana 3;
- [x] Semana 4;
- [x] Semana 5 quando existir.

**Commit:**

```text
feat: add habit progress dashboard
```

---

# FASE 11 — Gráficos

## 11.1 Daily Progress Chart

- [x] criar dados derivados;
- [x] integrar Recharts;
- [x] eixo X = dias;
- [x] eixo Y = percentual;
- [x] tooltip;
- [x] estado sem dados.

---

## 11.2 Weekly Chart

Opcional no primeiro MVP:

- [ ] gráfico semanal;
- [ ] comparação entre semanas.

---

## 11.3 Validação

Ao marcar/desmarcar uma célula:

```text
tabela
↓
cálculo
↓
gráfico
```

devem atualizar imediatamente.

**Commit:**

```text
feat: add progress charts
```

---

# FASE 12 — Metas

## 12.1 Meta diária

- [x] configurar objetivo;
- [x] mostrar objetivo;
- [x] calcular progresso em relação à meta.

---

## 12.2 Meta por hábito

- [x] configurar quantidade de dias;
- [x] mostrar progresso;
- [x] indicar se a meta foi atingida.

**Commit:**

```text
feat: add habit goals
```

---

# FASE 13 — Página de hábitos

Criar `/habits`.

- [x] lista completa;
- [x] criar;
- [x] editar;
- [x] ativar/desativar;
- [x] excluir;
- [x] mostrar meta;
- [x] mostrar progresso.

---

# FASE 14 — Estatísticas

Criar `/statistics`.

- [x] progresso mensal;
- [x] progresso semanal;
- [x] progresso por hábito;
- [x] melhores dias;
- [x] total de conclusões.

Evitar adicionar estatísticas que não possam ser calculadas corretamente com os dados disponíveis.

**Commit:**

```text
feat: add statistics page
```

---

# FASE 15 — Configurações

Criar `/settings`.

MVP:

- [x] objetivo diário;
- [ ] preferências básicas; _(nenhuma preferência além do objetivo diário existe ainda)_
- [x] resetar dados;
- [x] confirmação antes do reset.

O reset deve ser uma ação claramente destrutiva.

**Commit:**

```text
feat: add settings page
```

---

# FASE 16 — Responsividade

## Desktop

- [x] sidebar;
- [x] tabela;
- [x] cards;
- [x] gráficos.

## Tablet

- [x] espaçamento;
- [x] tabela horizontal;
- [x] cards adaptáveis.

## Mobile

- [x] navegação adaptada;
- [x] tabela com scroll horizontal;
- [x] primeira coluna fixa quando apropriado;
- [x] células adequadas para toque;
- [x] cards empilhados;
- [x] gráficos responsivos.

**Critério:**

Nenhum conteúdo essencial deve ficar inacessível em telas pequenas.

**Commit:**

```text
style: improve responsive dashboard
```

---

# FASE 17 — Acessibilidade

- [x] foco visível;
- [x] `aria-label`;
- [x] navegação por teclado;
- [x] botões semânticos;
- [x] contraste;
- [x] modais acessíveis;
- [x] tooltips não devem ser a única forma de obter informação importante.

**Commit:**

```text
feat: improve accessibility
```

---

# FASE 18 — Estados da aplicação

## Primeiro acesso

- [x] onboarding simples ou dados iniciais.

## Sem hábitos

- [x] empty state.

## Sem dados no período

- [x] gráfico vazio;
- [x] resumo coerente.

## Erro

- [x] mensagem;
- [x] ação de recuperação.

## Loading

- [x] loading state quando necessário. _(não necessário: a leitura do localStorage é síncrona)_

**Commit:**

```text
feat: add application states
```

---

# FASE 19 — Refinamento visual

- [ ] revisar espaçamento;
- [ ] revisar tipografia;
- [ ] revisar hierarquia visual;
- [ ] revisar bordas;
- [ ] revisar estados hover;
- [ ] revisar estados active;
- [ ] revisar estados disabled;
- [ ] revisar gráficos;
- [ ] remover elementos visuais desnecessários.

Objetivo:

```text
dashboard moderno
```

e não:

```text
planilha com CSS
```

**Commit:**

```text
style: refine dashboard visual design
```

---

# FASE 20 — Qualidade de código

- [ ] remover código morto;
- [ ] remover imports não usados;
- [ ] remover componentes duplicados;
- [ ] revisar nomes;
- [ ] revisar tipos;
- [ ] revisar funções de cálculo;
- [ ] revisar efeitos;
- [ ] revisar dependências.

---

# FASE 21 — Testes finais

## Build

- [ ] `npm run build`

## Lint

- [ ] `npm run lint`

## Funcional

- [ ] criar hábito;
- [ ] editar hábito;
- [ ] excluir hábito;
- [ ] ativar/desativar;
- [ ] marcar célula;
- [ ] desmarcar célula;
- [ ] trocar mês;
- [ ] voltar mês;
- [ ] persistir após reload;
- [ ] resetar dados.

## Calendário

- [ ] mês com 28 dias;
- [ ] fevereiro bissexto;
- [ ] mês com 30 dias;
- [ ] mês com 31 dias;
- [ ] virada de ano.

## Responsividade

- [ ] desktop;
- [ ] tablet;
- [ ] mobile.

---

# FASE 22 — Segurança do estado

- [ ] testar localStorage inválido;
- [ ] testar localStorage vazio;
- [ ] testar campos ausentes;
- [ ] testar dados antigos;
- [ ] evitar crash da aplicação.

---

# FASE 23 — Preparação para backend

Não implementar backend ainda.

Somente verificar se a arquitetura permite trocar:

```text
localStorage
```

por:

```text
API
```

sem reescrever componentes.

- [ ] componentes não dependem diretamente de localStorage;
- [ ] storage está isolado em `services`;
- [ ] domínio possui tipos claros;
- [ ] cálculos são independentes da persistência.

**Commit:**

```text
refactor: prepare persistence abstraction
```

---

# FASE 24 — Documentação

- [ ] atualizar README;
- [ ] documentar instalação;
- [ ] documentar comandos;
- [ ] documentar stack;
- [ ] documentar arquitetura;
- [ ] documentar modelo de dados;
- [ ] documentar decisões importantes;
- [ ] confirmar `CLAUDE.md`;
- [ ] confirmar `TASKS.md`.

---

# FASE 25 — MVP concluído

O MVP só pode ser considerado concluído quando todos estes itens estiverem funcionando:

- [ ] Dashboard
- [ ] CRUD de hábitos
- [ ] Calendário mensal
- [ ] Marcação diária
- [ ] Navegação de meses
- [ ] Progresso diário
- [ ] Progresso semanal
- [ ] Progresso mensal
- [ ] Progresso por hábito
- [ ] Gráfico
- [ ] Metas básicas
- [ ] localStorage
- [ ] Responsividade
- [ ] Acessibilidade básica
- [ ] Build sem erros
- [ ] Lint sem erros relevantes
- [ ] Dados persistentes
- [ ] Casos de calendário validados

**Commit:**

```text
release: complete habit tracker mvp
```

---

# FUNCIONALIDADES FUTURAS — NÃO IMPLEMENTAR NO MVP

Estas tarefas ficam fora do escopo inicial.

## Backend

- [ ] Node.js
- [ ] API
- [ ] PostgreSQL
- [ ] Supabase

## Conta

- [ ] cadastro;
- [ ] login;
- [ ] recuperação de conta;
- [ ] perfil.

## Sincronização

- [ ] múltiplos dispositivos;
- [ ] backup;
- [ ] sincronização automática.

## Notificações

- [ ] lembretes;
- [ ] notificações push;
- [ ] lembretes por hábito.

## Gamificação

- [ ] streaks;
- [ ] níveis;
- [ ] conquistas;
- [ ] XP;
- [ ] ranking pessoal.

## IA

- [ ] análise de hábitos;
- [ ] recomendações;
- [ ] geração de metas;
- [ ] resumo automático.

## Mobile

- [ ] PWA;
- [ ] aplicativo Android;
- [ ] aplicativo iOS.

---

# PROTOCOLO DE EXECUÇÃO COM CLAUDE

Para economizar contexto e créditos, usar este formato:

## Primeira solicitação

```text
Leia CLAUDE.md, README.md e TASKS.md.

Não implemente funcionalidades ainda.

Analise o projeto atual e me diga:

1. arquitetura encontrada;
2. arquivos existentes;
3. primeira tarefa recomendada;
4. possíveis problemas.

Não altere arquivos.
```

---

## Depois

Para cada tarefa:

```text
Leia CLAUDE.md e TASKS.md.

Implemente somente a próxima tarefa pendente da fase atual.

Não avance para outra tarefa.

Antes de alterar arquivos:
- verifique o código existente;
- reutilize componentes quando possível.

Depois:
- execute build;
- execute lint se disponível;
- corrija somente problemas relacionados à tarefa;
- atualize TASKS.md;
- informe os arquivos alterados;
- informe o resultado da verificação.

Não reescreva partes não relacionadas do projeto.
```

---

# REGRA PARA BUGS

Quando surgir um bug:

```text
Corrija somente este bug:

[descrição]

Não altere funcionalidades não relacionadas.

Depois execute a verificação apropriada.
```

Não mandar:

```text
corrija todos os bugs do projeto
```

sem antes identificar o problema.

---

# REGRA PARA REFACTOR

Antes de um refactor grande:

1. explicar o problema;
2. explicar a solução;
3. listar arquivos afetados;
4. somente depois implementar.

---

# REGRA PARA DEPENDÊNCIAS

Antes de instalar qualquer pacote:

```text
Nome:
Motivo:
Alternativa sem dependência:
Impacto:
```

Só instalar se houver benefício real.

---

# CHECKPOINTS

Após cada fase importante, criar um commit.

Checkpoints principais:

```text
1. base
2. layout
3. estado
4. calendário
5. CRUD
6. persistência
7. cálculos
8. dashboard
9. gráficos
10. responsividade
11. qualidade
12. MVP
```

---

# OBJETIVO FINAL

Entregar uma aplicação:

- funcional;
- responsiva;
- tipada;
- organizada;
- fácil de manter;
- sem cálculos duplicados;
- sem estatísticas hardcoded;
- com persistência local;
- visualmente moderna;
- preparada para backend futuro.

Prioridade:

```text
FUNCIONAMENTO
    ↓
ARQUITETURA
    ↓
QUALIDADE
    ↓
RESPONSIVIDADE
    ↓
VISUAL
    ↓
FUNCIONALIDADES FUTURAS
```

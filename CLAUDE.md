# CLAUDE.md — Habit Tracker

Instruções permanentes para o Claude neste repositório.

## Arquivos de referência

- `docs/ESPECIFICACAO.md` — especificação funcional e visual do produto.
- `README.md` — documentação do projeto (instalação, comandos, arquitetura, modelo de dados, decisões).
- `TASKS.md` — roteiro oficial de implementação (fonte da ordem de trabalho).

## Fluxo de trabalho

- Trabalhar **uma tarefa principal por vez**, na ordem do `TASKS.md`.
- Nunca avançar para a tarefa seguinte sem solicitação.
- Antes de alterar arquivos: verificar o código existente e reutilizar componentes.
- Depois de cada tarefa:
  1. verificar o resultado;
  2. executar `npm run build`, `npm run lint` e `npm test`;
  3. corrigir apenas problemas relacionados à tarefa;
  4. atualizar o `TASKS.md` (`[x]` concluído, `[-]` parcial, `[!]` bloqueado);
  5. informar os arquivos alterados e o resultado da verificação;
  6. indicar a próxima tarefa.
- Não reescrever partes não relacionadas do projeto.
- Bugs: corrigir somente o bug descrito, sem mexer em funcionalidades não relacionadas.
- Refactors grandes: explicar problema, solução e arquivos afetados antes de implementar.
- Dependências: antes de instalar, informar nome, motivo, alternativa sem dependência e impacto.
  Instalar só se houver benefício real.

## Stack

React + Vite + TypeScript, Tailwind CSS, Lucide React, Recharts, date-fns.
Estado: React Context + `useReducer`. Persistência no MVP: `localStorage`.
Qualidade: Vitest + jsdom (testes) e Biome (lint).

## Regras de código

1. TypeScript obrigatório; evitar `any`.
2. Não concentrar a aplicação em um único arquivo; separar `components`, `pages`,
   `hooks`, `context`, `services`, `utils`, `types`, `data`.
3. Não duplicar lógica: cálculos de progresso ficam em `src/utils` como funções puras,
   sem dependência de React.
4. Componentes pequenos e reutilizáveis; criar apenas o que será realmente usado.
5. Mobile-first; deve funcionar bem em celular.
6. Nenhum número de progresso hardcoded: tudo derivado do estado.
7. O estado é a fonte de verdade; tabela, gráficos e resumos derivam dos mesmos dados.
8. Persistência automática, sem botão "Salvar".
9. Componentes não acessam `localStorage` diretamente; isso fica em `services/storage.ts`.
   O restante da aplicação usa apenas a interface `persistence` (`services/persistence.ts`), nunca o módulo
   concreto. Trocar `localStorage` por API = novo adapter + trocar o valor de `persistence`.
   `src/architecture.test.ts` falha se essa regra for violada.
10. Calendário gerado dinamicamente com `date-fns`; não implementar regras de data à mão.
11. Percentuais nunca são armazenados como fonte de verdade.

## Fora do escopo do MVP

Backend, login, sincronização, notificações, gamificação, IA e apps mobile nativos.

## Prioridades

Funcionamento > arquitetura > qualidade > responsividade > visual > funcionalidades futuras.

<h1 align="center">
  🚌 OniBus Express — Sistema de Venda de Passagens
</h1>

<p align="center">
  MVP de busca e compra de passagens rodoviárias, construído como resposta ao desafio técnico da OniBus Express.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Vitest-4.x-6E9F18?style=flat-square&logo=vitest" alt="Vitest" />
  <img src="https://img.shields.io/badge/Docker-ready-2496ED?style=flat-square&logo=docker" alt="Docker" />
</p>

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades Implementadas](#funcionalidades-implementadas)
- [Stack e Decisões Técnicas](#stack-e-decisões-técnicas)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Como Rodar Localmente](#como-rodar-localmente)
- [Como Rodar com Docker](#como-rodar-com-docker)
- [Como Rodar os Testes](#como-rodar-os-testes)
- [Endpoints Mockados (MSW)](#endpoints-mockados-msw)
- [O que Ficou de Fora e Melhorias Futuras](#o-que-ficou-de-fora-e-melhorias-futuras)

---

## Sobre o Projeto

Este repositório contém o frontend do MVP do sistema de vendas da **OniBus Express**. O foco foi entregar um fluxo completo — da busca de viagens até a confirmação da passagem — com qualidade de código, testes e uma base sólida para evoluir.

**Por que somente o Frontend?**
O desafio permite a entrega isolada do frontend. Optei por construir uma camada de dados completamente funcional em memória usando **Mock Service Worker (MSW)**, o que significa que a aplicação se comporta exatamente como se houvesse um backend real, com delay de rede simulado, validações de negócio e persistência em memória durante a sessão. Isso permite avaliar todas as telas e o fluxo completo sem a necessidade de um servidor rodando.

---

## Funcionalidades Implementadas

| Tela | Status | Descrição |
|---|---|---|
| **Busca de Passagens** | ✅ Completo | Filtros funcionais de origem, destino e data; listagem de viagens com preço/horário/vagas; loading e mensagem de vazio |
| **Seleção de Assento** | ✅ Completo | Mapa visual com fileiras explícitas, corredor central, assentos livres/ocupados/selecionado e legenda |
| **Dados e Confirmação** | ✅ Completo | Formulário com validação de CPF real (dígito verificador), e-mail e nome; resumo da compra; tela de sucesso com código de reserva |
| **Consulta de Reserva** | ✅ Completo (Bônus) | Busca por código, exibição dos detalhes tipados e opção de cancelamento com liberação de assento |

---

## Stack e Decisões Técnicas

### Por que cada tecnologia foi escolhida

| Tecnologia | Motivo |
|---|---|
| **React 19 + TypeScript** | Requisito obrigatório. TypeScript garante contratos claros entre componentes e a camada de dados — todos os tipos (`Viagem`, `Reserva`, `CriarReservaResponse`) são definidos em `core/types.ts` e reutilizados por features e mocks. Sem `any` no código. |
| **Vite 8** | Build tool extremamente rápido com HMR instantâneo. Integração nativa com Vitest, compartilhando a mesma configuração — zero overhead de configuração separada. |
| **Zustand** | Estado global mínimo e sem boilerplate. Gerencia exclusivamente o contexto de compra em andamento (`viagemSelecionada` + `assentoSelecionado`). O estado de UI fica local via `useState`; o Zustand gerencia apenas o que precisa ser compartilhado entre rotas. |
| **TanStack Query (React Query v5)** | Gerencia o ciclo de vida das requisições: loading, error, cache e refetch. `SearchPage` usa `useQuery` (GET) com `enabled: filtros !== null` para busca sob demanda. `ConsultPage` usa `useQuery` com `enabled: !!codigoBusca`. `CheckoutPage` usa `useMutation` (POST). Semântica HTTP respeitada em toda a aplicação. |
| **React Hook Form + Zod** | Dupla ideal para formulários: RHF gerencia o estado de forma performática (sem re-renders desnecessários) e Zod define o schema de validação com inferência de tipos — `CheckoutFormData` é derivado direto do schema, sem duplicação. |
| **Styled Components v6** | CSS-in-JS com suporte a theming via `ThemeProvider`. O design system centralizado em `theme.ts` (cores, espaçamentos, radii) garante consistência. Props transientes (`$variant`, `$ocupado`) evitam vazamento de atributos para o DOM. |
| **MSW (Mock Service Worker) v2** | Intercepta chamadas fetch no Service Worker real do browser. Os testes usam o servidor MSW para Node com os **mesmos handlers**, garantindo paridade total entre dev e teste. |
| **Vitest + React Testing Library + user-event** | Vitest roda no mesmo contexto do Vite. RTL incentiva testes orientados ao comportamento do usuário. `@testing-library/user-event` simula interações reais (keydown, keyup, input) em vez do `fireEvent` sintético, capturando mais bugs. |
| **Docker + Nginx** | Build multi-stage: `node:20-alpine` compila e `nginx:alpine` serve os arquivos estáticos. O Nginx inclui `try_files` para suportar o React Router e cache agressivo para assets estáticos. |

---

## Arquitetura do Projeto

A estrutura segue o padrão **Feature-Sliced Design** simplificado, onde cada feature é um módulo independente com seus próprios componentes e testes:

```
src/
├── core/                    # Núcleo da aplicação (global, compartilhado entre features)
│   ├── ErrorBoundary.tsx    # Captura erros de renderização com tela de fallback
│   ├── globalStyles.ts      # Reset CSS e estilos globais
│   ├── store.ts             # Estado global de compra (Zustand)
│   ├── theme.ts             # Design tokens: cores, espaçamentos, bordas
│   ├── styled.d.ts          # Augmentação do tema no TypeScript (tipagem do ThemeProvider)
│   └── types.ts             # Contratos de dados: Rota, Viagem, Reserva, respostas da API
│
├── features/                # Módulos de domínio (cada pasta = uma tela/fluxo)
│   ├── search/              # Tela 1: Busca de passagens (origem + destino + data)
│   │   ├── SearchPage.tsx
│   │   └── SearchPage.spec.tsx
│   ├── booking/             # Tela 2: Seleção de assento
│   │   ├── BookingPage.tsx
│   │   ├── SeatMap.tsx      # Grid de fileiras explícitas com corredor central
│   │   └── SeatMap.spec.tsx
│   ├── checkout/            # Tela 3: Dados do passageiro + confirmação
│   │   ├── CheckoutPage.tsx
│   │   └── CheckoutPage.spec.tsx
│   └── consult/             # Tela 4 (Bônus): Consulta e cancelamento de reserva
│       ├── ConsultPage.tsx
│       └── ConsultPage.spec.tsx
│
├── mocks/                   # Camada de dados mock (MSW)
│   ├── browser.ts           # Worker para o browser (modo dev)
│   ├── handlers.ts          # Handlers HTTP com lógica de negócio + filtro por data
│   └── data.ts              # Seed de 4 viagens em 3 rotas diferentes
│
├── shared/                  # Componentes e utilitários reutilizáveis
│   ├── components/
│   │   ├── Button.tsx       # Botão com variantes (primary, outline) e estado de loading
│   │   ├── Card.tsx         # Contêiner visual padronizado
│   │   ├── ConfirmDialog.tsx # Modal de confirmação (substitui confirm() nativo)
│   │   ├── Input.tsx        # Input com label, erro e acessibilidade (forwardRef)
│   │   ├── Spinner.tsx      # Indicador de carregamento
│   │   └── Toast.tsx        # Sistema de notificações (substitui alert() nativo)
│   └── utils/
│       ├── cpf.ts           # Validação de CPF com dígito verificador
│       └── cpf.spec.ts      # 11 casos de teste unitários para a validação
│
├── App.tsx                  # Roteamento, layout e providers (ErrorBoundary, Toast, Confirm)
├── main.tsx                 # Ponto de entrada; inicializa MSW em modo dev
└── setupTests.ts            # Configuração global dos testes (MSW server para Node)
```

### Decisões de Arquitetura Relevantes

**1. Fluxo de estado entre telas via Zustand (não URL params)**
A viagem selecionada e o assento são armazenados no Zustand, não na URL. Isso simplifica a navegação e evita a exposição de IDs de viagem na barra de endereço. O trade-off é que o refresh na página `/reserva` perde o contexto — ambas as páginas tratam esse caso exibindo uma tela de fallback com botão para voltar.

**2. `useQuery` com `enabled: false` para buscas sob demanda**
Tanto a `SearchPage` (busca de viagens) quanto a `ConsultPage` (busca de reserva) usam `useQuery` com disparo manual — `enabled: filtros !== null` e `enabled: !!codigoBusca`. Isso respeita a semântica RESTful (GET nunca usa `useMutation`) e aproveita o cache do React Query automaticamente.

**3. Validação de CPF no frontend**
O algoritmo com dígito verificador está isolado em `shared/utils/cpf.ts` — função pura sem efeitos colaterais, coberta por 11 testes unitários. A integração com Zod é feita via `.refine()`, mantendo o schema declarativo.

**4. MSW com os mesmos handlers em dev e teste**
Tanto o browser worker quanto o servidor de testes Node importam os mesmos `handlers.ts`. Isso garante que os testes exercitam exatamente o mesmo comportamento que o usuário verá em desenvolvimento, incluindo as validações de negócio (assento já ocupado, viagem não encontrada, filtro por data).

**5. Toast e ConfirmDialog no lugar de `alert()` e `confirm()` nativos**
Os dialogs nativos interrompem o event loop do jsdom nos testes e são UX ruim. O `ToastProvider` e o `ConfirmProvider` são Context-based, o que permite mockálos nos testes quando necessário sem configuração extra.

**6. SeatMap com fileiras JSX explícitas**
O mapa de assentos gera objetos `{ row, left[], right[] }` e renderiza cada fileira como uma `<Row>` com um `<Corridor>` visual entre os grupos. Isso substitui a abordagem anterior com `nth-child(4n+3)` no CSS, que era frágil para qualquer mudança de layout.

**7. Variável de ambiente para URL da API**
Todas as chamadas de fetch usam `import.meta.env.VITE_API_BASE_URL ?? ""`. Em desenvolvimento, a string vazia + MSW intercepta tudo. Em produção com backend real, basta criar um `.env` com `VITE_API_BASE_URL=https://api.seudominio.com`.

---

## Como Rodar Localmente

**Pré-requisitos:** Node.js 20+ e npm.

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd OneBusK2

# 2. Instale as dependências
npm install

# 3. (Opcional) Configure variáveis de ambiente
cp .env.example .env
# Deixe VITE_API_BASE_URL vazio para usar o MSW

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em **http://localhost:5173**.

> O MSW (mock de API) é inicializado automaticamente em modo `development`. Na primeira execução, o browser pode pedir permissão para registrar o Service Worker — basta aceitar.

---

## Como Rodar com Docker

**Pré-requisitos:** Docker e Docker Compose instalados.

```bash
# Sobe a aplicação com um único comando
docker compose up --build
```

A aplicação estará disponível em **http://localhost:8080**.

> ⚠️ **Atenção:** A build de produção não inicializa o MSW. A aplicação será servida corretamente pelo Nginx, mas as chamadas de API não retornarão dados sem um backend real. Para o fluxo completo, use o modo de desenvolvimento (`npm run dev`).

---

## Como Rodar os Testes

```bash
# Executa todos os testes uma vez
npm test -- --run

# Executa em modo watch (ideal durante o desenvolvimento)
npm test

# Executa com relatório de cobertura
npm test -- --coverage
```

### Cobertura de Testes — 25 testes em 5 arquivos

| Arquivo | Testes | O que valida |
|---|---|---|
| `cpf.spec.ts` | 11 | Validação de CPF: tamanho errado, dígitos repetidos, dígito verificador incorreto, CPF válido com e sem máscara |
| `SearchPage.spec.tsx` | 3 | Busca por origem, mensagem de vazio e filtro por destino |
| `SeatMap.spec.tsx` | 5 | Assento desabilitado, seleção atualiza store, click em ocupado não muda estado, contagem de assentos por `totalAssentos`, legenda |
| `CheckoutPage.spec.tsx` | 3 | Fallback sem dados, validação de formulário + CPF inválido, resumo da compra |
| `ConsultPage.spec.tsx` | 3 | Erro em código inexistente, detalhes de reserva válida, botão de cancelar em reserva CONFIRMADA |

Os testes usam o **MSW Node Server** com os mesmos handlers do modo de desenvolvimento, garantindo consistência total entre os ambientes.

---

## Endpoints Mockados (MSW)

Todos os endpoints são interceptados pelo Mock Service Worker e processados em memória.

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/viagens?origem=&destino=&data=` | Lista viagens com filtros opcionais (todos case-insensitive; `data` no formato `YYYY-MM-DD`) |
| `GET` | `/api/rotas` | Lista todas as rotas disponíveis |
| `POST` | `/api/reservas` | Cria uma nova reserva. Valida se a viagem existe e se o assento está livre |
| `GET` | `/api/reservas/:codigo` | Busca os detalhes de uma reserva pelo código (ex: `ONB-4231`). Case-insensitive |
| `DELETE` | `/api/reservas/:codigo` | Cancela uma reserva e libera o assento para nova compra |

**Lógica de negócio implementada nos mocks:**
- Verificação de assento já ocupado no POST (retorna `400`)
- Liberação do assento ao cancelar (`DELETE`)
- Case-insensitive no código da reserva
- Delay simulado por endpoint (800ms a 1200ms) para testar estados de loading
- Persistência de reservas em memória consistente durante a sessão

---

## O que Ficou de Fora e Melhorias Futuras

Com mais tempo e/ou um backend real, as evoluções prioritárias seriam:

### Funcionais
- **Persistência de Reservas:** Hoje o estado de reservas é perdido ao recarregar a página. Com `localStorage` ou um backend, isso seria resolvido.
- **Máscara de CPF:** O campo aceita somente números mas não formata automaticamente (ex: `000.000.000-00`). Uma biblioteca como `react-input-mask` resolveria isso.
- **Paginação / Scroll infinito:** Para muitas viagens disponíveis, a listagem precisaria de paginação.
- **Autenticação:** Sistema de login para associar reservas ao usuário logado.

### Técnicas
- **Testes E2E com Playwright:** Os testes atuais cobrem componentes isolados. Testes E2E validariam o fluxo completo de navegação entre páginas com um browser real.
- **React Query DevTools:** Adicionar as DevTools do TanStack Query para facilitar o debug do cache em desenvolvimento.
- **Internacionalização (i18n):** Estrutura preparada para múltiplos idiomas via `react-i18next`.
- **Acessibilidade (a11y):** Auditoria completa com `axe-core` para conformidade com WCAG 2.1 AA.
- **Backend real:** API REST em Node.js (NestJS ou Fastify) com PostgreSQL para persistência real de dados.

---

<p align="center">
  Desenvolvido com ☕ e TypeScript.
</p>

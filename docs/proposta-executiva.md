# Proposta Executiva — Plataforma Auto Prestige

- Cliente: Auto Prestige
- Data: 03/10/2025
- Responsável: Equipe Técnica

## Sumário Executivo

Plataforma editorial e de serviços automotivos, com conteúdo multimídia (artigos, notícias, vídeos), catálogo e gestão de test drives, diretório de concessionárias, utilitários (ferramentas), monetização por publicidade, busca unificada e chatbot dinâmico conectado às APIs em tempo real. Construída em Next.js com SSR/SSG, performance Turbopack, APIs próprias e integrações de analytics, privacidade e SEO técnico.

## Objetivos

- Aumentar alcance e engajamento com conteúdo e experiências.
- Gerar leads qualificados (test drives, contato, newsletter).
- Monetizar com publicidade e parcerias.
- Garantir governança com admin completo e APIs seguras.

## Escopo Funcional (Completo)

### Conteúdo e Experiências
- Artigos (`/artigos` | `GET /api/artigos`): listagem paginada, filtros, página por `slug`, SEO técnico.
- Notícias (`/noticias` | `GET /api/noticias`): manchetes, filtros, página por `id`/`slug`.
- Vídeos (`/videos`): destaques (`VideosDestaque`), player (`VideoPlayer`), assinatura YouTube (`YouTubeSubscribe`).
- Test Drives (`/test-drives` | `GET/POST /api/test-drives`, `GET/PUT/DELETE /api/test-drives/[slug]`): catálogo, filtros/paginação e gestão de solicitações.
- Mercado (`/mercado`): conteúdos e dados de mercado (hooks e páginas dedicadas).
- Páginas institucionais (`/sobre`, `/termos`, `/privacidade`): conteúdo estático com SEO.

### Concessionárias
- Diretório de Concessionárias (`/concessionarias` | `GET /api/concessionarias`): listagem, dados estruturados, store local.
- Registro de Concessionárias (`DealershipRegistration`): forms de cadastro e integração de leads.

### Interação e Engajamento
- Chatbot Dinâmico (`Chatbot`, `ChatbotButton`): respostas em tempo real de artigos, notícias, test drives, concessionárias e ferramentas; “digitando…”; sugestões e telemetria via analytics.
- Newsletter (`/newsletter`): captura de assinaturas e integração com conteúdo.
- Contato (`/contato`): envio via `lib/email.ts` e suporte `lib/whatsapp.ts`.
- Modal e UI (`Modal`, `components/ui/`): diálogos, layouts condicionais, experiência consistente.

### Busca e Descoberta
- Busca Unificada (`GET /api/busca`): agrega resultados de artigos, notícias e test drives com filtros e paginação.
- Hero Carousel (`useHeroCarousel`): destaques da homepage, coberto por testes.

### Ferramentas e Utilitários
- Catálogo de Ferramentas (`/ferramentas` | `GET /api/ferramentas`): listagem, filtros/paginação e execução.
- Administração de Ferramentas (`GET/PUT/DELETE /api/admin/ferramentas`, `GET /api/admin/ferramentas/[id]`): criar/editar/excluir/rodar.
- Exportação e Sanitização: `lib/export.ts` para extrair dados e `lib/sanitize.ts` para higienização segura.

### Monetização e Parcerias
- Publicidade (`Advertisement`, `usePublicidade`, `usePublicidadeData`): slots, gestão de inventário e métricas.
- Parcerias e Conteúdos Patrocinados (`types/partner.ts`): base para integrações comerciais.

### SEO e Performance
- SEO (`components/SEO/`, `useSEO`, `useSEOAdmin`): metatags, títulos, descrições e dados estruturados.
- Sitemap e Robots (`/sitemap.ts`, `/robots.ts`): indexação automatizada e controle de rastreamento.
- Performance: imagens preguiçosas (`useLazyImage`), SSR/SSG e Turbopack; Core Web Vitals.

### Privacidade e Compliance
- Cookies e Consentimento (`/cookies`, `CookieBanner`, `CookiePreferences`, `CookieContext`): consentimento granular (Analytics, Ads, Funcional) e bloqueio condicional de scripts.
- Páginas obrigatórias (`/privacidade`, `/termos`): conteúdo customizável conforme exigências legais.

### Analytics e Relatórios
- Google Analytics (`components/GoogleAnalytics.tsx`, `lib/analytics.ts`, `useAnalytics`): pageviews, eventos (chatbot, navegação), anonimização de IP e cookie flags.
- KPIs sugeridos: engajamento por módulo, CTR em anúncios, conversões de test drives, leads de concessionárias, assinaturas de newsletter.

### Admin e Operações
- Administração (`/admin`):
  - Usuários (`useUsuariosAdmin`).
  - SEO (`useSEOAdmin`), Configurações (`useConfiguracoesAdmin`).
  - Conteúdos: Artigos/Notícias/Vídeos com CRUD via APIs.
  - Publicidade: inventário e posicionamento.
  - Ferramentas Admin: criar/editar/excluir/rodar (`useFerramentasAdmin`).
  - Solicitações e Leads (`useSolicitacoes`): triagem de contatos/test drives.
  - Mídia (`useMidia`): uploads em `public/uploads/` (documentos, imagens, vídeos).
- Logs e Observabilidade: telemetria de interações, web vitals e erros de runtime.

### APIs e Integrações
- Conteúdo: `GET /api/artigos`, `GET /api/noticias`, `GET /api/videos`.
- Experiências: `GET/POST /api/test-drives`, `GET/PUT/DELETE /api/test-drives/[slug]`.
- Concessionárias: `GET /api/concessionarias`.
- Ferramentas: `GET /api/ferramentas`, `GET/PUT/DELETE /api/admin/ferramentas`, `GET /api/admin/ferramentas/[id]`.
- Busca: `GET /api/busca`.
- Docs públicas: `GET /api/docs` e `src/app/api-docs/`.
- Integrações: E-mail (`lib/email.ts`), WhatsApp (`lib/whatsapp.ts`).
- Segurança: `lib/sanitize.ts` e `middleware.ts`.

### Qualidade e Testes
- Testes automatizados: unit e e2e (`tests/unit`, `tests/e2e`), cobertura de APIs, busca, carousel e homepage.
- Playwright: relatórios (`playwright-report/`) e pipelines prontos para CI.

### Infraestrutura
- Containerização: `docker-compose.yml`.
- Banco de dados: `scripts/db` (schema e migração).
- Configuração e qualidade: ESLint (`eslint.config.mjs`), PostCSS (`postcss.config.mjs`), Jest (`jest.config.js`).

## Experiência do Usuário
- Navegação clara entre conteúdo e utilitários.
- Respostas do chatbot com dados atualizados e sugestões.
- Performance otimizada e acessibilidade consistente.

## Arquitetura Técnica (Resumo)
- Next.js 15.x com Turbopack, SSR/SSG, rotas app dir.
- Hooks e stores para dados (ex.: `useArtigos`, `useNoticias`, `concessionariasStore`).
- APIs internas com endpoints versionados e documentação.
- Gestão de privacidade e analytics sob consentimento.

## KPIs e Métricas
- Audiência: pageviews, usuários únicos, tempo de sessão.
- Conteúdo: leitura completa, compartilhamentos, profundidade por categoria.
- Engajamento: cliques no chatbot, CTR em blocos de destaque.
- Conversão: solicitações de test drive, contatos, assinaturas de newsletter.
- Monetização: impressões e CTR de anúncios, fill rate, receita estimada.
- Qualidade: LCP, CLS, INP, taxa de erro JS/API.

## Cronograma Sugerido (6–10 semanas)
- Fase 1 — Descoberta & Planejamento (semana 1): requisitos, KPIs, mapa de conteúdo.
- Fase 2 — Setup Técnico (semanas 1–2): infraestrutura, privacidade, SEO, analytics.
- Fase 3 — Conteúdo & Páginas (semanas 2–4): artigos/notícias/vídeos, institucionais.
- Fase 4 — Funcionalidades Principais (semanas 3–6): test drives, concessionárias, ferramentas, busca.
- Fase 5 — Monetização (semanas 5–7): publicidade e parcerias.
- Fase 6 — Analytics & QA (semanas 6–8): testes unit/e2e, dashboards KPI.
- Fase 7 — Lançamento & Handover (semanas 8–10): revisão final, treinamento e go-live.

## Estimativa de Investimentos (em Kz)
- Premissas: time sênior, taxa de 30.000 Kz/h, escopo conforme acima.
- Descoberta & Planejamento: 16–24h.
- Setup Técnico: 24–40h.
- Conteúdo & Páginas: 40–80h.
- Funcionalidades Principais: 80–140h.
- Monetização: 24–40h.
- Analytics & QA: 40–60h.
- Lançamento & Handover: 16–24h.
- Valores por fase (estimativa com 30.000 Kz/h):
- Descoberta & Planejamento: 480.000–720.000 Kz
- Setup Técnico: 720.000–1.200.000 Kz
- Conteúdo & Páginas: 1.200.000–2.400.000 Kz
- Funcionalidades Principais: 2.400.000–4.200.000 Kz
- Monetização: 720.000–1.200.000 Kz
- Analytics & QA: 1.200.000–1.800.000 Kz
- Lançamento & Handover: 480.000–720.000 Kz
- Total estimado: 240–408h (7.200.000–12.240.000 Kz). Ajustável por escopo e integrações adicionais.

## Riscos e Mitigação
- Dados externos variáveis: cache leve (30–60s), timeouts e fallbacks.
- Consentimento de cookies: carregamento condicional e comunicação clara.
- SEO e performance: auditorias regulares e otimizações contínuas.
- Integrações futuras (CRM/Ads): design modular e APIs documentadas.

## Anexos
- Endpoints principais e contratos: ver seção “APIs e Integrações”.
- Estrutura do repositório: `src/app`, `src/components`, `src/hooks`, `src/lib`, `src/types`.

---

### Observações
- Este documento serve de base para a proposta comercial e técnica. Valores e prazos serão refinados na fase de descoberta, com detalhamento de entregáveis por sprint e SLAs.

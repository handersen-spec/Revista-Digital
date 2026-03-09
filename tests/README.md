# Testes - Auto Prestige

Este diretório contém todos os testes automatizados do projeto Auto Prestige.

## 📁 Estrutura de Testes

```
tests/
├── e2e/                    # Testes End-to-End (Playwright)
│   ├── global-setup.ts     # Configuração global E2E
│   ├── global-teardown.ts  # Limpeza global E2E
│   ├── homepage.spec.ts    # Testes da página inicial
│   ├── calculadora.spec.ts # Testes da calculadora
│   ├── api.spec.ts         # Testes dos endpoints da API
│   └── busca.spec.ts       # Testes da funcionalidade de busca
├── unit/                   # Testes unitários (Jest)
│   └── api.test.ts         # Testes unitários da API
└── README.md               # Esta documentação

src/
├── components/__tests__/   # Testes de componentes
│   └── Newsletter.test.tsx # Testes do componente Newsletter
├── hooks/__tests__/        # Testes de hooks
│   └── useGoogleAnalytics.test.ts # Testes do hook de analytics
└── lib/__tests__/          # Testes de utilitários
```

## 🧪 Tipos de Testes

### 1. Testes Unitários (Jest)
- **Localização**: `tests/unit/`, `src/components/__tests__/`, `src/hooks/__tests__/`, `src/lib/__tests__/`
- **Framework**: Jest + Testing Library
- **Propósito**: Testar componentes, hooks e funções isoladamente

### 2. Testes End-to-End (Playwright)
- **Localização**: `tests/e2e/`
- **Framework**: Playwright
- **Propósito**: Testar fluxos completos da aplicação

## 🚀 Como Executar os Testes

### Scripts Disponíveis

```bash
# Executar todos os testes unitários
npm run test:unit

# Executar testes de componentes específicos
npm run test:components

# Executar testes de hooks
npm run test:hooks

# Executar testes de bibliotecas/utilitários
npm run test:lib

# Executar testes em modo watch
npm run test:watch

# Executar testes com relatório de cobertura
npm run test:coverage

# Executar testes E2E
npm run test:e2e

# Executar testes E2E com interface gráfica
npm run test:e2e:ui

# Executar testes E2E em modo headed (visível)
npm run test:e2e:headed

# Executar testes E2E em modo debug
npm run test:e2e:debug

# Executar todos os testes (unitários + E2E)
npm run test:all

# Executar pipeline completo de CI
npm run test:ci

# Script completo com relatórios
./scripts/test.sh
```

### Pré-requisitos

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Instalar navegadores do Playwright**:
   ```bash
   npm run playwright:install
   ```

3. **Servidor de desenvolvimento** (para testes E2E):
   ```bash
   npm run dev
   ```

## 📊 Relatórios de Cobertura

Os relatórios de cobertura são gerados na pasta `coverage/`:

- **HTML**: `coverage/lcov-report/index.html`
- **JSON**: `coverage/coverage-final.json`
- **LCOV**: `coverage/lcov.info`

### Metas de Cobertura

- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

## 🎯 Testes por Funcionalidade

### Homepage (`homepage.spec.ts`)
- ✅ Carregamento da página
- ✅ Navegação
- ✅ Exibição de notícias
- ✅ Footer com informações
- ✅ Responsividade
- ✅ SEO básico

### Calculadora (`calculadora.spec.ts`)
- ✅ Carregamento da página
- ✅ Cálculo de impostos
- ✅ Validação de campos
- ✅ Responsividade
- ✅ Informações sobre impostos
- ✅ Limpeza do formulário

### API (`api.spec.ts`)
- ✅ Health check
- ✅ Endpoints de notícias
- ✅ Endpoints de carros
- ✅ Endpoints de concessionárias
- ✅ Documentação OpenAPI
- ✅ Filtros e paginação
- ✅ Validação de dados
- ✅ Headers CORS

### Busca (`busca.spec.ts`)
- ✅ Campo de busca
- ✅ Busca por notícias
- ✅ Sugestões de busca
- ✅ Filtros por categoria
- ✅ Busca sem resultados
- ✅ Histórico de buscas
- ✅ Responsividade móvel
- ✅ Busca avançada

### Componentes
- ✅ **Newsletter**: Renderização, validação, submissão, estados
- ✅ **GoogleAnalytics**: Tracking de eventos, páginas, erros

## 🔧 Configuração

### Jest (`jest.config.js`)
- Ambiente: jsdom
- Setup: `jest.setup.js`
- Cobertura: statements, branches, functions, lines
- Mocks: Next.js, Google Analytics, APIs do navegador

### Playwright (`playwright.config.ts`)
- Navegadores: Chromium, Firefox, WebKit
- Dispositivos: Desktop e Mobile
- Relatórios: HTML, JSON, JUnit
- Screenshots e vídeos em falhas
- Retry automático

## 🐛 Debugging

### Testes Unitários
```bash
# Executar teste específico
npm test -- Newsletter.test.tsx

# Modo debug
npm test -- --detectOpenHandles --forceExit

# Verbose
npm test -- --verbose
```

### Testes E2E
```bash
# Modo debug interativo
npm run test:e2e:debug

# Executar teste específico
npx playwright test homepage.spec.ts

# Gerar trace
npx playwright test --trace on
```

## 📝 Escrevendo Novos Testes

### Testes Unitários
```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from '@jest/globals'
import MeuComponente from '../MeuComponente'

describe('MeuComponente', () => {
  it('deve renderizar corretamente', () => {
    render(<MeuComponente />)
    expect(screen.getByText('Texto esperado')).toBeInTheDocument()
  })
})
```

### Testes E2E
```typescript
import { test, expect } from '@playwright/test'

test.describe('Minha Funcionalidade', () => {
  test('deve funcionar corretamente', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()
  })
})
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Servidor não iniciado**: Certifique-se que `npm run dev` está rodando
2. **Navegadores não instalados**: Execute `npm run playwright:install`
3. **Timeouts**: Aumente o timeout nos testes E2E
4. **Mocks não funcionando**: Verifique `jest.setup.js`

### Logs e Debug

- **Jest**: Use `console.log` ou `--verbose`
- **Playwright**: Use `page.pause()` ou `--debug`
- **CI**: Verifique artifacts de screenshots e vídeos

## 📈 Métricas e Monitoramento

Os testes geram métricas importantes:

- **Tempo de execução**
- **Taxa de sucesso**
- **Cobertura de código**
- **Performance dos endpoints**
- **Acessibilidade**

## 🔄 Integração Contínua

O pipeline de CI executa:

1. Linting
2. Testes unitários com cobertura
3. Build de produção
4. Testes E2E
5. Geração de relatórios

```bash
npm run test:ci
```

## 📚 Recursos Adicionais

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Next.js Testing](https://nextjs.org/docs/testing)

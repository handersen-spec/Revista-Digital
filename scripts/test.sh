#!/bin/bash

# Script para executar todos os testes do projeto
# Auto Prestige

set -e

echo "🧪 Iniciando execução dos testes..."
echo "=================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir com cor
print_color() {
    printf "${1}${2}${NC}\n"
}

# Verificar se as dependências estão instaladas
print_color $BLUE "📦 Verificando dependências..."
if [ ! -d "node_modules" ]; then
    print_color $YELLOW "⚠️  node_modules não encontrado. Instalando dependências..."
    npm install
fi

# Verificar se o servidor está rodando
print_color $BLUE "🌐 Verificando servidor de desenvolvimento..."
if ! curl -s http://localhost:3001 > /dev/null; then
    print_color $YELLOW "⚠️  Servidor não está rodando. Iniciando servidor..."
    npm run dev &
    SERVER_PID=$!
    
    # Aguardar servidor iniciar
    print_color $BLUE "⏳ Aguardando servidor inicializar..."
    sleep 10
    
    # Verificar se servidor iniciou corretamente
    for i in {1..30}; do
        if curl -s http://localhost:3001 > /dev/null; then
            print_color $GREEN "✅ Servidor iniciado com sucesso!"
            break
        fi
        sleep 2
        if [ $i -eq 30 ]; then
            print_color $RED "❌ Falha ao iniciar servidor"
            exit 1
        fi
    done
else
    print_color $GREEN "✅ Servidor já está rodando"
    SERVER_PID=""
fi

# Função para cleanup
cleanup() {
    if [ ! -z "$SERVER_PID" ]; then
        print_color $YELLOW "🛑 Parando servidor..."
        kill $SERVER_PID 2>/dev/null || true
    fi
}

# Registrar cleanup para quando script terminar
trap cleanup EXIT

# Executar testes unitários
print_color $BLUE "🔬 Executando testes unitários (Jest)..."
echo "----------------------------------------"

if npm run test:unit; then
    print_color $GREEN "✅ Testes unitários passaram!"
else
    print_color $RED "❌ Testes unitários falharam!"
    exit 1
fi

echo ""

# Executar testes E2E
print_color $BLUE "🎭 Executando testes E2E (Playwright)..."
echo "----------------------------------------"

if npm run test:e2e; then
    print_color $GREEN "✅ Testes E2E passaram!"
else
    print_color $RED "❌ Testes E2E falharam!"
    exit 1
fi

echo ""

# Gerar relatório de cobertura
print_color $BLUE "📊 Gerando relatório de cobertura..."
echo "----------------------------------------"

if npm run test:coverage; then
    print_color $GREEN "✅ Relatório de cobertura gerado!"
    print_color $BLUE "📁 Relatório disponível em: coverage/lcov-report/index.html"
else
    print_color $YELLOW "⚠️  Falha ao gerar relatório de cobertura"
fi

echo ""

# Executar linting
print_color $BLUE "🔍 Executando verificação de código (ESLint)..."
echo "----------------------------------------"

if npm run lint; then
    print_color $GREEN "✅ Código está conforme as regras de linting!"
else
    print_color $YELLOW "⚠️  Encontrados problemas de linting"
fi

echo ""

# Verificar build
print_color $BLUE "🏗️  Verificando build de produção..."
echo "----------------------------------------"

if npm run build; then
    print_color $GREEN "✅ Build de produção bem-sucedido!"
else
    print_color $RED "❌ Falha no build de produção!"
    exit 1
fi

echo ""
print_color $GREEN "🎉 Todos os testes foram executados com sucesso!"
print_color $BLUE "📋 Resumo:"
print_color $GREEN "   ✅ Testes unitários"
print_color $GREEN "   ✅ Testes E2E"
print_color $GREEN "   ✅ Relatório de cobertura"
print_color $GREEN "   ✅ Verificação de linting"
print_color $GREEN "   ✅ Build de produção"

echo ""
print_color $BLUE "🚀 Projeto pronto para deploy!"

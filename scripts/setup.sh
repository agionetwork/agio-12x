#!/bin/bash

echo "🚀 Configurando Solana USDC Platform..."

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale Node.js 18+ primeiro."
    exit 1
fi

# Verificar versão do Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ é necessário. Versão atual: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) encontrado"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

echo "✅ Dependências instaladas"

# Criar arquivo .env se não existir
if [ ! -f .env.local ]; then
    echo "📝 Criando arquivo .env.local..."
    cp env.example .env.local
    echo "✅ Arquivo .env.local criado"
    echo "⚠️  Configure suas chaves de API no arquivo .env.local"
fi

# Verificar se as dependências estão corretas
echo "🔍 Verificando dependências..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Projeto compilado com sucesso!"
    echo ""
    echo "🎉 Setup concluído!"
    echo ""
    echo "📋 Próximos passos:"
    echo "1. Configure suas chaves de API no arquivo .env.local"
    echo "2. Execute 'npm run dev' para iniciar o servidor de desenvolvimento"
    echo "3. Acesse http://localhost:3000"
    echo ""
    echo "🔑 Chaves necessárias:"
    echo "- STRIPE_SECRET_KEY"
    echo "- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
    echo "- STRIPE_WEBHOOK_SECRET"
else
    echo "❌ Erro na compilação do projeto"
    exit 1
fi

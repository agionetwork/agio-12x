# Solana USDC Platform

Uma plataforma completa para comprar USDC na rede Solana usando métodos de pagamento brasileiros (cartão de crédito, débito e PIX) com opção de parcelamento.

## 🚀 Funcionalidades

- **Compra de USDC** com cartão de crédito, débito e PIX
- **Parcelamento** em até 12x no cartão de crédito
- **Integração com Solana** usando Web3.js
- **Carteira Phantom** para recebimento automático
- **Interface moderna** e responsiva
- **Pagamentos seguros** via Stripe
- **Conversão automática** BRL para USDC

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Blockchain**: Solana Web3.js, SPL Token
- **Pagamentos**: Stripe, MercadoPago
- **UI/UX**: Framer Motion, Lucide React
- **Validação**: React Hook Form, Zod

## 📦 Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd solana-usdc-platform
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp env.example .env.local
```

4. Configure as chaves da API:
- Stripe (obrigatório)
- MercadoPago (opcional)
- Solana RPC

5. Execute o projeto:
```bash
npm run dev
```

## 🔧 Configuração

### Variáveis de Ambiente Obrigatórias

```env
# Solana
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_USDC_MINT=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Configuração do Stripe

1. Crie uma conta no [Stripe](https://stripe.com)
2. Obtenha suas chaves de API
3. Configure os webhooks para `/api/webhooks/stripe`
4. Configure os eventos: `payment_intent.succeeded`, `checkout.session.completed`

### Configuração da Solana

- **Rede Principal**: `https://api.mainnet-beta.solana.com`
- **Rede de Teste**: `https://api.devnet.solana.com`
- **USDC Mint**: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`

## 🏗️ Arquitetura

```
├── app/                    # App Router (Next.js 14)
│   ├── api/               # API Routes
│   │   ├── payments/      # Endpoints de pagamento
│   │   └── webhooks/      # Webhooks do Stripe
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/            # Componentes React
│   ├── Header.tsx         # Cabeçalho
│   ├── PaymentForm.tsx    # Formulário de pagamento
│   ├── WalletConnection.tsx # Conexão de carteira
│   ├── ConversionRate.tsx # Taxa de conversão
│   ├── Features.tsx       # Funcionalidades
│   └── Footer.tsx         # Rodapé
├── lib/                   # Utilitários
│   ├── solana.ts          # Integração Solana
│   └── payments.ts        # Integração pagamentos
├── hooks/                 # React Hooks
│   ├── useWallet.ts       # Hook da carteira
│   └── usePayment.ts      # Hook de pagamento
├── types/                 # Tipos TypeScript
└── utils/                 # Utilitários gerais
```

## 💳 Métodos de Pagamento

### Cartão de Crédito
- Parcelamento em até 12x
- Taxa: 3.5% + juros
- Processamento via Stripe

### Cartão de Débito
- Pagamento à vista
- Taxa: 2.5%
- Processamento via Stripe

### PIX
- Pagamento instantâneo
- Taxa: 1%
- Processamento via Stripe

## 🔒 Segurança

- **Criptografia**: Todas as transações são criptografadas
- **Validação**: Dados validados com Zod
- **Webhooks**: Verificação de assinatura Stripe
- **Carteira**: Integração segura com Phantom Wallet
- **LGPD**: Conformidade com lei brasileira

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Docker

```bash
# Build da imagem
docker build -t solana-usdc-platform .

# Executar container
docker run -p 3000:3000 solana-usdc-platform
```

## 📱 Mobile

A plataforma é totalmente responsiva e otimizada para dispositivos móveis:

- **PWA Ready**: Pode ser instalada como app
- **Touch Friendly**: Interface otimizada para touch
- **Performance**: Carregamento rápido em 3G

## 🔧 Desenvolvimento

### Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Linting
```

### Estrutura de Commits

```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: tarefas de manutenção
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

- **Email**: contato@solana-usdc.com
- **Discord**: [Servidor da Comunidade](https://discord.gg/solana)
- **GitHub Issues**: [Reportar Bug](https://github.com/username/solana-usdc-platform/issues)

## 🙏 Agradecimentos

- [Solana Foundation](https://solana.org)
- [Stripe](https://stripe.com)
- [Phantom Wallet](https://phantom.app)
- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)

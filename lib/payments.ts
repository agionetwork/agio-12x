import Stripe from 'stripe';

// Configuração do Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

// Tipos para pagamentos
export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'pix';
  name: string;
  icon: string;
  installments?: number[];
}

export interface PaymentRequest {
  amount: number; // em BRL
  usdcAmount: number;
  paymentMethod: string;
  installments?: number;
  customerEmail: string;
  customerName: string;
  customerDocument: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
  redirectUrl?: string;
}

// Métodos de pagamento disponíveis
export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'credit_card',
    type: 'credit_card',
    name: 'Cartão de Crédito',
    icon: '💳',
    installments: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  {
    id: 'debit_card',
    type: 'debit_card',
    name: 'Cartão de Débito',
    icon: '💳'
  },
  {
    id: 'pix',
    type: 'pix',
    name: 'PIX',
    icon: '⚡'
  }
];

// Função para criar intent de pagamento no Stripe
export async function createStripePaymentIntent(
  amount: number,
  currency: string = 'brl',
  installments?: number
): Promise<{ clientSecret: string; paymentIntentId: string }> {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe usa centavos
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        installments: installments?.toString() || '1',
      },
    });

    return {
      clientSecret: paymentIntent.client_secret!,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error('Erro ao criar payment intent:', error);
    throw new Error('Erro ao processar pagamento');
  }
}

// Função para criar sessão de checkout do Stripe
export async function createStripeCheckoutSession(
  amount: number,
  usdcAmount: number,
  customerEmail: string,
  successUrl: string,
  cancelUrl: string
): Promise<{ url: string; sessionId: string }> {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: `${usdcAmount.toFixed(6)} USDC`,
              description: 'Compra de USDC na rede Solana',
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      metadata: {
        usdc_amount: usdcAmount.toString(),
      },
    });

    return {
      url: session.url!,
      sessionId: session.id,
    };
  } catch (error) {
    console.error('Erro ao criar checkout session:', error);
    throw new Error('Erro ao processar pagamento');
  }
}

// Função para processar PIX via Stripe
export async function createPixPayment(
  amount: number,
  customerEmail: string,
  successUrl: string,
  cancelUrl: string
): Promise<{ url: string; sessionId: string }> {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Stripe não suporta PIX diretamente
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: 'Compra de USDC via PIX',
              description: 'Pagamento via PIX para compra de USDC',
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
    });

    return {
      url: session.url!,
      sessionId: session.id,
    };
  } catch (error) {
    console.error('Erro ao criar pagamento PIX:', error);
    throw new Error('Erro ao processar pagamento PIX');
  }
}

// Função para verificar status do pagamento
export async function verifyPaymentStatus(paymentIntentId: string): Promise<{
  status: string;
  succeeded: boolean;
}> {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    return {
      status: paymentIntent.status,
      succeeded: paymentIntent.status === 'succeeded',
    };
  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', error);
    throw new Error('Erro ao verificar status do pagamento');
  }
}

// Função para processar reembolso
export async function processRefund(paymentIntentId: string): Promise<{
  success: boolean;
  refundId?: string;
  error?: string;
}> {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    return {
      success: true,
      refundId: refund.id,
    };
  } catch (error) {
    console.error('Erro ao processar reembolso:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

// Função para calcular parcelas
export function calculateInstallments(
  amount: number,
  installments: number,
  interestRate: number = 0.02 // 2% ao mês
): { installmentAmount: number; totalAmount: number; interestAmount: number } {
  if (installments === 1) {
    return {
      installmentAmount: amount,
      totalAmount: amount,
      interestAmount: 0,
    };
  }

  const monthlyRate = interestRate;
  const totalAmount = amount * Math.pow(1 + monthlyRate, installments);
  const installmentAmount = totalAmount / installments;
  const interestAmount = totalAmount - amount;

  return {
    installmentAmount: Math.round(installmentAmount * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    interestAmount: Math.round(interestAmount * 100) / 100,
  };
}

// Função para validar dados do cliente
export function validateCustomerData(data: {
  email: string;
  name: string;
  document: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    errors.push('Email inválido');
  }

  // Validar nome
  if (data.name.length < 2) {
    errors.push('Nome deve ter pelo menos 2 caracteres');
  }

  // Validar CPF/CNPJ
  const documentRegex = /^\d{11}$|^\d{14}$/;
  if (!documentRegex.test(data.document.replace(/\D/g, ''))) {
    errors.push('CPF/CNPJ inválido');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

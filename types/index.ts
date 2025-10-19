// Tipos principais da aplicação

export interface User {
  id: string;
  email: string;
  name: string;
  document: string;
  walletAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number; // em BRL
  usdcAmount: number;
  paymentMethod: string;
  installments?: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  paymentId?: string;
  signature?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface Wallet {
  address: string;
  balance: number; // SOL
  usdcBalance: number;
  isConnected: boolean;
}

export interface PaymentFormData {
  amount: number;
  paymentMethod: string;
  installments?: number;
  customerEmail: string;
  customerName: string;
  customerDocument: string;
}

export interface ConversionRate {
  brlToUsdc: number;
  usdcToBrl: number;
  lastUpdated: Date;
}

export interface InstallmentOption {
  installments: number;
  monthlyAmount: number;
  totalAmount: number;
  interestRate: number;
}

export interface PaymentMethodConfig {
  id: string;
  name: string;
  type: 'credit_card' | 'debit_card' | 'pix';
  icon: string;
  enabled: boolean;
  minAmount?: number;
  maxAmount?: number;
  installments?: number[];
  fees?: {
    fixed?: number;
    percentage?: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SolanaTransaction {
  signature: string;
  success: boolean;
  error?: string;
  blockTime?: number;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  paymentId?: string;
  signature?: string;
  error?: string;
  redirectUrl?: string;
}

// Enums
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum PaymentMethodType {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PIX = 'pix',
}

export enum TransactionType {
  PURCHASE = 'purchase',
  REFUND = 'refund',
  TRANSFER = 'transfer',
}

// Constantes
export const MIN_PURCHASE_AMOUNT = 10; // R$ 10,00
export const MAX_PURCHASE_AMOUNT = 10000; // R$ 10.000,00
export const DEFAULT_CONVERSION_RATE = 5.2; // 1 USDC = R$ 5,20
export const SUPPORTED_CURRENCIES = ['BRL', 'USD'];
export const SUPPORTED_CRYPTOCURRENCIES = ['USDC', 'SOL'];

// Configurações de parcelamento
export const INSTALLMENT_CONFIG = {
  MIN_INSTALLMENTS: 1,
  MAX_INSTALLMENTS: 12,
  INTEREST_RATE: 0.02, // 2% ao mês
  MIN_AMOUNT_FOR_INSTALLMENTS: 100, // R$ 100,00
};

// Configurações de taxas
export const FEE_CONFIG = {
  CREDIT_CARD: {
    PERCENTAGE: 0.035, // 3.5%
    FIXED: 0,
  },
  DEBIT_CARD: {
    PERCENTAGE: 0.025, // 2.5%
    FIXED: 0,
  },
  PIX: {
    PERCENTAGE: 0.01, // 1%
    FIXED: 0,
  },
};

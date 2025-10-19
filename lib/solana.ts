import { 
  Connection, 
  PublicKey, 
  Keypair, 
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import { 
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAccount,
  TOKEN_PROGRAM_ID
} from '@solana/spl-token';

// Configurações da rede Solana
export const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
export const USDC_MINT = new PublicKey(process.env.NEXT_PUBLIC_USDC_MINT || 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

// Conexão com a rede Solana
export const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

// Tipos para a aplicação
export interface WalletInfo {
  publicKey: PublicKey;
  balance: number;
  usdcBalance: number;
}

export interface TransactionResult {
  signature: string;
  success: boolean;
  error?: string;
}

// Função para conectar carteira
export async function connectWallet(): Promise<WalletInfo | null> {
  try {
    if (typeof window !== 'undefined' && window.solana?.isPhantom) {
      const response = await window.solana.connect();
      const publicKey = new PublicKey(response.publicKey);
      
      // Obter saldo SOL
      const balance = await connection.getBalance(publicKey);
      const solBalance = balance / LAMPORTS_PER_SOL;
      
      // Obter saldo USDC
      const usdcBalance = await getUSDCBalance(publicKey);
      
      return {
        publicKey,
        balance: solBalance,
        usdcBalance
      };
    }
    return null;
  } catch (error) {
    console.error('Erro ao conectar carteira:', error);
    return null;
  }
}

// Função para obter saldo USDC
export async function getUSDCBalance(publicKey: PublicKey): Promise<number> {
  try {
    const tokenAccount = await getAssociatedTokenAddress(USDC_MINT, publicKey);
    const accountInfo = await getAccount(connection, tokenAccount);
    return Number(accountInfo.amount) / 1_000_000; // USDC tem 6 decimais
  } catch (error) {
    console.error('Erro ao obter saldo USDC:', error);
    return 0;
  }
}

// Função para criar conta de token associada se não existir
export async function ensureTokenAccount(owner: PublicKey): Promise<PublicKey> {
  const tokenAccount = await getAssociatedTokenAddress(USDC_MINT, owner);
  
  try {
    await getAccount(connection, tokenAccount);
    return tokenAccount;
  } catch (error) {
    // Conta não existe, precisa criar
    throw new Error('Conta de token USDC não encontrada. Você precisa ter pelo menos 0.01 SOL para criar a conta.');
  }
}

// Função para transferir USDC
export async function transferUSDC(
  from: PublicKey,
  to: PublicKey,
  amount: number,
  signTransaction: (tx: Transaction) => Promise<Transaction>
): Promise<TransactionResult> {
  try {
    const transaction = new Transaction();
    
    // Verificar se a conta de destino existe
    let toTokenAccount: PublicKey;
    try {
      toTokenAccount = await getAssociatedTokenAddress(USDC_MINT, to);
      await getAccount(connection, toTokenAccount);
    } catch {
      // Criar conta de token associada
      toTokenAccount = await getAssociatedTokenAddress(USDC_MINT, to);
      transaction.add(
        createAssociatedTokenAccountInstruction(
          from,
          toTokenAccount,
          to,
          USDC_MINT
        )
      );
    }
    
    // Obter conta de origem
    const fromTokenAccount = await getAssociatedTokenAddress(USDC_MINT, from);
    
    // Adicionar instrução de transferência
    const transferAmount = Math.floor(amount * 1_000_000); // Converter para unidades menores
    transaction.add(
      createTransferInstruction(
        fromTokenAccount,
        toTokenAccount,
        from,
        transferAmount,
        [],
        TOKEN_PROGRAM_ID
      )
    );
    
    // Obter recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = from;
    
    // Assinar e enviar transação
    const signedTransaction = await signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTransaction.serialize());
    
    // Confirmar transação
    await connection.confirmTransaction(signature);
    
    return {
      signature,
      success: true
    };
  } catch (error) {
    console.error('Erro na transferência USDC:', error);
    return {
      signature: '',
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

// Função para obter taxa de conversão BRL/USDC
export async function getBRLToUSDCPrice(): Promise<number> {
  try {
    // Em produção, você usaria uma API real como CoinGecko ou CoinMarketCap
    // Por agora, vamos usar um valor fixo para demonstração
    return 5.2; // 1 USDC = R$ 5,20 (valor aproximado)
  } catch (error) {
    console.error('Erro ao obter preço USDC:', error);
    return 5.2; // Valor padrão
  }
}

// Função para calcular taxa de conversão
export function calculateUSDCAmount(brlAmount: number, rate: number): number {
  return brlAmount / rate;
}

// Função para calcular taxa de conversão reversa
export function calculateBRLAmount(usdcAmount: number, rate: number): number {
  return usdcAmount * rate;
}

// Declaração global para Phantom Wallet
declare global {
  interface Window {
    solana?: {
      isPhantom: boolean;
      connect: () => Promise<{ publicKey: string }>;
      signTransaction: (tx: Transaction) => Promise<Transaction>;
      signAllTransactions: (txs: Transaction[]) => Promise<Transaction[]>;
    };
  }
}

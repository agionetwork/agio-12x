// Tipos para integração com carteiras Solana

export interface WalletAdapter {
  connect(): Promise<{ publicKey: any }>
  disconnect(): Promise<void>
  signTransaction(transaction: any): Promise<any>
  signAllTransactions(transactions: any[]): Promise<any[]>
  publicKey: any
  connected: boolean
}

export interface PhantomWallet extends WalletAdapter {
  isPhantom: boolean
}

export interface SolflareWallet extends WalletAdapter {
  isSolflare: boolean
}

export interface BackpackWallet extends WalletAdapter {
  isBackpack: boolean
}

// Extensão da interface Window para incluir carteiras
declare global {
  interface Window {
    solana?: PhantomWallet
    solflare?: SolflareWallet
    backpack?: BackpackWallet
  }
}

export interface WalletInfo {
  id: string
  name: string
  description: string
  icon: string
  color: string
  type: 'external' | 'embedded'
  downloadUrl?: string
  isInstalled: boolean
}

export interface WalletConnectionResult {
  walletType: string
  address: string
  publicKey: string
  connected: boolean
}

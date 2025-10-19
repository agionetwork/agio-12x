'use client'

import { PrivyProvider as BasePrivyProvider } from '@privy-io/react-auth'

export default function PrivyProvider({ children }: { children: React.ReactNode }) {
  return (
    <BasePrivyProvider
      appId="clx123456789"
      config={{
        loginMethods: ['google', 'wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#3B82F6',
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      {children}
    </BasePrivyProvider>
  )
}

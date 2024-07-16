'use client'

import { wagmiConfig } from '@/config/wagmiConfig'
import { useFhevmInstance } from '@/hooks/useFhevmInstance'
import { NextUIProvider } from '@nextui-org/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { BalancesProvider } from './BalancesProvider'

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  const fh = useFhevmInstance()
  console.log('fhevm instance:', fh)
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <NextUIProvider>
          <BalancesProvider>{children}</BalancesProvider>
        </NextUIProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

'use client'

import { wagmiConfig } from '@/config/wagmiConfig'
import { NextUIProvider } from '@nextui-org/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { BalancesProvider } from './BalancesProvider'
import { useFhevmInstance } from '@/hooks/useFhevmInstance'

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  const fh = useFhevmInstance()
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

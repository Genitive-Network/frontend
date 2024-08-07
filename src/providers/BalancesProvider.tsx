import { createContext, useCallback, useState, type ReactNode } from 'react'

export type TokenBalance = {
  decimals: number
  value: bigint
  encrypted: string
}
// encrypted token balance
export type Balances = {
  [tokenAddress: `0x${string}`]: TokenBalance | undefined
}
export const BalanceContext = createContext<{
  balances: Balances
  addOrUpdateBalance: (params: {
    tokenAddress: `0x${string}`
    value?: TokenBalance['value']
    decimals?: TokenBalance['decimals']
    encrypted?: string
  }) => void
}>({ balances: {}, addOrUpdateBalance: () => {} })

interface BalancesProviderProps {
  children: ReactNode
}
export function BalancesProvider({ children }: BalancesProviderProps) {
  const [balances, setBalances] = useState<Balances>({})
  // ebtc balance
  console.log('=======BalancesProvider=======', balances)

  // Function to update or add a balance entry
  const addOrUpdateBalance = useCallback(
    ({
      tokenAddress,
      value,
      decimals = 18,
      encrypted,
    }: {
      tokenAddress: `0x${string}`
      value?: TokenBalance['value']
      decimals?: TokenBalance['decimals']
      encrypted?: string
    }) => {
      // TODO decrypt the encrypted balance inside this provider?
      setBalances(prevBalances => ({
        ...prevBalances,
        [tokenAddress]: {
          value,
          decimals,
          encrypted,
        },
      }))
    },
    [setBalances],
  )

  // The value to be provided to the context
  const value = {
    balances,
    addOrUpdateBalance,
  }

  return (
    <BalanceContext.Provider value={value}>{children}</BalanceContext.Provider>
  )
}

import { wagmiConfig } from '@/config/wagmiConfig'
import { useEffect, useState } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { getBalance, type GetBalanceReturnType } from 'wagmi/actions'

// Assuming `getBalance` and `balanceOf` are functions that fetch the token balance
// for different chains, and `useChain` is a hook that provides the current chain's information.

export function useTokenBalance(token?: Address) {
  const [balance, setBalance] = useState<GetBalanceReturnType>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<any>(null)
  const { isConnected, address, chain } = useAccount()

  useEffect(() => {
    console.log({ chain, isConnected })
    if (!chain) return

    const fetchBalance = async () => {
      if (!address || !chain.id) return

      setIsLoading(true)
      setError(null)

      try {
        let balance
        balance = await getBalance(wagmiConfig, {
          address,
          ...(token && { token }),
          chainId: chain.id,
        })

        setBalance(balance)
      } catch (err) {
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBalance()
  }, [address, chain, token, isConnected])

  return { balance, isLoading, error }
}

// TODO useEncryptedBalance, return encryptedBalance, decrypt

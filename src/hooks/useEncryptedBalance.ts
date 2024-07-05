import { getReencryptPublicKey } from '@/utils/fhevm'
import { Uint8Array2HexString } from '@/utils/helpers'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useFhevmInstance } from './useFhevmInstance'

const fetchBalance = async (
  tokenAddress: string,
  userAddress: string,
  publicKey: string,
  signature: string,
): Promise<{ balance: `0x${string}` }> => {
  const response = await fetch('/api/decrypt', {
    method: 'POST',
    body: JSON.stringify({
      token_addr: tokenAddress,
      user_addr: userAddress,
      public_key: publicKey,
      signature: signature,
    }),
  })

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  return response.json()
}

export default function useEncryptedBalance(tokenAddress?: string) {
  const { isConnected, address } = useAccount()
  const [publicKey, setPublicKey] = useState('')
  const [signature, setSignature] = useState('')
  const [shouldFetch, setShouldFetch] = useState(false)

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['decrypt'],
    queryFn: () =>
      fetchBalance(tokenAddress!, address!, publicKey!, signature!),
    staleTime: 0,
    refetchOnWindowFocus: true,
    enabled: shouldFetch,
  })

  const fhevmInstance = useFhevmInstance()

  useEffect(() => {
    async function ready() {
      console.log('check is ready', !!fhevmInstance, !!tokenAddress)
      if (isConnected && address && fhevmInstance && tokenAddress) {
        const reencrypt = await getReencryptPublicKey(
          fhevmInstance,
          tokenAddress,
          address,
        )
        if (!reencrypt) return
        setPublicKey(Uint8Array2HexString(reencrypt.publicKey))
        setSignature(reencrypt.signature)
      }
    }
    ready()
  }, [isConnected, address, fhevmInstance, tokenAddress])

  useEffect(() => {
    if (tokenAddress && address && publicKey && signature) {
      setShouldFetch(true)
    }
  }, [address, publicKey, signature, tokenAddress])

  return { data, error, isLoading, refetch }
}

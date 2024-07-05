import { CHAIN_ID } from '@/config/wagmiConfig'
import { ChainItem } from '@/types'
import { Uint8Array2HexString } from '@/utils/helpers'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { TypedDataDomain } from 'viem'
import { useAccount, useSignTypedData, useSwitchChain } from 'wagmi'
import { useFhevmInstance } from './useFhevmInstance'

const fetchBalance = async (
  tokenAddress: string,
  userAddress: string,
  publicKey: string,
  signature: string,
): Promise<{ balance: `0x${string}` }> => {
  const response = await fetch('/api/balance', {
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

export default function useEncryptedBalance(chainItem?: ChainItem) {
  const { isConnected, address } = useAccount()
  const [publicKey, setPublicKey] = useState('')
  const [signature, setSignature] = useState('')
  const [shouldFetch, setShouldFetch] = useState(false)

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['decrypt'],
    queryFn: () =>
      fetchBalance(chainItem!.ebtcAddress, address!, publicKey!, signature!),
    staleTime: 0,
    refetchOnWindowFocus: true,
    enabled: shouldFetch,
  })

  const fhevmInstance = useFhevmInstance()
  const { switchChainAsync } = useSwitchChain()
  const { signTypedDataAsync } = useSignTypedData()

  useEffect(() => {
    async function ready() {
      console.log('check is ready', !!fhevmInstance, !!chainItem)
      if (isConnected && address && fhevmInstance && chainItem) {
        await switchChainAsync({ chainId: CHAIN_ID.zamaDevnet })
        // const reencrypt = await getPublicKeyAndSig(
        //   fhevmInstance,
        //   chainItem.ebtcAddress,
        //   address,
        // )
        const { publicKey, eip712 } = fhevmInstance.generatePublicKey({
          verifyingContract: chainItem.ebtcAddress,
        })
        console.log({ eip712 })
        // const types = { Reencrypt: eip712.types.Reencrypt }
        const sig = await signTypedDataAsync({
          types: { Reencrypt: eip712.types.Reencrypt },
          domain: eip712.domain as TypedDataDomain,
          primaryType: 'Reencrypt',
          message: eip712.message,
        })

        if (!sig) {
          console.error('get reencrypt publickey failed.', {
            ca: chainItem.ebtcAddress,
          })
          return
        }

        fhevmInstance.setSignature(chainItem.ebtcAddress, sig)
        console.log('get reencrypt for fetch balance:', sig)

        setPublicKey(Uint8Array2HexString(publicKey))
        setSignature(sig)
        await switchChainAsync({ chainId: chainItem.id })
      }
    }
    ready()
  }, [
    isConnected,
    address,
    fhevmInstance,
    chainItem,
    switchChainAsync,
    signTypedDataAsync,
  ])

  useEffect(() => {
    if (chainItem && address && publicKey && signature) {
      setShouldFetch(true)
    }
  }, [address, publicKey, signature, chainItem])

  return { data, error, isLoading, refetch }
}

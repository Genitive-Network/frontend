import { CHAIN_ID } from '@/config/wagmiConfig'
import { ZAMA_ADDRESS_EMDC } from '@/constants'
import { ChainItem } from '@/types'
import { Uint8Array2HexString } from '@/utils/helpers'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useState } from 'react'
import { TypedDataDomain } from 'viem'
import { useAccount, useSignTypedData, useSwitchChain } from 'wagmi'
import { useFhevmInstance } from './useFhevmInstance'
import { getFhevmInstance } from '@/utils/fhevm'

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
  // TODO set isSigning to true when signing. if isSigning is true, the page should not switch chain
  // const [isSigning, setIsSigning] = useState(false)

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['decrypt'],
    queryFn: () =>
      fetchBalance(chainItem!.ebtcAddress, address!, publicKey!, signature!),
    staleTime: 0,
    refetchOnWindowFocus: true,
    enabled: shouldFetch,
  })

  const fhevmInstance = getFhevmInstance()
  const { switchChainAsync } = useSwitchChain()
  const { signTypedDataAsync } = useSignTypedData()

  const update = useCallback(async () => {
    console.log('check is ready', !!fhevmInstance, !!chainItem)
    if (isConnected && address && fhevmInstance && chainItem) {
      // const reencrypt = await getPublicKeyAndSig(
      //   fhevmInstance,
      //   ZAMA_ADDRESS_EMDC,
      //   address,
      // )
      await switchChainAsync({ chainId: CHAIN_ID.zamaDevnet })

      // const reencrypt = await getReencryptPublicKey(
      //   fhevmInstance,
      //   ZAMA_ADDRESS_EMDC,
      //   address,
      // )
      // if (reencrypt) {
      //   console.log('get reEncrypt key from fhevmInstance.', reencrypt)
      //   setPublicKey(Uint8Array2HexString(reencrypt.publicKey))
      //   setSignature(reencrypt?.signature)
      // }

      if (fhevmInstance.hasKeypair(ZAMA_ADDRESS_EMDC)) {
        console.log('the required keypair has been generated before.')
        const reEncryptKey = fhevmInstance.getPublicKey(ZAMA_ADDRESS_EMDC)
        if (reEncryptKey) {
          console.log('get reEncrypt key from fhevmInstance.', reEncryptKey)
          setPublicKey(Uint8Array2HexString(reEncryptKey.publicKey))
          setSignature(reEncryptKey?.signature)
          await switchChainAsync({ chainId: chainItem.id })
          return
        }
        console.log('Failed to get reEncrypt key, try generate a new one.')
      }

      const { publicKey, eip712 } = fhevmInstance.generatePublicKey({
        verifyingContract: ZAMA_ADDRESS_EMDC,
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
          ca: ZAMA_ADDRESS_EMDC,
        })
        await switchChainAsync({ chainId: chainItem.id })
        return
      }

      fhevmInstance.setSignature(ZAMA_ADDRESS_EMDC, sig)
      console.log('get reencrypt for fetch balance:', sig)

      setPublicKey(Uint8Array2HexString(publicKey))
      setSignature(sig)
      await switchChainAsync({ chainId: chainItem.id })
    }
  }, [
    isConnected,
    address,
    fhevmInstance,
    chainItem,
    switchChainAsync,
    signTypedDataAsync,
  ])

  useEffect(() => {
    console.log('shouldFetch:', chainItem && address && publicKey && signature)
    if (chainItem && address && publicKey && signature) {
      setShouldFetch(true)
    }
  }, [address, publicKey, signature, chainItem])

  return { data, error, isLoading, update, refetch }
}

'use client'

import { CHAIN_ID } from '@/config/wagmiConfig'
import { gacABI } from '@/constants'
import { ChainItem } from '@/types'
import { getReencryptPublicKey } from '@/utils/fhevm'
import { Uint8Array2HexString } from '@/utils/helpers'
import { useCallback, useEffect, useState } from 'react'
import { useReadContract, useSwitchChain, useWriteContract } from 'wagmi'
import { useFhevmInstance } from './useFhevmInstance'

export function usePubkey(chainItem?: ChainItem, address?: `0x${string}`) {
  const [pubkey, setPubkey] = useState<string>('')
  const [isPending, setIsPending] = useState(true)
  const [hash, setHash] = useState<`0x${string}`>()

  const { writeContractAsync, isPending: isSettingPubkey } = useWriteContract()

  const { data: pubkeyFromGAC, isLoading: isReading } = useReadContract({
    account: address,
    abi: gacABI,
    address: chainItem?.gac,
    functionName: 'getPubkey',
    chainId: chainItem?.id,
  })

  const fhevmInstance = useFhevmInstance()
  const { switchChainAsync } = useSwitchChain()

  const [pubkeyFromWallet, setPubkeyFromWallet] = useState('')
  const requestEncryptionKey = useCallback(() => {
    console.log('requestEncryptionKey')
    async function request() {
      if (!address || !chainItem || !fhevmInstance) return

      await switchChainAsync({ chainId: CHAIN_ID.zamaDevnet })
      const reencrypt = await getReencryptPublicKey(
        fhevmInstance,
        chainItem.ebtcAddress,
        address,
      )
      const requestedPublicKey = reencrypt?.publicKey

      // const { signature, publicKey: requestedPublicKey } = await getSignature(
      //   fhevmInstance,
      //   chainItem.ebtcAddress,
      //   address,
      // )
      console.log({ requestedPublicKey })
      if (!requestedPublicKey) {
        alert('Please set public key before encrypt and transfer.')
        return
      }

      const pubkeyHex = Uint8Array2HexString(requestedPublicKey)
      console.log({ pubkeyHex })
      setPubkeyFromWallet(pubkeyHex)

      console.log('switchChain', chainItem.label, { chainId: chainItem.id })
      await switchChainAsync({ chainId: chainItem.id })
      debugger
      const hash = await writeContractAsync({
        account: address,
        abi: gacABI,
        address: chainItem.gac,
        functionName: 'setPubkey',
        args: [pubkeyHex as `0x${string}`],
      })
      console.log('setPubkey tx hash:', hash)
      setIsPending(isSettingPubkey)
      setHash(hash)
    }
    request()
  }, [
    address,
    chainItem,
    fhevmInstance,
    isSettingPubkey,
    switchChainAsync,
    writeContractAsync,
  ])

  useEffect(() => {
    if (
      pubkeyFromGAC &&
      pubkeyFromGAC !==
        '0x0000000000000000000000000000000000000000000000000000000000000000'
    ) {
      console.info('get valid pubkey from gac:', pubkeyFromGAC)
      setPubkey(pubkeyFromGAC)
      setIsPending(false)

      return
    }

    setIsPending(isReading)
    console.log('no pubkey', { isReading, pubkeyFromGAC })
  }, [isReading, pubkeyFromGAC])

  return {
    pubkey,
    isPending,
    hash,
    requestEncryptionKey,
    pubkeyFromWallet,
  }
}

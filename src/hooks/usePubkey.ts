import { gacABI } from '@/constants'
import { ChainItem } from '@/types'
import { base64ToBytes32, requestPublicKey } from '@/utils/helpers'
import { useCallback, useEffect, useState } from 'react'
import { useReadContract, useWriteContract } from 'wagmi'

export function usePubkey(
  chainItem: ChainItem | null,
  address?: `0x${string}`,
) {
  const [pubkey, setPubkey] = useState('')
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

  const requestEncryptionKey = useCallback(() => {
    console.log('hhh')
    async function request() {
      if (!address || !chainItem) return

      const requestedPublicKey = await requestPublicKey(address)
      console.log({ requestedPublicKey })
      if (!requestedPublicKey) {
        alert('Please set public key before encrypt and transfer.')
        return
      }

      const pubkeyBytes = base64ToBytes32(requestedPublicKey)
      console.log({ pubkeyBytes })
      const hash = await writeContractAsync({
        abi: gacABI,
        address: chainItem.gac,
        functionName: 'setPubkey',
        args: [pubkeyBytes as `0x${string}`],
      })
      setIsPending(isSettingPubkey)
      setHash(hash)
    }
    request()
  }, [address, chainItem, isSettingPubkey, writeContractAsync])

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

  return { pubkey, isPending, hash, requestEncryptionKey }
}

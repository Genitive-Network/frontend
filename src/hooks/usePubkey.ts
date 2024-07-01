import { wagmiConfig } from '@/config/wagmiConfig'
import { gacABI } from '@/constants'
import { ChainItem } from '@/types'
import { base64ToBytes32, requestPublicKey } from '@/utils/helpers'
import { readContract } from '@wagmi/core'
import { useEffect, useState } from 'react'
import { useWriteContract } from 'wagmi'

export function usePubkey(
  chainItem: ChainItem | null,
  address?: `0x${string}`,
) {
  const [pubkey, setPubkey] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [hash, setHash] = useState('')

  const {
    writeContractAsync,
    isPending: isSettingPubkey,
    data: setPubkeyTx,
  } = useWriteContract()
  console.log({ chainItem, address })

  useEffect(() => {
    async function readKey() {
      setIsPending(true)
      const res = await readContract(wagmiConfig, {
        abi: gacABI,
        address: chainItem?.gac,
        functionName: 'getPubkey',
        chainId: chainItem?.id,
      })
      const pubkey = res.data
      console.log('pubkey from GAC:', res)

      if (
        pubkey &&
        pubkey !==
          '0x0000000000000000000000000000000000000000000000000000000000000000'
      ) {
        console.info('get valid pubkey from gac:', pubkey)
        setPubkey(pubkey)
        setIsPending(res.isPending)
        setHash(res.hash)
        return
      }

      if (!address || !chainItem) return ''
      const requestedPublicKey = await requestPublicKey(address)
      console.log({ requestedPublicKey })
      if (!requestedPublicKey) {
        alert('Please set public key before encrypt and transfer.')
        return
      }

      const pubkeyBytes = base64ToBytes32(requestedPublicKey)
      console.log({ pubkeyBytes })
      await writeContractAsync({
        abi: gacABI,
        address: chainItem.gac,
        functionName: 'setPubkey',
        args: [pubkeyBytes as `0x${string}`],
      })
    }
    readKey()
  }, [])

  return { pubkey, isPending, hash }
}

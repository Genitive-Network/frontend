import { gacABI } from '@/constants'
import { ChainItem } from '@/types'
import { base64ToBytes32, requestPublicKey } from '@/utils/helpers'
import { JsonRpcSigner, ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { useWriteContract } from 'wagmi'

export async function getContractPubkey(gac: string, signer: JsonRpcSigner) {
  const contract = new ethers.Contract(gac, gacABI, signer)
  console.log('pubkey: ', await contract.getPubkey())
  return await contract.getPubkey()
}

export function usePubkey(
  chainItem: ChainItem | null,
  signer?: JsonRpcSigner,
  address?: `0x${string}`,
) {
  const [pubkey, setPubkey] = useState('')
  const [isPending, setIsPending] = useState(true)
  const [hash, setHash] = useState<`0x${string}`>()

  const { writeContractAsync, isPending: isSettingPubkey } = useWriteContract()

  // TODO: investigate why useReadContract returns 0x00000...
  // const { data: pubkeyFromGAC, isLoading: isReading } = useReadContract({
  //   abi: gacABI,
  //   address: chainItem?.gac,
  //   functionName: 'getPubkey',
  //   args: [],
  // })

  // console.log({
  //   pubkeyFromGAC,
  //   gac: chainItem?.gac,
  //   chainId: chainItem?.id,
  //   address,
  // })

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
    if (!chainItem || !signer) return
    getContractPubkey(chainItem?.gac, signer).then(pubkeyFromGAC => {
      // const pubkeyHex = hexlify(pubkeyFromGAC)
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

      setIsPending(false)
      console.log('no pubkey', { pubkeyFromGAC })
    })
  }, [chainItem, chainItem?.gac, signer])

  return { pubkey, isPending, hash, requestEncryptionKey }
}

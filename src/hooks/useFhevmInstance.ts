'use client'

import { CHAIN_ID } from '@/config/wagmiConfig'
import { createFhevmInstance } from '@/utils/fhevm'
import { useEthersProvider } from '@/utils/helpers'
import { FhevmInstance, initFhevm } from 'fhevmjs'
import { useEffect, useState } from 'react'

export function useFhevmInstance() {
  const [instance, setInstance] = useState<FhevmInstance>()
  const provider = useEthersProvider({ chainId: CHAIN_ID.zamaDevnet })

  useEffect(() => {
    if (!provider) {
      console.error('provider is not provided.')
      return
    }
    if (instance) {
      console.info('instance existed, no need to create.')
      return
    }

    initFhevm()
      .then(() => {
        createFhevmInstance(provider).then(instance => {
          setInstance(instance)
        })
      })
      .catch(e => {
        console.error('Init fhevm error', e)
      })
  }, [instance, provider])

  return instance
}

'use client'

import { CHAIN_ID } from '@/config/wagmiConfig'
import { createFhevmInstance } from '@/utils/fhevm'
import { useEthersProvider } from '@/utils/helpers'
import { FhevmInstance, initFhevm } from 'fhevmjs'
import { useEffect, useState } from 'react'

let globalInstance: FhevmInstance
let initializing = false
export function useFhevmInstance() {
  const [instance, setInstance] = useState<FhevmInstance>()
  const provider = useEthersProvider({ chainId: CHAIN_ID.zamaDevnet })

  useEffect(() => {
    if (!provider) {
      console.error('provider is not provided.')
      return
    }
    if (globalInstance) {
      setInstance(globalInstance)
      console.info('instance existed, no need to create.')
      return
    }

    if (initializing) {
      return
    }

    initializing = true
    initFhevm()
      .then(() => {
        console.info('instance creating.')
        createFhevmInstance(provider).then(i => {
          console.info('instance created.', i)
          globalInstance = i
          setInstance(globalInstance)
        })
      })
      .catch(e => {
        console.error('Init fhevm error', e)
      })
  }, [provider])

  return instance
}

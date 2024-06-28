import { CHAIN_ID } from '@/config/wagmiConfig'
import { createFhevmInstance } from '@/utils/fhevm'
import { useEthersProvider } from '@/utils/helpers'
import { FhevmInstance, initFhevm } from 'fhevmjs'
import { useEffect, useState } from 'react'

export function useFhevmInstance() {
  const [instance, setInstance] = useState<FhevmInstance>()
  const provider = useEthersProvider({ chainId: CHAIN_ID.incoTestnet })

  useEffect(() => {
    if (!provider || instance) {
      console.error('provider is not provided.')
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

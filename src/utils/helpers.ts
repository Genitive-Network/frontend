import { CHAIN_ID, wagmiConfig } from '@/config/wagmiConfig'
import {
  BrowserProvider,
  FallbackProvider,
  JsonRpcProvider,
  JsonRpcSigner,
  hexlify,
} from 'ethers'
import { useMemo } from 'react'
import {
  ProviderRpcError,
  type Account,
  type Chain,
  type Client,
  type Transport,
} from 'viem'
import { useConnectorClient, type Config } from 'wagmi'

export const shortAddress = (
  str: `0x${string}`,
  num: number = 4,
  placeholder = '...',
) => {
  if (typeof str === 'string' && str) {
    return `${str?.substring(0, num + 2)}${placeholder}${str?.substring(str?.length - num)}`
  }
  return ''
}

export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new BrowserProvider(transport, network)
  const signer = new JsonRpcSigner(provider, account.address)
  return signer
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: client } = useConnectorClient<Config>({ chainId })
  return useMemo(() => (client ? clientToSigner(client) : undefined), [client])
}

// export function useIncoSigner() {
//   const client = wagmiConfig.getClient({ chainId: CHAIN_ID.incoTestnet })
//   return useMemo(() => (client ? clientToSigner(client) : undefined), [client])
// }

export function useFhevmSigner() {
  const { data: client } = useConnectorClient<Config>({
    chainId: CHAIN_ID.zamaDevnet,
  })
  return useMemo(() => (client ? clientToSigner(client) : undefined), [client])
}

export function clientToProvider(client: Client<Transport, Chain>) {
  const { chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  if (transport.type === 'fallback') {
    const providers = (transport.transports as ReturnType<Transport>[]).map(
      ({ value }) => new JsonRpcProvider(value?.url, network),
    )
    if (providers.length === 1) return providers[0]
    return new FallbackProvider(providers)
  }
  return new JsonRpcProvider(transport.url, network)
}

/** Action to convert a viem Client to an ethers.js Provider. */
export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  const client = wagmiConfig.getClient({ chainId })

  return useMemo(
    () => (client ? clientToProvider(client) : undefined),
    [client],
  )
}

export function cls(input: (string | boolean)[]): string {
  return input
    .filter((cond: string | boolean) => typeof cond === 'string')
    .join(' ')
}

export function Uint8Array2HexString(array: Uint8Array) {
  return (
    '0x' +
    Array.from(array)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('')
  )
}

export function base64ToBytes32(base64: string) {
  const decoded = Buffer.from(base64, 'base64') // 使用 Node.js Buffer 进行 Base64 解码
  return hexlify(decoded) //.padEnd(66, '0')
}

export async function requestPublicKey(address: string) {
  try {
    // TODO get current connected connector name
    // const provider = walletName === 'MetaMask' ? window.ethereum : window.okxwallet
    const provider = window.ethereum || window.okxwallet
    const publicKey = await provider.request({
      method: 'eth_getEncryptionPublicKey',
      params: [address],
    })

    return publicKey
  } catch (error) {
    let message = 'Unknown Error'
    if (error instanceof ProviderRpcError) {
      message = error.message
      if (error.name === 'UserRejectedRequestError') {
        console.log(message)
        return
      }
    }

    console.error(message)
  }
}

export const decryptText = async (account: string, text: string) => {
  // TODO get current connected connector name
  // const provider = walletName === 'MetaMask' ? window.ethereum : window.okxwallet
  const provider = window.ethereum || window.okxwallet
  const decryptedObj = await provider.send('eth_decrypt', [text, account])
  console.log({ decryptText: decryptedObj.result })
  return decryptedObj.result as string
}

/**
 * Convert an ISO 8601 date string to the user’s local date format.
 * @param {string} isoString - ISO 8601 format string
 * @returns {string}
 */
export function formatToUserLocale(isoString: string) {
  const date = new Date(isoString)

  const userLocale =
    typeof window !== 'undefined' ? window.navigator.language : 'en-US'

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    // timeZoneName: 'short'
  }

  return new Intl.DateTimeFormat(userLocale, options).format(date)
}

/**
 * Convert an ISO 8601 date string to the user’s local date format.
 * @param {string} isoString - ISO 8601 format string
 * @returns {string}
 */
export function formatToLocale(isoString: string, locale: string = 'en-US') {
  const date = new Date(isoString)

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    // timeZoneName: 'short'
  }

  return new Intl.DateTimeFormat(locale, options).format(date)
}

import { defineChain } from 'viem'
import { createConfig, http } from 'wagmi'
import { injected } from 'wagmi/connectors'

export const CHAIN_ID = {
  bevmTestnet: 11503,
  fhevmDevnet: 8009,
  bitlayerTestnet: 200810,
  incoTestnet: 9090,
}

export const bevmTestnet = defineChain({
  id: CHAIN_ID.bevmTestnet,
  name: 'BEVM Testnet',
  nativeCurrency: { name: 'BTC', symbol: 'BTC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet.bevm.io'] },
  },
  blockExplorers: {
    default: { name: 'BEVM Testnet Scan', url: 'https://scan-testnet.bevm.io' },
  },
  testnet: true,
})

export const bitlayerTestnet = defineChain({
  id: CHAIN_ID.bitlayerTestnet,
  name: 'Bitlayer Testnet',
  nativeCurrency: { name: 'BTC', symbol: 'BTC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.bitlayer.org'] },
  },
  blockExplorers: {
    default: {
      name: 'Bitlayer Testnet Scan',
      url: 'https://testnet.btrscan.com/',
    },
  },
  testnet: true,
})

export const fhevm = defineChain({
  id: CHAIN_ID.fhevmDevnet,
  name: 'FHEVM Devnet',
  nativeCurrency: { name: 'ZAMA', symbol: 'ZAMA', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://devnet.zama.ai'] },
  },
  blockExplorers: {
    default: {
      name: 'FHEVM Devnet Scan',
      url: 'https://main.explorer.zama.ai',
    },
  },
  testnet: true,
})

export const incoTestnet = defineChain({
  id: CHAIN_ID.incoTestnet,
  name: 'INCO Gentry Testnet',
  nativeCurrency: { name: 'INCO', symbol: 'INCO', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet.inco.org'] },
  },
  blockExplorers: {
    default: {
      name: 'INCO Testnet Scan',
      url: 'https://explorer.testnet.inco.org',
    },
  },
  testnet: true,
})

export const MetaMask = injected({
  target() {
    return { id: 'metamask', name: 'MetaMask', provider: window.ethereum }
  },
})

export const OKX = injected({
  target() {
    return { id: 'okx', name: 'OKX', provider: window.okxwallet }
  },
})

export const wagmiConfig = createConfig({
  chains: [bevmTestnet, bitlayerTestnet],
  transports: {
    [bevmTestnet.id]: http(bevmTestnet.rpcUrls.default.http[0]),
    [bitlayerTestnet.id]: http(bitlayerTestnet.rpcUrls.default.http[0]),
    // [incoTestnet.id]: http(incoTestnet.rpcUrls.default.http[0]),
  },
})

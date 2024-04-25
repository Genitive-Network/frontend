import { createConfig, http } from 'wagmi';

import { defineChain } from 'viem';
import { injected } from 'wagmi/connectors';

export const bevmTestnet = defineChain({
  id: 11503,
  name: 'BEVM',
  nativeCurrency: { name: 'BTC', symbol: 'BTC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet.bevm.io'] },
  },
  blockExplorers: {
    default: { name: 'BEVM Testnet Scan', url: 'https://scan-testnet.bevm.io' },
  },
  testnet: true,
});

export const fhevm = defineChain({
  id: 8009,
  name: 'FHEVM',
  nativeCurrency: { name: 'ZAMA', symbol: 'ZAMA', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://devnet.zama.ai'] },
  },
  blockExplorers: {
    default: { name: 'FHEVM Scan', url: 'https://main.explorer.zama.ai' },
  },
  testnet: true,
});

export const MetaMask = injected({
  target() {
    return { id: 'metamask', name: 'MetaMask', provider: window.ethereum };
  },
});

export const OKX = injected({
  target() {
    return { id: 'okx', name: 'OKX', provider: window.okxwallet };
  },
});

export const wagmiConfig = createConfig({
  chains: [bevmTestnet, fhevm],
  transports: {
    [bevmTestnet.id]: http(),
    [fhevm.id]: http(),
  },
});

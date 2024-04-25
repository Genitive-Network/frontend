import { createConfig, http } from 'wagmi';

import { defineChain } from 'viem';

export const bevmTestnet = defineChain({
  id: 11503,
  name: 'BEVM',
  nativeCurrency: { name: 'Bitcoin', symbol: 'BTC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet.bevm.io'] },
  },
  blockExplorers: {
    default: { name: 'BEVM Testnet Scan', url: 'https://scan-testnet.bevm.io' },
  },
  testnet: true,
});

export const fhevm = defineChain({
  id: 2,
  name: 'FHEVM',
  nativeCurrency: { name: 'Bitcoin', symbol: 'BTC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://devnet.zama.ai'] },
  },
  testnet: true,
});

export const wagmiConfig = createConfig({
  chains: [bevmTestnet, fhevm],
  transports: {
    [bevmTestnet.id]: http(),
    [fhevm.id]: http(),
  },
});

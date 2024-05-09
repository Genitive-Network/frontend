import { CHAIN_ID, MetaMask, OKX } from '@/config/wagmiConfig';
import { ChainItem, NavItem, TokenItem, WalletButton } from '@/types';

export const NavItems: NavItem[] = [
  { name: 'HomePage', path: '/' },
  { name: 'WritePaper', path: '#' },
  { name: 'Bridge & Earn', path: '/bridge' },
  { name: 'Docs', path: '#' },
];

export const walletList: WalletButton[] = [
  { id: 'unisat', walletName: 'Unisat Wallet', icon: 'Unisat-logo.svg', height: 50, width: 50, connector: undefined },
  { id: 'okx', walletName: 'OKX Wallet', icon: 'Okx-logo.svg', height: 50, width: 50, connector: OKX },
  { id: 'MetaMask', walletName: 'MetaMask', icon: 'metamask-logo.svg', height: 60, width: 60, connector: MetaMask },
];

const BEVM_CONTRACT_ADDRESS = '0x14D5d2da26D0f66b9A851CfDA1Dfa6CCDDE9DCEc';
const BEVM_TO_ADDRESS = '0x92FCD6763c42688A94EAc714F41146c80933F74e';

const FHEVM_CONTRACT_ADDRESS = '0x16456979482cC0EFFaF04b6eEb05BCA5aba09250';
const FHEVM_TO_ADDRESS = '0x21b7356966eAef9C6CCBeB81a226630A9c916797';

export const chainList: ChainItem[] = [
  { label: 'BEVM', value: 'BEVM', icon: 'BEVM.svg', id: CHAIN_ID.bevmTestnet, bridgeReceiveAddress: BEVM_TO_ADDRESS},
  { label: 'FHEVM', value: 'FHEVM', icon: 'zama.svg', id: CHAIN_ID.fhevmDevnet, bridgeReceiveAddress: FHEVM_TO_ADDRESS},
];

export const tokenList: TokenItem[] = [
  {
    symbol: 'XBTC',
    value: CHAIN_ID.bevmTestnet + '-' + BEVM_CONTRACT_ADDRESS,
    chain: CHAIN_ID.bevmTestnet,
    // TODO: use token.decimals from contract instead of hardcoding
    decimals: 8,
    address: BEVM_CONTRACT_ADDRESS
  },
  {
    symbol: 'xbtc',
    value: CHAIN_ID.fhevmDevnet + '-' + FHEVM_CONTRACT_ADDRESS,
    chain: CHAIN_ID.fhevmDevnet,
    decimals: 8,
    address: FHEVM_CONTRACT_ADDRESS
  },
];

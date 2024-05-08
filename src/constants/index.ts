import { CHAIN_ID, MetaMask, OKX } from '@/config/wagmiConfig';
import { ChainItem, NavItem, TokenItem, WalletButton } from '@/types';

export const NavItems: NavItem[] = [
  { name: 'HomePage', path: '/' },
  { name: 'WritePaper', path: '/whitepaper' },
  { name: 'Bridge & Earn', path: '/bridge' },
  { name: 'Docs', path: '/docs' },
];

export const walletList: WalletButton[] = [
  { id: 'unisat', walletName: 'Unisat Wallet', icon: 'Unisat-logo.svg', height: 50, width: 50, connector: undefined },
  { id: 'okx', walletName: 'OKX Wallet', icon: 'Okx-logo.svg', height: 50, width: 50, connector: OKX },
  { id: 'MetaMask', walletName: 'MetaMask', icon: 'metamask-logo.svg', height: 60, width: 60, connector: MetaMask },
];

export const chainList: ChainItem[] = [
  { label: 'BEVM', value: 'BEVM', icon: 'BEVM.svg', id: CHAIN_ID.bevmTestnet },
  { label: 'FHEVM', value: 'FHEVM', icon: 'zuma.svg', id: CHAIN_ID.fhevmDevnet },
];

export const tokenList: TokenItem[] = [
  { label: 'XBTC', value: 'XBTC' },
  { label: 'ZAMA', value: 'ZAMA' },
];


// export const BEVM_CONTRACT_ADDRESS = '0x14D5d2da26D0f66b9A851CfDA1Dfa6CCDDE9DCEc';
export const BEVM_CONTRACT_ADDRESS = '0x30A0e025BE2bbC80948f60647c48756815b78227';
export const BEVM_TO_ADDRESS = '0x92FCD6763c42688A94EAc714F41146c80933F74e';

export const FHEVM_CONTRACT_ADDRESS = '0x16456979482cC0EFFaF04b6eEb05BCA5aba09250';
export const FHEVM_TO_ADDRESS = '0x21b7356966eAef9C6CCBeB81a226630A9c916797';

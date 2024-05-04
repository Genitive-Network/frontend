import { MetaMask, OKX } from '@/config/wagmiConfig';
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
  { label: 'BEVM', value: 'BEVM', icon: 'BEVM.svg' },
  { label: 'FHEVM', value: 'FHEVM', icon: 'zuma.svg' },
];

export const tokenList: TokenItem[] = [
  { label: 'XBTC', value: 'XBTC' },
  { label: 'ZAMA', value: 'ZAMA' },
];

export const BEVM_CONTRACT_ADDRESS = '0x30A0e025BE2bbC80948f60647c48756815b78227';

export const FHEVM_CONTRACT_ADDRESS = '0xcc0030860577CB392C2104E1AA3EccD17181588C';

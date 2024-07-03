import { CHAIN_ID, MetaMask } from '@/config/wagmiConfig'
import { ChainItem, NavIcon, NavItem, TokenItem, WalletButton } from '@/types'
export * from './abi'

export const NavItems: NavItem[] = [
  { name: 'HomePage', path: '/' },
  { name: 'Encrypt', path: '/encrypt' },
  { name: 'Bridge', path: '/bridge' },
  { name: 'Docs', path: '#' },
]

export const NavIcons: NavIcon[] = [
  { name: 'X', img: 'X.svg', href: 'https://x.com/GenitiveNetwork' },
  { name: 'Discord', img: 'discord.svg', href: 'https://discord.gg/nbaHqXph' },
]

export const walletList: WalletButton[] = [
  // { id: 'unisat', walletName: 'Unisat Wallet', icon: 'Unisat-logo.svg', height: 50, width: 50, connector: undefined },
  // {
  //   id: 'okx',
  //   walletName: 'OKX Wallet',
  //   icon: 'Okx-logo.svg',
  //   height: 50,
  //   width: 50,
  //   connector: OKX,
  // },
  {
    id: 'MetaMask',
    walletName: 'MetaMask',
    icon: 'metamask-logo.svg',
    height: 60,
    width: 60,
    connector: MetaMask,
  },
]

export const ZAMA_ADDRESS_EMDC = '0x4e1BacdBCc4490A623FE35A4C321344Fad0a08db'
// BEVM EBTC contract deployed on ZAMA
const ZAMA_ADDRESS_EBTC_BEVM = '0xC2e0f0CaeCEb3b91d1d1822026De6d9D10c10025'
// Bitlayer EBTC contract deployed on ZAMA
const ZAMA_ADDRESS_EBTC_BITLAYER = '0xDbb6F44FA2bDb55c45A4B4119C163f9c42Ac5630'

const BEVM_GAC_ADDRESS = '0x775a7751fc13567847806a6eb5c52DE0C8E75B65'
const BITLAYER_GAC_ADDRESS = '0x254193315255C680Fa9DD67B302B3971383e4cDD'

export const chainList: ChainItem[] = [
  {
    label: 'BEVM Testnet',
    value: 'BEVM',
    icon: 'BEVM.svg',
    id: CHAIN_ID.bevmTestnet,
    gac: BEVM_GAC_ADDRESS,
    faucet: 'https://bevm-testnet-faucet-alpha.vercel.app',
    ebtcAddress: ZAMA_ADDRESS_EBTC_BEVM,
  },
  {
    label: 'Bitlayer Testnet',
    value: 'Bitlayer',
    icon: 'Bitlayer.svg',
    id: CHAIN_ID.bitlayerTestnet,
    gac: BITLAYER_GAC_ADDRESS,
    faucet: 'https://www.bitlayer.org/faucet',
    ebtcAddress: ZAMA_ADDRESS_EBTC_BITLAYER,
  },
]

export const tokenList: TokenItem[] = [
  {
    symbol: 'eBTC',
    value: CHAIN_ID.bevmTestnet + '-' + BEVM_GAC_ADDRESS,
    chain: CHAIN_ID.bevmTestnet,
    // TODO: use token.decimals from contract instead of hardcoding
    decimals: 18,
    address: ZAMA_ADDRESS_EBTC_BEVM,
  },
  {
    symbol: 'eBTC',
    value: CHAIN_ID.bitlayerTestnet + '-' + BITLAYER_GAC_ADDRESS,
    chain: CHAIN_ID.bitlayerTestnet,
    decimals: 18,
    address: ZAMA_ADDRESS_EBTC_BITLAYER,
  },
]

import { CHAIN_ID, MetaMask, OKX } from '@/config/wagmiConfig'
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
  {
    name: 'Discord',
    img: 'discord.svg',
    href: 'https://discord.gg/YXGYuF3pqd',
  },
]

export const walletList: WalletButton[] = [
  // { id: 'unisat', walletName: 'Unisat Wallet', icon: 'Unisat-logo.svg', height: 50, width: 50, connector: undefined },
  {
    id: 'okx',
    walletName: 'OKX Wallet',
    icon: 'Okx-logo.svg',
    height: 50,
    width: 50,
    connector: OKX,
  },
  {
    id: 'MetaMask',
    walletName: 'MetaMask',
    icon: 'metamask-logo.svg',
    height: 60,
    width: 60,
    connector: MetaMask,
  },
]

export const ZAMA_ADDRESS_EMDC = '0x7AEDFB1c4F1aAA9EFe53204da494deeb7e898E2d'
// BEVM EBTC contract deployed on ZAMA
const ZAMA_ADDRESS_EBTC_BEVM = '0x82a1D39277B179C5C5120E70b77b886e29345b8C'
// Bitlayer EBTC contract deployed on ZAMA
const ZAMA_ADDRESS_EBTC_BITLAYER = '0x79A141917E9E41f5e2c27e13cc4ED317d6735982'
const ZAMA_ADDRESS_EBTC_BOB = '0x5E4ac25605b79C9cfE3F7cECBA0c78Ff7455DF84'

const BEVM_GAC_ADDRESS = '0x775a7751fc13567847806a6eb5c52DE0C8E75B65'
const BITLAYER_GAC_ADDRESS = '0x254193315255C680Fa9DD67B302B3971383e4cDD'
const BOB_GAC_ADDRESS = '0x499607543A80c3674b29580962F5e74968455641'

export const chainList: ChainItem[] = [
  {
    label: 'BEVM Testnet',
    value: 'BEVM',
    icon: '/BEVM.svg',
    id: CHAIN_ID.bevmTestnet,
    gac: BEVM_GAC_ADDRESS,
    faucet: 'https://bevm-testnet-faucet-alpha.vercel.app',
    ebtcAddress: ZAMA_ADDRESS_EBTC_BEVM,
  },
  // {
  //   label: 'BOB Testnet',
  //   value: 'BOB',
  //   icon: 'BEVM.svg',
  //   id: CHAIN_ID.BOBSepoliaTestnet,
  //   gac: BOB_GAC_ADDRESS,
  //   faucet: 'https://bevm-testnet-faucet-alpha.vercel.app',
  //   ebtcAddress: ZAMA_ADDRESS_EBTC_BOB,
  // },
  {
    label: 'Bitlayer Testnet',
    value: 'Bitlayer',
    icon: '/Bitlayer.svg',
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
  // {
  //   symbol: 'eETH',
  //   value: CHAIN_ID.BOBSepoliaTestnet + '-' + BOB_GAC_ADDRESS,
  //   chain: CHAIN_ID.BOBSepoliaTestnet,
  //   decimals: 18,
  //   address: ZAMA_ADDRESS_EBTC_BOB,
  // },
  {
    symbol: 'eBTC',
    value: CHAIN_ID.bitlayerTestnet + '-' + BITLAYER_GAC_ADDRESS,
    chain: CHAIN_ID.bitlayerTestnet,
    decimals: 18,
    address: ZAMA_ADDRESS_EBTC_BITLAYER,
  },
]

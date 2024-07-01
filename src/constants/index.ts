import { CHAIN_ID, MetaMask, OKX } from '@/config/wagmiConfig'
import { ChainItem, NavIcon, NavItem, TokenItem, WalletButton } from '@/types'

export const NavItems: NavItem[] = [
  { name: 'HomePage', path: '/' },
  { name: 'Encrypt', path: '/encrypt' },
  { name: 'Bridge', path: '/bridge' },
  { name: 'Docs', path: '#' },
]

export const NavIcons: NavIcon[] = [
  { name: 'X', img: 'X.svg', href: 'https://x.com/GenitiveNetwork' },
  { name: 'Discord', img: 'discord.svg', href: 'https://discord.gg/nbaHqXph' }
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

const BEVM_GAC_ADDRESS = '0x775a7751fc13567847806a6eb5c52DE0C8E75B65'
const BITLAYER_GAC_ADDRESS = '0xEbCDF71529852edC7B0812d4EE0F038FdA8DE3Ea'
export const ZAMA_ADDRESS_EMDC='0x840E3D2683FA8FA4821C9B297C11E60e6e1cC9Fd'
// BEVM EBTC contract deployed on ZAMA
const ZAMA_ADDRESS_EBTC_BEVM='0x66308014eC4be48dd5f0249f215A28CFb072b063'
// Bitlayer EBTC contract deployed on ZAMA
const ZAMA_ADDRESS_EBTC_BITLAYER='0xB099C3e6Bbf48aA31d80d82cB9CE4edAb26Bbe37'


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
    address: ZAMA_ADDRESS_EBTC_BEVM
  },
  {
    symbol: 'eBTC',
    value: CHAIN_ID.bitlayerTestnet + '-' + BITLAYER_GAC_ADDRESS,
    chain: CHAIN_ID.bitlayerTestnet,
    decimals: 18,
    address: ZAMA_ADDRESS_EBTC_BITLAYER
  },
]
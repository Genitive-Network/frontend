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

export const gacABI = [
  {
    inputs: [
      {
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'balance',
        type: 'bytes',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'commandHash',
        type: 'string',
      },
    ],
    name: 'SetBalance',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'addr',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'pubkey',
        type: 'bytes32',
      },
    ],
    name: 'SetPubkeyCommand',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'transferAddrFrom',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'transferAddrTo',
        type: 'bytes',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'tokenAddrFrom',
        type: 'bytes',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'tokenAddrTo',
        type: 'bytes',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'amount',
        type: 'bytes',
      },
    ],
    name: 'TransferAndSwapCommand',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'commandHash',
        type: 'string',
      },
    ],
    name: 'TransferTo',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'addr',
        type: 'address',
      },
    ],
    name: 'UnwrapAllCommand',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'addr',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'UnwrapCommand',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'addr',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'WrapCommand',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'addr',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'balanceOfMe',
    outputs: [
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'balances',
    outputs: [
      {
        internalType: 'bytes',
        name: '',
        type: 'bytes',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAgentBalance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getPubkey',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'pubkeys',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'addr',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'balance',
        type: 'bytes',
      },
      {
        internalType: 'string',
        name: 'commandHash',
        type: 'string',
      },
    ],
    name: 'setBalance',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'pubkey',
        type: 'bytes32',
      },
    ],
    name: 'setPubkey',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'transferAddrTo',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: 'tokenAddrFrom',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: 'tokenAddrTo',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: 'amount',
        type: 'bytes',
      },
    ],
    name: 'swapAndTransfer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address payable',
        name: '_to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'commandHash',
        type: 'string',
      },
    ],
    name: 'transferWbtc',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'amount',
        type: 'uint64',
      },
    ],
    name: 'unwrap',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'unwrapAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'wrap',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
]

export const chainList: ChainItem[] = [
  {
    label: 'BEVM Testnet',
    value: 'BEVM',
    icon: 'BEVM.svg',
    id: CHAIN_ID.bevmTestnet,
    gac: BEVM_GAC_ADDRESS,
    faucet: 'https://bevm-testnet-faucet-alpha.vercel.app',
  },
  {
    label: 'Bitlayer Testnet',
    value: 'Bitlayer',
    icon: 'Bitlayer.svg',
    id: CHAIN_ID.bitlayerTestnet,
    gac: BITLAYER_GAC_ADDRESS,
    faucet: 'https://www.bitlayer.org/faucet',
  },
]

export const tokenList: TokenItem[] = [
  {
    symbol: 'eBTC',
    value: CHAIN_ID.bevmTestnet + '-' + BEVM_GAC_ADDRESS,
    chain: CHAIN_ID.bevmTestnet,
    // TODO: use token.decimals from contract instead of hardcoding
    decimals: 18,
    incoAddress: '0xF9521827585Bcc8a03BC18F2452535C4E5223C9c',
  },
  {
    symbol: 'eBTC',
    value: CHAIN_ID.bitlayerTestnet + '-' + BITLAYER_GAC_ADDRESS,
    chain: CHAIN_ID.bitlayerTestnet,
    decimals: 18,
    incoAddress: '0xBFB88b6183EdE0aCa9Df2Aa7Ac535D1023F623A3',
  },
]

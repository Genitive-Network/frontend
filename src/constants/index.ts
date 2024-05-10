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
  { label: 'BEVM', value: 'BEVM', icon: 'BEVM.svg', id: CHAIN_ID.bevmTestnet, bridgeReceiveAddress: BEVM_TO_ADDRESS },
  { label: 'Genitive', value: 'FHEVM', icon: 'logo.svg', id: CHAIN_ID.fhevmDevnet, bridgeReceiveAddress: FHEVM_TO_ADDRESS },
];

export const tokenList: TokenItem[] = [
  {
    symbol: 'XBTC',
    value: CHAIN_ID.bevmTestnet + '-' + BEVM_CONTRACT_ADDRESS,
    chain: CHAIN_ID.bevmTestnet,
    // TODO: use token.decimals from contract instead of hardcoding
    decimals: 8,
    address: BEVM_CONTRACT_ADDRESS,
    abi: [
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'address',
            name: 'previousAdmin',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'address',
            name: 'newAdmin',
            type: 'address',
          },
        ],
        name: 'AdminChanged',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'beacon',
            type: 'address',
          },
        ],
        name: 'BeaconUpgraded',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'implementation',
            type: 'address',
          },
        ],
        name: 'Upgraded',
        type: 'event',
      },
      {
        stateMutability: 'payable',
        type: 'fallback',
      },
      {
        inputs: [],
        name: 'admin',
        outputs: [
          {
            internalType: 'address',
            name: 'admin_',
            type: 'address',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'newAdmin',
            type: 'address',
          },
        ],
        name: 'changeAdmin',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'implementation',
        outputs: [
          {
            internalType: 'address',
            name: 'implementation_',
            type: 'address',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'newImplementation',
            type: 'address',
          },
        ],
        name: 'upgradeTo',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'newImplementation',
            type: 'address',
          },
          {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes',
          },
        ],
        name: 'upgradeToAndCall',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
      },
      {
        stateMutability: 'payable',
        type: 'receive',
      },
      {
        inputs: [],
        name: 'EnforcedPause',
        type: 'error',
      },
      {
        inputs: [],
        name: 'ExpectedPause',
        type: 'error',
      },
      {
        inputs: [],
        name: 'InvalidInitialization',
        type: 'error',
      },
      {
        inputs: [],
        name: 'NotInitializing',
        type: 'error',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
        ],
        name: 'OwnableInvalidOwner',
        type: 'error',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
        ],
        name: 'OwnableUnauthorizedAccount',
        type: 'error',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'Approval',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: '_account',
            type: 'address',
          },
        ],
        name: 'Blacklisted',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'newBlacklister',
            type: 'address',
          },
        ],
        name: 'BlacklisterChanged',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'burner',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'Burn',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'uint64',
            name: 'version',
            type: 'uint64',
          },
        ],
        name: 'Initialized',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'newMasterMinter',
            type: 'address',
          },
        ],
        name: 'MasterMinterChanged',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'minter',
            type: 'address',
          },
          {
            indexed: true,
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
        ],
        name: 'Mint',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'minter',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: 'minterAllowedAmount',
            type: 'uint256',
          },
        ],
        name: 'MinterConfigured',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'oldMinter',
            type: 'address',
          },
        ],
        name: 'MinterRemoved',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'previousOwner',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'newOwner',
            type: 'address',
          },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
        ],
        name: 'Paused',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            indexed: true,
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
        ],
        name: 'Transfer',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: '_account',
            type: 'address',
          },
        ],
        name: 'UnBlacklisted',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
        ],
        name: 'Unpaused',
        type: 'event',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
        ],
        name: 'allowance',
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
        inputs: [
          {
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'approve',
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
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
        ],
        name: 'balanceOf',
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
        inputs: [
          {
            internalType: 'address',
            name: '_account',
            type: 'address',
          },
        ],
        name: 'blacklist',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'blacklister',
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
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: '_amount',
            type: 'uint256',
          },
        ],
        name: 'burn',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'minter',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'minterAllowedAmount',
            type: 'uint256',
          },
        ],
        name: 'configureMinter',
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
        inputs: [],
        name: 'currency',
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
        name: 'decimals',
        outputs: [
          {
            internalType: 'uint8',
            name: '',
            type: 'uint8',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '_from',
            type: 'address',
          },
        ],
        name: 'destroyBlackFunds',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'string',
            name: 'tokenName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'tokenSymbol',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'tokenCurrency',
            type: 'string',
          },
          {
            internalType: 'uint8',
            name: 'tokenDecimals',
            type: 'uint8',
          },
          {
            internalType: 'address',
            name: 'newMasterMinter',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'newBlacklister',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'newOwner',
            type: 'address',
          },
        ],
        name: 'initialize',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '_account',
            type: 'address',
          },
        ],
        name: 'isBlacklisted',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'account',
            type: 'address',
          },
        ],
        name: 'isMinter',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'masterMinter',
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
            name: '_to',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: '_amount',
            type: 'uint256',
          },
        ],
        name: 'mint',
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
            internalType: 'address',
            name: 'minter',
            type: 'address',
          },
        ],
        name: 'minterAllowance',
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
        inputs: [],
        name: 'paused',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'minter',
            type: 'address',
          },
        ],
        name: 'removeMinter',
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
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'symbol',
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
        name: 'totalSupply',
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
        inputs: [
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'transfer',
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
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'transferFrom',
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
            internalType: 'address',
            name: '_account',
            type: 'address',
          },
        ],
        name: 'unBlacklist',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '_newBlacklister',
            type: 'address',
          },
        ],
        name: 'updateBlacklister',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '_newMasterMinter',
            type: 'address',
          },
        ],
        name: 'updateMasterMinter',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: '_logic',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'admin_',
            type: 'address',
          },
          {
            internalType: 'bytes',
            name: '_data',
            type: 'bytes',
          },
        ],
        stateMutability: 'payable',
        type: 'constructor',
      },
    ]
  },
  {
    symbol: 'xbtc',
    value: CHAIN_ID.fhevmDevnet + '-' + FHEVM_CONTRACT_ADDRESS,
    chain: CHAIN_ID.fhevmDevnet,
    decimals: 8,
    address: FHEVM_CONTRACT_ADDRESS,
    abi: [
      {
        inputs: [
          {
            internalType: 'string',
            name: 'name_',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'symbol_',
            type: 'string',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        inputs: [],
        name: 'ECDSAInvalidSignature',
        type: 'error',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'length',
            type: 'uint256',
          },
        ],
        name: 'ECDSAInvalidSignatureLength',
        type: 'error',
      },
      {
        inputs: [
          {
            internalType: 'bytes32',
            name: 's',
            type: 'bytes32',
          },
        ],
        name: 'ECDSAInvalidSignatureS',
        type: 'error',
      },
      {
        inputs: [],
        name: 'InvalidShortString',
        type: 'error',
      },
      {
        inputs: [
          {
            internalType: 'string',
            name: 'str',
            type: 'string',
          },
        ],
        name: 'StringTooLong',
        type: 'error',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
        ],
        name: 'Approval',
        type: 'event',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
          {
            internalType: 'bytes',
            name: 'encryptedAmount',
            type: 'bytes',
          },
        ],
        name: 'approve',
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
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
          {
            internalType: 'euint64',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'approve',
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
            internalType: 'uint256',
            name: 'requestID',
            type: 'uint256',
          },
          {
            internalType: 'uint64',
            name: 'amount',
            type: 'uint64',
          },
        ],
        name: 'callbackAmountUint64',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'uint64',
            name: 'amount',
            type: 'uint64',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
        ],
        name: 'CrossChainTransfer',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [],
        name: 'EIP712DomainChanged',
        type: 'event',
      },
      {
        inputs: [
          {
            internalType: 'uint64',
            name: 'amount',
            type: 'uint64',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
        ],
        name: 'mint',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint64',
            name: 'amount',
            type: 'uint64',
          },
        ],
        name: 'Mint',
        type: 'event',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'bytes',
            name: 'encryptedAmount',
            type: 'bytes',
          },
        ],
        name: 'transfer',
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
      // {
      //   inputs: [
      //     {
      //       internalType: 'address',
      //       name: 'to',
      //       type: 'address',
      //     },
      //     {
      //       internalType: 'euint64',
      //       name: 'amount',
      //       type: 'uint256',
      //     },
      //   ],
      //   name: 'transfer',
      //   outputs: [
      //     {
      //       internalType: 'bool',
      //       name: '',
      //       type: 'bool',
      //     },
      //   ],
      //   stateMutability: 'nonpayable',
      //   type: 'function',
      // },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'uint256',
            name: 'transferId',
            type: 'uint256',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
        ],
        name: 'Transfer',
        type: 'event',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'euint64',
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'transferFrom',
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
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'bytes',
            name: 'encryptedAmount',
            type: 'bytes',
          },
        ],
        name: 'transferFrom',
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
        inputs: [],
        name: '_cross_chain_receiver',
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
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'spender',
            type: 'address',
          },
          {
            internalType: 'bytes32',
            name: 'publicKey',
            type: 'bytes32',
          },
          {
            internalType: 'bytes',
            name: 'signature',
            type: 'bytes',
          },
        ],
        name: 'allowance',
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
            name: 'wallet',
            type: 'address',
          },
          {
            internalType: 'bytes32',
            name: 'publicKey',
            type: 'bytes32',
          },
          {
            internalType: 'bytes',
            name: 'signature',
            type: 'bytes',
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
            internalType: 'euint64',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'decimals',
        outputs: [
          {
            internalType: 'uint8',
            name: '',
            type: 'uint8',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'eip712Domain',
        outputs: [
          {
            internalType: 'bytes1',
            name: 'fields',
            type: 'bytes1',
          },
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'version',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'chainId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'verifyingContract',
            type: 'address',
          },
          {
            internalType: 'bytes32',
            name: 'salt',
            type: 'bytes32',
          },
          {
            internalType: 'uint256[]',
            name: 'extensions',
            type: 'uint256[]',
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
        inputs: [
          {
            internalType: 'uint256',
            name: 'transferId',
            type: 'uint256',
          },
          {
            internalType: 'bytes32',
            name: 'publicKey',
            type: 'bytes32',
          },
          {
            internalType: 'bytes',
            name: 'signature',
            type: 'bytes',
          },
        ],
        name: 'reencryptError',
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
        name: 'symbol',
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
        name: 'totalSupply',
        outputs: [
          {
            internalType: 'uint64',
            name: '',
            type: 'uint64',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ]
  },
];

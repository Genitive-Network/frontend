export type ChainItem = {
  label: string
  value: string
  icon: string
  id: number
  gac: `0x${string}`
  faucet?: string
  ebtcAddress: `0x${string}`
  // TODO extract chainList.EBTC as tokenList
  // EBTC: {
  //   decimal: number;
  //   address: `0x${string}`;
  // }
}

export type TokenItem = {
  symbol: string
  value: string
  chain: number
  decimals: number
  address: `0x${string}`
}

export interface WalletButton {
  id: string
  walletName: string
  icon: string
  width: number
  height: number
  connector?: any
}

export interface NavItem {
  name: string
  path: string
}

export interface NavIcon {
  name: string
  img: string
  href: string
}

export type GetFhevmTokenBalanceParameters = {
  balanceAddress: Address
  tokenAddress: Address
}

export interface HistoryItem {
  chain_id: number
  address: string
  tx_hash: string
  time: string
  value: string
  operation: string
  status: string
}

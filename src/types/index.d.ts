export type ChainItem = {
  label: string;
  value: string;
  icon: string;
  id: number;
  bridgeReceiveAddress: `0x${string}`;
};

export type TokenItem = {
  symbol: string;
  value: string;
  chain: number;
  decimals: number;
  address: `0x${string}`;
};

export interface WalletButton {
  id: string;
  walletName: string;
  icon: string;
  width: number;
  height: number;
  connector?: any;
}

export interface NavItem {
  name: string;
  path: string;
}

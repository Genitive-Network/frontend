export type ChainItem = {
  label: string;
  value: string;
  icon: string;
  id: number;
};

export type TokenItem = {
  label: string;
  value: string;
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

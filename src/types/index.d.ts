import { Abi } from 'viem';
import { InterfaceAbi, Interface } from 'ethers';

export type ChainItem = {
  label: string;
  value: string;
  icon: string;
  id: number;
  gac: `0x${string}`;
  faucet?: string;
};

export type TokenItem = {
  symbol: string;
  value: string;
  chain: number;
  decimals: number;
  incoAddress: `0x${string}`;
  address?: `0x${string}`;
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

export interface NavIcon {
  name: string;
  img: string;
  href: string;
}

export type GetFhevmTokenBalanceParameters = {
  balanceAddress: Address
  tokenAddress: Address
}
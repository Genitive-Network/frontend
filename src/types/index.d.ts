import { Abi } from 'viem';
import { InterfaceAbi, Interface } from 'ethers';

export type ChainItem = {
  label: string;
  value: string;
  icon: string;
  id: number;
  bridgeReceiveAddress: `0x${string}`;
  faucet?: string;
};

export type TokenItem = {
  symbol: string;
  value: string;
  chain: number;
  decimals: number;
  address: `0x${string}`;
  abi: Interface | InterfaceAbi
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

export type GetFhevmTokenBalanceParameters = {
  balanceAddress: Address
  tokenAddress: Address
}
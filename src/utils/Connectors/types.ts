import { OkxConnector } from './okx';
import { UnisatConnector } from './unisat';

declare global {
  interface Window {
    okxwallet: {
      bitcoin: OkxWallet;
      bitcoinTestnet: OkxWallet;
    };
    unisat: Unisat;
  }
}

export namespace UnisatWalletTypes {
  export type AccountsChangedEvent = (
    event: 'accountsChanged' | 'networkChanged',
    handler: (accounts: Array<string> | string) => void
  ) => void;

  export type Inscription = {
    inscriptionId: string;
    inscriptionNumber: string;
    address: string;
    outputValue: string;
    content: string;
    contentLength: string;
    contentType: string;
    preview: string;
    timestamp: number;
    offset: number;
    genesisTransaction: string;
    location: string;
  };

  export type GetInscriptionsResult = { total: number; list: Inscription[] };

  export type SendInscriptionsResult = { txid: string };

  export type Network = 'livenet' | 'testnet';
}

export type Unisat = {
  requestAccounts: () => Promise<string[]>;
  getAccounts: () => Promise<string[]>;
  on: UnisatWalletTypes.AccountsChangedEvent;
  removeListener: UnisatWalletTypes.AccountsChangedEvent;
  getInscriptions: (cursor: number, size: number) => Promise<UnisatWalletTypes.GetInscriptionsResult>;
  sendInscription: (
    address: string,
    inscriptionId: string,
    options?: { feeRate: number }
  ) => Promise<UnisatWalletTypes.SendInscriptionsResult>;
  switchNetwork: (network: 'livenet' | 'testnet') => Promise<void>;
  getNetwork: () => Promise<UnisatWalletTypes.Network>;
  getPublicKey: () => Promise<string>;
  getBalance: () => Promise<Balance>;
  sendBitcoin: (address: string, atomicAmount: number, options?: { feeRate: number }) => Promise<string>;
  pushTx: ({ rawtx }: { rawtx: string }) => Promise<string>;
  pushPsbt: (psbtHex: string) => Promise<string>;
  signMessage: (message: string, type?: 'ecdsa' | 'bip322-simple') => Promise<string>;
  signPsbt: (
    psbtHex: string,
    options?: {
      autoFinalized?: boolean;
      toSignInputs: {
        index: number;
        address?: string;
        publicKey?: string;
        sighashTypes?: number[];
        disableTweakSigner?: boolean;
      }[];
    }
  ) => Promise<string>;

  signPsbts: (
    psbtHexs: string[],
    options?: {
      autoFinalized?: boolean;
      toSignInputs: {
        index: number;
        address?: string;
        publicKey?: string;
        sighashTypes?: number[];
        disableTweakSigner?: boolean;
      };
    }[]
  ) => Promise<string[]>;
};

export namespace OkxWalletTypes {
  export interface AddressInfo {
    address: string;
    publicKey: string;
    compressedPublicKey: string;
  }
  export type OnEvent = (
    event: 'accountsChanged' | 'accountChanged',
    handler: (accounts: Array<string> | Array<AddressInfo>) => void
  ) => void;

  export type Inscription = {
    inscriptionId: string;
    inscriptionNumber: string;
    address: string;
    outputValue: string;
    content: string;
    contentLength: string;
    contentType: string;
    preview: string;
    timestamp: number;
    offset: number;
    genesisTransaction: string;
    location: string;
  };

  export type GetInscriptionsResult = { total: number; list: Inscription[] };

  export type Network = 'livenet' | 'testnet';

  export interface ConnectResult {
    address: string;
    publicKey: string;
  }
  export interface SendProps {
    from: string;
    to: string;
    value: number;
    satBytes: number;
  }
  export interface SendResult {
    txhash: string;
  }

  export interface TransferNftProps {
    from: string;
    to: string;
    data: string | string[];
  }
  export interface TransferNftResult {
    txhash: string;
  }
  export interface SplitUtxoProps {
    from: string;
    amount: number;
  }
  export interface SplitUtxoResult {
    utxos: {
      txId: string;
      vOut: number;
      amount: number;
      rawTransaction: string;
    }[];
  }

  export interface InscribeProps {
    type: 51 | 58;
    from: string;
    tick: string;
    tid: string;
  }
  export interface MintProps {
    type: 60 | 50 | 51 | 62 | 61 | 36 | 33 | 34 | 35 | 58;
    from: string;
    inscriptions: {
      contentType: string;
      body: string;
    }[];
  }
  export interface MintResult {
    commitAddrs: string[];
    commitTx: string;
    revealTxs: string[];
    commitTxFee: number;
    revealTxFees: number[];
    feeRate: number;
    size: number;
  }
}

export type OkxWallet = {
  connect: () => Promise<OkxWalletTypes.ConnectResult>;
  requestAccounts: () => Promise<string[]>;
  getAccounts: () => Promise<string[]>;
  getNetwork: () => Promise<OkxWalletTypes.Network>;
  getPublicKey: () => Promise<string>;
  getBalance: () => Promise<Balance>;
  getInscriptions: (cursor: number, size: number) => Promise<OkxWalletTypes.GetInscriptionsResult>;
  sendBitcoin: (
    toAddress: string,
    satoshis: number,
    options?: {
      feeRate: number;
    }
  ) => Promise<string>;
  sendInscription: (address: string, inscriptionId: string, options?: { feeRate: number }) => Promise<string>;
  transferNft: ({ from, to, data }: OkxWalletTypes.TransferNftProps) => Promise<OkxWalletTypes.TransferNftResult>;
  send: ({ from, to, value, satBytes }: OkxWalletTypes.SendProps) => Promise<OkxWalletTypes.SendResult>;
  signMessage: (message: string, type?: 'ecdsa' | 'bip322-simple') => Promise<string>;
  pushTx: (rawtx: string) => Promise<string>;
  splitUtxo: ({ from, amount }: OkxWalletTypes.SplitUtxoProps) => Promise<OkxWalletTypes.SplitUtxoResult>;
  inscribe: ({ type, from, tick, tid }: OkxWalletTypes.InscribeProps) => Promise<string>;
  mint: ({ type, from, inscriptions }: OkxWalletTypes.MintProps) => Promise<OkxWalletTypes.MintResult>;
  signPsbt: (
    psbtHex: string,
    options?: {
      autoFinalized?: boolean;
      toSignInputs: {
        index: number;
        address?: string;
        publicKey?: string;
        sighashTypes?: number[];
        disableTweakSigner?: boolean;
      }[];
    }
  ) => Promise<string>;
  signPsbts: (
    psbtHexs: string[],
    options?: {
      autoFinalized?: boolean;
      toSignInputs: {
        index: number;
        address?: string;
        publicKey?: string;
        sighashTypes?: number[];
        disableTweakSigner?: boolean;
      };
    }[]
  ) => Promise<string[]>;
  pushPsbt: (psbtHex: string) => Promise<string>;
  on: OkxWalletTypes.OnEvent;
};

export interface OkxTestnetWallet {
  connect: () => Promise<OkxWalletTypes.ConnectResult>;
  signMessage: (message: string, type?: 'ecdsa' | 'bip322-simple') => Promise<string>;
  signPsbt: (
    psbtHex: string,
    options?: {
      autoFinalized?: boolean;
      toSignInputs: {
        index: number;
        address?: string;
        publicKey?: string;
        sighashTypes?: number[];
        disableTweakSigner?: boolean;
      }[];
    }
  ) => Promise<string>;
  signPsbts: (
    psbtHexs: string[],
    options?: {
      autoFinalized?: boolean;
      toSignInputs: {
        index: number;
        address?: string;
        publicKey?: string;
        sighashTypes?: number[];
        disableTweakSigner?: boolean;
      };
    }[]
  ) => Promise<string[]>;
}

export type BtcConnectorId = 'unisat' | 'okx';

export type AccountsChangedEvent = (event: 'accountsChanged', handler: (accounts: Array<string>) => void) => void;
export type AccountChangedEvent = (event: 'accountChanged', handler: (account: any) => void) => void;

export type NetworkChangedEvent = (event: 'networkChanged', handler: (network: WalletNetwork) => void) => void;

export type MessageType = 'ecdsa' | 'bip322-simple';

export type WalletNetwork = 'livenet' | 'testnet';

export type Balance = { confirmed: number; unconfirmed: number; total: number };

export type Connector = UnisatConnector | OkxConnector;

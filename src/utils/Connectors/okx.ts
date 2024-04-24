import { BtcConnector } from '@/utils/Connectors/btcConnector';
import { Balance, OkxWallet, WalletNetwork } from '@/utils/Connectors/types';

export class OkxConnector extends BtcConnector {
  readonly id = 'okx';
  readonly name: string = 'OKX';
  readonly networks: WalletNetwork[] = ['livenet'];
  public homepage: string = 'https://www.okx.com/web3/build/docs/sdks/chains/bitcoin/provider';
  public banance: Balance = { confirmed: 0, unconfirmed: 0, total: 0 };
  public okxwallet: OkxWallet;

  constructor() {
    super();
    this.okxwallet = window.okxwallet?.bitcoin;
  }
  on(event: 'accountsChanged' | 'accountChanged', handler: any) {
    if (this.network === 'livenet') {
      this.okxwallet?.on(event, handler);
    }
  }
  async connect(): Promise<boolean> {
    this.connected = false;
    try {
      if (!this.okxwallet) {
        throw new Error('OkxWallet not installed');
      }
      const res = await this.okxwallet.connect();
      this.connected = true;
      this.address = res.address;
      this.publicKey = res.publicKey;
      await this.getCurrentInfo();
    } catch (error) {
      throw error;
    }
    return this.connected;
  }
  async getCurrentInfo() {
    if (this.network === 'livenet') {
      if (!this.okxwallet) {
        throw new Error('OkxWallet not installed');
      }
      const accounts = await this.okxwallet.getAccounts();
      if (accounts.length) {
        this.address = accounts[0];
        const [publicKey, network, banance] = await Promise.all([
          this.okxwallet.getPublicKey(),
          this.okxwallet.getNetwork(),
          this.okxwallet.getBalance(),
        ]);
        this.publicKey = publicKey;
        this.network = network;
        this.banance = banance;
        this.connected = true;
      }
    }
  }
  async disconnect(): Promise<void> {
    this.address = undefined;
    this.publicKey = undefined;
    this.connected = false;
    this.banance = { confirmed: 0, unconfirmed: 0, total: 0 };
  }
  async getAccounts(): Promise<string[]> {
    if (this.network !== 'livenet') {
      throw new Error("Can't get accounts on testnet");
    }
    if (!this.okxwallet) {
      throw new Error('OkxWallet not installed');
    }
    return this.okxwallet.getAccounts();
  }
  async getNetwork(): Promise<WalletNetwork> {
    return this.network;
  }
  async getPublicKey() {
    if (this.network !== 'livenet') {
      throw new Error("Can't get accounts on testnet");
    }
    if (!this.okxwallet) {
      throw new Error('OkxWallet not installed');
    }
    return this.okxwallet.getPublicKey();
  }
  async getBalance() {
    if (this.network !== 'livenet') {
      throw new Error("Can't get accounts on testnet");
    }
    if (!this.okxwallet) {
      throw new Error('OkxWallet not installed');
    }
    return this.okxwallet.getBalance();
  }

  async sendToAddress(toAddress: string, amount: number) {
    if (this.network !== 'livenet') {
      throw new Error("Can't get accounts on testnet");
    }
    if (!this.okxwallet) {
      throw new Error('OkxWallet not installed');
    }
    return this.okxwallet?.sendBitcoin(toAddress, amount);
  }

  async switchNetwork(network: WalletNetwork) {
    this.okxwallet = network === 'testnet' ? window.okxwallet.bitcoinTestnet : window.okxwallet.bitcoin;
  }

  async signPsbt(psbtHex: string, options?: any) {
    if (!this.okxwallet) {
      throw new Error('OkxWallet not installed');
    }
    return this.okxwallet.signPsbt(psbtHex, options);
  }
  async signMessage(message: string) {
    if (!this.okxwallet) {
      throw new Error('OkxWallet not installed');
    }
    return this.okxwallet.signMessage(message);
  }
  async signPsbts(psbtHexs: string[], options?: any) {
    if (!this.okxwallet) {
      throw new Error('OkxWallet not installed');
    }
    return this.okxwallet.signPsbts(psbtHexs, options);
  }
  async pushTx(rawTx: string) {
    if (this.network !== 'livenet') {
      throw new Error("Can't get accounts on testnet");
    }
    if (!this.okxwallet) {
      throw new Error('OkxWallet not installed');
    }
    return this.okxwallet.pushTx(rawTx);
  }
  async pushPsbt(psbtHex: string) {
    if (this.network !== 'livenet') {
      throw new Error("Can't get accounts on testnet");
    }
    if (!this.okxwallet) {
      throw new Error('OkxWallet not installed');
    }
    return this.okxwallet.pushPsbt(psbtHex);
  }
}

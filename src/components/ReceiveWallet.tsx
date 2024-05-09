'use client';

import { walletList } from '@/constants';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { ethers } from 'ethers';
import { useState } from 'react';

export default function ReceiveWallet({
  chainId,
  setReceiveAddress,
}: {
  chainId: number;
  setReceiveAddress: Function;
}) {
  const [selectedKey, setSelectedKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider>();

  const handleReceiveWallet = async (walletName: string) => {
    const _provider = new ethers.BrowserProvider(walletName === 'MetaMask' ? window.ethereum : window.okxwallet);
    const accounts = await _provider?.send('eth_requestAccounts', []);
    if (accounts) {
      setProvider(provider);
      setReceiveAddress(accounts[0]);
      setIsConnected(true);
      setSelectedKey(walletName);
    }
  };

  return (
    <Dropdown className="bg-[#c2c2c2] min-w-[7.75rem]">
      <DropdownTrigger>
        <Button className="mt-[0.5rem] border border-black rounded-md w-[8rem] text-left pl-[0.5rem] h-[1.3rem]">
          {selectedKey === '' ? 'Connect Wallet' : selectedKey}
        </Button>
      </DropdownTrigger>
      {!isConnected ? (
        <DropdownMenu
          className="text-center"
          selectionMode="single"
          selectedKeys={selectedKey}
          onAction={(key) => handleReceiveWallet(key as string)}
        >
          {walletList.map((wallet) => (
            <DropdownItem key={wallet.walletName}>{wallet.walletName}</DropdownItem>
          ))}
        </DropdownMenu>
      ) : (
        <DropdownMenu variant="flat" className="text-center">
          <DropdownItem
            key="disconnect"
            onClick={() => {
              setIsConnected(false);
              setSelectedKey('');
              provider?.send('disconnect', []);
              setReceiveAddress('');
              setProvider(undefined);
            }}
          >
            Disconnect
          </DropdownItem>
        </DropdownMenu>
      )}
    </Dropdown>
  );
}

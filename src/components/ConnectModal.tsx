'use client';
import { MetaMask, OKX } from '@/app/config/wagmiConfig';
import { Button, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@nextui-org/react';
import Image from 'next/image';
import { useConnect } from 'wagmi';

interface WalletButton {
  id: string;
  walletName: string;
  icon: string;
  width: number;
  height: number;
  connector?: any;
}

export const walletList: WalletButton[] = [
  { id: 'unisat', walletName: 'Unisat Wallet', icon: 'Unisat-logo.svg', height: 50, width: 50, connector: undefined },
  { id: 'okx', walletName: 'OKX Wallet', icon: 'Okx-logo.svg', height: 50, width: 50, connector: OKX },
  { id: 'MetaMask', walletName: 'MetaMask', icon: 'metamask-logo.svg', height: 60, width: 60, connector: MetaMask },
];

export function ConnectModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { connect } = useConnect();

  const walletConnectHandler = (connector: any) => {
    //todo  need to add wallet request
    connect({ connector });
  };

  return (
    <>
      <Button className="bg-[#c2c2c2] cursor-pointer" onPress={onOpen} variant="flat">
        Connect Wallet
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        className="bg-[#cdcccc] h-[17.9375rem] w-[26rem]"
      >
        <ModalContent className="text-center mt-[2.5rem] gap-[2.75rem]">
          {(onClose) => (
            <>
              <ModalHeader className="flex-col">Connect Wallet</ModalHeader>
              <ModalBody className="flex flex-row justify-around">
                {walletList.map((item) => {
                  return (
                    <Button
                      className="flex flex-col items-center w-[6rem] h-[6rem] bg-[#cdcccc]"
                      key={item.id}
                      onPress={(e) => {
                        walletConnectHandler(item.connector);
                        onClose();
                      }}
                    >
                      <Image src={item.icon} alt={item.walletName} width={item.width} height={item.height} />
                      <p>{item.walletName}</p>
                    </Button>
                  );
                })}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

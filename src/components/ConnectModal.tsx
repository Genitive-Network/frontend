'use client';
import { walletList } from '@/constants';
import { Button, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@nextui-org/react';
import Image from 'next/image';
import { useConnect } from 'wagmi';

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

'use client';
import { Button, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@nextui-org/react';
import Image from 'next/image';

export function ConnectModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
                <Button className="flex flex-col items-center w-[6rem] h-[6rem] bg-[#cdcccc]">
                  <Image src="Unisat-logo.svg" alt="Unisat" width="50" height="50" />
                  <p>Unisat Wallet</p>
                </Button>
                <Button className="flex flex-col items-center w-[6rem] h-[6rem] bg-[#cdcccc]">
                  <Image src="Okx-logo.svg" alt="OKX" width="50" height="50" />
                  <p>OKX Wallet</p>
                </Button>
                <Button className="flex flex-col items-center w-[6rem] h-[6rem] bg-[#cdcccc]">
                  <Image src="metamask-logo.svg" alt="MetaMask" width="60" height="60" />
                  <p>MetaMask</p>
                </Button>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

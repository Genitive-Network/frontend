'use client'
import { chainList, walletList } from '@/constants'
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react'
import Image from 'next/image'
import { useCallback } from 'react'
import { useAccount, useConnect, useSwitchChain } from 'wagmi'

export function ConnectModal({ chainId }: { chainId: number }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { connect } = useConnect()
  const { isConnected, chain } = useAccount()
  const { switchChainAsync } = useSwitchChain()

  const walletConnectHandler = (connector: any) => {
    //todo  need to add wallet request
    connect({
      chainId,
      connector,
    })
  }
  const chainItem = chainList.find(item => item.id === chainId)
  // console.log({ connectedChain: chain, isConnected })

  const onClickSwitch = useCallback(() => {
    switchChainAsync({ chainId })
  }, [chainId, switchChainAsync])

  return (
    <>
      {!isConnected ? (
        <Button
          as="div"
          className="bg-[#c2c2c2] cursor-pointer"
          onPress={onOpen}
          variant="flat"
        >
          Connect Wallet
        </Button>
      ) : (
        <>
          {chainItem && (
            <Button
              as="div"
              className="bg-[#c2c2c2] cursor-pointer"
              onPress={onClickSwitch}
              variant="flat"
            >
              Switch to {chainItem.label}
            </Button>
          )}
        </>
      )}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        placement="top-center"
        className="bg-[#cdcccc] h-[17.9375rem] w-[26rem]"
      >
        <ModalContent className="text-center mt-[2.5rem] gap-[2.75rem] absolute top-16">
          {onClose => (
            <>
              <ModalHeader className="flex-col">Connect Wallet</ModalHeader>
              <ModalBody className="flex flex-row justify-around">
                {walletList.map(item => {
                  return (
                    <Button
                      as="div"
                      className="flex flex-col items-center w-[6rem] h-[6rem] bg-[#cdcccc]"
                      key={item.id}
                      onPress={e => {
                        walletConnectHandler(item.connector)
                        onClose()
                      }}
                    >
                      <Image
                        src={item.icon}
                        alt={item.walletName}
                        width={item.width}
                        height={item.height}
                      />
                      <span>{item.walletName}</span>
                    </Button>
                  )
                })}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

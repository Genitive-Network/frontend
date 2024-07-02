'use client'

import { ConnectModal } from '@/components/ConnectModal'
import Decrypt from '@/components/Decrypt'
import { CHAIN_ID } from '@/config/wagmiConfig'
import { chainList, gacABI } from '@/constants'
import { useTokenBalance } from '@/hooks/useBalance'
import { usePubkey } from '@/hooks/usePubkey'
import { ChainItem } from '@/types'
import { balanceOfMe } from '@/utils/fhevm'
import { decryptText, shortAddress, useEthersSigner } from '@/utils/helpers'
import { Button, Input, Tab, Tabs } from '@nextui-org/react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { formatUnits, parseEther, type Abi } from 'viem'
import {
  useAccount,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
  type BaseError,
} from 'wagmi'

export default function Wrap({ params }: { params: { slug: string } }) {
  const { isConnected, address, chain } = useAccount()
  const { switchChainAsync } = useSwitchChain()
  const { writeContractAsync, isPending, data: hash } = useWriteContract()
  const [wrapAmount, setWrapAmount] = useState('')
  const { balance, isLoading, error } = useTokenBalance()
  const [isWrapping, setIsWrapping] = useState(false)

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  const setWrapAmountMax = () => {
    console.log('set max', isLoading, error)
    if (!balance) return
    console.log('balance:', formatUnits(balance.value, balance.decimals))
    balance && setWrapAmount(formatUnits(balance.value, balance.decimals))
  }

  const [chainItem, setChainItem] = useState<ChainItem | null>(null)
  const signer = useEthersSigner({ chainId: CHAIN_ID.bevmTestnet })
  const [encryptedBalance, setEncryptedBalance] = useState<`0x${string}`>()

  const {
    pubkey,
    isPending: isSettingPubkey,
    requestEncryptionKey,
    hash: setPubkeyTxHash,
  } = usePubkey(chainItem, address)

  const { switchChain } = useSwitchChain()
  const updateEncryptedBalance = useCallback(() => {
    async function update() {
      if (!address || !signer || !chainItem) return
      if (chainItem.id !== CHAIN_ID.fhevmDevnet) {
        switchChain({ chainId: CHAIN_ID.fhevmDevnet })
      }
      // TODO use token.decimal instead of hardcoded 18
      const newEncryptedBalance = await balanceOfMe(chainItem.gac, 18, signer)
      console.log({ newEncryptedBalance })
      setEncryptedBalance(newEncryptedBalance)
    }
    update()
  }, [address, chainItem, signer, switchChain])

  useEffect(() => {
    if (!chain) return
    const chainItem = chainList.find(c => c.id === chain.id)
    if (!chainItem) return
    setChainItem(chainItem)

    updateEncryptedBalance()
  }, [address, chain, signer, updateEncryptedBalance])

  const wrap = async () => {
    if (!chain || !chainItem) return
    setIsWrapping(true)
    console.log('wrap', wrapAmount)

    await writeContractAsync({
      abi: gacABI as Abi,
      address: chainItem.gac,
      functionName: 'wrap',
      args: [],
      value: parseEther(wrapAmount),
    })
    setIsWrapping(false)
    updateEncryptedBalance()
  }

  // TODO
  // const { isSuccess: isWrapSuccess } = waitForTransactionReceipt({
  //   hash: setPubkeyTxHash,
  // })

  const { isSuccess: setPubkeySuccess } = useWaitForTransactionReceipt({
    hash: setPubkeyTxHash,
  })

  const [showEncryptedBalance, setShowEncryptedBalance] = useState(true)
  const [decryptedBalance, setDecryptedBalance] = useState<string>()

  const showDecryptedBalance = useCallback(async () => {
    if (encryptedBalance === '0x') {
      setDecryptedBalance('0')
    } else if (address && encryptedBalance) {
      let decrypted = await decryptText(address, encryptedBalance)
      setDecryptedBalance(decrypted)
    }
    setShowEncryptedBalance(false)
  }, [address, encryptedBalance])

  return (
    <div className="items-center text-center mt-[5rem] text-[2.5rem] text-[#424242] flex flex-col">
      <h1 className="mb-1 font-bold">Encrypt & Decrypt</h1>
      <p className="mb-2 text-sm">
        balance WBTC encrypted for cross-chain bridge
      </p>
      <Tabs
        size="lg"
        variant="bordered"
        radius="full"
        color="default"
        aria-label="Options"
        className="font-bold"
        classNames={{
          tabList: 'p-0 bg-primary border-0 mb-4',
          tab: 'text-xs px-8',
          tabContent: 'text-white',
          panel: 'p-1',
        }}
      >
        <Tab key="Encrypt" title="Encrypt">
          <div className="bg-white p-8 rounded-3xl">
            <div className="flex horizontal justify-between font-bold gap-4">
              <div className="flex vertical gap-2">
                <span className="text-[0.5rem] text-left">BTC Balance</span>
                <span className="text-[0.8rem]">
                  {balance
                    ? formatUnits(balance.value, balance.decimals) + ' BTC'
                    : ''}
                </span>
              </div>

              {chain && address && (
                <div className="flex horizontal center-h text-base gap-3 ml-16">
                  <div className="text-[0.8rem]">{chainItem?.label}</div>
                  {/* TODO select chain and switch chain */}
                  <div className="text-[0.5rem]">{shortAddress(address)}</div>
                </div>
              )}
            </div>

            <hr className="border-t-4 border-black mb-10 mt-6" />

            <div className="flex horizontal justify-between mb-8 font-bold gap-16">
              <div className="flex vertical gap-2 text-left">
                <span className="text-[0.5rem]">BTC Balance</span>
                <span className="text-[0.8rem]">
                  {balance
                    ? formatUnits(balance.value, balance.decimals) + ' BTC'
                    : ''}
                </span>
                {chainItem && chainItem.faucet && (
                  <Link
                    href={chainItem.faucet}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary"
                  >
                    faucet
                  </Link>
                )}
              </div>

              <div
                className="flex vertical gap-2 text-left w-56"
                onMouseOver={showDecryptedBalance}
                onMouseOut={() => setShowEncryptedBalance(true)}
              >
                <span className="text-[0.5rem]">encrypted BTC Balance</span>
                {showEncryptedBalance ? (
                  <span className="text-[0.8rem]">
                    {encryptedBalance && '**** eBTC'}
                  </span>
                ) : (
                  decryptedBalance && (
                    <span className="text-[0.8rem]">
                      {formatUnits(BigInt(decryptedBalance), 18) + ' eBTC'}
                    </span>
                  )
                )}
                <span className="text-[0.5rem] text-slate-300 font-normal">
                  Hover to display plaintext balance
                </span>
              </div>
            </div>

            <Input
              placeholder="BTC amount"
              size="lg"
              variant="bordered"
              type="number"
              value={wrapAmount}
              onValueChange={setWrapAmount}
              classNames={{
                inputWrapper: 'border-1 rounded-2xl',
                input: 'placeholder:text-slate-200 pl-2',
              }}
              endContent={
                <Button
                  size="sm"
                  className="min-w-12 h-7 p-0 rounded-xl text-xs bg-primary-50 text-[0.5rem] text-primary font-bold focus:outline-none"
                  type="button"
                  onClick={setWrapAmountMax}
                >
                  MAX
                </Button>
              }
            />

            {isConnected ? (
              <>
                {!pubkey && !setPubkeySuccess && (
                  <Button
                    isLoading={isPending || isSettingPubkey}
                    onClick={requestEncryptionKey}
                    variant="shadow"
                    color="primary"
                    className="mt-4 w-full font-bold text-xs"
                    size="lg"
                  >
                    {isSettingPubkey ? 'Pending...' : 'Set Public Key'}
                  </Button>
                )}
                <Button
                  disabled={!wrapAmount || !pubkey}
                  isLoading={isPending}
                  onClick={wrap}
                  variant="shadow"
                  color="primary"
                  className="mt-4 w-full font-bold text-xs"
                  size="lg"
                >
                  {isPending ? 'Pending...' : 'Encrypt'}
                </Button>
              </>
            ) : (
              <ConnectModal />
            )}

            <div className="text-sm mt-4 text-left">
              {hash && chain && (
                <div>
                  Transaction Hash:{' '}
                  <Link
                    href={chain?.blockExplorers?.default.url + '/tx/' + hash}
                    target="_blank"
                    className="underline text-primary"
                  >
                    {shortAddress(hash)}
                  </Link>
                </div>
              )}
              {isConfirming && <div>Waiting for confirmation...</div>}
              {isConfirmed && <div>Transaction confirmed.</div>}
              {error && (
                <div>
                  Error: {(error as BaseError).shortMessage || error.message}
                </div>
              )}
            </div>
          </div>
        </Tab>

        <Decrypt address={address} />
      </Tabs>
    </div>
  )
}

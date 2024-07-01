'use client'

import { ConnectModal } from '@/components/ConnectModal'
import { CHAIN_ID } from '@/config/wagmiConfig'
import { chainList, gacABI } from '@/constants'
import { useTokenBalance } from '@/hooks/useBalance'
import { ChainItem } from '@/types'
import {
  balanceOfMe,
  getContractPubkey,
  setContractPubkey,
} from '@/utils/fhevm'
import {
  requestPublicKey,
  shortAddress,
  useEthersSigner,
} from '@/utils/helpers'
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
import { GetBalanceReturnType } from 'wagmi/actions'

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
  const [encryptedBalance, setEncryptedBalance] =
    useState<GetBalanceReturnType>()
  useEffect(() => {
    if (!chain) return
    const chainItem = chainList.find(c => c.id === chain.id)
    if (!chainItem) return
    setChainItem(chainItem)

    async function checkPubkey() {
      if (!signer || !chainItem) return

      let pubkey
      try {
        pubkey = await getContractPubkey(chainItem.gac, signer)
        console.log({ pubkey })
      } catch (e) {
        console.error('failed to get pubkey: ', e)
        return
      }
      if (
        pubkey &&
        pubkey !==
          '0x0000000000000000000000000000000000000000000000000000000000000000'
      ) {
        console.info('get pubkey from gac:', pubkey)
        return
      }

      if (!address || !chainItem) return

      const requestedPublicKey = await requestPublicKey(address)
      console.log({ requestedPublicKey })
      if (!requestedPublicKey) {
        alert('Please set public key before encrypt and transfer.')
        return
      }

      // await switchChainAsync({ chainId: fromChainItem.id })
      await setContractPubkey(requestedPublicKey, chainItem.gac, signer)
      return true
    }
    checkPubkey()
  }, [address, chain, signer])

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
            <div className="flex horizontal font-bold gap-4">
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
                  <div className="text-[0.8rem]">{chain.name}</div>
                  <div className="text-[0.5rem]">{shortAddress(address)}</div>
                </div>
              )}
            </div>

            <hr className="border-t-4 border-black mb-10 mt-6" />

            <div className="flex horizontal mb-8 font-bold gap-16">
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

              <div className="flex vertical gap-2 text-left">
                <span className="text-[0.5rem]">encrypted BTC Balance</span>
                {encryptedBalance && (
                  <span className="text-[0.8rem]">
                    {encryptedBalance.value.toString() + ' eBTC'}
                  </span>
                )}
                {balance && (
                  <span className="text-[0.8rem]">
                    {formatUnits(balance.value, balance.decimals) + ' eBTC'}
                  </span>
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
              <Button
                disabled={!wrapAmount}
                isLoading={isPending}
                onClick={wrap}
                variant="shadow"
                color="primary"
                className="mt-4 w-full font-bold text-xs"
                size="lg"
              >
                {isPending ? 'Pending...' : 'Encrypt'}
              </Button>
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
        <Tab key="Decrypt" title="Decrypt">
          <div>Decrypt</div>
        </Tab>
      </Tabs>
    </div>
  )
}

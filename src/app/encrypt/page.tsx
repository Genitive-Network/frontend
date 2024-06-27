'use client'

import { ConnectModal } from '@/components/ConnectModal'
import { chainList, gacABI } from '@/constants'
import { useTokenBalance } from '@/hooks/useBalance'
import { ChainItem } from '@/types'
import { shortAddress } from '@/utils/helpers'
import { Button, Input, Tab, Tabs } from '@nextui-org/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
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
  useEffect(() => {
    if (!chain) return
    const chainItem = chainList.find(c => c.id === chain.id)
    if (!chainItem) return
    setChainItem(chainItem)
  }, [chain])

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
  }

  return (
    <div className="items-center text-center mt-[5rem] text-[2.5rem] text-[#424242] flex flex-col">
      <h1 className="mb-1 font-bold">Encrypt & Decrypt</h1>
      <p className="mb-2 text-sm">
        balance WBTC encrypted for cross-chain bridge
      </p>
      <Tabs size="lg" aria-label="Options">
        <Tab key="Wrap" title="Wrap">
          <div className="bg-white p-8 rounded-3xl">
            <Input
              placeholder="amount"
              size="lg"
              type="number"
              value={wrapAmount}
              onValueChange={setWrapAmount}
              endContent={
                <button
                  className="p-2 rounded-md text-xs bg-primary-50 text-primary focus:outline-none"
                  type="button"
                  onClick={setWrapAmountMax}
                >
                  MAX
                </button>
              }
            />

            {isConnected ? (
              <Button
                disabled={!wrapAmount}
                isLoading={isPending}
                onClick={wrap}
                variant="shadow"
                color="primary"
                className="mt-4 w-full"
                size="lg"
              >
                {isPending ? 'Pending...' : 'Wrap'}
              </Button>
            ) : (
              <ConnectModal />
            )}

            <div className="text-sm mt-4 text-left">
              {hash && chain && (
                <div>
                  Transaction Hash:{' '}
                  <Link
                    href={chain?.blockExplorers?.default.url + 'tx/' + hash}
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
        <Tab key="Unwrap" title="Unwrap">
          <div>unwrap</div>
        </Tab>
      </Tabs>
    </div>
  )
}

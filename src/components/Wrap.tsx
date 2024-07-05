'use client'
import { CHAIN_ID, zamaDevnet } from '@/config/wagmiConfig'
import { chainList, gacABI } from '@/constants'
import { useTokenBalance } from '@/hooks/useBalance'
import useEncryptedBalance from '@/hooks/useEncryptedBalance'
import { useFhevmInstance } from '@/hooks/useFhevmInstance'
import { ChainItem } from '@/types'
import { shortAddress } from '@/utils/helpers'
import { Button, Input, Link } from '@nextui-org/react'
import { useCallback, useEffect, useState } from 'react'
import { Abi, BaseError, formatEther, formatUnits, parseEther } from 'viem'
import {
  useAccount,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'
import ChainSelect from './ChainSelect'
import { ConnectModal } from './ConnectModal'

type WrapProps = {
  tab: 'Encrypt' | 'Decrypt'
}
const Wrap: React.FC<WrapProps> = ({ tab }) => {
  const { isConnected, address, chain } = useAccount()
  const { switchChainAsync } = useSwitchChain()
  const { writeContractAsync, isPending, data: hash } = useWriteContract()
  const [amount, setAmount] = useState('')
  const { balance, isLoading, error } = useTokenBalance()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  const setAmountMax = () => {
    console.log('set max', isLoading, error)
    if (tab === 'Encrypt') {
      if (!balance) return
      console.log('balance:', formatUnits(balance.value, balance.decimals))
      setAmount(formatUnits(balance.value, balance.decimals))
    }
    if (tab === 'Decrypt') {
      if (!decryptedBalance) return
      console.log('decryptedBalance:', decryptedBalance)
      setAmount(decryptedBalance)
    }
  }

  // switch to the first chain in the list if the current chain is not in the list
  useEffect(() => {
    if (chainList.find(chainItem => chainItem.id === chain?.id)) return
    if (chain?.id === zamaDevnet.id) return
    switchChainAsync({ chainId: chainList[0].id })
  }, [chain, switchChainAsync])

  const [chainItem, setChainItem] = useState<ChainItem>()
  // const signer = useEthersSigner({ chainId: CHAIN_ID.bevmTestnet })
  const [encryptedBalance, setEncryptedBalance] = useState<`0x${string}`>()

  const fhevmInstance = useFhevmInstance()

  const {
    data: encryptedBalanceFromServer,
    isLoading: isLoadingBalance,
    update: fetchEncryptedBalance,
  } = useEncryptedBalance(chainItem)
  const updateEncryptedBalance = useCallback(() => {
    async function update() {
      console.log('update encrypted balance', encryptedBalanceFromServer)
      if (!address || !encryptedBalanceFromServer || !chainItem) return
      // TODO use token.decimal instead of hardcoded 18
      const newEncryptedBalance = encryptedBalanceFromServer.balance
      console.log({ newEncryptedBalance })
      setEncryptedBalance(newEncryptedBalance)
    }
    update()
  }, [address, chainItem, encryptedBalanceFromServer])

  useEffect(() => {
    if (!chain) return
    const chainItem = chainList.find(c => c.id === chain.id)
    if (!chainItem) return
    setChainItem(chainItem)

    updateEncryptedBalance()
  }, [chain, updateEncryptedBalance])

  const wrap = useCallback(async () => {
    if (!chain || !chainItem) return
    console.log('wrap', amount)

    await writeContractAsync({
      abi: gacABI as Abi,
      address: chainItem.gac,
      functionName: 'wrap',
      args: [],
      value: parseEther(amount),
    })
    updateEncryptedBalance()
  }, [chain, chainItem, updateEncryptedBalance, amount, writeContractAsync])

  const unwrap = useCallback(async () => {
    if (!chain || !chainItem) return
    console.log('unwrap', amount)

    await writeContractAsync({
      abi: gacABI as Abi,
      address: chainItem.gac,
      functionName: 'unwrap',
      args: [parseEther(amount)],
    })

    updateEncryptedBalance()
  }, [chain, chainItem, updateEncryptedBalance, amount, writeContractAsync])

  const [showEncryptedBalance, setShowEncryptedBalance] = useState(true)
  const [decryptedBalance, setDecryptedBalance] = useState<string>()

  const revealBalance = useCallback(async () => {
    if (encryptedBalance === '0x') {
      setDecryptedBalance('0')
      setShowEncryptedBalance(false)
    } else if (address && encryptedBalance && fhevmInstance) {
      // TODO request decrypt only when user click
      let decrypted = fhevmInstance.decrypt(address, encryptedBalance)
      setDecryptedBalance(formatEther(decrypted))
      setShowEncryptedBalance(false)
    }

    if (!encryptedBalance) {
      fetchEncryptedBalance()
    }
  }, [address, encryptedBalance, fetchEncryptedBalance, fhevmInstance])

  const [selectedChain, setSelectedChain] = useState(
    chain?.id || CHAIN_ID.bevmTestnet,
  )
  const selectChain = (id: number) => {
    setSelectedChain(id)
    switchChainAsync({ chainId: id })
  }

  return (
    <div className="bg-white p-8 rounded-3xl">
      <div className="flex horizontal justify-between font-bold gap-4">
        <div className="flex vertical gap-2">
          <span className="text-[0.5rem] text-left">BTC Balance</span>
          <span className="text-[0.8rem]">
            {balance && address
              ? formatUnits(balance.value, balance.decimals) + ' BTC'
              : ''}
          </span>
        </div>

        {chain && address && (
          <div className="flex horizontal center-h text-base gap-3 ml-8 md:ml-16">
            {/* <div className="text-[0.8rem]">{chainItem?.label}</div> */}
            {/* TODO select chain and switch chain */}
            {/* <div className="text-[0.5rem]">{shortAddress(address)}</div> */}
            <ChainSelect
              label=""
              selectedKey={selectedChain}
              defaultSelectedKey={selectedChain}
              chainList={chainList}
              changeChain={selectChain}
            />
          </div>
        )}
      </div>

      <hr className="border-t-4 border-black mb-10 mt-6" />

      <div className="flex horizontal justify-between mb-8 font-bold gap-16">
        <div className="flex vertical gap-2 text-left">
          <span className="text-[0.5rem]">BTC Balance</span>
          <span className="text-[0.8rem]">
            {balance && address
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
          onClick={revealBalance}
        >
          <span className="text-[0.5rem]">encrypted BTC Balance</span>
          {showEncryptedBalance ? (
            <span className="text-[0.8rem]">**** eBTC</span>
          ) : (
            <span className="text-[0.8rem] inline-block h-5">
              {formatUnits(BigInt(decryptedBalance ?? ''), 18) + ' eBTC'}
            </span>
          )}
          <span className="text-[0.5rem] text-slate-300 font-normal">
            Click to display plaintext balance
          </span>
        </div>
      </div>

      <Input
        placeholder="BTC amount"
        size="lg"
        variant="bordered"
        type="number"
        value={amount}
        onValueChange={setAmount}
        classNames={{
          inputWrapper: 'border-1 rounded-2xl',
          input: 'placeholder:text-slate-200 pl-2',
        }}
        endContent={
          <Button
            as="div"
            size="sm"
            className="min-w-12 h-7 p-0 rounded-xl text-xs bg-primary-50 text-[0.5rem] text-primary font-bold focus:outline-none"
            type="button"
            onClick={setAmountMax}
          >
            MAX
          </Button>
        }
      />

      {isConnected ? (
        <>
          <Button
            as="div"
            disabled={!amount}
            isLoading={isPending}
            onClick={() => (tab === 'Encrypt' ? wrap() : unwrap())}
            variant="shadow"
            color="primary"
            className="mt-4 w-full font-bold text-xs"
            size="lg"
          >
            {isPending ? 'Pending...' : tab}
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
          <div>Error: {(error as BaseError).shortMessage || error.message}</div>
        )}
      </div>
    </div>
  )
}

export default Wrap

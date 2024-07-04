'use client'
import { CHAIN_ID } from '@/config/wagmiConfig'
import { chainList, gacABI } from '@/constants'
import { useTokenBalance } from '@/hooks/useBalance'
import { usePubkey } from '@/hooks/usePubkey'
import { ChainItem } from '@/types'
import { balanceOfMe } from '@/utils/fhevm'
import { shortAddress, useEthersSigner } from '@/utils/helpers'
import { Button, Input, Link } from '@nextui-org/react'
import { useCallback, useEffect, useState } from 'react'
import { Abi, BaseError, formatUnits, parseEther } from 'viem'
import {
  useAccount,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'
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
  const [isWrapping, setIsWrapping] = useState(false)

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

  const [chainItem, setChainItem] = useState<ChainItem>()
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
      const newEncryptedBalance = await balanceOfMe(chainItem.gac, signer)
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

  const wrap = useCallback(async () => {
    if (!chain || !chainItem) return
    setIsWrapping(true)
    console.log('wrap', amount)

    await writeContractAsync({
      abi: gacABI as Abi,
      address: chainItem.gac,
      functionName: 'wrap',
      args: [],
      value: parseEther(amount),
    })
    setIsWrapping(false)
    updateEncryptedBalance()
  }, [chain, chainItem, updateEncryptedBalance, amount, writeContractAsync])

  const unwrap = useCallback(async () => {
    if (!chain || !chainItem) return
    setIsWrapping(true)
    console.log('unwrap', amount)

    await writeContractAsync({
      abi: gacABI as Abi,
      address: chainItem.gac,
      functionName: 'unwrap',
      args: [parseEther(amount)],
    })
    setIsWrapping(false)
    updateEncryptedBalance()
  }, [chain, chainItem, updateEncryptedBalance, amount, writeContractAsync])

  // TODO
  // const { isSuccess: isWrapSuccess } = waitForTransactionReceipt({
  //   hash: setPubkeyTxHash,
  // })

  const { isSuccess: setPubkeySuccess } = useWaitForTransactionReceipt({
    hash: setPubkeyTxHash,
  })

  const [showEncryptedBalance, setShowEncryptedBalance] = useState(true)
  const [decryptedBalance, setDecryptedBalance] = useState<string>()

  const revealBalance = useCallback(async () => {
    if (encryptedBalance === '0x') {
      setDecryptedBalance('0')
    } else if (address && encryptedBalance) {
      // TODO request decrypt only when user click
      let decrypted = '' //await decryptText(address, encryptedBalance)
      setDecryptedBalance(decrypted)
    }
    setShowEncryptedBalance(false)
  }, [address, encryptedBalance])

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
            <span className="text-[0.8rem]">
              {encryptedBalance && '**** eBTC'}
            </span>
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
          {!pubkey && !setPubkeySuccess && (
            <Button
              as="div"
              isLoading={isSettingPubkey}
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
            as="div"
            disabled={!amount || !pubkey}
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

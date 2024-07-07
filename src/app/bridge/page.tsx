'use client'

import ChainSelect from '@/components/ChainSelect'
import { ConnectModal } from '@/components/ConnectModal'
import History from '@/components/History'
import TokenSelect from '@/components/TokenSelect'
import { CHAIN_ID, wagmiConfig, zamaDevnet } from '@/config/wagmiConfig'
import { chainList, tokenList } from '@/constants'
import useEncryptedBalance from '@/hooks/useEncryptedBalance'
import { useFhevmInstance } from '@/hooks/useFhevmInstance'
import { BalanceContext, TokenBalance } from '@/providers/BalancesProvider'
import { ChainItem, TokenItem } from '@/types'
import { swapAndTransfer } from '@/utils/fhevm'
import { shortAddress, useEthersSigner } from '@/utils/helpers'
import { Button, Link } from '@nextui-org/react'
import Image from 'next/image'
import { useContext, useEffect, useState, type ChangeEvent } from 'react'
import {
  ContractFunctionExecutionError,
  TransactionExecutionError,
  formatEther,
  formatUnits,
  parseUnits,
} from 'viem'
import {
  useAccount,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'
import { getGasPrice } from 'wagmi/actions'

export default function Bridge() {
  const [amount, setAmount] = useState('')
  const { balances: eBTCBalances } = useContext(BalanceContext)

  const { isConnected, address, chain: connectedChain } = useAccount()
  const { switchChainAsync } = useSwitchChain()

  const [fromChain, setFromChain] = useState(
    connectedChain && chainList.find(item => item.id === connectedChain.id)
      ? connectedChain.id
      : CHAIN_ID.bevmTestnet,
  )
  const [toChain, setToChain] = useState(
    chainList.find(item => item.id !== fromChain)?.id ||
      CHAIN_ID.bitlayerTestnet,
  )

  const [token, setToken] = useState<TokenItem>(
    tokenList.find(token => token.chain === fromChain) || tokenList[0],
  )

  const [fee, setFee] = useState('0.00015')
  const [receiveAddress, setReceiveAddress] = useState('')

  const signer = useEthersSigner({ chainId: fromChain })

  const fhevmInstance = useFhevmInstance()

  const {
    writeContractAsync,
    isPending,
    data: txHash,
    error,
  } = useWriteContract()

  const [hash, setHash] = useState<`0x${string}`>()
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  const transferHandler = async () => {
    if (!fromChainItem || !amount || !signer || !fhevmInstance) return
    try {
      const tokenAddressTo = chainList.find(
        chain => chain.id === toChain,
      )?.ebtcAddress
      if (!tokenAddressTo) return

      console.log('swap and transfer', {
        gac: fromChainItem.gac,
        to: receiveAddress,
        tokenAddressFrom: token.address,
        tokenAddressTo: tokenAddressTo,
        amount: parseUnits(amount, token.decimals),
      })

      const txResponse = await swapAndTransfer(fhevmInstance, signer, {
        gac: fromChainItem.gac,
        to: receiveAddress,
        tokenAddressFrom: token.address,
        tokenAddressTo: tokenAddressTo,
        amount: amount,
      })
      setHash(txResponse.hash)
      console.log(txResponse.hash)
    } catch (e: unknown) {
      if (
        e instanceof TransactionExecutionError ||
        e instanceof ContractFunctionExecutionError
      ) {
        alert('Transaction failed:' + e.shortMessage)
      }
      console.error('error', e)
    }
    //todo request backend
  }

  const changeFromChain = async (value: number) => {
    setFromChain(value)
    setToChain(chainList.find(chain => chain.id !== value)!.id)
    switchChainAsync({ chainId: value })
  }

  const changeToChain = async (value: number) => {
    setToChain(value)
    const fromId = chainList.find(chain => chain.id !== value)!.id
    setFromChain(fromId)
  }

  const handleChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value
    // 使用正则表达式匹配数字和小数点
    const regex = /^\d*\.?\d*$/
    if (regex.test(inputValue)) {
      setAmount(inputValue)
    }
  }

  const [fromChainItem, setFromChainItem] = useState<ChainItem>()
  useEffect(() => {
    const item = chainList.find(chain => chain.id === fromChain)
    setFromChainItem(item)
  }, [fromChain])

  useEffect(() => {
    if (connectedChain && connectedChain.id === zamaDevnet.id) return
    function updateChainAndReceiveAddress() {
      if (isConnected && fromChain && address) {
        setReceiveAddress(address)

        const tokenItem =
          tokenList.find(token => token.chain === fromChain) || tokenList[0]
        setToken(tokenItem)
      }

      const gas = getGasPrice(wagmiConfig, { chainId: fromChain })
      gas.then(gas => setFee(formatEther(gas)))
    }
    updateChainAndReceiveAddress()
  }, [address, connectedChain, fromChain, isConnected])

  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

  const { data: encryptedBalanceFromServer, update: fetchEncryptedBalance } =
    useEncryptedBalance(fromChainItem)

  const [isReveal, setIsReveal] = useState(false)
  const onClickReveal = async () => {
    if (isReveal) return
    await fetchEncryptedBalance()
    setIsReveal(true)
  }

  let eBTCBalance: TokenBalance | undefined
  if (fromChainItem) eBTCBalance = eBTCBalances[fromChainItem.ebtcAddress]

  return (
    <div className="items-center text-center mt-[5rem] text-[2.5rem] text-[#424242] flex flex-col">
      <div className="flex flex-row space-x-16 content-around]">
        <Button className="w-[15rem] border border-black bg-[#c2c2c2] opacity-60">
          Bridge
        </Button>
        <Button className="w-[15rem] border border-black bg-transparent">
          Earn (Coming Soon)
        </Button>
      </div>

      <div className="border border-black bg-transparent w-[40rem] h-[32rem] rounded-[1rem] mt-[4rem] p-[2rem] pb-12">
        {isClient && (
          <form>
            <div className="flex flex-row justify-between items-end">
              <div>
                <ChainSelect
                  label="From"
                  selectedKey={fromChain}
                  defaultSelectedKey={fromChain}
                  chainList={chainList}
                  changeChain={changeFromChain}
                />
                {fromChainItem && fromChainItem.faucet && (
                  <Link
                    href={fromChainItem!.faucet}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute"
                  >
                    faucet
                  </Link>
                )}
              </div>
              <Image
                src="transfer_right.svg"
                alt="right"
                width="40"
                height="40"
                className=""
              />
              <ChainSelect
                label="To"
                selectedKey={toChain}
                defaultSelectedKey={toChain}
                chainList={chainList}
                changeChain={changeToChain}
              />
            </div>
            <div className="flex flex-row border border-black rounded-lg mt-[2rem] px-[0.5rem] py-[1rem] text-[1rem] justify-between">
              <div className="flex flex-col items-start w-[20rem]">
                <p>Amount</p>
                <input
                  className="bg-transparent text-[1.5rem] text-bold cursor-text focus:outline-none"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => {
                    handleChangeAmount(e)
                  }}
                />
              </div>
              <div className="flex flex-col w-2/5 items-end">
                <div className="flex flex-row justify-between w-[100%]">
                  <p
                    onClick={onClickReveal}
                    title="click to decrypt encrypted balance"
                  >
                    Balance:&nbsp;
                    {isReveal && eBTCBalance
                      ? formatUnits(
                          eBTCBalance.value,
                          eBTCBalance.decimals,
                        ).slice(0, 10)
                      : '****'}
                  </p>
                  {eBTCBalance && (
                    <p
                      className="cursor-pointer ml-2"
                      onClick={() =>
                        setAmount(
                          formatUnits(
                            eBTCBalance!.value,
                            eBTCBalance!.decimals,
                          ),
                        )
                      }
                    >
                      Max
                    </p>
                  )}
                </div>

                <TokenSelect
                  tokenList={tokenList.filter(
                    token => token.chain === fromChain,
                  )}
                  selectedToken={token}
                  className="self-end mt-0"
                />
              </div>
            </div>
            <div className="flex flex-row border border-black rounded-lg mt-[1rem] px-[0.5rem] py-[1rem] text-[0.875rem] justify-between">
              <div className="flex flex-col items-start w-[20rem]">
                <p>Recipient Address</p>
                <input
                  className="bg-transparent text-[0.75rem] cursor-text focus:outline-none w-[20rem] mt-[0.5rem]"
                  placeholder="Connect wallet to receive tokens"
                  value={receiveAddress}
                  disabled
                />
              </div>
              <div className="flex flex-col w-[10rem] items-end">
                <p className="text-[0.75rem] text-[#c1c1c1]">Est: 20 mins</p>
                {/* <Button className="mt-[0.5rem] border border-black rounded-md w-[8rem] text-left pl-[0.5rem] h-[1.3rem]">
                Connect Wallet
              </Button> */}
                {/* <ReceiveWallet chainId={toChain} setReceiveAddress={setReceiveAddress} /> */}
              </div>
            </div>
            <div className="flex flex-row border border-black rounded-lg mt-[1rem] px-[1rem] py-[0.5rem] text-[0.875rem] justify-start ">
              <p className="w-[50%] text-left">Fee: {fee}</p>
              <p className="text-[#c1c1c1]">
                Total: {amount ? parseFloat(fee) + parseFloat(amount) : fee}
              </p>
            </div>
            {isConnected && connectedChain?.id === fromChain ? (
              <>
                <Button
                  className="w-[11rem] border border-black bg-transparent"
                  onPress={e => transferHandler()}
                  isDisabled={!isConnected || !amount || !receiveAddress}
                >
                  Transfer
                </Button>
              </>
            ) : (
              <ConnectModal chainId={fromChain} />
            )}

            <div className="text-sm mt-4 text-left">
              {hash && connectedChain && (
                <div>
                  Transaction Hash:&nbsp;
                  <Link
                    href={
                      connectedChain?.blockExplorers?.default.url +
                      '/tx/' +
                      hash
                    }
                    target="_blank"
                    className="underline text-primary"
                  >
                    {shortAddress(hash)}
                  </Link>
                </div>
              )}
              {isConfirming && <div>Waiting for confirmation...</div>}
              {isConfirmed && <div>Transaction confirmed.</div>}
              {error && <div>Error: {error.name}</div>}
            </div>
          </form>
        )}
      </div>

      <div>
        <Button
          disabled
          disableRipple
          className="w-[10rem] border border-black bg-[#c2c2c2] data-[pressed=true]:scale-1"
        >
          History
        </Button>
        {isClient && address && <History userAddress={address} />}
      </div>
    </div>
  )
}

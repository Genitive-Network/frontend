'use client'

import ChainSelect from '@/components/ChainSelect'
import { ConnectModal } from '@/components/ConnectModal'
import History from '@/components/History'
import TokenSelect from '@/components/TokenSelect'
import { CHAIN_ID, wagmiConfig, zamaDevnet } from '@/config/wagmiConfig'
import { chainList, tokenList } from '@/constants'
import { usePubkey } from '@/hooks/usePubkey'
import { ChainItem, TokenItem } from '@/types'
import { encryptText } from '@/utils/clientUtils'
import { balanceOfMe, swapAndTransfer } from '@/utils/fhevm'
import { useEthersSigner } from '@/utils/helpers'
import { Button, Link } from '@nextui-org/react'
import Image from 'next/image'
import { useCallback, useEffect, useState, type ChangeEvent } from 'react'
import {
  ContractFunctionExecutionError,
  TransactionExecutionError,
  formatEther,
  formatUnits,
  parseUnits,
} from 'viem'
import { useAccount, useSwitchChain, useWaitForTransactionReceipt } from 'wagmi'
import { GetBalanceReturnType, getGasPrice } from 'wagmi/actions'

export default function Bridge() {
  const [amount, setAmount] = useState('')
  const [balance, setBalance] = useState<GetBalanceReturnType>()

  const [fromChain, setFromChain] = useState(CHAIN_ID.bevmTestnet)
  const [toChain, setToChain] = useState(CHAIN_ID.bitlayerTestnet)

  // const [fromChain, setFromChain] = useState(CHAIN_ID.bitlayerTestnet);
  // const [toChain, setToChain] = useState(CHAIN_ID.bevmTestnet);

  const [token, setToken] = useState<TokenItem>(
    tokenList.find(token => token.chain === fromChain) || tokenList[0],
  )

  const [fee, setFee] = useState('0.00015')
  const [receiveAddress, setReceiveAddress] = useState('')

  const { switchChainAsync } = useSwitchChain()
  const { isConnected, address, chain: connectedChain } = useAccount()

  const signer = useEthersSigner({ chainId: fromChain })

  const transferHandler = async () => {
    if (!fromChainItem || !amount || !signer) return
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

      console.log('encrypt with pubkey: ', pubkey, pubkeyFromGAC)
      await swapAndTransfer(signer, {
        gac: fromChainItem.gac,
        to: encryptText(pubkeyFromGAC, receiveAddress),
        tokenAddressFrom: encryptText(pubkeyFromGAC, token.address),
        tokenAddressTo: encryptText(pubkeyFromGAC, tokenAddressTo),
        amount: encryptText(
          pubkeyFromGAC,
          parseUnits(amount, token.decimals).toString(),
        ),
      })
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

  const updateBalance = useCallback(
    async (chainId: number, token: TokenItem) => {
      if (
        !fromChainItem ||
        !signer ||
        !address ||
        !connectedChain ||
        connectedChain.id === zamaDevnet.id
      )
        return
      setBalance(undefined)

      console.log('get balance from chain:', fromChainItem.value, token)

      const balance = await balanceOfMe(fromChainItem.gac, signer)
      const decryptedBalance = balance === '0x' ? '0' : '' //await decryptText(address, balance)

      console.log('balance:', balance)
      setBalance({
        value: BigInt(decryptedBalance),
        decimals: 18,
        formatted: '',
        symbol: 'eBTC',
      })
    },
    [address, fromChainItem, signer],
  )

  const [pubkeyFromGAC, setPubkeyFromGAC] = useState('')
  const {
    pubkey,
    isPending: isSettingPubkey,
    requestEncryptionKey,
    hash: setPubkeyTxHash,
    pubkeyFromWallet,
  } = usePubkey(fromChainItem, address)
  const { isSuccess: setPubkeySuccess } = useWaitForTransactionReceipt({
    hash: setPubkeyTxHash,
  })
  useEffect(() => {
    if (pubkey) {
      setPubkeyFromGAC(pubkey)
    }
  }, [pubkey])
  useEffect(() => {
    if (setPubkeySuccess) {
      setPubkeyFromGAC(pubkeyFromWallet)
    }
  }, [setPubkeySuccess, pubkeyFromWallet])

  useEffect(() => {
    if (connectedChain && connectedChain.id === zamaDevnet.id) return
    function updateChainAndReceiveAddress() {
      if (isConnected && fromChain && address) {
        if (connectedChain?.id !== fromChain) {
          switchChainAsync({ chainId: fromChain })
        }

        setReceiveAddress(address)

        const tokenItem =
          tokenList.find(token => token.chain === fromChain) || tokenList[0]
        setToken(tokenItem)

        updateBalance(fromChain, tokenItem)
      }

      const gas = getGasPrice(wagmiConfig, { chainId: fromChain })
      gas.then(gas => setFee(formatEther(gas)))
    }
    updateChainAndReceiveAddress()
  }, [
    address,
    connectedChain,
    fromChain,
    isConnected,
    switchChainAsync,
    updateBalance,
  ])

  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])

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
      <div className="border border-black bg-transparent w-[40rem] h-[30rem] rounded-[1rem] mt-[4rem] p-[2rem]">
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
              <div className="flex flex-col w-[12rem] items-end">
                <div className="flex flex-row justify-between w-[100%]">
                  <p>
                    Balance:{' '}
                    {balance
                      ? formatUnits(balance.value, balance.decimals)
                      : ''}
                  </p>
                  {balance && (
                    <p
                      className="cursor-pointer"
                      onClick={() =>
                        setAmount(formatUnits(balance.value, balance.decimals))
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
            {isConnected ? (
              <>
                {!pubkey && !setPubkeySuccess && (
                  <Button
                    isLoading={isSettingPubkey}
                    onClick={requestEncryptionKey}
                    className="mt-4 mr-4 w-[11rem] border border-black"
                    title={`Switch to ${zamaDevnet.name} to generate a public key for encrypting token.`}
                  >
                    {isSettingPubkey ? 'Pending...' : 'Set Public Key'}
                  </Button>
                )}
                <Button
                  className="w-[11rem] border border-black bg-transparent"
                  onPress={e => transferHandler()}
                  isDisabled={
                    !isConnected || !amount || !receiveAddress || !pubkeyFromGAC
                  }
                >
                  Transfer
                </Button>
              </>
            ) : (
              <ConnectModal />
            )}
          </form>
        )}
      </div>
      <div>
        <Button className="w-[10rem] border border-black bg-[#c2c2c2] opacity-60">
          History
        </Button>
        {isClient && address && <History userAddress={address} />}
      </div>
    </div>
  )
}

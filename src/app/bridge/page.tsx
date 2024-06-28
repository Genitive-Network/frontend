'use client';

import ChainSelect from '@/components/ChainSelect';
import TokenSelect from '@/components/TokenSelect';
import { CHAIN_ID, wagmiConfig, } from '@/config/wagmiConfig';
import {
  chainList,
  tokenList
} from '@/constants';
import { ChainItem, TokenItem } from '@/types';
import { balanceOf, getPubkey, init, swapAndTransfer } from '@/utils/fhevm';
import { useEthersSigner } from '@/utils/helpers';
import { Button, Link } from '@nextui-org/react';
import Image from 'next/image';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { ContractFunctionExecutionError, TransactionExecutionError, formatEther, formatUnits, parseUnits } from 'viem';
import { useAccount, useSwitchChain, useWriteContract } from 'wagmi';
import { GetBalanceReturnType, getBalance, getGasPrice } from 'wagmi/actions';

export default function Bridge() {
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState<GetBalanceReturnType>();

  const [fromChain, setFromChain] = useState(CHAIN_ID.bevmTestnet);
  const [toChain, setToChain] = useState(CHAIN_ID.bitlayerTestnet);

  // const [fromChain, setFromChain] = useState(CHAIN_ID.bitlayerTestnet);
  // const [toChain, setToChain] = useState(CHAIN_ID.bevmTestnet);

  const [token, setToken] = useState<TokenItem>(tokenList.find(token => token.chain === fromChain) || tokenList[0]);

  const [fee, setFee] = useState('0.00015');
  const [receiveAddress, setReceiveAddress] = useState('');

  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const { isConnected, address, chain: connectedChain } = useAccount();

  const signer = useEthersSigner({ chainId: fromChain });
  const [initialized, setInitialized] = useState(false);

  // init fhevm instance on page load
  useEffect(() => {
    init()
      .then(() => {
        setInitialized(true);
      })
      .catch((e) => {
        setInitialized(false);
        console.error('Init fhevm error', e);
      });
  }, []);

  const transferHandler = async () => {
    if (!fromChainItem || !amount || !signer) return
    console.log('transfer from bevm', amount, parseUnits(amount, token.decimals));
    try {
      const tokenAddressTo = tokenList.find(token => token.chain === toChain)!.incoAddress;
      await swapAndTransfer(signer, {
        gac: fromChainItem.gac,
        to: receiveAddress,
        tokenAddressFrom: token.incoAddress,
        tokenAddressTo,
        amount: parseUnits(amount, token.decimals)
      })
    } catch (e: unknown) {
      if (e instanceof TransactionExecutionError
        || e instanceof ContractFunctionExecutionError
      ) {
        alert('Transaction failed:' + e.shortMessage)
      }
      console.error('error', e)
    }
    //todo request backend
  };

  const changeFromChain = async (value: number) => {
    setFromChain(value);
    setToChain(chainList.find((chain) => chain.id !== value)!.id);
  };

  const changeToChain = async (value: number) => {
    setToChain(value);
    const fromId = chainList.find((chain) => chain.id !== value)!.id;
    setFromChain(fromId);
  };

  const handleChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    // 使用正则表达式匹配数字和小数点
    const regex = /^\d*\.?\d*$/;
    if (regex.test(inputValue)) {
      setAmount(inputValue);
    }
  };

  const updateBalance = useCallback(async (chainId: number, token: TokenItem) => {
    if (!address) return
    setBalance(undefined)

    console.log('get balance from chain:',
      chainId === CHAIN_ID.bevmTestnet ? 'bevm' : 'fhevm',
      token
    )

    if (fromChain === CHAIN_ID.bevmTestnet) {
      const balance = await getBalance(wagmiConfig, {
        address,
        token: token.address,
        chainId: fromChain
      })

      console.log('balance:', balance)
      setBalance(balance);
    } else if (fromChain === CHAIN_ID.fhevmDevnet && signer) {
      const balance = await balanceOf(signer, token)

      console.log('balance:', balance)
      setBalance(balance);
    }
  }, [address, fromChain, signer]);


  useEffect(() => {

    if (isConnected && fromChain && address) {
      if (connectedChain?.id !== fromChain) {
        switchChainAsync({ chainId: fromChain });
      }

      setReceiveAddress(address);

      const tokenItem = tokenList.find(token => token.chain === fromChain) || tokenList[0]
      setToken(tokenItem)

      updateBalance(fromChain, tokenItem)
    }

    const gas = getGasPrice(wagmiConfig, { chainId: fromChain });
    gas.then((gas) => setFee(formatEther(gas)));
  }, [fromChain, isConnected, address, updateBalance, connectedChain?.id, switchChainAsync]);

  const [fromChainItem, setFromChainItem] = useState<ChainItem>()
  useEffect(() => {
    const item = chainList.find(chain => chain.id === fromChain)
    setFromChainItem(item)
  }, [fromChain])


  useEffect(() => {
    async function pubkey() {
      if (!fromChainItem) return;
      const pubkey = await getPubkey(fromChainItem.gac)
      console.log({ pubkey })

      if (!pubkey) {
        return
      }
    }
    pubkey()
  }, [fromChainItem])

  if (!initialized) return null;


  return (
    <div className="items-center text-center mt-[5rem] text-[2.5rem] text-[#424242] flex flex-col">
      <div className="flex flex-row space-x-16 content-around]">
        <Button className="w-[15rem] border border-black bg-[#c2c2c2] opacity-60">Bridge</Button>
        <Button className="w-[15rem] border border-black bg-transparent">Earn (Coming Soon)</Button>
      </div>
      <div className="border border-black bg-transparent w-[40rem] h-[30rem] rounded-[1rem] mt-[4rem] p-[2rem]">
        <form>
          <div className="flex flex-row justify-between items-end">
            <div>
              <ChainSelect label="From"
                selectedKey={fromChain}
                defaultSelectedKey={fromChain}
                chainList={chainList}
                changeChain={changeFromChain}
              />
              {fromChainItem!.faucet &&
                <Link href={fromChainItem!.faucet} target="_blank" rel="noopener noreferrer" className='absolute' >faucet</Link>
              }
            </div>
            <Image src="transfer_right.svg" alt="right" width="40" height="40" className="" />
            <ChainSelect label="To"
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
                onChange={(e) => {
                  handleChangeAmount(e);
                }}
              />
            </div>
            <div className="flex flex-col w-[12rem] items-end">
              <div className="flex flex-row justify-between w-[100%]">
                <p>Balance: {balance ? formatUnits(balance.value, balance.decimals) : ''}</p>
                {balance && <p className="cursor-pointer" onClick={() => setAmount(formatUnits(balance.value, balance.decimals))}>
                  Max
                </p>}
              </div>

              <TokenSelect
                tokenList={tokenList.filter(token => token.chain === fromChain)}
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
                onChange={(e) => {
                  setReceiveAddress(e.target.value);
                }}
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
            <p className="text-[#c1c1c1]">Total: {amount ? parseFloat(fee) + parseFloat(amount) : fee}</p>
          </div>
          <Button className="w-[11rem] border border-black bg-transparent"
            onPress={(e) => transferHandler()}
            isDisabled={!isConnected || !amount || !receiveAddress}
          >
            Transfer
          </Button>
        </form>
      </div>
      <div>
        <Button className="w-[10rem] border border-black bg-[#c2c2c2] opacity-60">History</Button>
      </div>
    </div>
  );
}
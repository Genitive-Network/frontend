'use client';

import { bevmABI } from '@/abis/bevm';
import { fhevmABI } from '@/abis/fhevm';
import ChainSelect from '@/components/ChainSelect';
import TokenSelect from '@/components/TokenSelect';
import { wagmiConfig } from '@/config/wagmiConfig';
import { BEVM_CONTRACT_ADDRESS, FHEVM_CONTRACT_ADDRESS, chainList, tokenList } from '@/constants';
import { Button } from '@nextui-org/react';
import Image from 'next/image';
import { ChangeEvent, useEffect, useState } from 'react';
import { formatEther } from 'viem';
import { useAccount, useSwitchChain, useWriteContract } from 'wagmi';
import { getBalance } from 'wagmi/actions';

export default function Bridge() {
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState('');
  const [fromChain, setFromChain] = useState(11503);
  const [toChain, setToChain] = useState(8009);
  const [fee, setFee] = useState('0.00015');
  const [receiveAddress, setReceiveAddress] = useState('');

  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const { isConnected, address } = useAccount();

  //todo Need to change abi, address, functionName and args.
  const transferHandler = async () => {
    if (fromChain === 11503) {
      await writeContractAsync({
        abi: bevmABI,
        address: BEVM_CONTRACT_ADDRESS,
        functionName: 'upgradeToAndCall',
        args: ['0xcc0030860577CB392C2104E1AA3EccD17181588C', '0xcc0030860577CB392C2104E1AA3EccD17181588C'],
      });
    } else {
      await writeContractAsync({
        abi: fhevmABI,
        address: FHEVM_CONTRACT_ADDRESS,
        functionName: 'upgradeToAndCall',
        args: ['0xcc0030860577CB392C2104E1AA3EccD17181588C', '0xcc0030860577CB392C2104E1AA3EccD17181588C'],
      });
    }
    //todo request backend
  };

  const changeFromChain = async (value: string) => {
    const chainId = value === 'BEVM' ? 11503 : 8009;
    await switchChainAsync({ chainId: chainId });
    setFromChain(chainId);
  };

  const changeToChain = async (value: string) => {
    const chainId = value === 'BEVM' ? 11503 : 8009;
    setToChain(chainId);
  };

  const handleChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    // 使用正则表达式匹配数字和小数点
    const regex = /^\d*\.?\d*$/;
    if (regex.test(inputValue)) {
      setAmount(inputValue);
    }
  };

  useEffect(() => {
    if (isConnected) {
      const _balance = getBalance(wagmiConfig, { address: address, chainId: fromChain });
      _balance.then((balance) => {
        setBalance(formatEther(balance.value));
      });
    } else {
      setBalance('0');
    }
  }, [fromChain, isConnected, address]);

  return (
    <div className="items-center text-center mt-[5rem] text-[2.5rem] text-[#424242] flex flex-col">
      <div className="flex flex-row space-x-16 content-around]">
        <Button className="w-[15rem] border border-black bg-[#c2c2c2] opacity-60">Bridge</Button>
        <Button className="w-[15rem] border border-black bg-transparent">Earn (Coming Soon)</Button>
      </div>
      <div className="border border-black bg-transparent w-[40rem] h-[30rem] rounded-[1rem] mt-[4rem] p-[2rem]">
        <form>
          <div className="flex flex-row justify-between items-end">
            <ChainSelect label="From" defaultSelectedKey="BEVM" chainList={chainList} changeChain={changeFromChain} />
            <Image src="transfer_right.svg" alt="right" width="40" height="40" className="" />
            <ChainSelect label="To" defaultSelectedKey="FHEVM" chainList={chainList} changeChain={changeToChain} />
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
            <div className="flex flex-col w-[10rem] items-end">
              <div className="flex flex-row justify-between w-[100%]">
                <p>Balance: {balance}</p>
                <p className="cursor-pointer" onClick={() => setAmount(balance)}>
                  Max
                </p>
              </div>

              <TokenSelect tokenList={tokenList} selectedKey={fromChain === 11503 ? 'XBTC' : 'ZAMA'} />
            </div>
          </div>
          <div className="flex flex-row border border-black rounded-lg mt-[1rem] px-[0.5rem] py-[1rem] text-[0.875rem] justify-between">
            <div className="flex flex-col items-start w-[20rem]">
              <p>Recipient Address</p>
              <input
                className="bg-transparent text-[0.75rem] cursor-text focus:outline-none w-[20rem] mt-[0.5rem]"
                placeholder="Connect wallet to receive tokens"
                value={receiveAddress}
                onChange={(e) => {
                  setReceiveAddress(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col w-[10rem] items-end">
              <p className="text-[0.75rem] text-[#c1c1c1]">Est: 20 mins</p>
              <Button className="mt-[0.5rem] border border-black rounded-md w-[8rem] text-left pl-[0.5rem] h-[1.3rem]">
                Connect Wallet
              </Button>
            </div>
          </div>
          <div className="flex flex-row border border-black rounded-lg mt-[1rem] px-[1rem] py-[0.5rem] text-[0.875rem] justify-start ">
            <p className="w-[50%] text-left">Fee: {fee}</p>
            <p className="text-[#c1c1c1]">Total: {amount ? (parseFloat(fee) + parseFloat(amount)).toFixed(5) : fee}</p>
          </div>
          <Button className="w-[11rem] border border-black bg-transparent" onPress={(e) => transferHandler()}>
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

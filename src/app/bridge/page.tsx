'use client';

import ChainSelect from '@/components/ChainSelect';
import TokenSelect from '@/components/TokenSelect';
import { chainList, tokenList } from '@/constants';
import { Button } from '@nextui-org/react';
import Image from 'next/image';
import { useEffect } from 'react';
import { useSwitchChain } from 'wagmi';

export default function Bridge() {
  const { switchChain } = useSwitchChain();

  const transferHandler = () => {
    //todo request backend
  };

  const changeChain = (value: string) => {
    switchChain({ chainId: value === 'BEVM' ? 11503 : 8009 });
  };

  useEffect(() => {}, []);

  return (
    <div className="items-center text-center mt-[5rem] text-[2.5rem] text-[#424242] flex flex-col">
      <div className="flex flex-row space-x-16 content-around]">
        <Button className="w-[15rem] border border-black bg-[#c2c2c2] opacity-60">Bridge</Button>
        <Button className="w-[15rem] border border-black bg-transparent">Earn (Coming Soon)</Button>
      </div>
      <div className="border border-black bg-transparent w-[40rem] h-[30rem] rounded-[1rem] mt-[4rem] p-[2rem]">
        <form>
          <div className="flex flex-row justify-between items-end">
            <ChainSelect label="From" defaultSelectedKey="BEVM" chainList={chainList} changeChain={changeChain} />
            <Image src="transfer_right.svg" alt="right" width="40" height="40" className="" />
            <ChainSelect label="To" defaultSelectedKey="FHEVM" chainList={chainList} />
          </div>
          <div className="flex flex-row border border-black rounded-lg mt-[2rem] px-[0.5rem] py-[1rem] text-[1rem] justify-between">
            <div className="flex flex-col items-start w-[20rem]">
              <p className="">Amount</p>
              <input
                className="bg-transparent text-[1.5rem] text-bold cursor-text focus:outline-none"
                placeholder="0.00"
              />
            </div>
            <div className="flex flex-col w-[10rem] items-end">
              <div className="flex flex-row justify-between w-[100%]">
                <p>Balance: {0}</p>
                <p>Max</p>
              </div>

              <TokenSelect defaultSelectedKey="XBTC" tokenList={tokenList} />
            </div>
          </div>
          <div className="flex flex-row border border-black rounded-lg mt-[1rem] px-[0.5rem] py-[1rem] text-[0.875rem] justify-between">
            <div className="flex flex-col items-start w-[20rem]">
              <p>Recipient Address</p>
              <input
                className="bg-transparent text-[0.75rem] cursor-text focus:outline-none w-[20rem] mt-[0.5rem]"
                placeholder="Connect wallet to receive tokens"
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
            <p className="w-[50%] text-left">Fee: </p>
            <p className="text-[#c1c1c1]">Total:</p>
          </div>
          <Button className="w-[11rem] border border-black bg-transparent" onPressUp={(e) => transferHandler}>
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

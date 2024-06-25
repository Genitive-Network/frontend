"use client";

import React, { useEffect, useState } from "react";
import { Tabs, Tab, Card, CardBody, Button, Input } from "@nextui-org/react";
import { useAccount } from 'wagmi';
import { ConnectModal } from '@/components/ConnectModal';
import { useTokenBalance } from '@/hooks/useBalance';
import { formatUnits } from 'viem';

export default function Wrap({ params }: { params: { slug: string } }) {
  const { isConnected, address, chain } = useAccount();
  const [wrapAmount, setWrapAmount] = useState('');
  const { balance, isLoading, error } = useTokenBalance();
  const [isWrapping, setIsWrapping] = useState(false);

  const setWrapAmountMax = () => {
    console.log('set max', isLoading, error)
    if (!balance) return
    console.log('balance:', formatUnits(balance.value, balance.decimals))
    balance && setWrapAmount(formatUnits(balance.value, balance.decimals))
  }

  return (
    <div className="items-center text-center mt-[5rem] text-[2.5rem] text-[#424242] flex flex-col">
      <h1 className='mb-1 font-bold'>Wrap & Unwrap</h1>
      <p className='mb-2 text-sm'>Wrap token into encrypted token or unwrap encrypted token</p>
      <Tabs size='lg' aria-label="Options">
        <Tab key="Wrap" title="Wrap">
          <div className='bg-white p-8 rounded-3xl'>
            <Input
              placeholder='amount'
              size='lg'
              type='number'
              value={wrapAmount}
              onValueChange={setWrapAmount}
              endContent={<button className="p-2 rounded-md text-xs bg-primary-50 text-primary focus:outline-none" type="button" onClick={setWrapAmountMax}>MAX</button>}
            />

            {isConnected
              ? <Button disabled={!wrapAmount} isLoading={isWrapping}
                variant='shadow' color='primary' className='mt-4 w-full' size='lg'>Wrap</Button>
              : <ConnectModal />}

          </div>
        </Tab>
        <Tab key="Unwrap" title="Unwrap">
          <div>
            unwrap
          </div>
        </Tab>
      </Tabs>

    </div>
  );
}
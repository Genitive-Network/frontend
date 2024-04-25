'use client';

import { Avatar, Button, Select, SelectItem, SelectedItems } from '@nextui-org/react';
import Image from 'next/image';

type ChainItem = {
  label: string;
  value: string;
  icon: string;
};

export default function Bridge() {
  const chainList: ChainItem[] = [{ label: 'BEVM', value: 'BEVM', icon: 'BEVM.svg' }];

  const transferHandler = () => {
    //todo request backend
  };

  return (
    <div className="items-center text-center mt-[5rem] text-[2.5rem] text-[#424242] flex flex-col">
      <div className="flex flex-row space-x-16 content-around]">
        <Button className="w-[15rem] border border-black bg-[#c2c2c2] opacity-60">Bridge</Button>
        <Button className="w-[15rem] border border-black bg-transparent">Earn (Comming Soon)</Button>
      </div>
      <div className="border border-black bg-transparent w-[40rem] h-[30rem] rounded-[1rem] mt-[4rem] p-[2rem]">
        <form>
          <div className="flex flex-row justify-between items-end">
            <Select
              items={chainList}
              labelPlacement="outside"
              label="From"
              placeholder="Select a Chain"
              defaultSelectedKeys={['BEVM']}
              selectorIcon={<Image src="Icon_caret_down.svg" alt="" width="20" height="20" />}
              renderValue={(items: SelectedItems<ChainItem>) => {
                return items.map((item) => (
                  <div key={item.key} className="flex items-center gap-2">
                    <Avatar
                      alt={item.data.value}
                      src={item.data.icon}
                      className="flex-shrink-0 w-[1.5rem] h-[1.5rem]"
                    />
                    <span>{item.data.label}</span>
                  </div>
                ));
              }}
              className="w-[11.4375rem] border border-black rounded-lg opacity-60"
            >
              {(chain) => (
                <SelectItem key={chain.value} textValue={chain.value}>
                  <div className="flex gap-2 items-center">
                    <Avatar alt={chain.value} className="flex-shrink-0 w-[1.5rem] h-[1.5rem]" src={chain.icon} />
                    <span className="text-small">{chain.label}</span>
                  </div>
                </SelectItem>
              )}
            </Select>
            <Image src="transfer_right.svg" alt="right" width="40" height="40" className="" />
            <Select
              items={chainList}
              labelPlacement="outside"
              label="To"
              placeholder="Select a Chain"
              defaultSelectedKeys={['BEVM']}
              selectorIcon={<Image src="Icon_caret_down.svg" alt="" width="20" height="20" />}
              renderValue={(items: SelectedItems<ChainItem>) => {
                return items.map((item) => (
                  <div key={item.key} className="flex items-center gap-2">
                    <Avatar
                      alt={item.data.value}
                      src={item.data.icon}
                      className="flex-shrink-0 w-[1.5rem] h-[1.5rem]"
                    />
                    <span>{item.data.label}</span>
                  </div>
                ));
              }}
              className="w-[11.4375rem] border border-black rounded-lg opacity-60"
            >
              {(chain) => (
                <SelectItem key={chain.value} textValue={chain.value}>
                  <div className="flex gap-2 items-center">
                    <Avatar alt={chain.value} className="flex-shrink-0 w-[1.5rem] h-[1.5rem]" src={chain.icon} />
                    <span className="text-small">{chain.label}</span>
                  </div>
                </SelectItem>
              )}
            </Select>
          </div>
          <div className="flex flex-row border border-black rounded-lg mt-[2rem] px-[0.5rem] py-[1rem] text-[1rem] justify-between">
            <div className="flex flex-col items-start w-[20rem]">
              <p className="">Amount</p>
              <input
                className="bg-transparent text-[1.5rem] text-bold cursor-text focus:outline-none"
                placeholder="0.00"
              />
            </div>
            <div className="flex flex-col w-[10rem]">
              <div className="flex flex-row justify-between">
                <p className="">Balance: {0.0}</p>
                <p className="">Max</p>
              </div>
              <div className="mt-[0.75rem] border border-black rounded-md w-[8rem] text-left pl-[0.5rem]">x-BTC</div>
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

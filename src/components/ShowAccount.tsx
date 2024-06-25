'use client';
import { shortAddress } from '@/utils/helpers';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { useAccount, useDisconnect } from 'wagmi';

export default function ShowAccount() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  return (
    <Dropdown className="bg-[#c2c2c2] min-w-[7.75rem] h-[2.4rem] rounded-lg">
      <DropdownTrigger>
        <Button variant="bordered">{shortAddress(address as `0x${string}`)}</Button>
      </DropdownTrigger>
      <DropdownMenu variant="flat" className="text-center">
        <DropdownItem key="disconnect" onClick={() => disconnect()}>
          Disconnect
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

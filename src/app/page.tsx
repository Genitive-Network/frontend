import { Button } from '@nextui-org/react';
import Image from 'next/image';
export default function Home() {
  return (
    <div className="justify-center items-center text-center mt-[18rem] text-[40px] text-[#424242]">
      <div className="font-medium">Genitive Network</div>
      <div className="mt-[5rem]">The First FHE-based </div>
      <div>Native Bitcoin Layer2 Cross-chain Bridge</div>
      <div className="mt-[50px] ml-[40.5rem] flex items-center">
        <span className="text-[10px] text-[#5c6081] font-light">Powered by</span>
        <div className="flex flex-row ml-[2.875rem]">
          <Image src="zuma.svg" height="50" width="50" alt="ZUMA" />
        </div>
      </div>
      <div className="mt-[4rem] flex justify-center items-center space-x-[2rem]">
        <Button radius="sm" className="w-[19rem] bg-[#c1c1c1] cursor-pointer">
          Airdrop
        </Button>
        <Button radius="sm" className="w-[19rem] bg-[#c1c1c1] cursor-pointer">
          Bridge & Earn
        </Button>
      </div>
    </div>
  );
}

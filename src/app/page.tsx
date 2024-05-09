import { Button } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
export default function Home() {
  return (
    <div className="justify-center items-center text-center mt-[18rem] text-[2.5rem] text-[#424242]">
      <div className="font-medium">Genitive Network</div>
      <div className="mt-[5rem] font-light">The First FHE-based </div>
      <div className="font-light">Native Bitcoin Layer2 Cross-chain Bridge</div>
      <div className="mt-[3.125rem] ml-[-22rem] justify-center flex items-center">
        <span className="text-[10px] text-[#5c6081] font-light">Powered by</span>
        <div className="flex flex-row ml-[2.875rem]">
          <Image src="zuma.svg" height="50" width="50" alt="ZUMA" />
        </div>
      </div>
      <div className="mt-[4rem] flex justify-center items-center space-x-[2rem]">
        <Link href="/"><Button radius="sm" className="w-[19rem] h-[3.3rem] bg-[#c1c1c1] cursor-pointer">Airdrop</Button></Link>
        <Link href="/bridge"><Button radius="sm" className="w-[19rem] h-[3.3rem] bg-[#c1c1c1] cursor-pointer">Bridge & Earn</Button></Link>
      </div>
    </div>
  );
}
import { Button } from '@nextui-org/react'
import Image from 'next/image'
import Link from 'next/link'
export default function Home() {
  return (
    <div className="justify-center items-center text-center mt-[18vh] text-[2.5rem] text-[#424242]">
      <div className="font-medium">Genitive Network</div>
      <div className="mt-[5rem] font-light">The First FHE-based </div>
      <div className="font-light">Native Bitcoin Layer2 Cross-chain Bridge</div>
      <div className="mt-[3.125rem] ml-[-22rem] justify-center flex items-center">
        <span className="text-[10px] text-[#5c6081] font-light">
          Powered by
        </span>
        <div className="flex flex-row ml-12 gap-9">
          <Image
            className="w-auto h-12"
            src="zama.svg"
            height="50"
            width="50"
            alt="ZAMA"
          />
          <Image
            className="w-auto h-12"
            src="inco.svg"
            height="50"
            width="50"
            alt="INCO"
          />
        </div>
      </div>
      <div className="mt-[4rem] flex justify-center items-center space-x-[2rem]">
        {/* <Link href="/#"><Button radius="sm" className="w-[19rem] h-[3.3rem] bg-[#c1c1c1] cursor-pointer">Airdrop</Button></Link> */}
        <Link href="/encrypt">
          <Button
            radius="sm"
            className="w-[19rem] h-[3.3rem] bg-[#c1c1c1] cursor-pointer"
          >
            Launch Dapp
          </Button>
        </Link>
      </div>
    </div>
  )
}

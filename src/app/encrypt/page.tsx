'use client'

import Wrap from '@/components/Wrap'
import { Tab, Tabs } from '@nextui-org/react'

export default function EncryptPage({ params }: { params: { slug: string } }) {
  return (
    <div className="items-center text-center mt-[5rem] text-[2.5rem] text-[#424242] flex flex-col">
      <h1 className="mb-1 font-bold">Encrypt & Decrypt</h1>
      <p className="mb-2 text-sm">
        balance WBTC encrypted for cross-chain bridge
      </p>
      <Tabs
        size="lg"
        variant="bordered"
        radius="full"
        color="default"
        aria-label="Options"
        className="font-bold"
        classNames={{
          tabList: 'p-0 bg-primary border-0 mb-4',
          tab: 'text-xs px-8',
          tabContent: 'text-white',
          panel: 'p-1 w-full md:w-3/5 lg:w-1/2 xl:w-1/3',
        }}
      >
        <Tab key="Encrypt" title="Encrypt">
          <Wrap tab="Encrypt" />
        </Tab>

        <Tab key="Decrypt" title="Decrypt">
          <Wrap tab="Decrypt" />
        </Tab>
      </Tabs>
    </div>
  )
}

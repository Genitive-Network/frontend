'use client'
import { ChainItem } from '@/types'
import { Avatar, Select, SelectItem, SelectedItems } from '@nextui-org/react'
import Image from 'next/image'

export default function ChainSelect({
  chainList,
  label,
  selectedKey,
  defaultSelectedKey,
  changeChain = () => {},
}: {
  chainList: ChainItem[]
  label: string
  selectedKey: number
  defaultSelectedKey: number
  changeChain?: Function
}) {
  return (
    <Select
      as="div"
      onChange={e => {
        changeChain(parseInt(e.target.value, 10))
      }}
      items={chainList}
      labelPlacement="outside"
      label={label}
      aria-label="Select a Chain"
      placeholder="Select a Chain"
      selectedKeys={[selectedKey]}
      defaultSelectedKeys={[defaultSelectedKey]}
      selectorIcon={
        <Image src="/Icon_caret_down.svg" alt="" width="20" height="20" />
      }
      renderValue={(items: SelectedItems<ChainItem>) => {
        return items.map(item => (
          <div key={item.key} className="flex items-center gap-2">
            <Avatar
              alt={item.data?.value}
              src={item.data?.icon}
              className="flex-shrink-0 w-4 h-4"
            />
            <span className="text-medium">{item.data?.label}</span>
          </div>
        ))
      }}
      classNames={{
        base: ['w-[11.4375rem]'],
        trigger: ['min-h-8 h-8 bg-transparent border border-black rounded-lg'],
      }}
    >
      {chain => (
        <SelectItem key={chain.id} textValue={chain.value}>
          <div className="flex gap-2 items-center">
            <Avatar
              alt={chain.value}
              src={chain.icon}
              className="flex-shrink-0 w-4 h-4"
            />
            <span className="text-small">{chain.label}</span>
          </div>
        </SelectItem>
      )}
    </Select>
  )
}

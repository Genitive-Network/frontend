import { ChainItem } from '@/types';
import { Avatar, Select, SelectItem, SelectedItems } from '@nextui-org/react';
import Image from 'next/image';

export default function ChainSelect({
  chainList,
  label,
  defaultSelectedKey,
}: {
  chainList: ChainItem[];
  label: string;
  defaultSelectedKey: string;
}) {
  return (
    <Select
      items={chainList}
      labelPlacement="outside"
      label={label}
      placeholder="Select a Chain"
      defaultSelectedKeys={[defaultSelectedKey]}
      selectorIcon={<Image src="Icon_caret_down.svg" alt="" width="20" height="20" />}
      renderValue={(items: SelectedItems<ChainItem>) => {
        return items.map((item) => (
          <div key={item.key} className="flex items-center gap-2">
            <Avatar alt={item.data?.value} src={item.data?.icon} className="flex-shrink-0 w-[1.5rem] h-[1.5rem]" />
            <span className="text-medium">{item.data?.label}</span>
          </div>
        ));
      }}
      classNames={{ base: ['w-[11.4375rem]'], trigger: ['bg-transparent border border-black rounded-lg'] }}
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
  );
}

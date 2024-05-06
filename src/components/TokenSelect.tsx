import { TokenItem } from '@/types';
import { Select, SelectItem, SelectedItems } from '@nextui-org/react';

export default function TokenSelect({ tokenList, selectedKey }: { tokenList: TokenItem[]; selectedKey: string }) {
  return (
    <Select
      items={tokenList}
      placeholder="Select a Token"
      aria-label="Select a Token"
      selectedKeys={[selectedKey]}
      selectorIcon={<></>}
      renderValue={(items: SelectedItems<TokenItem>) => {
        return items.map((item) => (
          <div key={item.key} className="flex items-center gap-2">
            <span className="pl-[0.5rem] text-medium">{item.textValue}</span>
          </div>
        ));
      }}
      classNames={{ base: ['w-[8rem] mt-3 self-start'], trigger: ['bg-transparent border border-black rounded-lg'] }}
    >
      {tokenList.map((token) => (
        <SelectItem key={token.value} textValue={token.label} aria-label={token.label} className="w-full bg-white">
          <div className="flex text-lg pl-[0.5rem]">
            <span className="block text-medium text-left">{token.label}</span>
          </div>
        </SelectItem>
      ))}
    </Select>
  );
}

import { TokenItem } from '@/types';
import { Select, SelectItem, SelectedItems } from '@nextui-org/react';

export default function TokenSelect({ tokenList, selectedToken, changeToken = () => {} } : {
  tokenList: TokenItem[];
  selectedToken: TokenItem;
  changeToken?: (token: TokenItem['value']) => void;
}) {
  return (
    <Select
      items={tokenList}
      onChange={(e) => {
        changeToken(e.target.value);
      }}
      placeholder="Select a Token"
      aria-label="Select a Token"
      selectedKeys={[selectedToken.value]}
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
        <SelectItem key={token.value} textValue={token.symbol} aria-label={token.symbol} className="w-full bg-white">
          <div className="flex text-lg pl-[0.5rem]">
            <span className="block text-medium text-left">{token.symbol}</span>
          </div>
        </SelectItem>
      ))}
    </Select>
  );
}

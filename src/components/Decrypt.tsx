import { Tab } from '@nextui-org/react'

type DecryptProps = {
  address?: string
}
const Decrypt: React.FC<DecryptProps> = ({ address }) => {
  return (
    <Tab key="Decrypt" title="Decrypt">
      <div>Decrypt</div>
    </Tab>
  )
}

export default Decrypt

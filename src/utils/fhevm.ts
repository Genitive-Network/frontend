import { CHAIN_ID } from '@/config/wagmiConfig'
import { gacABI } from '@/constants/abi'
import { JsonRpcSigner, ethers } from 'ethers'
import {
  createInstance,
  getPublicKeyCallParams,
  type FhevmInstance,
} from 'fhevmjs'
import { formatUnits } from 'viem'
import { base64ToBytes32 } from './helpers'

let instance: FhevmInstance

export const createFhevmInstance = async (
  provider: ethers.JsonRpcProvider | ethers.FallbackProvider,
) => {
  // 1. Get the chain id
  // const provider = new BrowserProvider(window.ethereum);
  // const network = await provider.getNetwork()
  const chainId = CHAIN_ID.incoTestnet

  // 2. Fetch the FHE public key from the blockchain
  const ret = await provider.call(getPublicKeyCallParams())
  // console.log('public key ret from blockchain:', ret)

  if (ret === '0x') {
    throw 'Failed to get FHE public key from the blockchain'
  }

  // TODO investigate RangeError: data out-of-bounds here
  const decoded = ethers.AbiCoder.defaultAbiCoder().decode(['bytes'], ret)
  const publicKey = decoded[0]

  // 3. Create the fhevm_instance
  instance = await createInstance({ chainId, publicKey })
  return instance
}

export const getSignature = async (
  instance: FhevmInstance,
  contractAddress: string,
  userAddress: string,
) => {
  if (instance.hasKeypair(contractAddress)) {
    return instance.getPublicKey(contractAddress)!
  } else {
    const { publicKey, eip712 } = instance.generatePublicKey({
      verifyingContract: contractAddress,
    })

    console.log({ publicKey, eip712 })

    const params = [userAddress, JSON.stringify(eip712)]
    const signature: string = await window.ethereum.request({
      method: 'eth_signTypedData_v4',
      params,
    })
    instance.setSignature(contractAddress, signature)
    return { signature, publicKey }
  }
}

// export async function balanceOfMe(token: TokenItem) {
//   const contract = new ethers.Contract(token.address, token.abi, signer)
//   console.log('balanceOfMe encrypted:', await contract.balanceOfMe())
//   const balance = (await getInstance()).decrypt(
//     token.address,
//     await contract.balanceOfMe(),
//   )
//   const decimals = Number(await contract.decimals())

//   return {
//     value: balance,
//     decimals,
//     symbol: await contract.symbol(),
//     formatted: formatUnits(balance, decimals),
//   }
// }

export async function swapAndTransfer(
  signer: JsonRpcSigner,
  instance: FhevmInstance,
  params: {
    gac: string
    to: string
    tokenAddressFrom: string
    tokenAddressTo: string
    amount: bigint
  },
) {
  const { gac, to, tokenAddressFrom, tokenAddressTo, amount } = params
  const contract = new ethers.Contract(gac, gacABI, signer)

  const eTo = instance.encryptAddress(to)
  const eTokenAddressFrom = instance.encryptAddress(tokenAddressFrom)
  const eTokenAddressTo = instance.encryptAddress(tokenAddressTo)
  const eAmount = instance.encrypt64(amount)
  return await contract.swapAndTransfer(
    eTo,
    eTokenAddressFrom,
    eTokenAddressTo,
    eAmount,
  )
}

export async function getContractPubkey(gac: string, signer: JsonRpcSigner) {
  const contract = new ethers.Contract(gac, gacABI, signer)
  console.log('pubkey: ', await contract.getPubkey())
  return await contract.getPubkey()
}
export async function setContractPubkey(
  pubkey: string,
  gac: string,
  signer: JsonRpcSigner,
) {
  const contract = new ethers.Contract(gac, gacABI, signer)
  const pubkeyBytes = base64ToBytes32(pubkey)
  console.log(
    'pubkey in bytes: ',
    pubkeyBytes,
    await contract.setPubkey(pubkeyBytes),
  )
  return await contract.setPubkey(pubkeyBytes)
}

export async function balanceOfMe(
  gac: string,
  decimals: number,
  signer: JsonRpcSigner,
) {
  const contract = new ethers.Contract(gac, gacABI, signer)
  console.log('balanceOfMe: ', await contract.balanceOfMe())
  const balance = await contract.balanceOfMe()

  return {
    value: balance,
    decimals,
    symbol: 'eBTC',
    formatted: formatUnits(balance, decimals),
  }
}

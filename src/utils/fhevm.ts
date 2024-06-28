import { CHAIN_ID } from '@/config/wagmiConfig'
import { gacABI } from '@/constants'
import { JsonRpcSigner, ethers } from 'ethers'
import {
  createInstance,
  getPublicKeyCallParams,
  type FhevmInstance
} from 'fhevmjs'
import { formatUnits } from 'viem'

let instance: FhevmInstance

export const createFhevmInstance = async (provider: ethers.JsonRpcProvider | ethers.FallbackProvider) => {
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

export async function getPubkey(gac: string, signer: JsonRpcSigner) {
  const contract = new ethers.Contract(gac, gacABI, signer)
  console.log('pubkey: ', await contract.getPubkey())
  return await contract.getPubkey()
}

export async function balanceOfMe(gac: string, decimals: number, signer: JsonRpcSigner, instance: FhevmInstance) {
  const contract = new ethers.Contract(gac, gacABI, signer)
  console.log('balanceOfMe: ', await contract.balanceOfMe())
  const encryptedBalance = await contract.balanceOfMe()
  const balance = instance.decrypt(gac, encryptedBalance)

  return {
    value: balance,
    decimals,
    symbol: await contract.symbol(),
    formatted: formatUnits(balance, decimals),
  }
}

export async function getReencryptPublicKey(instance: FhevmInstance, userAddress: `0x${string}`, contractAddress: string, chainId: number) {
  if (!instance.hasKeypair(contractAddress)) {
    const eip712Domain = {
      // Give a user-friendly name to the specific contract you're signing for.
      // This must match the EIP712WithModifier string in the contract constructor.
      name: 'Authorization token',
      // This identifies the latest version.
      // This must match the EIP712WithModifier version in the contract constructor.
      version: '1',
      // This defines the network, in this case, Gentry Testnet.
      chainId,
      // Add a verifying contract to make sure you're establishing contracts with the proper entity.
      verifyingContract: contractAddress,
    }
  
    const reencryption = instance.generatePublicKey(eip712Domain);
   
    const params = [userAddress, JSON.stringify(reencryption.eip712)];
    const sig = window.ethereum.request({
      method: "eth_signTypedData_v4",
      params,
    });
    
    instance.setSignature(contractAddress, sig);
  }

  return instance.getPublicKey(contractAddress);
}
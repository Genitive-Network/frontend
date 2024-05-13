import { BrowserProvider, AbiCoder, ethers, JsonRpcSigner } from "ethers";
import { initFhevm, createInstance, FhevmInstance, getPublicKeyCallParams } from "fhevmjs";
import { GetFhevmTokenBalanceParameters, TokenItem } from '@/types';
import { tokenList } from '@/constants';
import { formatUnits } from 'viem';

export const init = async () => {
  await initFhevm();
};

let instance: FhevmInstance;

export const createFhevmInstance = async () => {
  // 1. Get the chain id
  const provider = new BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();
  const chainId = +network.chainId.toString();

  // 2. Fetch the FHE public key from the blockchain
  const ret = await provider.call(getPublicKeyCallParams());
  // TODO investigate RangeError: data out-of-bounds here
  const decoded = ethers.AbiCoder.defaultAbiCoder().decode(["bytes"], ret);
  const publicKey = decoded[0];

  // 3. Create the fhevm_instance
  instance = await createInstance({ chainId, publicKey });
  return instance;
};

export const getInstance = async () => {
  if (instance) {
    return instance;
  }

  instance = await createFhevmInstance();
  return instance;
};

export const getSignature = async (
  contractAddress: string,
  userAddress: string
) => {
  const instance = await getInstance();
  
  if (instance.hasKeypair(contractAddress)) {
    return instance.getPublicKey(contractAddress)!;
  } else {
    const { publicKey, eip712 } = instance.generatePublicKey({
      verifyingContract: contractAddress,
    });

    console.log({ publicKey, eip712 })

    const params = [userAddress, JSON.stringify(eip712)];
    const signature: string = await window.ethereum.request({
      method: "eth_signTypedData_v4",
      params,
    });
    instance.setSignature(contractAddress, signature);
    return { signature, publicKey };
  }
};

export async function balanceOf(
  signer: JsonRpcSigner,
  token: TokenItem
) {
  let { publicKey, signature } = await getSignature(token.address, signer.address);

  const contract = new ethers.Contract(token.address, token.abi, signer);
  const balance = (await getInstance()).decrypt(token.address, await contract.balanceOf(signer.address, publicKey, signature));
  const decimals = Number(await contract.decimals());

  return {
    value: balance,
    decimals,
    symbol: await contract.symbol(),
    formatted: formatUnits(balance, decimals)
  }
}

export async function balanceOfMe(
  signer: JsonRpcSigner,
  token: TokenItem,
) {
  const contract = new ethers.Contract(token.address, token.abi, signer);
  const balance = (await getInstance()).decrypt(token.address, await contract.balanceOfMe());
  const decimals = Number(await contract.decimals());

  return {
    value: balance,
    decimals,
    symbol: await contract.symbol(),
    formatted: formatUnits(balance, decimals)
  }
}

export async function transfer(signer: JsonRpcSigner, token: TokenItem, to: string, amount: bigint) {
  const contract = new ethers.Contract(token.address, token.abi, signer);
  let encryptedAmount = (await getInstance()).encrypt64(amount);
  return await contract.transfer(to, encryptedAmount);
}
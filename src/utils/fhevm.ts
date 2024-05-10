import { BrowserProvider, AbiCoder, ethers } from "ethers";
import { initFhevm, createInstance, FhevmInstance, getPublicKeyCallParams } from "fhevmjs";
import { GetFhevmTokenBalanceParameters } from '@/types';
import { tokenList } from '@/constants';
import { formatUnits } from 'viem';

const FHE_LIB_ADDRESS = "0x000000000000000000000000000000000000005d";

export const init = async () => {
  await initFhevm();
  await createFhevmInstance();
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
};

export const getInstance = () => {
  return instance;
};

export const getSignature = async (
  contractAddress: string,
  userAddress: string
) => {
  const instance = getInstance();
  if (!instance) {
    await init();
  }
  if (getInstance().hasKeypair(contractAddress)) {
    return getInstance().getPublicKey(contractAddress)!;
  } else {
    const { publicKey, eip712 } = getInstance().generatePublicKey({
      verifyingContract: contractAddress,
    });

    console.log({ publicKey, eip712 })

    const params = [userAddress, JSON.stringify(eip712)];
    const signature: string = await window.ethereum.request({
      method: "eth_signTypedData_v4",
      params,
    });
    getInstance().setSignature(contractAddress, signature);
    return { signature, publicKey };
  }
};

export async function getFhevmTokenBalance(
  signer: ethers.JsonRpcSigner,
  parameters: GetFhevmTokenBalanceParameters,
) {
  const { balanceAddress, tokenAddress } = parameters

  let { publicKey, signature } = await getSignature(tokenAddress, balanceAddress);

  const token = tokenList.find((token) => token.address === tokenAddress);
  if (!token) {
    throw new Error(`Token not found: ${tokenAddress}`);
  }

  const contract = new ethers.Contract(tokenAddress, token.abi, signer);
  const balance = getInstance().decrypt(tokenAddress, await contract.balanceOf(balanceAddress, publicKey, signature));
  const decimals = Number(await contract.decimals());

  return {
    value: balance,
    decimals,
    symbol: await contract.symbol(),
    formatted: formatUnits(balance, decimals)
  }
}

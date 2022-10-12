import { ethers } from "ethers";

/**
 * Get the revert reason from just a transaction hash
 * @param {string} txHash - Hash of an Ethereum transaction
 * @param {string} network - Ethereum network name（Currently only supports Ethereum network.If it is a network on Arbitrum or Optimism or Polygon, please use customProvider）
 * @param {*} customProvider - Custom provider (Only ethers and web3 providers are supported at this time)
 */

async function getRevertReason(
  txHash: string,
  network: string | undefined = undefined,
  customProvider: any = undefined
) {
  ({ network } = normalizeInput(network));

  const provider = await validateInputPreProvider(
    txHash,
    network,
    customProvider
  );

  try {
    const tx = await provider.getTransaction(txHash);
    const code = await getCode(tx, provider);
    return decodeMessage(code);
  } catch (err) {
    throw new Error("Unable to decode revert reason.");
  }
}

function normalizeInput(network: string | undefined): {
  network: string | undefined;
} {
  return {
    network: network !== undefined ? network.toLowerCase() : undefined,
  };
}

async function validateInputPreProvider(
  txHash: string,
  network: string | undefined,
  customProvider: any
): Promise<any> {
  // Only accept a valid txHash
  if (
    !/^0x([A-Fa-f0-9]{64})$/.test(txHash) ||
    txHash.substring(0, 2) !== "0x"
  ) {
    throw new Error("Invalid transaction hash");
  }
  if (network === undefined && customProvider === undefined) {
    throw new Error("Please provide a network or customize customProvider");
  }
  let provider = undefined;
  if (network !== undefined) {
    // mainnet,goerli
    const networks: string[] = ["mainnet", "goerli"];
    if (!networks.indexOf(network)) {
      throw new Error("Not a valid network");
    }
    provider = ethers.getDefaultProvider(network);
  } else {
    // web3
    if (customProvider.version) {
      provider = new ethers.providers.Web3Provider(
        customProvider.currentProvider
      );
    }
  }

  return customProvider || provider;
}

function decodeMessage(code: string): string {
  let codeString = `0x${code.substring(138)}`.replace(/0+$/, "");

  // If the codeString is an odd number of characters, add a trailing 0
  if (codeString.length % 2 === 1) {
    codeString += "0";
  }

  return ethers.utils.toUtf8String(codeString);
}

async function getCode(tx: any, provider: any): Promise<string> {
  try {
    // NOTE: The await is intentional in order for the catch to work
    return await provider.call(tx, tx.blockNumber);
  } catch (err: any) {
    return JSON.parse(err.responseText).error.data;
  }
}

export { getRevertReason };

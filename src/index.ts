/*
 * @Author: changsheng 2642799676@qq.com
 * @Date: 2022-10-11 16:04:13
 * @LastEditors: changsheng 2642799676@qq.com
 * @LastEditTime: 2022-10-13 18:01:04
 * @FilePath: /revert-reason/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ethers } from "ethers";
import { Deferrable } from "ethers/lib/utils";
import {
  CompatibleNetworkId,
  EthereumNetworkId,
  OneTransactionResponse,
  SupportNetworks,
  TwoTransactionResponse,
} from "./entities/network";
import {
  TransactionHash,
  Providers,
  NetworkId,
  TransactionResponse,
  DecodeMessage,
  NetworkOrProvider,
  TransactionRequest,
  TransactionReceipt,
} from "./utils/type";

/**
 * Get the revert reason from just a transaction hash
 * @param {TransactionHash} TransactionHash - Hash of an Ethereum transaction
 * @param {NetworkOrProvider} NetworkOrProvider
 */
async function getRevertReason(
  TransactionHash: TransactionHash,
  NetworkOrProvider: NetworkOrProvider
): Promise<DecodeMessage> {
  const provider: Providers = await validateInputPreProvider(
    TransactionHash,
    NetworkOrProvider
  );

  try {
    const TransactionReceipt: TransactionReceipt =
      await provider.getTransactionReceipt(TransactionHash);
    let decode: DecodeMessage;
    if (TransactionReceipt.status !== 0) {
      decode = "success";
    } else {
      const TransactionResponse: TransactionResponse =
        await provider.getTransaction(TransactionHash);
      const code: DecodeMessage = await getCode(TransactionResponse, provider);
      decode = decodeMessage(code);
    }
    return processResult(decode);
  } catch (err) {
    throw new Error("Unable to decode revert reason.");
  }
}

async function validateInputPreProvider(
  txHash: TransactionHash,
  NetworkOrProvider: NetworkOrProvider
): Promise<Providers> {
  // Only accept a valid txHash
  if (
    !/^0x([A-Fa-f0-9]{64})$/.test(txHash) ||
    txHash.substring(0, 2) !== "0x"
  ) {
    throw new Error("Invalid transaction hash");
  }
  if (NetworkOrProvider.Network && NetworkOrProvider.CustomProvider) {
    throw new Error("Please provide a network or customize customProvider");
  }
  if (NetworkOrProvider.Network) {
    NetworkOrProvider.Network = NetworkOrProvider.Network.toLowerCase();
    if (!SupportNetworks.indexOf(NetworkOrProvider.Network)) {
      throw new Error("Not a valid network");
    }
    NetworkOrProvider.CustomProvider = ethers.getDefaultProvider(
      NetworkOrProvider.Network
    );
  }
  // Todo support Web3
  // if (NetworkOrProvider.Network) {
  //   if (!SupportNetworks.indexOf(NetworkOrProvider.Network)) {
  //     throw new Error("Not a valid network");
  //   }
  //   provider = ethers.getDefaultProvider(NetworkOrProvider.Network);
  // } else if(NetworkOrProvider.CustomProvider){
  //   // web3
  //   if (NetworkOrProvider.CustomProvider.version) {
  //     provider = new ethers.providers.Web3Provider(
  //       NetworkOrProvider.CustomProvider.currentProvider
  //     );
  //   }
  // }

  return NetworkOrProvider.CustomProvider as Providers;
}

function decodeMessage(code: DecodeMessage): DecodeMessage {
  let codeString: DecodeMessage;
  if (code.substring(0, 2) === "0x") {
    codeString = `0x${code.substring(138)}`.replace(/0+$/, "");
    // If the codeString is an odd number of characters, add a trailing 0
    if (codeString.length % 2 === 1) {
      codeString += "0";
    }
    codeString = ethers.utils.toUtf8String(codeString);
  } else {
    codeString = code.substring(20);
  }

  return codeString;
}

async function getCode(
  TransactionResponse: TransactionResponse,
  provider: Providers
): Promise<DecodeMessage> {
  const chainId: NetworkId = (await provider.getNetwork()).chainId;
  try {
    let executeTransactionRequest: Deferrable<TransactionRequest> = {};
    if (OneTransactionResponse.indexOf(chainId) !== -1) {
      //op
      executeTransactionRequest =
        TransactionResponse as Deferrable<TransactionRequest>;
    } else if (TwoTransactionResponse.indexOf(chainId) !== -1) {
      //ethereum || arb
      executeTransactionRequest = {
        to: TransactionResponse.to,
        data: TransactionResponse.data,
        value: TransactionResponse.value,
      };
    }
    // NOTE: The await is intentional in order for the catch to work
    return await provider.call(
      executeTransactionRequest,
      TransactionResponse.blockNumber
    );
  } catch (err: any) {
    let responseCode: DecodeMessage = "";
    if (EthereumNetworkId.indexOf(chainId) !== -1) {
      responseCode =
        JSON.parse(err.responseText).error.data === undefined
          ? JSON.parse(err.responseText).error.message
          : JSON.parse(err.responseText).error.data;
    } else if (CompatibleNetworkId.indexOf(chainId) !== -1) {
      responseCode = JSON.parse(err.error.body).error.message;
    }
    return responseCode;
  }
}
function processResult(decodeMessage: DecodeMessage): DecodeMessage {
  let result: DecodeMessage;
  if (decodeMessage === "") {
    result = "An error occurred but no error message was given.";
  } else if (decodeMessage === "success") {
    result = "success";
  } else {
    result = decodeMessage;
  }
  return result;
}
export { getRevertReason };

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRevertReason = void 0;
/*
 * @Author: changsheng 2642799676@qq.com
 * @Date: 2022-10-11 16:04:13
 * @LastEditors: changsheng 2642799676@qq.com
 * @LastEditTime: 2022-10-13 18:01:04
 * @FilePath: /revert-reason/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const ethers_1 = require("ethers");
const network_1 = require("./entities/network");
/**
 * Get the revert reason from just a transaction hash
 * @param {TransactionHash} TransactionHash - Hash of an Ethereum transaction
 * @param {NetworkOrProvider} NetworkOrProvider
 */
function getRevertReason(TransactionHash, NetworkOrProvider) {
    return __awaiter(this, void 0, void 0, function* () {
        const provider = yield validateInputPreProvider(TransactionHash, NetworkOrProvider);
        try {
            const TransactionReceipt = yield provider.getTransactionReceipt(TransactionHash);
            let decode;
            if (TransactionReceipt.status !== 0) {
                decode = "success";
            }
            else {
                const TransactionResponse = yield provider.getTransaction(TransactionHash);
                const code = yield getCode(TransactionResponse, provider);
                decode = decodeMessage(code);
            }
            return processResult(decode);
        }
        catch (err) {
            throw new Error("Unable to decode revert reason.");
        }
    });
}
exports.getRevertReason = getRevertReason;
function validateInputPreProvider(txHash, NetworkOrProvider) {
    return __awaiter(this, void 0, void 0, function* () {
        // Only accept a valid txHash
        if (!/^0x([A-Fa-f0-9]{64})$/.test(txHash) ||
            txHash.substring(0, 2) !== "0x") {
            throw new Error("Invalid transaction hash");
        }
        if (NetworkOrProvider.Network && NetworkOrProvider.CustomProvider) {
            throw new Error("Please provide a network or customize customProvider");
        }
        if (NetworkOrProvider.Network) {
            NetworkOrProvider.Network = NetworkOrProvider.Network.toLowerCase();
            if (!network_1.SupportNetworks.indexOf(NetworkOrProvider.Network)) {
                throw new Error("Not a valid network");
            }
            NetworkOrProvider.CustomProvider = ethers_1.ethers.getDefaultProvider(NetworkOrProvider.Network);
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
        return NetworkOrProvider.CustomProvider;
    });
}
function decodeMessage(code) {
    let codeString;
    if (code.substring(0, 2) === "0x") {
        codeString = `0x${code.substring(138)}`.replace(/0+$/, "");
        // If the codeString is an odd number of characters, add a trailing 0
        if (codeString.length % 2 === 1) {
            codeString += "0";
        }
        codeString = ethers_1.ethers.utils.toUtf8String(codeString);
    }
    else {
        codeString = code.substring(20);
    }
    return codeString;
}
function getCode(TransactionResponse, provider) {
    return __awaiter(this, void 0, void 0, function* () {
        const chainId = (yield provider.getNetwork()).chainId;
        try {
            let executeTransactionRequest = {};
            if (network_1.OneTransactionResponse.indexOf(chainId) !== -1) {
                //op
                executeTransactionRequest =
                    TransactionResponse;
            }
            else if (network_1.TwoTransactionResponse.indexOf(chainId) !== -1) {
                //ethereum || arb
                executeTransactionRequest = {
                    to: TransactionResponse.to,
                    data: TransactionResponse.data,
                    value: TransactionResponse.value,
                };
            }
            // NOTE: The await is intentional in order for the catch to work
            return yield provider.call(executeTransactionRequest, TransactionResponse.blockNumber);
        }
        catch (err) {
            let responseCode = "";
            if (network_1.EthereumNetworkId.indexOf(chainId) !== -1) {
                responseCode =
                    JSON.parse(err.responseText).error.data === undefined
                        ? JSON.parse(err.responseText).error.message
                        : JSON.parse(err.responseText).error.data;
            }
            else if (network_1.CompatibleNetworkId.indexOf(chainId) !== -1) {
                responseCode = JSON.parse(err.error.body).error.message;
            }
            return responseCode;
        }
    });
}
function processResult(decodeMessage) {
    let result;
    if (decodeMessage === "") {
        result = "An error occurred but no error message was given.";
    }
    else if (decodeMessage === "success") {
        result = "success";
    }
    else {
        result = decodeMessage;
    }
    return result;
}
//# sourceMappingURL=index.js.map
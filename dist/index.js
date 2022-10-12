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
const ethers_1 = require("ethers");
/**
 * Get the revert reason from just a transaction hash
 * @param {string} txHash - Hash of an Ethereum transaction
 * @param {string} network - Ethereum network name（Currently only supports Ethereum network.If it is a network on Arbitrum or Optimism or Polygon, please use customProvider）
 * @param {*} customProvider - Custom provider (Only ethers and web3 providers are supported at this time)
 */
function getRevertReason(txHash, network = undefined, customProvider = undefined) {
    return __awaiter(this, void 0, void 0, function* () {
        ({ network } = normalizeInput(network));
        const provider = yield validateInputPreProvider(txHash, network, customProvider);
        try {
            const tx = yield provider.getTransaction(txHash);
            const code = yield getCode(tx, provider);
            return decodeMessage(code);
        }
        catch (err) {
            throw new Error("Unable to decode revert reason.");
        }
    });
}
exports.getRevertReason = getRevertReason;
function normalizeInput(network) {
    return {
        network: network !== undefined ? network.toLowerCase() : undefined,
    };
}
function validateInputPreProvider(txHash, network, customProvider) {
    return __awaiter(this, void 0, void 0, function* () {
        // Only accept a valid txHash
        if (!/^0x([A-Fa-f0-9]{64})$/.test(txHash) ||
            txHash.substring(0, 2) !== "0x") {
            throw new Error("Invalid transaction hash");
        }
        if (network === undefined && customProvider === undefined) {
            throw new Error("Please provide a network or customize customProvider");
        }
        let provider = undefined;
        if (network !== undefined) {
            // mainnet,goerli
            const networks = ["mainnet", "goerli"];
            if (!networks.indexOf(network)) {
                throw new Error("Not a valid network");
            }
            provider = ethers_1.ethers.getDefaultProvider(network);
        }
        else {
            // web3
            if (customProvider.version) {
                provider = new ethers_1.ethers.providers.Web3Provider(customProvider.currentProvider);
            }
        }
        return customProvider || provider;
    });
}
function decodeMessage(code) {
    let codeString = `0x${code.substring(138)}`.replace(/0+$/, "");
    // If the codeString is an odd number of characters, add a trailing 0
    if (codeString.length % 2 === 1) {
        codeString += "0";
    }
    return ethers_1.ethers.utils.toUtf8String(codeString);
}
function getCode(tx, provider) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // NOTE: The await is intentional in order for the catch to work
            return yield provider.call(tx, tx.blockNumber);
        }
        catch (err) {
            return JSON.parse(err.responseText).error.data;
        }
    });
}
//# sourceMappingURL=index.js.map
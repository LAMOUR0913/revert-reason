/**
 * Get the revert reason from just a transaction hash
 * @param {string} txHash - Hash of an Ethereum transaction
 * @param {string} network - Ethereum network name（Currently only supports Ethereum network.If it is a network on Arbitrum or Optimism or Polygon, please use customProvider）
 * @param {*} customProvider - Custom provider (Only ethers and web3 providers are supported at this time)
 */
declare function getRevertReason(txHash: string, network?: string | undefined, customProvider?: any): Promise<string>;
export { getRevertReason };
//# sourceMappingURL=index.d.ts.map
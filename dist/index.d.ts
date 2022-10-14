import { TransactionHash, DecodeMessage, NetworkOrProvider } from "./utils/type";
/**
 * Get the revert reason from just a transaction hash
 * @param {TransactionHash} TransactionHash - Hash of an Ethereum transaction
 * @param {NetworkOrProvider} NetworkOrProvider
 */
declare function getRevertReason(TransactionHash: TransactionHash, NetworkOrProvider: NetworkOrProvider): Promise<DecodeMessage>;
export { getRevertReason };
//# sourceMappingURL=index.d.ts.map
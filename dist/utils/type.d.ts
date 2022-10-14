import { providers } from "ethers";
declare type TransactionResponse = providers.TransactionResponse;
declare type TransactionRequest = providers.TransactionRequest;
declare type TransactionReceipt = providers.TransactionReceipt;
declare type TransactionHash = string;
declare type Network = string;
declare type NetworkId = number;
declare type NetworkIdList = number[];
declare type SupportNetworks = string[];
declare type Providers = providers.Provider;
declare type DecodeMessage = string;
interface NetworkOrProvider {
    Network?: Network;
    CustomProvider?: Providers;
}
export { TransactionResponse, TransactionRequest, TransactionReceipt, TransactionHash, Network, NetworkId, NetworkIdList, Providers, SupportNetworks, DecodeMessage, NetworkOrProvider, };
//# sourceMappingURL=type.d.ts.map
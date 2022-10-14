/*
 * @Author: changsheng 2642799676@qq.com
 * @Date: 2022-10-13 11:46:13
 * @LastEditors: changsheng 2642799676@qq.com
 * @LastEditTime: 2022-10-14 10:41:13
 * @FilePath: /revert-reason/entities/network.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { NetworkIdList, SupportNetworks } from "../utils/type";

const SupportNetworks: SupportNetworks = ["mainnet", "goerli"];
const EthereumNetworkId: NetworkIdList = [1, 5];
const CompatibleNetworkId: NetworkIdList = [421613, 420];

const OneTransactionResponse: NetworkIdList = [420];
const TwoTransactionResponse: NetworkIdList = [5, 421613];
export {
  SupportNetworks,
  EthereumNetworkId,
  CompatibleNetworkId,
  OneTransactionResponse,
  TwoTransactionResponse,
};

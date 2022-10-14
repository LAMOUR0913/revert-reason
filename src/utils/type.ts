/*
 * @Author: changsheng 2642799676@qq.com
 * @Date: 2022-10-13 11:30:48
 * @LastEditors: changsheng 2642799676@qq.com
 * @LastEditTime: 2022-10-13 16:50:42
 * @FilePath: /revert-reason/type.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ethers, providers } from 'ethers';
type TransactionResponse = providers.TransactionResponse
type TransactionRequest = providers.TransactionRequest
type TransactionReceipt = providers.TransactionReceipt
type TransactionHash = string
type Network = string
type NetworkId = number
type NetworkIdList = number[]
type SupportNetworks = string[]
type Providers = providers.Provider
type DecodeMessage = string
interface NetworkOrProvider{
    Network?:Network,
    CustomProvider?:Providers
}

export {TransactionResponse,TransactionRequest,TransactionReceipt,TransactionHash,Network,NetworkId,NetworkIdList,Providers,SupportNetworks,DecodeMessage,NetworkOrProvider}
## Project source

This item is modified on the basis of item [eth-revert-reason](https://github.com/authereum/eth-revert-reason.git) of author [shanefontaine](https://github.com/shanefontaine). Since project `eth-revert-reason` of author `shanefontaine` has not been updated for many years, it cannot be used normally. So I updated it based on the current situation.

## revert-reason

#### Introduction

Get the transaction recovery reason from the transaction hash of Ethernet Square.

#### Usage

**At present, only ethers library is supported, web3 library is not supported, And the network only supports `Goerli` networks of Arbitrum, Optimism and Ethereum. if necessary, you can put forward comments, I will update it immediately.**

###### Use NetworkName

**This method does not support Arbitrum and Optimism,only Ethereum**

```tsx
const res = await getRevertReason(
  "0x56a72a14bccafc85786dcd21592be1fe8da94964dcf3d11d5b43cc374d42edf8",
  { Network: "goerli" }
);
```

###### Use ethers.provider

**This method supports `Goerli` networks of Arbitrum, Optimism and Ethereum**

```tsx
const provider = new ethers.providers.JsonRpcProvider();
//https://eth-goerli.g.alchemy.com/v2/your-key  alchemy or infura rpc
const res = await getRevertReason(
  "0xcb9c1863c6f9ef9f941b30bacaf107359b90172515f87cf641e23d0f2d0a2dea",
  { CustomProvider: provider }
);
```

1. If the transaction is successful, it will return `success`.
2. If the transaction fails but there is no error message, it will be return `An error occurred but no error message was given`.
3. If the transaction fails but there is an error message, an error result will be returned, such `ERC20: transfer amount exceeds balance`.

import Web3 from "web3";
// import connect from "./index";
import { provider } from "../contracts/provider";

async function getswitchedNetwork(selectedChainId) {
  try {
    console.log(selectedChainId);
    const chain = Web3.utils.toHex(selectedChainId);    
    
    //  Enable session (triggers QR Code modal)
    await provider.enable();

    const web3Provider = new Web3(provider);
    console.log(web3Provider)
    let chainId = await provider.request({ method: "eth_chainId" });
    chainId = Web3.utils.toHex(chainId);
    console.log(chainId);
    if (chainId !== chain) {
        console.log(chain)
        console.log('in if')
      try {
        const res = await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chain }],
        });
        console.log(res);
      } catch (switchError) {
        console.log(switchError)
        if (switchError) {
          try {
            switch (chain) {
              case "0x1":
                await provider.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: "0x1",
                      chainName: "Ethereum Mainnet",
                      rpcUrls: ["https://mainnet.infura.io/v3/"],
                      blockExplorerUrls: ["https://etherscan.io"],
                      nativeCurrency: {
                        symbol: "ETH",
                        decimals: 18,
                      },
                    },
                  ],
                });
                break;
              case "0x89":
                console.log('in matic')
                await provider.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: '0x89',
                      chainName: "Polygon Mainnet",
                      rpcUrls: ["https://polygon-mainnet.infura.io/v3/"],
                      blockExplorerUrls: ["https://polygonscan.com"],
                      nativeCurrency: {
                        symbol: "MATIC",
                        decimals: 18,
                      },
                    },
                  ],
                });
                break;
              case "0x5":
                await provider.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: "0x5",
                      chainName: "Goerli test network",
                      rpcUrls: ["https://goerli.infura.io/v3/"],
                      blockExplorerUrls: ["https://goerli.etherscan.io"],
                      nativeCurrency: {
                        symbol: "GoerliETH",
                        decimals: 18,
                      },
                    },
                  ],
                });
                break;
            }
          } catch (addError) {
            console.log(addError)
            throw new Error(addError.message);
          }
        } else {
          throw new Error(switchError.message);
        }
      }
    }
    let accounts = await web3Provider.eth.getAccounts();
    console.log(accounts);    

    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
      console.log("disconnected");
      accounts = null;
      //   localStorage.removeItem("userState");
    });

    provider.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {
        console.log(accounts[0]);
      }
    });

    provider.on("chainChanged", (chainId) => {
      console.log(chainId);
    });
    return web3Provider
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

export default getswitchedNetwork;

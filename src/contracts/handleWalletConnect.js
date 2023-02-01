import Web3 from "web3";
// import connect from "./index";
import { provider } from "../contracts/provider";

async function connectWalletConnect() {
  try {
    //  Enable session (triggers QR Code modal)
    await provider.enable();

    const web3Provider = new Web3(provider);
    console.log(web3Provider)      
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

export default connectWalletConnect;

import Web3 from "web3";
// import connect from "./index";
import { provider } from "./provider";

async function getChaiIdForSelected() {
  try {                
    //  Enable session (triggers QR Code modal)
    await provider.enable();

    const web3Provider = new Web3(provider);
    console.log(web3Provider)
    const chainId = await provider.request({ method: "eth_chainId" });
    // chainId = Web3.utils.toHex(chainId);
    console.log(chainId);             
    return chainId;
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

export default getChaiIdForSelected;

import WalletConnectProvider from "@walletconnect/web3-provider";

export const provider = new WalletConnectProvider({
  infuraId: 'ab66b962539745f9bc4abd4c5ee2a711',
  // qrcodeModalOptions: {
  //   mobileLinks: [
  //   {
  //     id: 'metamask',
  //     name: 'metamask',
  //     links: {  
  //       native:'https://metamask.app.link/dapp/wallet-connect-poc.netlify.app/claimreward',              
  //       universal: 'https://wallet-connect-poc.netlify.app/claimreward',
  //     },
  //   },
  //   {
  //     id: 'rainbow',
  //     name: 'Rainbow',
  //     links: {    
  //       native:'rainbow://',    
  //       universal: 'https://wallet-connect-poc.netlify.app/claimreward',
  //     },
  //   },
  // ],    
  // },
  // walletImages: [
  //   {      
  //     metaMask: "./assets/metamask.svg",
  //   },
  // ],
  // chainImages: [
  //   {
  //     1: "./assets/ethereum.svg",
  //     137: "./assets/polygon.png",
  //   },
  // ]
});




import WalletConnectProvider from "@walletconnect/web3-provider";

export const provider = new WalletConnectProvider({
  infuraId: 'ab66b962539745f9bc4abd4c5ee2a711',
  qrcodeModalOptions: {
    mobileLinks: [
    {
      id: '1',
      name: 'mainnet',
      links: {        
        universal: 'https://wallet-connect-poc.netlify.app/claimreward',
      },
    },
    {
      id: '5',
      name: 'goerli',
      links: {        
        universal: 'https://wallet-connect-poc.netlify.app/claimreward',
      },
    },
  ],    
  },
  walletImages: [
    {      
      metaMask: "./assets/metamask.svg",
    },
  ],
  chainImages: [
    {
      1: "./assets/ethereum.svg",
      137: "./assets/polygon.png",
    },
  ]
});




import Web3 from 'web3'
async function loadAndDisconnect() {
    window.web3 = new Web3(window.ethereum);
    const accounts = await window.ethereum.request({
      method: "wallet_requestPermissions",
      params: [{
          eth_accounts: {}
      }]
  }).then(() => window.ethereum.request({
      method: 'eth_requestAccounts'
  }))
  
  const account = accounts[0]
  console.log(account)
  return account
  }

export default loadAndDisconnect;
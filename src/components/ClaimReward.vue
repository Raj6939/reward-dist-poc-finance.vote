<template>
  <div class="hello mr-5 ml-5">
    <div class="row g-3 align-items-center w-100 mt-4">
      <div class="col-lg-3 col-md-3 text-left">
        <label for="email" class="col-form-label">Airdrop Id:</label>
      </div>
      <div class="col-lg-9 col-md-9 px-0">
        <input
          v-model="projectId"
          type="text"
          placeholder="Enter airdrop id"          
          class="form-control w-100"
        />
      </div>
    </div>
    <div class="row g-3 align-items-center w-100 mt-4">
      <div class="col-lg-3 col-md-3 text-left">
        <label for="email" class="col-form-label">Wallet Address:</label>
      </div>
      <div class="col-lg-9 col-md-9 px-0">
        <input
          v-model="walletAddress"
          type="text"
          placeholder="enter wallet address"          
          class="form-control w-100"
        />
      </div>
    </div>     
    <b-button class="mt-4" variant="info" @click="goTo"> Go to Admin side</b-button>
    <b-button class="mt-4 ml-4" variant="success" @click="onSubmit"
      >Claim Reward</b-button
    >
    <b-button class="mt-4 ml-4" variant="danger" @click="disconnectWallet"
      >Disconnect Wallet</b-button
    >
    
  </div>
</template>

<script>
import axios from 'axios'
import Web3 from "web3"
import  loadweb3  from "../contracts/getWeb3";
import { abi, address } from "../contracts/merkelDropFactoryAbi";
import {erc20ABI} from "../contracts/ERC20Contract"
import {utils} from "web3"
import { provider } from "../contracts/provider"
// import {ipfsHashToBytes32} from "../utils/conversionFunctions"
export default {
  name: "claim-reward",
  props: {
    msg: String,
  },
  data() {
    return { 
        projectId:"",              
        newRoot:"",       
        ipfsHash:"",
        walletAddress:"",
        tokenBalance:"",
        accounts:[],
        depositToken:"0x6cBAD888Bf20b35192AdfFA909c5cfeeD8463f81"
    };
  },
  methods: {
    goTo() {
      this.$router.push('/')
    },
    async disconnectWallet() {
      console.log('dd')
      await provider.disconnect();      
    },
    async onSubmit() {
      console.log(this.accounts);      
      try{
      let data =[]    
      const res = await axios.get(`https://bank.influencebackend.xyz/bank/check/${this.walletAddress}`)
      data = [...res.data]
      const filteredObject = data.find((x)=>{
        return x._id === this.projectId
      })
      console.log(filteredObject)
      console.log(filteredObject.treeIndex)
      console.log(filteredObject.additionalData.chainId)
      console.log(filteredObject.inputData.hash)
      console.log(filteredObject.version)
      // const web3 = await loadweb3();
      await provider.enable();
      const web3 = new Web3(provider);
      console.log(web3)
      this.accounts = await web3.eth.getAccounts();
      const contract = new web3.eth.Contract(abi, address);
      const [tree, withdrawn] = await Promise.all([
        contract.methods.merkleTrees(filteredObject.treeIndex-1).call(),
        contract.methods.getWithdrawn(filteredObject.treeIndex, filteredObject.inputData.hash).call()
      ])
      console.log(JSON.stringify(tree))
      console.log(tree, withdrawn)    
      const getProofFromApi = await this.getProof(this.projectId,this.walletAddress)
      console.log(getProofFromApi)
      const amountInWei =  utils.toWei(filteredObject.inputData.data.value, 'wei').toString();
      console.log(amountInWei)
      const withDrawToken = await contract.methods.withdraw(
        filteredObject.treeIndex-1,
        this.walletAddress,
        amountInWei,
        getProofFromApi
      ).send({from:this.accounts[0]})
      console.log(withDrawToken)
    }catch(e) {
      console.log(e)
      // location.reload();
    // await provider.disconnect()
    //   provider.on("disconnect", (code, reason) => {
    //   console.log(code, reason);
    //   });
      
    }},
    async getProof(projectId,walletAddress) {
      const proof = await axios.get(`https://bank.influencebackend.xyz/proof/${projectId}/${walletAddress}`)
      return proof?.data?.merkleProof
    },
   async addMerkelTree(newRoot,ipfsHash,depositToken,tokenBalance) {
    console.log(newRoot,ipfsHash,depositToken,tokenBalance)
    const web3 = await loadweb3();
        console.log(web3);
        this.accounts = await web3.eth.getAccounts();
        console.log(this.accounts);
        const contract = new web3.eth.Contract(abi, address);
        console.log(depositToken)
        console.log(erc20ABI)
        const getApprovalContract = new web3.eth.Contract(erc20ABI,depositToken)                
       const approval = await getApprovalContract.methods.approve('0xe18898Db95f7B803CF707f3AAAe2ecA14857c916', tokenBalance).send({from:this.accounts[0]})                      
       console.log(approval)
        const transaction = await contract.methods.addMerkleTree(
        newRoot,
        ipfsHash,
        depositToken,
        tokenBalance.toString()
      ).send({from:this.accounts[0]})
      console.log(transaction)  
      console.log(contract.methods)
      const oldTreeId = await contract.methods.numTrees().call()
      console.log(oldTreeId)                 
      const returnOldTreeId = Number(oldTreeId) + 1
      return returnOldTreeId
    },
   async updateMerkelTree(updateBody,signature) {
    const a = await axios.post('https://bank.influencebackend.xyz/update-merkle-tree', {updateBody,signature})      
    console.log(a)
    const resultData = a.data.success
    console.log(resultData)
     if(resultData === true) {
      console.log("===================Merkel Tree Added=============")
     }
   }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

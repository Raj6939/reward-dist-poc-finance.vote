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
    <b-button class="mt-4 ml-4" variant="success" @click="selectWallet"
      >Connect</b-button
    >
    <b-button class="mt-4 ml-4" variant="danger" @click="disconnectWallet"
      >Disconnect Wallet</b-button
    >
      <hf-pop-up
      id="modal-1"
  Header="Select Wallet">
  <b-button class="mt-2 ml-5 mr-4" variant="success" @click="metamaskSelected"
      >   <img
                  src="../assets/metamask.svg"
                  height="25px"
                  width="25px"
                />Metamask</b-button
    >

    <b-button class="mt-2 ml-5 mr-4" variant="info" @click="walletConnectSelected"
      ><img src="../assets/walletConnnect.svg"
        height="25px"
        width="25px"
    />WalletConnect</b-button
    >
  </hf-pop-up>
  <hf-pop-up
  id="modal-2"
  Header="Claim Reward">
  <b-button class="mr-4" variant="success" @click="claimReward"
      >   <img
                  src="../assets/premium-badge.png"
                  height="25px"
                  width="25px"                  
                />Claim Reward</b-button
    >    
  </hf-pop-up>
  </div>
</template>

<script>
import axios from 'axios'
// import Web3 from "web3"
import  loadweb3  from "../contracts/getWeb3";
import connectWalletConnect from "../contracts/handleWalletConnect"
import { abi, address } from "../contracts/merkelDropFactoryAbi";
import {erc20ABI} from "../contracts/ERC20Contract"
import {utils} from "web3"
import { provider } from "../contracts/provider"
import toast from "../elements/toast"
// import {ipfsHashToBytes32} from "../utils/conversionFunctions"
import HfPopUp from "../elements/HfPopUp.vue"
export default {
  components:{HfPopUp},
  name: "claim-reward",
  props: {
    msg: String,
  },
  data() {
    return { 
      filteredObject:null,
        chainId:0,
        projectId:"",              
        newRoot:"",       
        ipfsHash:"",
        walletAddress:"",
        tokenBalance:"",
        accounts:[],
        depositToken:"0x6cBAD888Bf20b35192AdfFA909c5cfeeD8463f81",
        isMetamaskSelected:false,
        isWalletConnect:false
    };
  },
  methods: {
    selectWallet(){
       this.$root.$emit('bv::show::modal','modal-1');
    },
    async metamaskSelected() {
      this.isMetamaskSelected = true
      this.walletConnectSelected = false
     await this.onSubmit()
    },
   async walletConnectSelected() {
      this.walletConnectSelected = true
      this.isMetamaskSelected = false
      await this.onSubmit()
    },
    goTo() {
      this.$router.push('/')
    },
    async disconnectWallet() {
      console.log('disconnect')
      await provider.disconnect(); 
      this.toast('wallet disconnected','success')     
    },
    async onSubmit() {
      if(this.projectId===""){
        return this.toast('Enter Airdrop ID','error')
      }      
      if(this.walletAddress==="") {
        return this.toast('Enter Wallet Address','error')
      }
      try{
      let data =[]    
      const res = await axios.get(`https://bank.influencebackend.xyz/bank/check/${this.walletAddress}`)
      data = [...res.data]
      const filteredObject = data.find((x)=>{
        return x._id === this.projectId
      })
      this.filteredObject = { ...filteredObject}
      console.log(this.filteredObject)
      console.log(this.filteredObject.treeIndex)
      console.log(this.filteredObject.additionalData.chainId)
      this.chainId = filteredObject.additionalData.chainId
      console.log(this.chainId)
      console.log(this.filteredObject.inputData.hash)
      console.log(this.filteredObject.version)
      let web3;
      console.log('MM',this.isMetamaskSelected)
      console.log('WC',this.walletConnectSelected)
      if(this.isMetamaskSelected === true && this.walletConnectSelected === false){
        console.log('in MM')
        web3 = await loadweb3(this.chainId);
      }else if(this.isMetamaskSelected === false && this.walletConnectSelected === true){
        console.log('in WC')
         web3 = await connectWalletConnect(this.chainId)
      }
      console.log(web3)
      this.accounts = await web3.eth.getAccounts();
      console.log(this.accounts)
      this.$root.$emit('bv::hide::modal','modal-1');
      if(this.accounts.length>=0)
      this.$root.$emit('bv::show::modal','modal-2');
      // const signature = await web3.eth.personal.sign(
      // "Sign here to proceed transaction",
      // this.accounts[0]
      // );
      // console.log(signature);
      // const contract = new web3.eth.Contract(abi, address);
      // const [tree, withdrawn] = await Promise.all([
      //   contract.methods.merkleTrees(filteredObject.treeIndex-1).call(),
      //   contract.methods.getWithdrawn(filteredObject.treeIndex, filteredObject.inputData.hash).call()
      // ])
      // console.log(JSON.stringify(tree))
      // console.log(tree, withdrawn) 
      // if(withdrawn === true) {
      //   return this.toast('reward already claimed','error')
      // }   
      // const getProofFromApi = await this.getProof(this.projectId,this.walletAddress)
      // console.log(getProofFromApi)
      // const amountInWei =  utils.toWei(filteredObject.inputData.data.value, 'wei').toString();
      // console.log(amountInWei)
      // const withDrawToken = await contract.methods.withdraw(
      //   filteredObject.treeIndex-1,
      //   this.walletAddress,
      //   amountInWei,
      //   getProofFromApi
      // )
      // .send({from:this.accounts[0],
      // maxPriorityFeePerGas: null,
      // maxFeePerGas: null})
      // console.log(withDrawToken)
      // if(withDrawToken.status === true){
      //   return this.toast( "Reward claimed successfully! check your wallet","success")
      // }
    }catch(e) {
      console.log(e)
      this.toast(e,'error')
      // if(e === "User closed modal")
      // {
        // this.$router.go(0)
      // }
      // this.$router.go(0)
      // location.reload();
    // await provider.disconnect()
    //   provider.on("disconnect", (code, reason) => {
    //   console.log(code, reason);
    //   });
      
    }},
   async claimReward() {    
    try{
    const web3 = await connectWalletConnect(this.chainId)
    const contract = new web3.eth.Contract(abi, address);
      const [tree, withdrawn] = await Promise.all([
        contract.methods.merkleTrees(this.filteredObject.treeIndex-1).call(),
        contract.methods.getWithdrawn(this.filteredObject.treeIndex, this.filteredObject.inputData.hash).call()
      ])
      console.log(JSON.stringify(tree))
      console.log(tree, withdrawn) 
      if(withdrawn === true) {
        return this.toast('reward already claimed','error')
      }   
      const getProofFromApi = await this.getProof(this.projectId,this.walletAddress)
      console.log(getProofFromApi)
      const amountInWei =  utils.toWei(this.filteredObject.inputData.data.value, 'wei').toString();
      console.log(amountInWei)
      const withDrawToken = await contract.methods.withdraw(
        this.filteredObject.treeIndex-1,
        this.walletAddress,
        amountInWei,
        getProofFromApi
      )
      .send({from:this.accounts[0],
      maxPriorityFeePerGas: null,
      maxFeePerGas: null})
      console.log(withDrawToken)
      if(withDrawToken.status === true){
        return this.toast( "Reward claimed successfully! check your wallet","success")
      }
    }
    catch(e){
      this.toast(e,'error')
    }finally{
      this.$root.$emit('bv::hide::modal','modal-2');
    }
   },
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
  mixins:[toast]
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

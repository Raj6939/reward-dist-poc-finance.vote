<template>
  <div class="hello mr-5 ml-5">
    <!-- <div class="row g-3 align-items-center w-100 mt-4">
      <div class="col-lg-3 col-md-3 text-left">
        <label for="email" class="col-form-label">Project Name:</label>
      </div>
      <div class="col-lg-9 col-md-9 px-0">
        <input
          v-model="depositToken"
          type="text"
          placeholder="deposite token balance"          
          class="form-control w-100"
        />
      </div>
    </div> -->
    <!-- <div class="row g-3 align-items-center w-100 mt-4">
      <div class="col-lg-3 col-md-3 text-left">
        <label for="email" class="col-form-label">Symbol:</label>
      </div>
      <div class="col-lg-9 col-md-9 px-0">
        <input
          v-model="depositToken"
          type="text"
          placeholder="deposite token balance"          
          class="form-control w-100"
        />
      </div>
    </div>     -->
    <div class="row g-3 align-items-center w-100 mt-4">
      <div class="col-lg-3 col-md-3 text-left">
        <label for="email" class="col-form-label">Token Address:</label>
      </div>
      <div class="col-lg-9 col-md-9 px-0">
        <input
          v-model="depositToken"
          type="text"
          placeholder="deposite token balance"          
          class="form-control w-100"
        />
      </div>
    </div>
    <div class="row g-3 align-items-center w-100 mt-4">
      <div class="col-lg-3 col-md-3 text-left">
        <label for="email" class="col-form-label">Browse:</label>
      </div>
      <div class="col-lg-9 col-md-9 px-0">
        <input          
          type="file"
          accept="image/*" name="logo"
          placeholder="deposite token balance"          
          class="form-control w-100"
          @change="uploadImg"
        />
      </div>
    </div>
     <div class="row g-3 align-items-center w-100 mt-4">
      <div class="col-lg-3 col-md-3 text-left">
        <label for="balance" class="col-form-label">Root Hash :</label>
      </div>
      <div class="col-lg-9 col-md-9 px-0">
        <p          
          type="text"
          placeholder="enter amount"          
          class="form-control w-100"
        >{{newRoot}}</p>
      </div>
    </div>
    <div class="row g-3 align-items-center w-100 mt-4">
      <div class="col-lg-3 col-md-3 text-left">
        <label for="balance" class="col-form-label">IPFS Hash :</label>
      </div>
      <div class="col-lg-9 col-md-9 px-0">
        <p          
          type="text"
          placeholder="enter amount"          
          class="form-control w-100"
        >{{ipfsHash}}</p>
      </div>
    </div>  
    <div class="row g-3 align-items-center w-100 mt-4">
      <div class="col-lg-3 col-md-3 text-left">
        <label for="balance" class="col-form-label">Token Allocation :</label>
      </div>
      <div class="col-lg-9 col-md-9 px-0">
        <p          
          type="text"
          placeholder="enter amount"          
          class="form-control w-100"
        >{{tokenBalance}}</p>
      </div>
    </div>    
    <b-button class="mt-4" variant="success" @click="onSubmit"
      >Upload To Blockchain</b-button
    >
    <b-button class="mt-4 ml-4" variant="info" @click="goTo">Go to Claim Reward</b-button>
  </div>
</template>

<script>
import axios from 'axios'
import  loadweb3  from "../contracts/getWeb3";
import { abi, address } from "../contracts/merkelDropFactoryAbi";
import {erc20ABI} from "../contracts/ERC20Contract"
import {ipfsHashToBytes32,getMaxApprove} from "../utils/conversionFunctions"
import logo from "../assets/logo.png"
export default {
  name: "hello-world",
  props: {
    msg: String,
  },
  data() {
    return {               
        newRoot:"",       
        ipfsHash:"",
        depositToken:"",
        tokenBalance:"",
        accounts:[],
data:{
        inputData: [
          {
            destination: "0x7e8e1B5fcd51D5b65f162D20c0d60a1f4232c06C",
            value: "220000000000000000000"
          }
        ],
        additionalData: {
          showcase: false,
          depositToken: "0x6cBAD888Bf20b35192AdfFA909c5cfeeD8463f81",
          project: {
            _id: "6391709d7f9eb60013c7507b",
            label: "AIRDROP TEST FOR FYRE",
            symbol: "ATFF",
            address: {
              5: "0x6cBAD888Bf20b35192AdfFA909c5cfeeD8463f81"
            },
            key: "ATFF",
            createdAt: "2022-12-08T05:05:33.799Z",
            updatedAt: "2022-12-08T05:05:33.799Z",
            __v: 0
          },
          contract: "MerkleDropFactory",
          chainId: 5
        },
        friendlyValues: false
      },
      newData:{       
        inputData: [
          {
            destination: "0x7e8e1B5fcd51D5b65f162D20c0d60a1f4232c06C",
            value: "220000000000000000000"
          }
        ],
        additionalData: {
          showcase: false,
          depositToken: "0x6cBAD888Bf20b35192AdfFA909c5cfeeD8463f81",
          project: {
            logo:{},           
            label: "AIRDROP TEST FOR FYRE",
            symbol: "ATFF",
            address: {
              5: "0x6cBAD888Bf20b35192AdfFA909c5cfeeD8463f81"
            },
            key: "ATFF",            
          },
          contract: "MerkleDropFactory",
          chainId: 5
        },
        friendlyValues: false       
      }
    };
  },
  methods: {
    uploadImg(e) {
    let image=''
      if(e.dataTransfer==undefined){
         image = e.target.files[0];
      }else{
       image = e.dataTransfer.files[0];
       console.log(image)
      }
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = e => {
      this.previewImage = e.target.result;
      console.log(this.previewImage);
      }
    },
    goTo() {
      this.$router.push('/claimreward')
    },
    async onSubmit() {
      const web3 = await loadweb3();
        console.log(web3);
        this.accounts = await web3.eth.getAccounts();
        console.log(this.accounts);
      const signerAddress = this.accounts[0]
      const requestData = this.newData
      const msg = JSON.stringify(requestData)
      const sig = await web3.eth.personal.sign(
        msg, signerAddress
      )
      const formData = new FormData();
      formData.append(
        'data',
        JSON.stringify({
          address:signerAddress,
          msg:requestData,
          sig
        })
      )
      // const reader = new FileReader();
      // reader.readAsText(logo);      
      formData.append('image',logo);
      console.log('formData with logo',formData)  
      const result = await axios.post('https://bank.influencebackend.xyz/create-merkle-tree/bank', formData,{
        headers:{
        'Content-Type': 'multipart/form-data'
        }
      })
      console.log(result)
      console.log(result.data)
      const { ipfsHash, root, totalBalance, dbTreeId } = result.data;
      console.log(ipfsHash)        
      console.log(root)
      console.log(totalBalance)
      console.log(dbTreeId)
      this.tokenBalance = totalBalance
      this.newRoot = root
      this.ipfsHash = ipfsHash
      console.log(this.tokenBalance)
      const ipfsHashBytes = ipfsHashToBytes32(ipfsHash);
      console.log(ipfsHashBytes)      
      const newTreeId = await this.addMerkelTree(
        root,
        ipfsHashBytes,
        this.depositToken,
        totalBalance.toString())
      console.log(abi,address); 
      console.log(newTreeId)
      console.log(dbTreeId)   
      const updateBody = {
        dbTreeId,
        newTreeId
      }
      const signature = await web3.eth.personal.sign(
        JSON.stringify(updateBody),
        signerAddress
      )  
     await this.updateMerkelTree(updateBody,signature)
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
        const maxApprove = getMaxApprove()
        console.log(maxApprove)             
       const approval = await getApprovalContract.methods.approve('0xe18898Db95f7B803CF707f3AAAe2ecA14857c916', maxApprove).send({from:this.accounts[0]})                      
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

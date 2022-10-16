<template>
  <el-descriptions class="margin-top" title="My $SAD Token" :column="3" :size="large" border>
    <template #extra>
      <el-input-number v-model="num" :min="1" :max="100000" />
      <el-button-group>
        <el-button type="primary" @click="depositFunction">Deposit</el-button>
        <el-button>Withdraw</el-button>
      </el-button-group>
    </template>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">OffChainToken</div>
      </template>

      <count-to :startVal="0" :endVal="offChainToken" :decimals="5" :duration="3000"></count-to>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">OnChainToken</div>
      </template>

      <count-to :startVal="0" :endVal="onChainToken" :decimals="5" :duration="3000"></count-to>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">BNB</div>
      </template>

      <count-to
        :startVal="0"
        :endVal="Number(balance) / Math.pow(10, 18)"
        :decimals="5"
        :duration="3000"
      ></count-to>
    </el-descriptions-item>
  </el-descriptions>
  <el-table :data="tableData" height="250" style="width: 100%">
      <el-table-column prop="entryTypeName" label="entryTypeName" width="180" />
    <el-table-column prop="entryAmount" label="entryAmount" width="180" />
    <el-table-column prop="entryBalance" label="entryBalance" width="180" />
    <el-table-column prop="entryEventName" label="entryEventname" width="180"/>
    <el-table-column prop="statusName" label="statusName" width="180"/>
    <el-table-column prop="txHash" label="txHash" width="180"/>
    <el-table-column prop="gmtCreated" label="operationTime" width="180"/>
  </el-table>
  <el-pagination
    small
    background
    layout="prev, pager, next"
    :total="50"
    class="mt-4"
  />
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { defineComponent } from 'vue'
import { CountTo } from 'vue3-count-to'
import { ElMessage } from 'element-plus'
import {
  useBoard,
  useEthers,
  useWallet,
  displayChainName,
  displayEther,
  shortenAddress,
  ChainId,
  useEthersHooks,
  MetaMaskConnector,
  WalletConnectConnector,
  CoinbaseWalletConnector,
  Web3Provider
} from 'vue-dapp'
import { ContractFactory, ethers, utils } from 'ethers'
import { getAccount, deposit } from '../api/account'
import { pageAccountEntry } from '../api/accountEntry'

const num = ref(1)
const onChainToken = ref(0)
const offChainToken = ref(0)
const bnb = ref(0)
const pageSize = ref(5)
const pageNo = ref(1)
const currentNo = ref(1)
const total = ref(0)
const tableData = ref([])
const { address, balance, chainId, isActivated, dnsAlias, signer, provider } = useEthers()
const { wallet } = useWallet()
 onMounted( async()=>{
     await getAccountFunction()
     let param = {pageSize:pageSize.value, pageNo:pageNo.value}
     await pageAccountEntryFunction(param)
  })
let contract = new ethers.Contract(
  import.meta.env.VITE_CONTRACT_ADDRESS,
  import.meta.env.VITE_CONTRACT_ABI,
  signer.value
)
contract.balanceOf(address.value).then(res => {
  onChainToken.value = Number(res) / Math.pow(10, 18)
})

function getAccountFunction(){
    getAccount().then(res=>{
        offChainToken.value = res.balance
    })
}

function pageAccountEntryFunction(param:any){
    pageAccountEntry(param).then(res=>{
        tableData.value = res.list
    })
}

function depositFunction() {
  if (num.value < 0 || num.value > onChainToken.value) {
    ElMessage({
      message: 'InSufficent onChainToken Amount',
      type: 'error'
    })
    return
  }
  signer.value?.signMessage(import.meta.env.VITE_DEPOSIT_MESSAGE).then(signature => {
    let contractWithSigner = contract.connect(signer.value)
    //  发起交易
    contractWithSigner
      .transfer(
        import.meta.env.VITE_DEPOSIT_WITHDRAW_ADDRESS,
        utils.parseUnits(num.value.toString(), 18)
      )
      .then(transaction => {
        let param = {address: transaction.from, amount:num.value,hash:transaction.hash,message:import.meta.env.VITE_DEPOSIT_MESSAGE, signature:signature}
        deposit(param).then(res=>{
            getAccountFunction()
            let param = {pageSize:pageSize.value, pageNo:pageNo.value}
             pageAccountEntryFunction(param)
            console.log(res)
        })
        // 介绍刷新上面的 Token 余额，重置输入框
      })
  })

 

  }

</script>
<style scoped>
.el-descriptions {
  margin-top: 20px;
}

.cell-item {
  display: flex;
  align-items: center;
}

.margin-top {
  margin-top: 20px;
}
</style>
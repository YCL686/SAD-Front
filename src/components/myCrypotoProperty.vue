<template>
  <!-- <el-descriptions class="margin-top" title="My $SAD Token" :column="1" :size="small" border>
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
    
    
  </el-descriptions>
  <el-descriptions :column="1" :size="small" border>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">OnChainToken</div>
      </template>
      <count-to :startVal="0" :endVal="onChainToken" :decimals="5" :duration="3000"></count-to>
    </el-descriptions-item>
  </el-descriptions>

  <el-descriptions :column="1" :size="small" border>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">BNB</div>
      </template>

      <count-to :startVal="0" :endVal="Number(balance) / Math.pow(10, 18)" :decimals="5" :duration="3000"></count-to>
    </el-descriptions-item>
  </el-descriptions> -->
  <div>
    <a-card title="MyToken" :bordered="false">
      <template #extra>
        <a-space>
          <a-button shape="round" :loading="depositing" @click="depositModalVisible = true" type="primary">Deposit</a-button>
          <a-button shape="round" :loading="withdrawing" @click="withdrawModalVisible = true" >Withdraw</a-button>
          <QuestionCircleOutlined @click="questionVisible = true" style="cursor: pointer;"/>
        </a-space>
      </template>
  <a-row :gutter="8">
      <a-col :span="12">
        <a-card>
          <a-statistic title="OffChainToken" :value="offChainToken" />        
        </a-card>
      </a-col>
      <a-col :span="12" :bordered="false">
        <a-card>
          <a-statistic title="OnChainToken" :value="onChainToken" />
        </a-card>
      </a-col>
      <!-- <a-col :span="8">
        <a-card title="BNB" :bordered="false">
          <count-to :startVal="0" :endVal="Number(balance) / Math.pow(10, 18)" :decimals="2" :duration="3000"></count-to>
        </a-card>
      </a-col> -->
    </a-row>
  </a-card>
  </div>

  <el-table :data="tableData" height="250" style="width: 100%">
    <el-table-column prop="entryTypeName" label="entryTypeName" width="180" />
    <el-table-column prop="entryAmount" label="entryAmount" width="180" />
    <el-table-column prop="entryBalance" label="entryBalance" width="180" />
    <el-table-column prop="entryEventName" label="entryEventname" width="180" />
    <el-table-column prop="statusName" label="statusName" width="180" />
    <el-table-column prop="txHash" label="txHash" width="180" />
    <el-table-column prop="gmtCreated" label="operationTime" width="180" />
  </el-table>
  <el-pagination small background layout="prev, pager, next" :total="50" class="mt-4" />

  <a-drawer
    title="Question"
    :closable="false"
    :visible="questionVisible"
    placement="bottom"
    @close="onQuestionClose"
  >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-drawer>

  <a-modal style="text-align: center;" v-model:visible="depositModalVisible" title="Deposit"
      ok-text="confirm"
      cancel-text="cancel" 
      @ok="handleDeposit">
      <el-input-number v-model="depositNum" :min="1" :max="1000000" />
    </a-modal>

    <a-modal style="text-align: center;" v-model:visible="withdrawModalVisible" title="WithDraw"
      ok-text="confirm"
      cancel-text="cancel" 
      @ok="handleWithdraw">
      <el-input-number v-model="withdrawNum" :min="1" :max="1000000" />
    </a-modal>

</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { CountTo } from 'vue3-count-to'
import { ElMessage } from 'element-plus'
import {QuestionCircleOutlined} from '@ant-design/icons-vue'
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
import { getAccount, deposit, withdraw } from '../api/account'
import { pageAccountEntry } from '../api/accountEntry'
import { Provider } from '@ethersproject/abstract-provider'
import { message } from 'ant-design-vue'

const depositing = ref(false)
const withdrawing = ref(false)
const depositNum = ref(1)
const withdrawNum = ref(1)
const withdrawModalVisible = ref(false)
const depositModalVisible = ref(false)
const questionVisible = ref(false)
const num = ref(1)
const onChainToken = ref(0)
const offChainToken = ref(0)
const bnb = ref(0)
const pageSize = ref(5)
const pageNo = ref(1)
const currentNo = ref(1)
const total = ref(0)
const tableData = ref([])



const onQuestionClose = () =>{
  questionVisible.value = false;
}


const getOnChainToken = (provider: Provider) => {
  let contract = new ethers.Contract(
 import.meta.env.VITE_CONTRACT_ADDRESS,
 import.meta.env.VITE_CONTRACT_ABI,
 provider)
 contract.balanceOf(address.value).then(res => {
  onChainToken.value = Number(res) / Math.pow(10, 18)
}).catch(()=>{
  message.error('Failed To Get Your OnChainToken, Please Check Your Network!')
})
}


const { onActivated, onChanged } = useEthersHooks()
const { address, balance, chainId, isActivated, dnsAlias, signer, provider } = useEthers()
onActivated(({ signer, provider }) => {
  getOnChainToken(provider)
})

const handleWithdraw = () => {
  if (withdrawNum.value < 0 || withdrawNum.value > offChainToken.value) {
  message.error('InSufficent offChainToken')
  return;
}

withdrawModalVisible.value = false;
signer.value?.signMessage(import.meta.env.VITE_WITHDRAW_MESSAGE).then(signature => { //链上钱包签名
  withdrawing.value = true;
  let param = { address: address.value, amount: withdrawNum.value, message: import.meta.env.VITE_WITHDRAW_MESSAGE, signature: signature }
  withdraw(param).then(res =>{
  getAccountFunction() //offChainToken余额更新
  let param = { pageSize: pageSize.value, pageNo: pageNo.value }
  pageAccountEntryFunction(param) //offChainToken流水更新
  withdrawing.value = false;
  withdrawNum.value = 1
  message.success('Withdraw Success!')
  })
}).catch(() => {
  withdrawing.value = false;
  message.error('Failed To Get Your Wallet, Please Check Your Network!')
})
}
 
 const handleDeposit = () => {
if (depositNum.value < 0 || depositNum.value > onChainToken.value) {
  message.error('InSufficent onChainToken')
  return
}
depositModalVisible.value = false;
let contract = new ethers.Contract(
 import.meta.env.VITE_CONTRACT_ADDRESS,
 import.meta.env.VITE_CONTRACT_ABI,
 provider.value)
signer.value?.signMessage(import.meta.env.VITE_DEPOSIT_MESSAGE).then(signature => { //链上钱包签名
  let contractWithSigner = contract.connect(signer.value)
  contractWithSigner
    .transfer( //发起链上交易
      import.meta.env.VITE_DEPOSIT_WITHDRAW_ADDRESS,
      utils.parseUnits(depositNum.value.toString(), 18)
    )
    .then(transaction => {
      depositing.value = true;
      provider.value.waitForTransaction(transaction.hash).then(res=>{ //同步等待交易完成
        if(res.status === 1){
        let param = { address: transaction.from, amount: depositNum.value, hash: transaction.hash, message: import.meta.env.VITE_DEPOSIT_MESSAGE, signature: signature }
        deposit(param).then(() => { //web2链下后端记录
        getAccountFunction() //offChainToken余额更新
        let param = { pageSize: pageSize.value, pageNo: pageNo.value }
        pageAccountEntryFunction(param) //offChainToken流水更新
        depositing.value = false;
        message.success('Deposite Success!')
      })
        }else{
          depositing.value = false;
          console.log(res)
          message.error('Deposite Error!')
        }
        depositNum.value = 1;
      })
      
    })
})
}


onMounted(async () => {
  await getAccountFunction()
  let param = { pageSize: pageSize.value, pageNo: pageNo.value }
  await pageAccountEntryFunction(param)
  getOnChainToken(provider.value)
})





function getAccountFunction() {
  getAccount().then(res => {
    offChainToken.value = res.balance
  })
}

function pageAccountEntryFunction(param: any) {
  pageAccountEntry(param).then(res => {
    tableData.value = res.list
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
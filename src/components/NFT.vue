<template>
  <a-collapse v-model:activeKey="activeKey" accordion>
    <a-collapse-panel key="1" header="Mint">
      <a-card title="Mint Your Customize Avatar" style="border-radius: 10px" hoverable>
        <a-row>
          <a-col :span="12">
            <p style="color: rgba(0, 0, 0, 0.85);font-size: 15px;margin-bottom: 4px">MaxSupply:</p>
            <count-to style="font-size: 24px;" :startVal="0" :endVal="maxSupply" :decimals="0" :duration="3000"></count-to>
          </a-col>
          <a-col :span="12">
            <p style="color: rgba(0, 0, 0, 0.85);font-size: 15px;margin-bottom: 4px">TotalSupply:</p>
            <count-to style="font-size: 24px;" :startVal="0" :endVal="totalSupply" :decimals="0" :duration="3000"></count-to>
          </a-col>
        </a-row>
        <a-divider></a-divider>
        <a-row>
          <a-col :span="24" style="text-align: center;">
            <svg-icon name="box-unopen" height="100" width="100"></svg-icon>
            <p>MintPrice: {{mintPrice}} BNB</p>
          </a-col>
        </a-row>
        <a-divider></a-divider>

        <a-row>
          <a-col :span="24" style="text-align: center;"><a-button
              :disabled="(!isActivated || !saleIsActive || (whitelistIsActive && !userInWhiteList))" type="primary"
              shape="round" @click="mintModalVisible = true">Mint</a-button>
            </a-col>
        </a-row>
        <a-alert style="margin-top: 10px;" v-if="(!isActivated || !saleIsActive || (whitelistIsActive && !userInWhiteList))" :message="generateWariningInfo()" type="warning" show-icon />
        <a-typography>
    <a-typography-title :level="4">Tips:</a-typography-title>
    <a-typography-paragraph>
      Here are the tips of mint your customize avatar:
    </a-typography-paragraph>
    <a-typography-paragraph>
      <ul>
        <li>
          <a-typography>MaxSupply: {{maxSupply}}</a-typography>
        </li>
        <li>
          <a-typography>TotalSupply: {{totalSupply}}</a-typography>
        </li>
        <li>
          <a-typography>MaxMint: {{maxMint}}</a-typography>
        </li>
        <li>
          <a-typography>MaxBalance: {{maxBalance}}</a-typography>
        </li>
        <li>
          <a-typography>MintPrice: {{mintPrice}} BNB</a-typography>
        </li>
      </ul>
    </a-typography-paragraph>
    </a-typography>
      </a-card>
    </a-collapse-panel>
    <a-collapse-panel key="2" header="NFT Market">
      2
    </a-collapse-panel>
    <a-collapse-panel key="3" header="My NFT">
      3
    </a-collapse-panel>
  </a-collapse>
<a-modal :destroyOnClose="true" :footer="null" v-model:visible="mintModalVisible" title="Mint Your Customize Avatar" @ok="handleOk">
    </a-modal>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { CountTo } from 'vue3-count-to'
import { ContractFactory, ethers, utils } from 'ethers'
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
const activeKey = ref(1)
const account = ref('')
const maxSupply = ref(0)
const totalSupply = ref(0)
const mintPrice = ref(0)
const maxBalance = ref(0)
const nftBalance = ref(0)
const maxMint = ref(0)
const saleIsActive = ref(true)
const whitelistIsActive = ref(true)
const userInWhiteList = ref(true)
const mintModalVisible = ref(false)


const { onActivated, onChanged } = useEthersHooks()
const { address, balance, chainId, isActivated, dnsAlias, signer, provider } = useEthers()
onActivated(({ provider }) => {
  getContractInfo((provider))
})

const getContractInfo = (provider: any) => {
  let contract = new ethers.Contract(
    import.meta.env.VITE_AVATAR_NFT_CONTRACT_ADDRESS,
    import.meta.env.VITE_AVATAR_NFT_ABI,
    provider
  )
  contract.MAX_SUPPLY().then(res => {
    maxSupply.value = Number(res)
})
contract.getTotalSupply().then(res => {
    totalSupply.value = Number(res)
})
contract.mintPrice().then(res => {
    mintPrice.value = Number(res) / Math.pow(10, 18)
})
contract.maxMint().then(res => {
    maxMint.value = Number(res)
})
contract.maxBalance().then(res => {
    maxBalance.value = Number(res)
})
contract.balanceOf(address.value).then(res => {
    nftBalance.value = Number(res)
})
contract.getSaleActive().then(res => {
    saleIsActive.value = res
})
contract.getWhiteListActive().then(res => {
    whitelistIsActive.value = res
})
contract.isInWhitelist (address.value).then(res => {
    userInWhiteList.value = res
})
}

const generateWariningInfo = () => {
  if(!isActivated.value){
    return 'Please Connect Your Wallet';
  }

  if(!saleIsActive.value){
    return 'Sale Is Not Start';
  }

  if(whitelistIsActive.value && !userInWhiteList.value){
    return 'You Are Not In Whitelist'
  }
}

const handleOk = () => {
  mintModalVisible.value = false
}


onMounted(() => {
  if(isActivated.value){
        getContractInfo((provider))
  }
})

</script>
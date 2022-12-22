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
              shape="round" @click="mintModalVisible = true">Mint Your Customize Avatar</a-button>
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
<a-modal :destroyOnClose="true" :footer="null" v-model:visible="mintModalVisible" title="Mint Your Customize Avatar">
  <a-space direction="vertical" style="width: 100%;">
            <a-row style="text-align: center;">
                    <a-col v-if="!mintUrl" :span="24">
                        <a-upload :accept="null" v-model:file-list="fileList" name="file" list-type="picture-card"
                            style="width: 100%;" :max-count="1" :action="uploadUrl" :headers=headers
                            :before-upload="beforeUpload" @change="handleChange">
                            <div>
                                <plus-outlined></plus-outlined>
                                <div class="ant-upload-text">Upload</div>
                            </div>
                        </a-upload>
                        
                        

                    </a-col>
                    <a-col v-else :span = "24">
                        <img style="width: 100%; height: 90%" :src="mintUrl" alt="avatar" />
                        <a-button @click="fileList=[]; mintUrl=''" type="text">Delete</a-button>
                    </a-col>
                </a-row>        
        <a-input-number style="width: 100%;" v-model:value="mintPrice" :disabled="true" addon-before="MintPrice:" addon-after="$BNB" :step="0.01" string-mode></a-input-number>    
        <a-input addon-before="Name:" v-model:value="mintName" show-count :maxlength="30" />
        <a-input addon-before="Title:" v-model:value="mintTitle" show-count :maxlength="30" />
        <a-input addon-before="Attributes:" v-model:value="mintAttributes" :disabled="true" />
        <a-textarea placeholder="Descrption..." :row="4" v-model:value="mintDescription" show-count :maxlength="300" />
        <a-space style="float: right">
        <a-button type="primary" size="small" shape="round" :loading="mintLoading" @click="mintFunction">MINT</a-button>
        <a-button size="small" shape="round">Reset</a-button>
    </a-space>
    </a-space>

    </a-modal>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { CountTo } from 'vue3-count-to'
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
import { message, Upload } from 'ant-design-vue';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
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

const mintUrl = ref('')
const fileList = ref<UploadProps['fileList']>([])
const headers = {
    token: localStorage.getItem('token')
}
const uploadUrl = import.meta.env.VITE_BASE_SERVER + import.meta.env.VITE_BASE_URL + '/resource/uploadToPinata'
const uploadLoading = ref(false)
const mintName = ref('')
const mintTitle = ref('')
const mintAttributes = ref('#Unknown')
const mintDescription = ref('')
const mintLoading = ref(false)


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


const beforeUpload: UploadProps['beforeUpload'] = file => {
      const isImg = (file.type === 'image/png' || file.type === 'image/jpeg');
      if (!isImg) {
        message.error(`only image supported`);
        return false;
      }

      if(file.size > 25165824){
        message.error(`maximum size is 3M`);
        return false;
      }

      fileList.value = [...fileList.value, file];
      return false;
        };

const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
        uploadLoading.value = true;
        return;
    }
    if (info.file.status === 'done') {
        // debugger
        mintUrl.value = info.file.response.data;
        uploadLoading.value = false;
    }
    if (info.file.status === 'error') {
        uploadLoading.value = false;
        message.error('upload error');
    }
    uploadLoading.value = false
}


const mintFunction = () => {

  if(mintTitle.value == '' || mintName.value == '' || mintDescription.value == ''){
    message.error("Please Input Mint Info!")
  }

    mintLoading.value = true
    signer.value?.signMessage(import.meta.env.VITE_MINT_AVATAR_NFT_MESSAGE).then(async signature => {
      let contract = new ethers.Contract(
      import.meta.env.VITE_AVATAR_NFT_CONTRACT_ADDRESS,
      import.meta.env.VITE_AVATAR_NFT_ABI,
      signer.value);
      
      const value = ethers.utils.parseEther(mintPrice.value.toString())
      console.log(value)
      //contract.mintSADAvatar(1, {gasPrice: 2100000000000, gasLimit: 90000, value: value}).then(tx=>{
        contract.mintSADAvatar(1, {gasPrice: 2100000000000, gasLimit: 90000}).then(tx=>{
        console.log("tx:======================")
        console.log(tx)
      })
      console.log(signature)
    })
}


onMounted(() => {
  if(isActivated.value){
        getContractInfo((provider))
  }
})

</script>
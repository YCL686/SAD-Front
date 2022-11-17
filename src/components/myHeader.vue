<template>
  <el-menu background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" :default-active="activeIndex"
    class="el-menu-demo" mode="horizontal" :ellipsis="false">
    <svg-icon style="margin-left:10px" name="LOGO2" width="100"></svg-icon>
    <div class="flex-grow-1"> </div>

    <el-menu-item index="1">
      <router-link to="/index">{{$t('menus.index')}}</router-link>
    </el-menu-item>
    <el-menu-item index="2">
      <router-link to="/hot">{{$t('menus.hot')}}</router-link>
    </el-menu-item>
    <el-menu-item index="3">
      <router-link to="/focus">{{$t('menus.focus')}}</router-link>
    </el-menu-item>
    <el-menu-item index="4">
      <router-link to="/NFT">NFT</router-link>
    </el-menu-item>
    <el-menu-item index="5">
      <router-link to="/DeFi">DeFi</router-link>
    </el-menu-item>
    <div class="flex-grow-2">
      <el-icon>
        <Search/>
      </el-icon>
      <!-- <el-input v-model="searchKey" class="search-style" placeholder="Please Input" :prefix-icon="Search" /> -->
    </div>

    <!-- <el-menu-item index="6">
      <router-link to="/publish">Publish</router-link>
    </el-menu-item> -->
    <!-- <el-menu-item index="7"><template #title><BellOutlined/></template></el-menu-item> -->
    <el-sub-menu index="8">
      <template #title><TranslationOutlined/></template>
      <el-menu-item @click.native="handleLocaleChange(item.value)" v-for="item in lanOptions" :key="item.value"
        :label="item.label" :value="item.value" :command="item.value">{{item.label}}</el-menu-item>
    </el-sub-menu>
    <div class="flex-grow-3">
      <el-button v-if="!store.state.isLogined" type="primary" @click="open" round>
        <el-icon class="el-icon--right">
          <Wallet />
        </el-icon>{{$t('buttons.connectWallet')}}
      </el-button>
      <vd-board :connectors="connectors" />
      <el-sub-menu v-if="store.state.isLogined" index="9">
        <template #title>
          <a-badge count="5">
          <a-avatar style="margin-right: 10px" v-if=" store.state.avatarUrl!= '' && store.state.avatarUrl != undefined && store.state.avatarUrl != null" :src="store.state.avatarUrl" :size="32" />
          <a-avatar style="margin-right: 10px" :size="32" v-else>{{store.state.nickName}}</a-avatar>
          </a-badge>
          {{ store.state.nickName }}
          </template>
        <el-menu-item index="9-0">
          <router-link to="/admin"><CrownOutlined/> {{$t('menus.items.admin')}}</router-link>
        </el-menu-item>
        <el-menu-item index="9-1">
          <router-link :to="'/profile/' + store.state.userId"><HomeOutlined/> {{$t('menus.items.myCenter')}}</router-link>
        </el-menu-item>
        <el-menu-item index="9-2">
          <router-link to="/MyToken"><DollarOutlined/> {{$t('menus.items.myToken')}}</router-link>
        </el-menu-item>
        <el-menu-item index="9-3">
          <router-link to="/MyNFT"><FileImageOutlined/> {{$t('menus.items.myNFT')}}</router-link>
        </el-menu-item>
        <el-menu-item index="9-4">
          <router-link to="/MyDeFi"><BankOutlined/> {{$t('menus.items.myDeFi')}}</router-link>
        </el-menu-item>
        <el-menu-item index="9-5">
          <router-link to="/Setting"><SettingOutlined/> {{$t('menus.items.setting')}}</router-link>
        </el-menu-item>
        <el-menu-item @click.native="logoutFunction()" index="9-6"><LogoutOutlined/> {{$t('menus.items.logout')}}</el-menu-item>
      </el-sub-menu>
    </div>
  </el-menu>

  

</template>
<style scoped>
.search-style {
  width: 15%;
  height: 50%
}

.flex-grow-1 {
  flex-grow: 1;
}

.flex-grow-2 {
  flex-grow: 8;
}

.flex-grow-3 {
  flex-grow: 1;
}

.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
}
</style>

<script lang="ts" setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { defineComponent, onMounted, provide } from 'vue'
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
  Web3Provider,
Signer,
} from 'vue-dapp'
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from "vue-i18n"
import { useRoute } from 'vue-router'
import { login, logout } from '../api/user'
import { ElMessage } from 'element-plus'
import { message } from 'ant-design-vue'




import {
  Wallet,
  Search,
  Switch
} from '@element-plus/icons-vue'
import router from '../router'
import {TranslationOutlined, CrownOutlined, HomeOutlined,DollarOutlined, FileImageOutlined, BankOutlined, SettingOutlined, LogoutOutlined} from '@ant-design/icons-vue'

const route = useRoute()
const searchKey = ref('')
const activeIndex = ref('1')
const store = useStore()
const isLogined = ref(false)
isLogined.value = store.state.isLogined
const { locale: locale } = useI18n({ useScope: "global" })
function handleLocaleChange(lang: string) {
  locale.value = lang
  store.dispatch('setLocale', lang)
}


const lanOptions = [
  {
    value: 'en',
    label: 'English',
  },
  {
    value: 'zhCn',
    label: '简体中文',
  }, {
    value: 'zhTc',
    label: '繁體中文'
  }, {
    value: 'kor',
    label: '한국어 공부 해요.'
  }, {
    value: 'jpn',
    label: '日本語'
  }, {
    value: 'fre',
    label: 'Français'
  }, {
    value: 'ger',
    label: 'Deutsch'
  }]

const isDev = window.location.host === 'localhost:5173'
const infuraId = isDev
  ? 'fd5dad2d869c4b20a703ea9f100333f7'
  : 'ff6a249a74e048f1b413cba715f98d07'
const connectors = [
  new MetaMaskConnector({
    appUrl: 'http://localhost:5173',
  }),
  new WalletConnectConnector({
    qrcode: true,
    rpc: {
      1: `https://mainnet.infura.io/v3/${infuraId}`,
      4: `https://rinkeby.infura.io/v3/${infuraId}`,
    },
  }),
  new CoinbaseWalletConnector({
    appName: 'Vue Dapp',
    jsonRpcUrl: `https://mainnet.infura.io/v3/${infuraId}`,
  }),
]
const { open } = useBoard()


const { wallet, disconnect, onDisconnect, onAccountsChanged, onChainChanged } = useWallet()
const { address, balance, chainId, isActivated, dnsAlias, signer, provider } = useEthers()

// const web3 = window.ethereum as any;
// const { connectWith } = useWallet()

// if (localStorage.getItem('token') != null && web3.selectedAddress) {
//   //TODO now default metamask need update
//   connectWith(connectors[0]).then(() => {
//     console.log(wallet.status)
//     //signer.value.connect(wallet.provider)
//   })
// }


function logoutFunction() {
  disconnect()
  if (localStorage.getItem('token') == null) {
    return;
  }
  logout().then((res) => {
    isActivated.value = false
    isLogined.value = false;
    store.dispatch('setIsLogined', false)
    localStorage.removeItem('token')
    localStorage.removeItem('nickName')
    localStorage.removeItem('avatarUrl')
    localStorage.removeItem('userId')
    router.push('/index')
    //TODO 跳转首页
  })
}
const { onActivated, onChanged } = useEthersHooks()
onDisconnect(() => {
  logoutFunction();
  console.log('disconnect')
})
onAccountsChanged(() => {
  logoutFunction();
  console.log('accounts changed')
})
onChainChanged((chainId: any) => {
  logoutFunction();
  console.log('chain changed', chainId)
})

const { availableNetworks } = useEthers()
const supportedChainId = Object.keys(availableNetworks.value).map((key) =>
  Number(key),
)
const selectedChainId = ref(0)
onActivated(() => {
  selectedChainId.value = chainId.value as number
  if (selectedChainId.value != import.meta.env.VITE_CHAIN_ID) {
    ElMessage({
      message: 'invalid chain',
      type: 'error',
      duration: 5 * 1000
    })
    return;
  }

  if (localStorage.getItem("token") == null) {
    signer.value.signMessage(import.meta.env.VITE_SIGN_MESSAGE).then(signature => {
      console.log(signature)
      const param = { address: address.value, signature: signature, message: import.meta.env.VITE_SIGN_MESSAGE }
      login(param).then((res) => {
        localStorage.setItem("token", res.token)
        isLogined.value = true
        store.dispatch('setNickName', res.nickName)
        store.dispatch('setAvatarUrl', res.avatarUrl)
        store.dispatch('setIsLogined', true)
        store.dispatch('setUserId', res.userId)
        message.success("Wallet Connect Success")
      })
    })
    console.log(provider)
    console.log(signer)
  }else{
    message.success("Wallet Connect Success")
    console.log("123")
    console.log(provider)
    console.log(signer)
  }
})
const isChainChanged = ref(false)
onChanged(() => {
  selectedChainId.value = chainId.value as number
  isChainChanged.value = true
})
// For turning back to previous chainId without calling switchChain() again
const switchError = ref(false)
watch(selectedChainId, async (val, oldVal) => {
  if (oldVal === 0) return // ignore initial change
  if (switchError.value) {
    switchError.value = false
    return
  }
  try {
    if (wallet.connector) {
      await wallet.connector.switchChain!(val)
    }
  } catch (e: any) {
    switchError.value = true
    selectedChainId.value = oldVal
    console.error(e)
  }
})


</script>
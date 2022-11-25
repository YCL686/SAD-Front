<template>
  <el-menu
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    :default-active="activeIndex"
    mode="horizontal"
    :ellipsis="false"
  >
  <svg-icon name="LOGO2"></svg-icon>
    <div class="flex-grow-1"/>
    <el-menu-item style="padding:0 3px" index="3">
      <router-link to="/hot"><el-icon><Search /></el-icon></router-link>
    </el-menu-item> 
    <el-sub-menu style="padding-left: 0px;"  index="1">
      <template #title><TranslationOutlined/>
      </template>
      <el-menu-item
      style="padding:0 3px"
        @click.native="handleLocaleChange(item.value)"
        v-for="item in lanOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :command="item.value"
      >
        {{ item.label }}
      </el-menu-item>
    </el-sub-menu>

    <li class="connect-wallet">
      <el-button v-if="!store.state.isLogined" type="primary" @click="open" round size="small">
        {{ $t('buttons.connectWallet') }}
      </el-button>
      <vd-board :connectors="connectors" dark />
    </li>
    <el-menu-item @click.native="showMyProfile" style="padding-left: 0px;" v-if="store.state.isLogined" index="9">
      <a-badge count="5">
          <a-avatar  v-if=" store.state.avatarUrl!= '' && store.state.avatarUrl != undefined && store.state.avatarUrl != null" :src="store.state.avatarUrl" :size="32" />
          <a-avatar  :size="32" v-else>{{store.state.nickName}}</a-avatar>
          </a-badge>
          {{ store.state.nickName }}
        </el-menu-item>
  </el-menu>
  <a-drawer
    v-model:visible="myProfileVisible"
    class="custom-class"
    title="MyProfile"
    placement="right"
  >
  <a-list size="small">
      <a-list-item><CrownOutlined/> {{$t('menus.items.admin')}}</a-list-item>
      <a-list-item @click="getUserProfile()"><HomeOutlined/> {{$t('menus.items.myCenter')}}</a-list-item>
      <a-list-item @click="getMyToken()"><DollarOutlined/> {{$t('menus.items.myToken')}}</a-list-item>
      <a-list-item><FileImageOutlined/> {{$t('menus.items.myNFT')}}</a-list-item>
      <a-list-item><BankOutlined/> {{$t('menus.items.myDeFi')}}</a-list-item>
      <a-list-item><SettingOutlined/> {{$t('menus.items.setting')}}</a-list-item>
      <a-list-item @click="logoutFunction()"><LogoutOutlined/> {{$t('menus.items.logout')}}</a-list-item>
  </a-list>
  </a-drawer>
</template>
<style scoped>
.connect-wallet {
  padding-left: 5px;
  justify-content: center; /*子元素水平居中*/
  align-items: center; /*子元素垂直居中*/
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
import { defineComponent } from 'vue'
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
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { login, logout } from '../../api/user'
import { ElMessage } from 'element-plus'

import { Wallet, Search, Switch } from '@element-plus/icons-vue'
import {TranslationOutlined, BellOutlined, CrownOutlined, HomeOutlined,DollarOutlined, FileImageOutlined, BankOutlined, SettingOutlined, LogoutOutlined} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

import router from '../../router'

const myProfileVisible = ref(false)
const route = useRoute()
const searchKey = ref('')
const activeIndex = ref('1')
const store = useStore()
const isLogined = ref(false)
isLogined.value = store.state.isLogined
const { locale: locale } = useI18n({ useScope: 'global' })
function handleLocaleChange(lang: string) {
  console.log(import.meta.env)
  console.log(import.meta.env.VITE_DEPOSIT_WITHDRAW_ADDRESS)
  console.log(lang)
  locale.value = lang
  store.dispatch('setLocale', lang)
}

const lanOptions = [
  {
    value: 'en',
    label: 'English'
  },
  {
    value: 'zhCn',
    label: '简体中文'
  },
  {
    value: 'zhTc',
    label: '繁體中文'
  },
  {
    value: 'kor',
    label: '한국어 공부 해요.'
  },
  {
    value: 'jpn',
    label: '日本語'
  },
  {
    value: 'fre',
    label: 'Français'
  },
  {
    value: 'ger',
    label: 'Deutsch'
  }
]

const isDev = window.location.host === 'localhost:5173'
const infuraId = isDev ? 'fd5dad2d869c4b20a703ea9f100333f7' : 'ff6a249a74e048f1b413cba715f98d07'
const { open } = useBoard()

const { wallet, disconnect, onDisconnect, onAccountsChanged, onChainChanged } = useWallet()
const { address, balance, chainId, isActivated, dnsAlias, signer } = useEthers()

function logoutFunction() {
  disconnect()
  if (localStorage.getItem('token') == null) {
    return;
  }
  logout().then((res) => {
    myProfileVisible.value = false;
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

const getMyToken = () => {
  const myTokenPage = router.resolve({
    path: '/myToken/'
  })
  window.open(myTokenPage.href, '_blank') // 打开新的窗口(跳转路径，跳转类型)
}

const getUserProfile = () => {
  const profilePage = router.resolve({
    path: '/profile/' + store.state.userId
  })
  window.open(profilePage.href, '_blank') // 打开新的窗口(跳转路径，跳转类型)
}

const { onActivated, onChanged } = useEthersHooks()
onDisconnect(() => {
  logoutFunction()
  console.log('disconnect')
})
onAccountsChanged(() => {
  console.log('accounts changed')
})
onChainChanged((chainId: any) => {
  console.log('chain changed', chainId)
})
const connectors = [
  new MetaMaskConnector({
    appUrl: 'http://192.168.1.4:5173'
  })
]
const { availableNetworks } = useEthers()
const supportedChainId = Object.keys(availableNetworks.value).map(key => Number(key))
const selectedChainId = ref(0)
onActivated(() => {
  selectedChainId.value = chainId.value as number
  if (selectedChainId.value != import.meta.env.VITE_CHAIN_ID) {
    ElMessage({
      message: 'invalid chain',
      type: 'error',
      duration: 5 * 1000
    })
    return
  }
  if (localStorage.getItem("token") == null) {
    signer.value.signMessage(import.meta.env.VITE_SIGN_MESSAGE).then(signature => {
      console.log(signature)
      const param = { address: address.value, signature: signature, message: import.meta.env.VITE_SIGN_MESSAGE, shortenAddress: shortenAddress() }
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
    
  }else{
    message.success("Wallet Auto Connect Success")
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

const showMyProfile = () =>{
  myProfileVisible.value = true
}
</script>
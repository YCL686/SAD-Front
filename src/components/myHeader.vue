<template>
<div id = "header">
    <el-row :gutter="24">
    <el-col :span="4">
    <div style="font-style: oblique;font-weight: 900;font-size:20px">SharableAD</div>
    </el-col>
    <el-col :span="12">
    </el-col>
    <el-col :span="8">
    <el-dropdown trigger="click"  @command='handleLocaleChange'>
      <el-button size="small" circle>
    <el-icon class="el-icon--right"><Switch /></el-icon>
      </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
        v-for="item in lanOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :command="item.value"
        >{{item.label}}</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
    <el-button type="primary" @click="open"  round><el-icon class="el-icon--right"><Wallet /></el-icon>{{$t('buttons.connectWallet')}}</el-button>
      {{ address }}
      <vd-board :connectors="connectors" dark /></el-col>
  </el-row>
    
      
</div>
</template>
<style scoped>
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

<script lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { defineComponent } from 'vue'
import {
  MetaMaskConnector,
  WalletConnectConnector,
  CoinbaseWalletConnector,
  useBoard,
  useEthers
} from 'vue-dapp'
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from "vue-i18n";



import {
  Wallet,
  Search,
  Switch
} from '@element-plus/icons-vue'

export default defineComponent({
    name:'myHeader',
  setup() {
      const store = useStore();
      const { locale: locale } = useI18n({ useScope: "global" })
      function handleLocaleChange(lang:string) {
        console.log(lang)
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
  },{
    value: 'zhTc',
    label:'繁體中文'
  },{
    value: 'kor',
    label: '한국어 공부 해요.'
  },{
    value:'jpn',
    label:'日本語'
  },{
    value:'spn',
    label:'Español'
  },{
    value:'fre',
    label:'Français'
  },{
    value:'ger',
    label:'Deutsch'
  },{
    value:'ara',
    label:'بالعربية'
  },{
    value:'rus',
    label:'русский язык'
  },{
    value:'por',
    label:'Português'
  }]
    const { open } = useBoard()
    const { address, balance } = useEthers()
    const infuraId = ''
    const connectors = [
      new MetaMaskConnector({
        appUrl: 'http://localhost:3000'
      }),
      new WalletConnectConnector({
        qrcode: true,
        rpc: {
          1: `https://mainnet.infura.io/v3/${infuraId}`,
          4: `https://rinkeby.infura.io/v3/${infuraId}`
        }
      }),
      new CoinbaseWalletConnector({
        appName: 'Vue Dapp',
        jsonRpcUrl: `https://mainnet.infura.io/v3/${infuraId}`
      })
    ]
    return {
      connectors,
      open,
      address,
      balance,
      lanOptions,
      handleLocaleChange
    }
  }
})
</script>
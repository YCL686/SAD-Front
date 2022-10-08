<template>
  <div id="header">
    <el-row :gutter="24">
      <el-col :span="4">
        <div style="font-style: oblique;font-weight: 900;font-size:20px">SharableAD</div>
      </el-col>
      <el-col :span="12">
      </el-col>
      <el-col :span="8">
        <el-dropdown trigger="click" @command='handleLocaleChange'>
          <el-button size="small" circle>
            <el-icon class="el-icon--right">
              <Switch />
            </el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="item in lanOptions" :key="item.value" :label="item.label" :value="item.value"
                :command="item.value">{{item.label}}</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button v-if="!isActivated" type="primary" @click="open" round>
          <el-icon class="el-icon--right">
            <Wallet />
          </el-icon>{{$t('buttons.connectWallet')}}
        </el-button>
        {{ shortAddress }}
        {{ balance }}
        <vd-board :connectors="connectors" dark />

        <el-dropdown v-if="isActivated" trigger="hover">
          <el-button size="small" circle>
            <el-icon class="el-icon--right">
              <Switch />
            </el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>My Opus</el-dropdown-item>
              <el-dropdown-item>My Collect</el-dropdown-item>
              <el-dropdown-item>My Foucus</el-dropdown-item>
              <el-dropdown-item>My Message</el-dropdown-item>
              <el-dropdown-item>Log Out</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

      </el-col>
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
} from 'vue-dapp'
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from "vue-i18n";



import {
  Wallet,
  Search,
  Switch
} from '@element-plus/icons-vue'


export default defineComponent({
  name: 'myHeader',
  data() {
  },
  methods: {

  },
  created() {

  },
  setup() {
    const store = useStore();
    var isLogined = store.state.isLogined;
    const { locale: locale } = useI18n({ useScope: "global" })
    function handleLocaleChange(lang: string) {
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
        value: 'spn',
        label: 'Español'
      }, {
        value: 'fre',
        label: 'Français'
      }, {
        value: 'ger',
        label: 'Deutsch'
      }, {
        value: 'ara',
        label: 'بالعربية'
      }, {
        value: 'rus',
        label: 'русский язык'
      }, {
        value: 'por',
        label: 'Português'
      }]

    const isDev = window.location.host === 'localhost:5173'
    const infuraId = isDev
      ? 'fd5dad2d869c4b20a703ea9f100333f7'
      : 'ff6a249a74e048f1b413cba715f98d07'
    const { open } = useBoard()

    const { wallet, disconnect, onDisconnect, onAccountsChanged, onChainChanged } =
      useWallet()
    const { address, balance, chainId, isActivated, dnsAlias } = useEthers()
    const shortAddress = ref('');
    function handleAddress(str: string) {
        var str1 = str.substring(0, 2)
        var str2 = "****"
        var str3 = str.substring(32, 36)
        shortAddress.value = str1+ str2 + str3;
      }
    const { onActivated, onChanged } = useEthersHooks()
    onDisconnect(() => {
      isLogined = false;
      store.dispatch('setIsLogined', false)
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
    const { availableNetworks } = useEthers()
    const supportedChainId = Object.keys(availableNetworks.value).map((key) =>
      Number(key),
    )
    const selectedChainId = ref(0)
    onActivated(() => {
      isLogined = true
      store.dispatch('setIsLogined', true)
      selectedChainId.value = chainId.value as number
      console.log("isLogined:", isLogined)
      handleAddress(address.value);
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
    return {
      connectors,
      open,
      address,
      shortAddress,
      balance,
      availableNetworks,
      selectedChainId,
      supportedChainId,
      lanOptions,
      isLogined,
      isActivated,
      handleLocaleChange
    }
  }
})
</script>
<template>
    <el-descriptions class="margin-top" title="My $SAD Token" :column="3" :size="large" border>
        <template #extra>
            <el-button type="primary" @click="depositFunction">Deposit</el-button>
            <el-button>Withdraw</el-button>
            <el-button>Entry</el-button>
        </template>
        <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                    OffChainToken
                </div>
            </template>
            
<count-to :startVal="0" :endVal="3000.22" :decimals="5" :duration="3000"></count-to>

        </el-descriptions-item>
        <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                    OnChainToken
                </div>
            </template>
            
<count-to :startVal="0" :endVal="onChainToken" :decimals="5" :duration="3000"></count-to>

        </el-descriptions-item>
        <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                    BNB
                </div>
            </template>
            
<count-to :startVal="0" :endVal="Number(balance)/Math.pow(10,18)" :decimals="5" :duration="3000"></count-to>

        </el-descriptions-item>
    </el-descriptions>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { defineComponent } from 'vue'
import { CountTo } from 'vue3-count-to';
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
} from 'vue-dapp'
import { ContractFactory, ethers, utils } from 'ethers';
const onChainToken = ref(0)
const { address, balance, chainId, isActivated, dnsAlias, signer, provider } = useEthers()
let contract = new ethers.Contract(import.meta.env.VITE_CONTRACT_ADDRESS, import.meta.env.VITE_CONTRACT_ABI, signer.value);
contract.balanceOf("0x912379C36D054913AF29cCBadd2Fd5251110bd0e").then((res)=>{
    onChainToken.value = Number(res)/Math.pow(10,18)
})

// All overrides are optional
let overrides = {

// The maximum units of gas for the transaction to use
gasLimit: 23000,

// The price (in wei) per unit of gas
gasPrice: utils.parseUnits('9.0', 'gwei'),

// The nonce to use in the transaction
nonce: 123,

// The amount to send with the transaction (i.e. msg.value)
value: 10*Math.pow(10,18),

// The chain ID (or network ID) to use
chainId: 97

};

function depositFunction(){
    contract.transfer(import.meta.env.VITE_DEPOSIT_WITHDRAW_ADDRESS, 1000)
      .then(function(gas) {
          // 必须关联一个有过签名钱包对象
          let contractWithSigner = contract.connect(signer.value);
          //  发起交易，前面 2 个参数是函数的参数，第 3 个是交易参数
          contractWithSigner.transfer(import.meta.env.VITE_DEPOSIT_WITHDRAW_ADDRESS, 1000).then(function(tx) {
                console.log(tx);
                // 介绍刷新上面的 Token 余额，重置输入框
            });  
      });
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
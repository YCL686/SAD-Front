<template>

<a-collapse v-model:activeKey="activeKey" accordion>
        <a-collapse-panel key="0" header="Sync View">
        <!-- <a-card> -->
        <a-row>
            <a-col :span="12">
                <p style="color: rgba(0, 0, 0, 0.45);font-size: 15px;margin-bottom: 4px">FeedBackTVL+: 
                
                </p>
                <count-to style="font-size: 24px;" :startVal="0" :endVal="1234.56" :decimals="2" :duration="3000">
                    
                </count-to><CaretUpFilled style="color: green"/>1.20%
            </a-col>
            <a-col :span="12">
                <p style="color: rgba(0, 0, 0, 0.45);font-size: 15px;margin-bottom: 4px">FeedBackTVL-:</p>
                <count-to style="font-size: 24px;" :startVal="0" :endVal="8765.43" :decimals="2" :duration="3000">
                </count-to><CaretDownFilled style="color: red"/>3.11%
            </a-col>
        </a-row>
        <a-divider></a-divider>
        <a-row>
            <a-col :span="12">
                <p style="color: rgba(0, 0, 0, 0.45);font-size: 15px;margin-bottom: 4px">OnSaleTVL:</p>
                <count-to style="font-size: 24px;" :startVal="0" :endVal="45679.81" :decimals="2" :duration="3000">
                </count-to><CaretUpFilled style="color: green"/>9.40%
            </a-col>
            <a-col :span="12">
                <p style="color: rgba(0, 0, 0, 0.45);font-size: 15px;margin-bottom: 4px">BurnTVL:</p>
                <count-to style="font-size: 24px;" :startVal="0" :endVal="9753.21" :decimals="2" :duration="3000">
                </count-to><CaretDownFilled style="color: red"/>22.29%
            </a-col>
        </a-row>
    <!-- </a-card> -->
</a-collapse-panel>
        <a-collapse-panel key="1" header="TVL Detail"></a-collapse-panel>
        <a-collapse-panel key="2" header="TVL History"></a-collapse-panel>
        <a-collapse-panel key="3" header="TVL Introduce"></a-collapse-panel>
        </a-collapse>

    
</template>
<script lang="ts" setup>
import {CaretDownFilled, CaretUpFilled} from '@ant-design/icons-vue';
import { CountTo } from 'vue3-count-to'
import { ref, onMounted} from 'vue'


const activeKey = ref(0)

</script>
<style scoped>

</style>